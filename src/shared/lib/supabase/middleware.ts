import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export async function updateSession(request: NextRequest) {
	let supabaseResponse = NextResponse.next({ request })

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll()
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value }) =>
						request.cookies.set(name, value),
					)
					supabaseResponse = NextResponse.next({ request })
					cookiesToSet.forEach(({ name, value, options }) =>
						supabaseResponse.cookies.set(name, value, options),
					)
				},
			},
		},
	)

	// IMPORTANT: use getUser() — validates the token with Supabase Auth server
	// on every request (more secure than getSession which only reads the cookie).
	const {
		data: { user },
	} = await supabase.auth.getUser()

	const { pathname } = request.nextUrl

	if (!user && pathname.startsWith('/dashboard')) {
		const url = new URL('/login', request.url)
		return NextResponse.redirect(url)
	}

	if (
		user &&
		(pathname.startsWith('/login') || pathname.startsWith('/register'))
	) {
		const url = new URL('/dashboard/qrs', request.url)
		return NextResponse.redirect(url)
	}

	return supabaseResponse
}
