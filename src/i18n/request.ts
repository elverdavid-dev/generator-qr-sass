import { cookies } from 'next/headers'
import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'

export const locales = ['es', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'es'

export default getRequestConfig(async ({ requestLocale }) => {
	const requested = await requestLocale
	const cookieLocale = (await cookies()).get('NEXT_LOCALE')?.value
	const resolved = requested ?? cookieLocale
	const locale = hasLocale(locales, resolved) ? resolved : defaultLocale

	return {
		locale,
		messages: (await import(`../../messages/${locale}.json`)).default,
	}
})
