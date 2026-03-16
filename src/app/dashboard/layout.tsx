import NavbarDashboard from '@/shared/components/layout/dashboard/navbar-dashboard'
import Sidebar from '@/shared/components/layout/dashboard/sidebar'
import { getSession } from '@/shared/lib/supabase/get-session'
import { getProfile } from '@/features/auth/services/queries/get-profile'
import { getTranslations } from 'next-intl/server'
import type { PropsWithChildren } from 'react'
import type { PlanId } from '@/features/billing/config/plans'

const DashboardLayout = async ({ children }: PropsWithChildren) => {
	const { data: session } = await getSession()
	const profile = session?.user
		? (await getProfile({ user_id: session.user.id })).data
		: null
	const plan: PlanId = profile?.plan ?? 'free'
	const t = await getTranslations('sidebar')

	const sidebarTranslations = {
		navLabel: t('navigation'),
		accountLabel: t('account'),
		navItems: [
			{ name: t('dashboard'), path: '/dashboard' },
			{ name: t('myQrs'), path: '/dashboard/qrs' },
			{ name: t('analytics'), path: '/dashboard/analytics' },
		],
		bottomItems: [
			{ name: t('profile'), path: '/dashboard/profile' },
			{ name: t('billing'), path: '/dashboard/billing' },
		],
		freePlan: t('freePlan'),
		freePlanDesc: t('freePlanDesc'),
		upgradeToPro: t('upgradeToPro'),
		manageSub: t('manageSub'),
		planActive: t('planActive'),
	}

	return (
		<div className="flex h-screen w-screen overflow-hidden">
			<Sidebar plan={plan} translations={sidebarTranslations} />
			<div className="flex flex-col flex-1 min-w-0">
				<NavbarDashboard />
				<main className="flex-1 overflow-y-auto">
					<section className="container mx-auto px-6 py-2">
						{children}
					</section>
				</main>
			</div>
		</div>
	)
}

export default DashboardLayout
