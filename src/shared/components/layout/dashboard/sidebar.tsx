'use client'

import { Button, cn } from '@heroui/react'
import {
	Analytics02Icon,
	ArrowLeft01Icon,
	ArrowRight01Icon,
	Crown02Icon,
	DashboardSquare02Icon,
	QrCodeIcon,
	StarIcon,
	UserAccountIcon,
	WebhookIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Link from 'next/link'
import type { PlanId } from '@/features/billing/config/plans'
import Logo from '@/shared/components/logo'
import { useSidebarStore } from '@/shared/lib/zustand/sidebar-store'
import SidebarItem from './sidebar-item'

interface SidebarTranslations {
	navLabel: string
	accountLabel: string
	navItems: { name: string; path: string }[]
	bottomItems: { name: string; path: string }[]
	freePlan: string
	freePlanDesc: string
	upgradeToPro: string
	manageSub: string
	planActive: string
}

interface Props {
	plan?: PlanId
	translations: SidebarTranslations
}

const PlanCTA = ({
	plan,
	translations,
}: {
	plan: PlanId
	translations: SidebarTranslations
}) => {
	if (plan === 'free') {
		return (
			<div className="flex flex-col gap-y-2 bg-linear-to-br from-primary/10 to-secondary/10 border border-primary/20 p-4 rounded-xl mt-auto">
				<div className="flex items-center gap-x-2 text-default-600">
					<HugeiconsIcon
						icon={Crown02Icon}
						size={15}
						className="text-primary"
					/>
					<span className="text-xs font-semibold">{translations.freePlan}</span>
				</div>
				<p className="text-xs text-default-500 leading-snug">
					{translations.freePlanDesc}
				</p>
				<Button color="primary" size="sm" as={Link} href="/pricing">
					{translations.upgradeToPro}
				</Button>
			</div>
		)
	}

	return (
		<div className="flex flex-col gap-y-2 bg-linear-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 p-4 rounded-xl mt-auto">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-x-2">
					<HugeiconsIcon
						icon={Crown02Icon}
						size={15}
						className="text-amber-500"
					/>
					<span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
						Plan {plan === 'pro' ? 'Pro' : 'Business'}
					</span>
				</div>
				<span className="text-[10px] bg-amber-500/20 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-semibold">
					{translations.planActive}
				</span>
			</div>
			<Link
				href="/dashboard/billing"
				className="text-xs text-default-500 hover:text-primary transition-colors"
			>
				{translations.manageSub}
			</Link>
		</div>
	)
}

const Sidebar = ({ plan = 'free', translations }: Props) => {
	const { isOpen, toggleSidebar, isMobileOpen, closeMobile } = useSidebarStore()

	return (
		<>
			{/* ── Desktop sidebar ─────────────────────────────────────── */}
			<aside
				className={cn(
					'h-screen shrink-0 border-r border-divider bg-background transition-all duration-300 hidden md:flex flex-col',
					isOpen ? 'w-60' : 'w-16',
				)}
			>
				<nav className="h-full flex flex-col p-3 gap-y-2">
					{/* Header */}
					<div className="flex items-center justify-between py-2 min-h-13">
						{isOpen && <Logo />}
						<Button
							isIconOnly
							variant="light"
							size="sm"
							radius="full"
							onPress={toggleSidebar}
							className="ml-auto"
						>
							<HugeiconsIcon
								icon={isOpen ? ArrowLeft01Icon : ArrowRight01Icon}
								size={18}
							/>
						</Button>
					</div>

					{/* Nav items */}
					{isOpen ? (
						<SidebarItem
							navLabel={translations.navLabel}
							accountLabel={translations.accountLabel}
							navItems={translations.navItems}
							bottomItems={translations.bottomItems}
						/>
					) : (
						<CollapsedNav />
					)}

					{/* Plan CTA expanded */}
					{isOpen && <PlanCTA plan={plan} translations={translations} />}

					{/* Plan CTA collapsed */}
					{!isOpen && (
						<div className="mt-auto pb-2 flex justify-center">
							<Link
								href={plan === 'free' ? '/pricing' : '/dashboard/billing'}
								title={
									plan === 'free' ? translations.upgradeToPro : `Plan ${plan}`
								}
								className={cn(
									'flex items-center justify-center p-2 rounded-lg transition-colors',
									plan === 'free'
										? 'text-primary hover:bg-primary/10'
										: 'text-amber-500 hover:bg-amber-500/10',
								)}
							>
								<HugeiconsIcon icon={Crown02Icon} size={20} />
							</Link>
						</div>
					)}
				</nav>
			</aside>

			{/* ── Mobile backdrop ──────────────────────────────────────── */}
			{isMobileOpen && (
				<button
					type="button"
					aria-label="Close menu"
					className="fixed inset-0 z-40 bg-black/50 md:hidden w-full cursor-default"
					onClick={closeMobile}
				/>
			)}

			{/* ── Mobile drawer ────────────────────────────────────────── */}
			<aside
				className={cn(
					'fixed inset-y-0 left-0 z-50 w-72 bg-background border-r border-divider transition-transform duration-300 md:hidden flex flex-col',
					isMobileOpen ? 'translate-x-0' : '-translate-x-full',
				)}
			>
				<nav className="h-full flex flex-col p-3 gap-y-2">
					{/* Header */}
					<div className="flex items-center justify-between py-2 min-h-13">
						<Logo />
						<Button
							isIconOnly
							variant="light"
							size="sm"
							radius="full"
							onPress={closeMobile}
							className="ml-auto"
						>
							<HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
						</Button>
					</div>

					<SidebarItem
						navLabel={translations.navLabel}
						accountLabel={translations.accountLabel}
						navItems={translations.navItems}
						bottomItems={translations.bottomItems}
						onNavigate={closeMobile}
					/>

					<PlanCTA plan={plan} translations={translations} />
				</nav>
			</aside>
		</>
	)
}

// Minimal icon-only nav for collapsed desktop state
const CollapsedNav = () => {
	const items = [
		{ icon: DashboardSquare02Icon, href: '/dashboard', label: 'Dashboard' },
		{ icon: QrCodeIcon, href: '/dashboard/qrs', label: 'QR Codes' },
		{ icon: Analytics02Icon, href: '/dashboard/analytics', label: 'Analytics' },
		{ icon: StarIcon, href: '/dashboard/favorites', label: 'Favorites' },
	]

	return (
		<div className="flex flex-col gap-1 mt-4 flex-1">
			{items.map(({ icon, href, label }) => (
				<Link
					key={href}
					href={href}
					title={label}
					className="flex items-center justify-center p-2 rounded-lg text-default-500 hover:text-primary hover:bg-primary/5 transition-colors"
				>
					<HugeiconsIcon icon={icon} size={20} />
				</Link>
			))}
			<div className="mt-auto pt-4 border-t border-divider flex flex-col gap-1">
				<Link
					href="/dashboard/profile"
					title="Profile"
					className="flex items-center justify-center p-2 rounded-lg text-default-500 hover:text-primary hover:bg-primary/5 transition-colors"
				>
					<HugeiconsIcon icon={UserAccountIcon} size={20} />
				</Link>
				<Link
					href="/dashboard/billing"
					title="Billing"
					className="flex items-center justify-center p-2 rounded-lg text-default-500 hover:text-primary hover:bg-primary/5 transition-colors"
				>
					<HugeiconsIcon icon={Crown02Icon} size={20} />
				</Link>
				<Link
					href="/dashboard/webhooks"
					title="Webhooks"
					className="flex items-center justify-center p-2 rounded-lg text-default-500 hover:text-primary hover:bg-primary/5 transition-colors"
				>
					<HugeiconsIcon icon={WebhookIcon} size={20} />
				</Link>
			</div>
		</div>
	)
}

export default Sidebar
