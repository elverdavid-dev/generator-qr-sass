import { getSession } from '@/shared/lib/supabase/get-session'
import { getProfile } from '@/features/auth/services/queries/get-profile'
import ProfileButton from '@/shared/components/profile-button'
import ThemeToggle from '@/shared/components/theme/theme-toggle'
import LogoutButton from '@/shared/components/logout-button'

const NavbarDashboard = async () => {
	const { data: session } = await getSession()
	const userId = session?.user?.id

	let profile = null
	if (userId) {
		const { data } = await getProfile({ user_id: userId })
		profile = data
	}

	return (
		<header className="flex items-center justify-end gap-x-2 px-6 py-3 border-b border-divider bg-background">
			<ThemeToggle />
			{profile ? (
				<ProfileButton
					avatar_url={profile.avatar_url ?? ''}
					full_name={profile.name ?? profile.email}
				/>
			) : (
				<LogoutButton />
			)}
		</header>
	)
}

export default NavbarDashboard
