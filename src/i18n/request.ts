import { cookies } from 'next/headers'
import { getRequestConfig } from 'next-intl/server'

export const locales = ['es', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'es'

export default getRequestConfig(async () => {
	const cookieStore = await cookies()
	const requested = cookieStore.get('NEXT_LOCALE')?.value
	const locale = locales.includes(requested as Locale)
		? (requested as Locale)
		: defaultLocale

	return {
		locale,
		messages: (await import(`../../messages/${locale}.json`)).default,
	}
})
