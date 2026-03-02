import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-02-25.clover', // Latest Stripe API version format or just cast as any if it conflicts with types
});

// Admin Supabase client because webhooks are server-to-server and need to bypass RLS to update profiles
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
    const body = await request.text();
    const headerPayload = await headers();
    const signature = headerPayload.get('stripe-signature') as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        console.error(`Webhook Error: ${error.message}`);
        return new Response(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const subscription = event.data.object as Stripe.Subscription;

    switch (event.type) {
        case 'checkout.session.completed':
            // The psychological lock-in: They paid.
            const userId = session.client_reference_id || session.metadata?.userId;
            const tier = session.metadata?.tier || 'free';

            if (userId) {
                await supabase
                    .from('profiles')
                    .update({
                        stripe_customer_id: session.customer as string,
                        stripe_subscription_id: session.subscription as string | null,
                        plan_tier: tier,
                        subscription_status: 'active'
                    })
                    .eq('id', userId);
            }
            break;

        case 'invoice.payment_failed':
        case 'customer.subscription.deleted':
            const customerId = subscription.customer as string;

            // Revert them to 'free' and 'canceled' status to break out of the Acceleration Engine features
            await supabase
                .from('profiles')
                .update({
                    plan_tier: 'free',
                    subscription_status: 'canceled'
                })
                .eq('stripe_customer_id', customerId);
            break;

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
}
