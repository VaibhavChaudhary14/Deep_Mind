
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/dashboard'

    // Check for errors
    const errorParam = searchParams.get('error')
    const errorDesc = searchParams.get('error_description')

    // DEBUG: Capture everything
    const debugInfo = {
        url: request.url,
        params: Object.fromEntries(searchParams.entries()),
        headers: Object.fromEntries(request.headers.entries()) // careful with secrets, but standard headers are fine
    }
    const debugString = encodeURIComponent(JSON.stringify(debugInfo))

    if (errorParam) {
        console.error('Upstream Auth Error:', errorParam, errorDesc)
        return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${encodeURIComponent(errorParam)}&details=${encodeURIComponent(errorDesc || '')}&debug=${debugString}`)
    }

    if (code) {
        const cookieStore = await cookies()
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            )
                        } catch {
                            // Cookie set error
                        }
                    },
                },
            }
        )
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            // Check if user is fully onboarded
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role, level')
                    .eq('id', user.id)
                    .single()

                // If profile is missing role or level, send to onboarding
                if (!profile?.role || !profile?.level) {
                    return NextResponse.redirect(`${origin}/onboarding`)
                }
            }

            return NextResponse.redirect(`${origin}${next}`)
        } else {
            console.error('Auth Code Exchange Error:', error)
            return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${encodeURIComponent(error.message)}&debug=${debugString}`)
        }
    }

    // No code found
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=no_code_received&debug=${debugString}`)
}
