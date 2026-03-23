import {
	ArrowRight02Icon,
	BarChartIcon,
	CheckmarkCircle02Icon,
	Download04Icon,
	Folder01Icon,
	GlobalIcon,
	Link01Icon,
	LockPasswordIcon,
	PaintBoardIcon,
	QrCodeIcon,
	SparklesIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

// ─────────────────────────────────────────────────────────────────────────────
// QR Mockup — purely decorative, simulates a QR code with CSS
// ─────────────────────────────────────────────────────────────────────────────
const QrMockup = () => {
	const rows = [
		[1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1],
		[1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
		[1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1],
		[1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
		[1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1],
		[1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1],
		[1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
		[0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0],
		[0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1],
		[1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0],
		[0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1],
		[1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0],
		[1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1],
		[1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0],
		[1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1],
		[1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0],
		[1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0],
		[1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1],
	]

	return (
		<div className="p-3 bg-white rounded-xl shadow-sm inline-block">
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(21, 8px)',
					gap: '1px',
				}}
			>
				{rows.map((row, ri) =>
					row.map((cell, ci) => (
						<div
							// biome-ignore lint/suspicious/noArrayIndexKey: static decorative pattern
							key={`${ri}-${ci}`}
							style={{
								width: 8,
								height: 8,
								borderRadius: 1,
								background: cell ? '#18181b' : 'transparent',
							}}
						/>
					)),
				)}
			</div>
		</div>
	)
}

// ─────────────────────────────────────────────────────────────────────────────
// Section components — all receive translated strings as props
// ─────────────────────────────────────────────────────────────────────────────

interface HeroT {
	badge: string
	headline1: string
	headline2: string
	headline3: string
	subtitle: string
	ctaPrimary: string
	ctaSecondary: string
	noCreditCard: string
	mockupDynamic: string
	mockupScans: string
	mockupCountries: string
	mockupUptime: string
	badge150: string
	badge150Sub: string
	badge10k: string
	badge10kSub: string
}

const HeroSection = ({ t }: { t: HeroT }) => (
	<section className="relative overflow-hidden py-20 md:py-32 px-4">
		<div
			className="absolute inset-0 -z-10 pointer-events-none"
			aria-hidden="true"
		>
			<div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl" />
			<div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
		</div>

		<div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
			<div className="flex flex-col gap-6">
				<div className="inline-flex items-center gap-2 self-start px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
					<HugeiconsIcon icon={SparklesIcon} size={15} />
					<span>{t.badge}</span>
				</div>

				<h1 className="text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight text-foreground">
					{t.headline1}
					<br />
					<span className="text-primary">{t.headline2}</span> {t.headline3}
				</h1>

				<p className="text-lg text-default-500 leading-relaxed max-w-md">
					{t.subtitle}
				</p>

				<div className="flex flex-wrap gap-3">
					<Link
						href="/register"
						className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-7 py-3 rounded-full text-base hover:bg-primary/90 transition-colors"
					>
						{t.ctaPrimary}
						<HugeiconsIcon icon={ArrowRight02Icon} size={16} />
					</Link>
					<Link
						href="/pricing"
						className="inline-flex items-center gap-2 border border-divider font-semibold px-7 py-3 rounded-full text-base hover:bg-content2 transition-colors"
					>
						{t.ctaSecondary}
					</Link>
				</div>

				<div className="flex items-center gap-3 text-sm text-default-400">
					<HugeiconsIcon
						icon={CheckmarkCircle02Icon}
						size={16}
						className="text-emerald-500 shrink-0"
					/>
					<span>{t.noCreditCard}</span>
				</div>
			</div>

			<div className="relative flex justify-center lg:justify-end">
				<div className="relative bg-content1 border border-divider rounded-3xl p-7 shadow-xl shadow-default/10 w-full max-w-sm">
					<div className="flex items-center gap-3 mb-5">
						<div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
							<HugeiconsIcon
								icon={QrCodeIcon}
								size={18}
								className="text-primary"
							/>
						</div>
						<div>
							<p className="text-sm font-semibold text-foreground">
								mi-sitio-web.com
							</p>
							<p className="text-xs text-default-400">{t.mockupDynamic}</p>
						</div>
						<div className="ml-auto w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_6px] shadow-emerald-400/60" />
					</div>

					<div className="flex justify-center mb-5">
						<QrMockup />
					</div>

					<div className="grid grid-cols-3 gap-2 text-center">
						<div className="bg-default-100 rounded-xl py-2 px-1">
							<p className="text-base font-bold text-foreground">1,284</p>
							<p className="text-[10px] text-default-400">{t.mockupScans}</p>
						</div>
						<div className="bg-default-100 rounded-xl py-2 px-1">
							<p className="text-base font-bold text-foreground">38</p>
							<p className="text-[10px] text-default-400">
								{t.mockupCountries}
							</p>
						</div>
						<div className="bg-default-100 rounded-xl py-2 px-1">
							<p className="text-base font-bold text-foreground">99.9%</p>
							<p className="text-[10px] text-default-400">{t.mockupUptime}</p>
						</div>
					</div>
				</div>

				<div className="absolute -top-4 -right-4 md:right-0 bg-content1 border border-divider rounded-2xl px-3.5 py-2.5 shadow-lg flex items-center gap-2">
					<div className="w-7 h-7 rounded-full bg-emerald-500/15 flex items-center justify-center">
						<HugeiconsIcon
							icon={GlobalIcon}
							size={14}
							className="text-emerald-500"
						/>
					</div>
					<div>
						<p className="text-xs font-bold text-foreground">{t.badge150}</p>
						<p className="text-[10px] text-default-400">{t.badge150Sub}</p>
					</div>
				</div>

				<div className="absolute -bottom-4 -left-4 md:left-0 bg-content1 border border-divider rounded-2xl px-3.5 py-2.5 shadow-lg flex items-center gap-2">
					<div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center">
						<HugeiconsIcon
							icon={QrCodeIcon}
							size={14}
							className="text-primary"
						/>
					</div>
					<div>
						<p className="text-xs font-bold text-foreground">{t.badge10k}</p>
						<p className="text-[10px] text-default-400">{t.badge10kSub}</p>
					</div>
				</div>
			</div>
		</div>
	</section>
)

interface StatsT {
	qrs: string
	scans: string
	uptime: string
	countries: string
}

const StatsBar = ({ t }: { t: StatsT }) => {
	const stats = [
		{ value: '10,000+', label: t.qrs },
		{ value: '500K+', label: t.scans },
		{ value: '99.9%', label: t.uptime },
		{ value: '150+', label: t.countries },
	]
	return (
		<section className="px-4">
			<div className="max-w-6xl mx-auto border-t border-b border-divider py-10">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
					{stats.map((s) => (
						<div key={s.label} className="flex flex-col gap-1">
							<span className="text-3xl font-extrabold text-primary">
								{s.value}
							</span>
							<span className="text-sm text-default-500">{s.label}</span>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}

interface HowT {
	label: string
	title: string
	subtitle: string
	step1Title: string
	step1Desc: string
	step2Title: string
	step2Desc: string
	step3Title: string
	step3Desc: string
}

const HowItWorksSection = ({ t }: { t: HowT }) => {
	const steps = [
		{
			number: '01',
			icon: QrCodeIcon,
			title: t.step1Title,
			description: t.step1Desc,
		},
		{
			number: '02',
			icon: PaintBoardIcon,
			title: t.step2Title,
			description: t.step2Desc,
		},
		{
			number: '03',
			icon: Download04Icon,
			title: t.step3Title,
			description: t.step3Desc,
		},
	]
	return (
		<section className="py-24 px-4">
			<div className="max-w-6xl mx-auto">
				<div className="text-center mb-16">
					<p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
						{t.label}
					</p>
					<h2 className="text-4xl md:text-5xl font-extrabold text-foreground">
						{t.title}
					</h2>
					<p className="mt-4 text-default-500 text-lg max-w-xl mx-auto">
						{t.subtitle}
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
					<div
						className="hidden md:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-divider"
						aria-hidden="true"
					/>
					{steps.map((step) => (
						<div
							key={step.number}
							className="flex flex-col items-center text-center gap-5"
						>
							<div className="relative">
								<div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
									<HugeiconsIcon
										icon={step.icon}
										size={32}
										className="text-primary"
									/>
								</div>
								<span className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shadow-md">
									{step.number}
								</span>
							</div>
							<div>
								<h3 className="text-xl font-bold text-foreground mb-2">
									{step.title}
								</h3>
								<p className="text-default-500 leading-relaxed text-sm">
									{step.description}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}

interface FeaturesT {
	label: string
	title: string
	subtitle: string
	analyticsTitle: string
	analyticsDesc: string
	customTitle: string
	customDesc: string
	dynamicTitle: string
	dynamicDesc: string
	passwordTitle: string
	passwordDesc: string
	formatsTitle: string
	formatsDesc: string
	foldersTitle: string
	foldersDesc: string
}

const FeaturesSection = ({ t }: { t: FeaturesT }) => {
	const features = [
		{
			icon: BarChartIcon,
			color: 'bg-violet-500/10 text-violet-500',
			title: t.analyticsTitle,
			description: t.analyticsDesc,
		},
		{
			icon: PaintBoardIcon,
			color: 'bg-pink-500/10 text-pink-500',
			title: t.customTitle,
			description: t.customDesc,
		},
		{
			icon: Link01Icon,
			color: 'bg-blue-500/10 text-blue-500',
			title: t.dynamicTitle,
			description: t.dynamicDesc,
		},
		{
			icon: LockPasswordIcon,
			color: 'bg-amber-500/10 text-amber-500',
			title: t.passwordTitle,
			description: t.passwordDesc,
		},
		{
			icon: Download04Icon,
			color: 'bg-emerald-500/10 text-emerald-500',
			title: t.formatsTitle,
			description: t.formatsDesc,
		},
		{
			icon: Folder01Icon,
			color: 'bg-primary/10 text-primary',
			title: t.foldersTitle,
			description: t.foldersDesc,
		},
	]
	return (
		<section className="py-24 px-4 bg-content1">
			<div className="max-w-6xl mx-auto">
				<div className="text-center mb-16">
					<p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
						{t.label}
					</p>
					<h2 className="text-4xl md:text-5xl font-extrabold text-foreground">
						{t.title}
					</h2>
					<p className="mt-4 text-default-500 text-lg max-w-xl mx-auto">
						{t.subtitle}
					</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{features.map((feat) => (
						<div
							key={feat.title}
							className="group bg-background border border-divider rounded-2xl p-6 flex flex-col gap-4 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 transition-all duration-300"
						>
							<div
								className={`w-12 h-12 rounded-xl flex items-center justify-center ${feat.color}`}
							>
								<HugeiconsIcon icon={feat.icon} size={22} />
							</div>
							<div>
								<h3 className="text-lg font-bold text-foreground mb-1">
									{feat.title}
								</h3>
								<p className="text-sm text-default-500 leading-relaxed">
									{feat.description}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}

interface PricingT {
	label: string
	title: string
	subtitle: string
	mostPopular: string
	forever: string
	perMonth: string
	viewAll: string
	freeName: string
	freeDesc: string
	freeBullet1: string
	freeBullet2: string
	freeBullet3: string
	freeCta: string
	proName: string
	proDesc: string
	proBullet1: string
	proBullet2: string
	proBullet3: string
	proCta: string
	businessName: string
	businessDesc: string
	businessBullet1: string
	businessBullet2: string
	businessBullet3: string
	businessCta: string
}

const PricingTeaserSection = ({ t }: { t: PricingT }) => {
	const plans = [
		{
			name: t.freeName,
			price: '$0',
			period: t.forever,
			description: t.freeDesc,
			highlighted: false,
			bullets: [t.freeBullet1, t.freeBullet2, t.freeBullet3],
			cta: t.freeCta,
			href: '/register',
		},
		{
			name: t.proName,
			price: '$12',
			period: t.perMonth,
			description: t.proDesc,
			highlighted: true,
			bullets: [t.proBullet1, t.proBullet2, t.proBullet3],
			cta: t.proCta,
			href: '/register',
		},
		{
			name: t.businessName,
			price: '$29',
			period: t.perMonth,
			description: t.businessDesc,
			highlighted: false,
			bullets: [t.businessBullet1, t.businessBullet2, t.businessBullet3],
			cta: t.businessCta,
			href: '/register',
		},
	]
	return (
		<section className="py-24 px-4">
			<div className="max-w-6xl mx-auto">
				<div className="text-center mb-16">
					<p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
						{t.label}
					</p>
					<h2 className="text-4xl md:text-5xl font-extrabold text-foreground">
						{t.title}
					</h2>
					<p className="mt-4 text-default-500 text-lg max-w-xl mx-auto">
						{t.subtitle}
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
					{plans.map((plan) => (
						<div
							key={plan.name}
							className={`relative flex flex-col rounded-2xl border p-7 ${plan.highlighted ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' : 'border-divider bg-content1'}`}
						>
							{plan.highlighted && (
								<div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
									<span className="bg-primary text-white text-xs font-bold px-4 py-1 rounded-full shadow">
										{t.mostPopular}
									</span>
								</div>
							)}
							<div className="mb-5">
								<h3 className="text-lg font-bold text-foreground mb-0.5">
									{plan.name}
								</h3>
								<p className="text-sm text-default-400 mb-4">
									{plan.description}
								</p>
								<div className="flex items-end gap-1.5">
									<span className="text-4xl font-extrabold text-foreground">
										{plan.price}
									</span>
									<span className="text-default-400 text-sm mb-1">
										{plan.period}
									</span>
								</div>
							</div>
							<ul className="flex flex-col gap-2.5 mb-6 flex-1">
								{plan.bullets.map((bullet) => (
									<li key={bullet} className="flex items-start gap-2 text-sm">
										<HugeiconsIcon
											icon={CheckmarkCircle02Icon}
											size={16}
											className="text-emerald-500 mt-0.5 shrink-0"
										/>
										<span className="text-default-600">{bullet}</span>
									</li>
								))}
							</ul>
							<Link
								href={plan.href}
								className={`w-full inline-flex justify-center items-center font-semibold py-2.5 rounded-full transition-colors ${plan.highlighted ? 'bg-primary text-white hover:bg-primary/90' : 'border border-divider hover:bg-content2'}`}
							>
								{plan.cta}
							</Link>
						</div>
					))}
				</div>

				<div className="text-center mt-10">
					<Link
						href="/pricing"
						className="inline-flex items-center gap-1.5 text-primary hover:underline font-medium text-sm"
					>
						{t.viewAll}
						<HugeiconsIcon icon={ArrowRight02Icon} size={14} />
					</Link>
				</div>
			</div>
		</section>
	)
}

interface CtaT {
	title: string
	subtitle: string
	button: string
	noCreditCard: string
}

const FinalCtaSection = ({ t }: { t: CtaT }) => (
	<section className="py-24 px-4">
		<div className="max-w-3xl mx-auto text-center bg-primary/8 border border-primary/20 rounded-3xl px-8 py-16 relative overflow-hidden">
			<div className="absolute inset-0 pointer-events-none" aria-hidden="true">
				<div className="absolute -top-16 -left-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
				<div className="absolute -bottom-16 -right-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
			</div>
			<div className="relative z-10 flex flex-col items-center gap-6">
				<div className="w-16 h-16 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center">
					<HugeiconsIcon
						icon={SparklesIcon}
						size={28}
						className="text-primary"
					/>
				</div>
				<h2 className="text-4xl md:text-5xl font-extrabold text-foreground">
					{t.title}
				</h2>
				<p className="text-default-500 text-lg max-w-md">{t.subtitle}</p>
				<Link
					href="/register"
					className="inline-flex items-center gap-2 bg-primary text-white font-bold px-10 py-3.5 rounded-full text-base shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors"
				>
					{t.button}
					<HugeiconsIcon icon={ArrowRight02Icon} size={17} />
				</Link>
				<p className="text-sm text-default-400">{t.noCreditCard}</p>
			</div>
		</div>
	</section>
)

// ─────────────────────────────────────────────────────────────────────────────
// Page export
// ─────────────────────────────────────────────────────────────────────────────
export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('landing.meta')
	const siteUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
	return {
		title: t('title'),
		description: t('description'),
		alternates: { canonical: siteUrl },
		keywords: [
			'generador de códigos QR',
			'crear código QR dinámico',
			'QR con analytics',
			'QR personalizado con logo',
			'rastrear escaneos QR',
			'QR generator SaaS',
			'dynamic QR code',
			'QR code analytics',
			'QR code tracking',
		],
		openGraph: {
			title: t('title'),
			description: t('description'),
			url: siteUrl,
			images: [{ url: '/og-image.png', width: 1200, height: 630, alt: t('title') }],
			type: 'website',
			locale: 'es_ES',
		},
	}
}

const jsonLd = {
	'@context': 'https://schema.org',
	'@graph': [
		{
			'@type': 'Organization',
			'@id': `${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/#organization`,
			name: 'QR Generator',
			url: process.env.NEXT_PUBLIC_BASE_URL ?? '',
			logo: {
				'@type': 'ImageObject',
				url: `${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/logo.svg`,
			},
		},
		{
			'@type': 'WebSite',
			'@id': `${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/#website`,
			url: process.env.NEXT_PUBLIC_BASE_URL ?? '',
			name: 'QR Generator',
			publisher: { '@id': `${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/#organization` },
			inLanguage: ['es', 'en'],
		},
		{
			'@type': 'SoftwareApplication',
			name: 'QR Generator',
			applicationCategory: 'BusinessApplication',
			operatingSystem: 'Web',
			url: process.env.NEXT_PUBLIC_BASE_URL ?? '',
			description:
				'Plataforma SaaS para crear, personalizar y rastrear códigos QR dinámicos con analytics avanzado.',
			offers: [
				{ '@type': 'Offer', name: 'Free', price: '0', priceCurrency: 'USD' },
				{ '@type': 'Offer', name: 'Pro', price: '12', priceCurrency: 'USD', billingIncrement: 'month' },
				{ '@type': 'Offer', name: 'Business', price: '29', priceCurrency: 'USD', billingIncrement: 'month' },
			],
		},
	],
}

const LandingPage = async () => {
	const t = await getTranslations('landing')

	return (
		<>
			{/* JSON-LD structured data */}
			<script
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: controlled static JSON-LD
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
			<HeroSection
				t={{
					badge: t('hero.badge'),
					headline1: t('hero.headline1'),
					headline2: t('hero.headline2'),
					headline3: t('hero.headline3'),
					subtitle: t('hero.subtitle'),
					ctaPrimary: t('hero.ctaPrimary'),
					ctaSecondary: t('hero.ctaSecondary'),
					noCreditCard: t('hero.noCreditCard'),
					mockupDynamic: t('hero.mockupDynamic'),
					mockupScans: t('hero.mockupScans'),
					mockupCountries: t('hero.mockupCountries'),
					mockupUptime: t('hero.mockupUptime'),
					badge150: t('hero.badge150'),
					badge150Sub: t('hero.badge150Sub'),
					badge10k: t('hero.badge10k'),
					badge10kSub: t('hero.badge10kSub'),
				}}
			/>
			<StatsBar
				t={{
					qrs: t('stats.qrs'),
					scans: t('stats.scans'),
					uptime: t('stats.uptime'),
					countries: t('stats.countries'),
				}}
			/>
			<HowItWorksSection
				t={{
					label: t('howItWorks.label'),
					title: t('howItWorks.title'),
					subtitle: t('howItWorks.subtitle'),
					step1Title: t('howItWorks.step1Title'),
					step1Desc: t('howItWorks.step1Desc'),
					step2Title: t('howItWorks.step2Title'),
					step2Desc: t('howItWorks.step2Desc'),
					step3Title: t('howItWorks.step3Title'),
					step3Desc: t('howItWorks.step3Desc'),
				}}
			/>
			<FeaturesSection
				t={{
					label: t('features.label'),
					title: t('features.title'),
					subtitle: t('features.subtitle'),
					analyticsTitle: t('features.analyticsTitle'),
					analyticsDesc: t('features.analyticsDesc'),
					customTitle: t('features.customTitle'),
					customDesc: t('features.customDesc'),
					dynamicTitle: t('features.dynamicTitle'),
					dynamicDesc: t('features.dynamicDesc'),
					passwordTitle: t('features.passwordTitle'),
					passwordDesc: t('features.passwordDesc'),
					formatsTitle: t('features.formatsTitle'),
					formatsDesc: t('features.formatsDesc'),
					foldersTitle: t('features.foldersTitle'),
					foldersDesc: t('features.foldersDesc'),
				}}
			/>
			<PricingTeaserSection
				t={{
					label: t('pricing.label'),
					title: t('pricing.title'),
					subtitle: t('pricing.subtitle'),
					mostPopular: t('pricing.mostPopular'),
					forever: t('pricing.forever'),
					perMonth: t('pricing.perMonth'),
					viewAll: t('pricing.viewAll'),
					freeName: t('pricing.freeName'),
					freeDesc: t('pricing.freeDesc'),
					freeBullet1: t('pricing.freeBullet1'),
					freeBullet2: t('pricing.freeBullet2'),
					freeBullet3: t('pricing.freeBullet3'),
					freeCta: t('pricing.freeCta'),
					proName: t('pricing.proName'),
					proDesc: t('pricing.proDesc'),
					proBullet1: t('pricing.proBullet1'),
					proBullet2: t('pricing.proBullet2'),
					proBullet3: t('pricing.proBullet3'),
					proCta: t('pricing.proCta'),
					businessName: t('pricing.businessName'),
					businessDesc: t('pricing.businessDesc'),
					businessBullet1: t('pricing.businessBullet1'),
					businessBullet2: t('pricing.businessBullet2'),
					businessBullet3: t('pricing.businessBullet3'),
					businessCta: t('pricing.businessCta'),
				}}
			/>
			<FinalCtaSection
				t={{
					title: t('cta.title'),
					subtitle: t('cta.subtitle'),
					button: t('cta.button'),
					noCreditCard: t('cta.noCreditCard'),
				}}
			/>
		</>
	)
}

export default LandingPage
