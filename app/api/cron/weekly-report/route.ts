import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Initialize a standard Supabase client with Service Role for CRON backend read/write
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Must use service role for global user read
const supabase = createClient(supabaseUrl, supabaseKey);

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function GET(request: Request) {
    // 1. Verify cron secret to prevent unauthorized execution
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        // 2. Fetch all profiles with an active sprint
        const { data: profiles, error: profileErr } = await supabase
            .from('profiles')
            .select(`
                id, 
                username,
                email,
                active_sprint, 
                streak,
                sprints (id, target_role, start_date)
            `)
            .eq('active_sprint', true); // Assuming active_sprint flag is maintained

        if (profileErr) throw profileErr;

        // 3. For each active user, generate their weekly stats
        for (const profile of profiles || []) {
            const activeSprintId = profile.sprints?.[0]?.id;

            // Calculate 7 days ago window
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            // Fetch logs for the past week for this user
            const { data: logs } = await supabase
                .from('logs')
                .select('hours_studied, tasks_completed, deep_work_intervals, date')
                .eq('user_id', profile.id)
                .gte('date', sevenDaysAgo.toISOString().split('T')[0]);

            // Formulate metrics
            let weeklyHours = 0;
            let weeklyTasks = 0;
            const uniqueActiveDays = new Set<string>();

            logs?.forEach(log => {
                weeklyHours += Number(log.hours_studied || 0);
                weeklyTasks += Number(log.tasks_completed || 0);
                uniqueActiveDays.add(log.date);
            });

            // 4. Calculate Server-Side AccelerationScore (Phase 5.3)
            // 40% Execution Consistency (out of 7 days instead of 14 for the weekly snapshot)
            // 30% Deep Work Hours (vs weekly target of 14h)
            // 20% Roadmap Completion (Scaffolded at 65% for now until roadmap query is built)
            // 10% Skill Delta (Scaffolded at 5%)
            const executionConsistency = Math.min((uniqueActiveDays.size / 7) * 100, 100);
            const deepWorkPercent = Math.min((weeklyHours / 14) * 100, 100);
            const roadmapPercent = 65;
            const skillDelta = 5;

            const compositeScore = Math.round(
                (executionConsistency * 0.40) +
                (deepWorkPercent * 0.30) +
                (roadmapPercent * 0.20) +
                (skillDelta * 0.10)
            );

            // 5. Store snapshot in sprint_metrics (Integrity Lock)
            if (activeSprintId) {
                // Approximate week number by checking how many metrics already exist for this sprint
                const { count } = await supabase
                    .from('sprint_metrics')
                    .select('*', { count: 'exact', head: true })
                    .eq('sprint_id', activeSprintId);

                const weekNumber = (count || 0) + 1;

                await supabase.from('sprint_metrics').insert({
                    user_id: profile.id,
                    sprint_id: activeSprintId,
                    week_number: weekNumber,
                    acceleration_score: compositeScore,
                    execution_consistency: executionConsistency,
                    deep_work_hours: deepWorkPercent,
                    roadmap_completion: roadmapPercent,
                    skill_delta: skillDelta
                });



                // 6. Send the Elite Email Template (Phase 5.4)
                const emailSubject = `Week ${weekNumber}: ${compositeScore > 50 ? '+' : ''}${compositeScore} AccelerationScore. ${compositeScore < 40 ? "You're slipping." : "Keep pushing."}`;

                const htmlTemplate = `
                    <div style="font-family: monospace; background-color: #000; color: #fff; padding: 40px; border: 4px solid #fff;">
                        <h1 style="color: #00FF94; text-transform: uppercase; margin-bottom: 20px;">Acceleration Engine // Status Report</h1>
                        
                        <p style="font-size: 16px; font-weight: bold;">Operator ${profile.username},</p>
                        
                        <p>Your 90-Day Sprint toward <strong>${profile.sprints?.[0]?.target_role}</strong> continues. Here is your unvarnished weekly snapshot.</p>
                        
                        <div style="background-color: #222; padding: 20px; border: 2px solid #FFD600; margin: 30px 0;">
                            <h2 style="color: #FFD600; font-size: 48px; margin: 0;">${compositeScore}<span style="font-size: 16px; color: #888;">/100</span></h2>
                            <p style="text-transform: uppercase; font-weight: bold; color: #888; margin-top: 5px;">Server-Verified AccelerationScore</p>
                        </div>
                        
                        <table style="width: 100%; text-align: left; border-collapse: collapse; font-weight: bold; margin-bottom: 30px;">
                            <tr style="border-bottom: 1px solid #333;">
                                <td style="padding: 10px 0; color: #00C2FF;">Execution Consistency (40%)</td>
                                <td style="text-align: right;">${Math.round(executionConsistency)}%</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #333;">
                                <td style="padding: 10px 0; color: #00C2FF;">Deep Work Hours (30%)</td>
                                <td style="text-align: right;">${weeklyHours.toFixed(1)} hrs (${Math.round(deepWorkPercent)}%)</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #333;">
                                <td style="padding: 10px 0; color: #00C2FF;">Tasks Shipped</td>
                                <td style="text-align: right;">${weeklyTasks}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; color: #00C2FF;">Streak Maintained</td>
                                <td style="text-align: right;">${profile.streak} Days</td>
                            </tr>
                        </table>
                        
                        <p style="font-size: 14px; color: #AAA;">If you continue at this rate, you ${compositeScore > 60 ? 'maintain your aggressive trajectory' : 'are falling behind standard pacing. Fix it'}.</p>
                        
                        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard" style="display: inline-block; background-color: #FFF; color: #000; text-decoration: none; padding: 15px 30px; font-weight: bold; text-transform: uppercase; margin-top: 20px;">Enter Deep Mind Dashboard</a>
                    </div>
                `;

                if (process.env.RESEND_API_KEY && profile.email) {
                    await resend.emails.send({
                        from: 'Deep Mind Protocol <status@yourdomain.com>',
                        to: profile.email,
                        subject: emailSubject,
                        html: htmlTemplate
                    });
                } else {
                    console.log('Would send Resend email:', emailSubject, 'to', profile.email || 'unknown');
                }
            }
        }

        return NextResponse.json({ success: true, message: 'Weekly reports compiled and dispatched.' });
    } catch (error) {
        console.error("Cron Job Error:", error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
