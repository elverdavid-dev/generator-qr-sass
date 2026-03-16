'use client'

import { cn } from '@heroui/react'
import {
	Analytics02Icon,
	Crown02Icon,
	DashboardSquare02Icon,
	QrCodeIcon,
	UserAccountIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
	{ name: 'Dashboard', path: '/dashboard', icon: DashboardSquare02Icon },
	{ name: 'Mis QR Codes', path: '/dashboard/qrs', icon: QrCodeIcon },
	{ name: 'Analíticas', path: '/dashboard/analytics', icon: Analytics02Icon },
]

const bottomItems = [
	{ name: 'Perfil', path: '/dashboard/profile', icon: UserAccountIcon },
	{ name: 'Facturación', path: '/dashboard/billing', icon: Crown02Icon },
]

const SidebarItem = () => {
	const pathname = usePathname()

	const isActive = (path: string) =>
		path === '/dashboard' ? pathname === path : pathname.startsWith(path)

	return (
		<section className="flex flex-col gap-y-1 mt-5 flex-1">
			<h2 className="mb-3 px-2 text-xs font-semibold text-default-400 uppercase tracking-wider">
				Navegación
			</h2>
			{navItems.map(({ name, path, icon }) => (
				<Link
					key={name}
					href={path}
					className={cn(
						'flex items-center gap-x-2 border-l-2 border-transparent p-2 rounded-r-lg transition-colors text-default-600 hover:text-primary hover:border-primary hover:bg-primary/5',
						isActive(path) && 'border-primary text-primary bg-primary/5 font-medium',
					)}
				>
					<HugeiconsIcon icon={icon} size={20} />
					<span>{name}</span>
				</Link>
			))}

			<div className="mt-auto pt-4 border-t border-divider">
				<h2 className="mb-3 px-2 text-xs font-semibold text-default-400 uppercase tracking-wider">
					Cuenta
				</h2>
				{bottomItems.map(({ name, path, icon }) => (
					<Link
						key={name}
						href={path}
						className={cn(
							'flex items-center gap-x-2 border-l-2 border-transparent p-2 rounded-r-lg transition-colors text-default-600 hover:text-primary hover:border-primary hover:bg-primary/5',
							isActive(path) && 'border-primary text-primary bg-primary/5 font-medium',
						)}
					>
						<HugeiconsIcon icon={icon} size={20} />
						<span>{name}</span>
					</Link>
				))}
			</div>
		</section>
	)
}

export default SidebarItem
