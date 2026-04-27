import { CheckmarkCircle02Icon, QrCodeIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Image from 'next/image'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import type { PropsWithChildren } from 'react'
import { GoogleOneTap } from '@/features/auth/components/google-one-tap'
import ThemeToggle from '@/shared/components/theme/theme-toggle'

interface BrandPanelProps {
	headline1: string
	headline2: string
	subtitle: string
	features: string[]
	stats: { value: string; label: string }[]
}

const BrandPanel = ({
	headline1,
	headline2,
	subtitle,
	features,
	stats,
}: BrandPanelProps) => (
	<aside className="hidden lg:flex flex-col justify-between bg-zinc-950 px-12 py-10 relative overflow-hidden">
		{/* Background glows */}
		<div className="absolute inset-0 pointer-events-none" aria-hidden="true">
			<div className="absolute top-1/3 -right-24 w-80 h-80 bg-primary/15 rounded-full blur-[100px]" />
			<div className="absolute bottom-1/4 -left-16 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
		</div>

		{/* Logo */}
		<div className="relative z-10">
			<Link href="/">
				<Image
					src="/brand/crowii-horizontal-dark.svg"
					alt="Crowii"
					width={130}
					height={44}
					style={{ width: 130, height: 'auto' }}
				/>
			</Link>
		</div>

		{/* Center content */}
		<div className="relative z-10 flex flex-col gap-8">
			{/* Decorative QR icon */}
			<div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
				<HugeiconsIcon icon={QrCodeIcon} size={28} className="text-primary" />
			</div>

			<div>
				<h2 className="text-4xl font-extrabold text-white leading-tight tracking-tight">
					{headline1}
					<br />
					{headline2}
				</h2>
				<p className="mt-3 text-zinc-400 text-base leading-relaxed max-w-sm">
					{subtitle}
				</p>
			</div>

			<ul className="flex flex-col gap-3.5">
				{features.map((text) => (
					<li
						key={text}
						className="flex items-center gap-3 text-sm text-zinc-300"
					>
						<div className="w-5 h-5 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0">
							<HugeiconsIcon
								icon={CheckmarkCircle02Icon}
								size={14}
								className="text-emerald-400"
							/>
						</div>
						{text}
					</li>
				))}
			</ul>
		</div>

		{/* Bottom stats */}
		<div className="relative z-10 border-t border-zinc-800 pt-6 grid grid-cols-3 gap-4">
			{stats.map((s) => (
				<div key={s.label}>
					<p className="text-white font-bold text-lg">{s.value}</p>
					<p className="text-zinc-500 text-xs mt-0.5">{s.label}</p>
				</div>
			))}
		</div>
	</aside>
)

const Layout = async ({ children }: PropsWithChildren) => {
	const t = await getTranslations('auth.brandPanel')

	const features = [t('feature1'), t('feature2'), t('feature3'), t('feature4')]

	const stats = [
		{ value: '10K+', label: t('stat1Label') },
		{ value: '150+', label: t('stat2Label') },
		{ value: '99.9%', label: t('stat3Label') },
	]

	return (
		<div className="min-h-dvh grid grid-cols-1 lg:grid-cols-2">
			<BrandPanel
				headline1={t('headline1')}
				headline2={t('headline2')}
				subtitle={t('subtitle')}
				features={features}
				stats={stats}
			/>

			<div className="flex flex-col">
				{/* Mobile header */}
				<header className="flex lg:hidden items-center justify-between px-6 py-4 border-b border-divider">
					<Link href="/">
						<Image
							src="/brand/crowii-horizontal.svg"
							alt="Crowii"
							width={110}
							height={37}
							className="dark:hidden"
							style={{ width: 110, height: 'auto' }}
						/>
						<Image
							src="/brand/crowii-horizontal-dark.svg"
							alt="Crowii"
							width={110}
							height={37}
							className="hidden dark:block"
							style={{ width: 110, height: 'auto' }}
						/>
					</Link>
					<ThemeToggle />
				</header>

				{/* Desktop theme toggle */}
				<div className="hidden lg:flex justify-end px-8 pt-6">
					<ThemeToggle />
				</div>

				{/* Form area — centered */}
				<div className="flex-1 flex items-center justify-center px-6 py-10">
					{children}
				</div>
				<GoogleOneTap />
			</div>
		</div>
	)
}

export default Layout
