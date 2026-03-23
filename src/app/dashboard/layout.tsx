import dynamic from 'next/dynamic'
import { getTranslations } from 'next-intl/server'
import type { PropsWithChildren } from 'react'
import { getProfile } from '@/features/auth/services/queries/get-profile'
import type { PlanId } from '@/features/billing/config/plans'
import NavbarDashboard from '@/shared/components/layout/dashboard/navbar-dashboard'
import Sidebar from '@/shared/components/layout/dashboard/sidebar'
import { PlanProvider } from '@/shared/context/plan-context'
import { getSession } from '@/shared/lib/supabase/get-session'
import { createClient } from '@/shared/lib/supabase/server'

const OnboardingModal = dynamic(
	() => import('@/features/onboarding/components/onboarding-modal'),
)

const DashboardLayout = async ({ children }: PropsWithChildren) => {
	// Wrap in try/catch so a Supabase error never crashes the entire layout
	let plan: PlanId = 'free'
	let needsOnboarding = false

	try {
		const { data: session } = await getSession()
		const profile = session?.user
			? (await getProfile({ user_id: session.user.id })).data
			: null
		plan = (profile?.plan ?? 'free') as PlanId

		if (profile?.onboarding_completed === false) {
			const supabase = await createClient()
			const { count } = await supabase
				.from('qrs')
				.select('id', { count: 'exact', head: true })
				.eq('user_id', profile.id)
			needsOnboarding = (count ?? 0) === 0
		}
	} catch {
		// If Supabase is unreachable or slow, render the layout with safe defaults
		// rather than crashing the entire dashboard with "Something went wrong!"
	}
	const [t, tOnboarding] = await Promise.all([
		getTranslations('sidebar'),
		getTranslations('onboarding'),
	])

	const sidebarTranslations = {
		navLabel: t('navigation'),
		accountLabel: t('account'),
		navItems: [
			{ name: t('dashboard'), path: '/dashboard' },
			{ name: t('myQrs'), path: '/dashboard/qrs' },
			{ name: t('analytics'), path: '/dashboard/analytics' },
			{ name: t('favorites'), path: '/dashboard/favorites' },
		],
		bottomItems: [
			{ name: t('profile'), path: '/dashboard/profile' },
			{ name: t('billing'), path: '/dashboard/billing' },
			{ name: t('webhooks'), path: '/dashboard/webhooks' },
			{ name: t('api'), path: '/dashboard/api' },
			{ name: t('team'), path: '/dashboard/team' },
		],
		freePlan: t('freePlan'),
		freePlanDesc: t('freePlanDesc'),
		upgradeToPro: t('upgradeToPro'),
		manageSub: t('manageSub'),
		planActive: t('planActive'),
	}

	const onboardingTranslations = {
		step1Title: tOnboarding('step1Title'),
		step1Desc: tOnboarding('step1Desc'),
		step2Title: tOnboarding('step2Title'),
		step2Desc: tOnboarding('step2Desc'),
		step3Title: tOnboarding('step3Title'),
		step3Desc: tOnboarding('step3Desc'),
		step4Title: tOnboarding('step4Title'),
		step4Desc: tOnboarding('step4Desc'),
		next: tOnboarding('next'),
		back: tOnboarding('back'),
		skip: tOnboarding('skip'),
		getStarted: tOnboarding('getStarted'),
		stepOf: tOnboarding('stepOf'),
	}

	return (
		<PlanProvider plan={plan}>
			{needsOnboarding && (
				<OnboardingModal translations={onboardingTranslations} />
			)}
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
		</PlanProvider>
	)
}

export default DashboardLayout
