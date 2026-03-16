import { getLocale, getTranslations } from 'next-intl/server'
import HeaderClient from './header-client'

const Header = async () => {
	const [t, tLang, locale] = await Promise.all([
		getTranslations('nav'),
		getTranslations('language'),
		getLocale(),
	])

	return (
		<HeaderClient
			loginLabel={t('login')}
			currentLocale={locale}
			langSelectLabel={tLang('select')}
			langLoadingMessage={tLang('loading')}
		/>
	)
}

export default Header
