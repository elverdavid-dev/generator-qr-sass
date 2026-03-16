'use client'

import { cn } from '@heroui/react'
import {
	Analytics02Icon,
	Crown02Icon,
	DashboardSquare02Icon,
	QrCodeIcon,
	StarIcon,
	UserAccountIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
	name: string
	path: string
	// biome-ignore lint/suspicious/noExplicitAny: HugeIcons type
	icon: any
}

interface Props {
	navLabel: string
	accountLabel: string
	navItems: Omit<NavItem, 'icon'>[]
	bottomItems: Omit<NavItem, 'icon'>[]
}

const NAV_ICONS: Record<string, any> = {
	'/dashboard': DashboardSquare02Icon,
	'/dashboard/qrs': QrCodeIcon,
	'/dashboard/analytics': Analytics02Icon,
	'/dashboard/favorites': StarIcon,
	'/dashboard/profile': UserAccountIcon,
	'/dashboard/billing': Crown02Icon,
}

const SidebarItem = ({ navLabel, accountLabel, navItems, bottomItems }: Props) => {
	const pathname = usePathname()

	const isActive = (path: string) =>
		path === '/dashboard' ? pathname === path : pathname.startsWith(path)

	return (
		<section className="flex flex-col gap-y-1 mt-5 flex-1">
			<h2 className="mb-3 px-2 text-xs font-semibold text-default-400 uppercase tracking-wider">
				{navLabel}
			</h2>
			{navItems.map(({ name, path }) => (
				<Link
					key={path}
					href={path}
					className={cn(
						'flex items-center gap-x-2 border-l-2 border-transparent p-2 rounded-r-lg transition-colors text-default-600 hover:text-primary hover:border-primary hover:bg-primary/5',
						isActive(path) && 'border-primary text-primary bg-primary/5 font-medium',
					)}
				>
					<HugeiconsIcon icon={NAV_ICONS[path]} size={20} />
					<span>{name}</span>
				</Link>
			))}

			<div className="mt-auto pt-4 border-t border-divider">
				<h2 className="mb-3 px-2 text-xs font-semibold text-default-400 uppercase tracking-wider">
					{accountLabel}
				</h2>
				{bottomItems.map(({ name, path }) => (
					<Link
						key={path}
						href={path}
						className={cn(
							'flex items-center gap-x-2 border-l-2 border-transparent p-2 rounded-r-lg transition-colors text-default-600 hover:text-primary hover:border-primary hover:bg-primary/5',
							isActive(path) && 'border-primary text-primary bg-primary/5 font-medium',
						)}
					>
						<HugeiconsIcon icon={NAV_ICONS[path]} size={20} />
						<span>{name}</span>
					</Link>
				))}
			</div>
		</section>
	)
}

export default SidebarItem
