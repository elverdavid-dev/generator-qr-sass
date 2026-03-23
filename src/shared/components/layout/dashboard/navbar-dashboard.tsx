import { getLocale, getTranslations } from 'next-intl/server'
import { getProfile } from '@/features/auth/services/queries/get-profile'
import LanguageSwitcher from '@/shared/components/language-switcher'
import LogoutButton from '@/shared/components/logout-button'
import ProfileButton from '@/shared/components/profile-button'
import ThemeToggle from '@/shared/components/theme/theme-toggle'
import { getSession } from '@/shared/lib/supabase/get-session'

const NavbarDashboard = async () => {
	const { data: session } = await getSession()
	const userId = session?.user?.id
	const [locale, tLang, tProfile, tBilling, tNav, tCommon] = await Promise.all([
		getLocale(),
		getTranslations('language'),
		getTranslations('profile'),
		getTranslations('billing'),
		getTranslations('nav'),
		getTranslations('common'),
	])

	let profile = null
	if (userId) {
		const { data } = await getProfile({ user_id: userId })
		profile = data
	}

	return (
		<header className="flex items-center justify-end gap-x-2 px-6 py-3 border-b border-divider bg-background">
			<LanguageSwitcher
				currentLocale={locale}
				selectLabel={tLang('select')}
				loadingMessage={tLang('loading')}
			/>
			<ThemeToggle />
			{profile ? (
				<ProfileButton
					avatar_url={profile.avatar_url ?? ''}
					full_name={profile.name ?? profile.email ?? ''}
					email={session?.user?.email}
					translations={{
						myAccount: tProfile('title'),
						profile: tProfile('title'),
						billing: tBilling('title'),
						pricing: tNav('pricing'),
						logout: tCommon('logout'),
						loggingOut: tCommon('loggingOut'),
					}}
				/>
			) : (
				<LogoutButton />
			)}
		</header>
	)
}

export default NavbarDashboard
