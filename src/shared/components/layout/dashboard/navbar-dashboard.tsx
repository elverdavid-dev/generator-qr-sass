import { getLocale, getTranslations } from 'next-intl/server'
import { getProfile } from '@/features/auth/services/queries/get-profile'
import NotificationsPanel from '@/features/notifications/components/notifications-panel'
import { getNotifications, getUnreadCount } from '@/features/notifications/services/queries/get-notifications'
import LanguageSwitcher from '@/shared/components/language-switcher'
import LogoutButton from '@/shared/components/logout-button'
import ProfileButton from '@/shared/components/profile-button'
import ThemeToggle from '@/shared/components/theme/theme-toggle'
import { getSession } from '@/shared/lib/supabase/get-session'
import MobileMenuButton from './mobile-menu-button'

const NavbarDashboard = async () => {
	const { data: session } = await getSession()
	const userId = session?.user?.id
	const [locale, tLang, tProfile, tBilling, tNav, tCommon, tNotif] = await Promise.all([
		getLocale(),
		getTranslations('language'),
		getTranslations('profile'),
		getTranslations('billing'),
		getTranslations('nav'),
		getTranslations('common'),
		getTranslations('notifications'),
	])

	let profile = null
	if (userId) {
		const { data } = await getProfile({ user_id: userId })
		profile = data
	}

	const [{ data: notifications }, { count: unreadCount }] = await Promise.all([
		userId ? getNotifications() : Promise.resolve({ data: [] }),
		userId ? getUnreadCount() : Promise.resolve({ count: 0 }),
	])

	return (
		<header className="flex items-center justify-between gap-x-2 px-6 py-3 border-b border-divider bg-background">
			<MobileMenuButton />
			<div className="flex items-center gap-x-2 ml-auto">
				<LanguageSwitcher
					currentLocale={locale}
					selectLabel={tLang('select')}
					loadingMessage={tLang('loading')}
				/>
				<ThemeToggle />
				{userId && (
					<NotificationsPanel
						initialNotifications={notifications}
						initialUnread={unreadCount}
						translations={{
							title: tNotif('title'),
							markAllRead: tNotif('markAllRead'),
							empty: tNotif('empty'),
							justNow: tNotif('justNow'),
							viewQr: tNotif('viewQr'),
						}}
					/>
				)}
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
			</div>
		</header>
	)
}

export default NavbarDashboard
