import { type NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/services/get-session'

export async function updateSession(request: NextRequest) {
	const { data: session } = await getSession()
	const { pathname } = request.nextUrl
	const userId = session?.user.id

	// If there is no session and the path is not /signin, redirect to signin
	if (!userId && !pathname.startsWith('/signin')) {
		const url = new URL('/signin', request.url)
		return NextResponse.redirect(url)
	}

	// If the user is already authenticated, do not allow them to enter routes like /signin
	if (
		(userId && pathname.startsWith('/signin')) ||
		pathname.startsWith('/signup')
	) {
		const url = new URL('/dashboard/qrs', request.url)
		return NextResponse.redirect(url)
	}

	return NextResponse.next({
		request,
	})
}
