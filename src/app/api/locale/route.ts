import { NextResponse } from 'next/server'
import type { Locale } from '@/i18n/request'
import { locales } from '@/i18n/request'

export async function POST(req: Request) {
	const { locale } = await req.json()

	if (!locales.includes(locale as Locale)) {
		return NextResponse.json({ error: 'Invalid locale' }, { status: 400 })
	}

	const response = NextResponse.json({ success: true })
	response.cookies.set('NEXT_LOCALE', locale, {
		maxAge: 60 * 60 * 24 * 365, // 1 year
		path: '/',
	})
	return response
}
