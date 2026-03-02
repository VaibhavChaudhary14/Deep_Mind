import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function ProtectedDormantLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                }
            }
        }
    );

    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
        redirect('/pricing');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('plan_tier')
        .eq('id', session.user.id)
        .single();

    if (!profile || profile.plan_tier !== 'architect') {
        redirect('/pricing');
    }

    return <>{children}</>;
}
