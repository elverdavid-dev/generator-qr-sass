'use client'

import { Button } from '@heroui/react'
import { Analytics02Icon, ArrowLeft01Icon, ArrowRight01Icon, Clock01Icon, DashboardSquare02Icon, QrCodeIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { cn } from '@heroui/react'
import Link from 'next/link'
import Logo from '@/shared/components/logo'
import SidebarItem from './sidebar-item'
import { useSidebarStore } from '@/shared/lib/zustand/sidebar-store'

const Sidebar = () => {
	const { isOpen, toggleSidebar } = useSidebarStore()

	return (
		<aside
			className={cn(
				'h-screen flex-shrink-0 border-r border-divider bg-background transition-all duration-300',
				isOpen ? 'w-60' : 'w-16',
			)}
		>
			<nav className="h-full flex flex-col p-3 gap-y-2">
				{/* Header */}
				<div className="flex items-center justify-between py-2 min-h-[52px]">
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
					<SidebarItem />
				) : (
					<CollapsedNav />
				)}

				{/* Upgrade plan */}
				{isOpen && (
					<div className="flex flex-col gap-y-2 bg-default-100 p-4 rounded-xl mt-auto">
						<div className="flex items-center gap-x-2 text-default-500 justify-center">
							<HugeiconsIcon icon={Clock01Icon} size={16} />
							<span className="text-xs font-medium">10 días restantes</span>
						</div>
						<Button color="primary" size="sm" as={Link} href="/pricing">
							Mejorar plan
						</Button>
					</div>
				)}
			</nav>
		</aside>
	)
}

// Minimal icon-only nav for collapsed state
const CollapsedNav = () => {
	const items = [
		{ icon: DashboardSquare02Icon, href: '/dashboard', label: 'Dashboard' },
		{ icon: QrCodeIcon, href: '/dashboard/qrs', label: 'Mis QR Codes' },
		{ icon: Analytics02Icon, href: '/dashboard/analytics', label: 'Analíticas' },
	]

	return (
		<div className="flex flex-col gap-1 mt-4">
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
		</div>
	)
}

export default Sidebar
