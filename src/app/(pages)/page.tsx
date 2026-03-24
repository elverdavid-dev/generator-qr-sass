import {
	BarChartIcon,
	CheckmarkCircle02Icon,
	Download04Icon,
	Folder01Icon,
	Link01Icon,
	LockPasswordIcon,
	PaintBoardIcon,
	QrCodeIcon,
	SmartPhone01Icon,
	UserGroupIcon,
	WebProgrammingIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { HeroCard } from './_components/hero-card'
import { MarqueeTicker } from './_components/marquee-ticker'
import { ScrollReveal } from './_components/scroll-reveal'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface HeroT {
	badge: string
	headline1: string
	headline2: string
	headline3: string
	subtitle: string
	ctaPrimary: string
	ctaSecondary: string
	trust1: string
	trust2: string
	trust3: string
}

interface StatsT {
	qrs: string
	scans: string
	uptime: string
	countries: string
}

interface MockupT {
	analyticsLabel: string
	scans: string
	today: string
	countries: string
	qrStyle: string
	square: string
	round: string
	dots: string
	exportAs: string
	deviceBreakdown: string
}

interface FeaturesT {
	label: string
	title: string
	analyticsOverline: string
	analyticsTitle: string
	analyticsDesc: string
	analyticsBullet1: string
	analyticsBullet2: string
	analyticsBullet3: string
	designOverline: string
	designTitle: string
	designDesc: string
	designBullet1: string
	designBullet2: string
	designBullet3: string
	dynamicOverline: string
	dynamicTitle: string
	dynamicDesc: string
	dynamicBullet1: string
	dynamicBullet2: string
	dynamicBullet3: string
	mini1Title: string
	mini1Desc: string
	mini2Title: string
	mini2Desc: string
	mini3Title: string
	mini3Desc: string
	mini4Title: string
	mini4Desc: string
}

interface HowItWorksT {
	label: string
	title: string
	step1Title: string
	step1Desc: string
	step2Title: string
	step2Desc: string
	step3Title: string
	step3Desc: string
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
	proBullet4: string
	proBullet5: string
	proBullet6: string
	proCta: string
	businessName: string
	businessDesc: string
	businessBullet1: string
	businessBullet2: string
	businessBullet3: string
	businessBullet4: string
	businessCta: string
}

interface CtaT {
	label: string
	title: string
	subtitle: string
	button: string
	footnote: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Hero Section
// ─────────────────────────────────────────────────────────────────────────────
const HeroSection = ({ t }: { t: HeroT }) => (
	<section className="relative overflow-hidden min-h-[100dvh] flex items-center px-4 py-24 md:py-0">
		<div
			className="absolute inset-0 -z-10 pointer-events-none"
			aria-hidden="true"
		>
			<div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-primary/6 rounded-full blur-[120px]" />
			<div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/4 rounded-full blur-[100px]" />
		</div>

		<div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 lg:gap-20 items-center">
			<div className="flex flex-col gap-7">
				<div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-primary text-xs font-semibold tracking-wide uppercase">
					<span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
					{t.badge}
				</div>

				<h1 className="text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight text-foreground">
					{t.headline1}
					<br />
					<span className="text-primary">{t.headline2.split(' ')[0]}</span>{' '}
					{t.headline2.split(' ').slice(1).join(' ')}
					<br />
					{t.headline3}
				</h1>

				<p className="text-lg text-default-500 leading-relaxed max-w-[50ch]">
					{t.subtitle}
				</p>

				<div className="flex flex-wrap gap-3">
					<Link
						href="/register"
						className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-7 py-3.5 rounded-full text-base hover:bg-primary/90 active:scale-[0.98] transition-all"
					>
						{t.ctaPrimary}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2.5"
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden="true"
						>
							<path d="M5 12h14M12 5l7 7-7 7" />
						</svg>
					</Link>
					<Link
						href="/pricing"
						className="inline-flex items-center gap-2 border border-divider font-semibold px-7 py-3.5 rounded-full text-base hover:bg-content1 active:scale-[0.98] transition-all"
					>
						{t.ctaSecondary}
					</Link>
				</div>

				<div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-default-400">
					{[t.trust1, t.trust2, t.trust3].map((item) => (
						<span key={item} className="flex items-center gap-1.5">
							<HugeiconsIcon
								icon={CheckmarkCircle02Icon}
								size={14}
								className="text-emerald-500 shrink-0"
							/>
							{item}
						</span>
					))}
				</div>
			</div>

			<HeroCard />
		</div>
	</section>
)

// ─────────────────────────────────────────────────────────────────────────────
// Stats Strip
// ─────────────────────────────────────────────────────────────────────────────
const StatsStrip = ({ t }: { t: StatsT }) => {
	const stats = [
		{ value: '10,000+', label: t.qrs },
		{ value: '500K+', label: t.scans },
		{ value: '99.9%', label: t.uptime },
		{ value: '150+', label: t.countries },
	]
	return (
		<section className="px-4">
			<div className="max-w-6xl mx-auto py-12">
				<div className="grid grid-cols-2 md:grid-cols-4">
					{stats.map((s, i) => (
						<div
							key={s.label}
							className={`flex flex-col gap-1 py-6 px-6 ${i > 0 ? 'md:border-l border-divider' : ''} ${i >= 2 ? 'border-t md:border-t-0' : ''}`}
						>
							<span className="text-3xl font-extrabold text-primary tracking-tight">
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

// ─────────────────────────────────────────────────────────────────────────────
// Mockup components
// ─────────────────────────────────────────────────────────────────────────────
const AnalyticsMockup = ({ t }: { t: MockupT }) => (
	<div className="bg-content1 border border-divider rounded-2xl p-6 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.06)]">
		<p className="text-xs font-semibold text-default-400 mb-4 uppercase tracking-wider">
			{t.analyticsLabel}
		</p>
		<div className="flex items-end gap-1.5 h-24 mb-5">
			{[38, 62, 47, 85, 58, 91, 73].map((h, i) => (
				<div
					// biome-ignore lint/suspicious/noArrayIndexKey: static chart bars
					key={i}
					className="flex-1 rounded-t-sm bg-primary/20"
					style={{ height: `${h}%` }}
				/>
			))}
		</div>
		<div className="grid grid-cols-3 gap-3 text-center border-t border-divider pt-4">
			<div>
				<p className="text-xl font-bold text-primary">1,284</p>
				<p className="text-xs text-default-400">{t.scans}</p>
			</div>
			<div>
				<p className="text-xl font-bold text-emerald-500">+34</p>
				<p className="text-xs text-default-400">{t.today}</p>
			</div>
			<div>
				<p className="text-xl font-bold text-foreground">38</p>
				<p className="text-xs text-default-400">{t.countries}</p>
			</div>
		</div>
	</div>
)

const CustomMockup = ({ t }: { t: MockupT }) => (
	<div className="bg-content1 border border-divider rounded-2xl p-6 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.06)] flex flex-col gap-5">
		<p className="text-xs font-semibold text-default-400 uppercase tracking-wider">
			{t.qrStyle}
		</p>
		<div className="flex gap-2.5">
			{['#465fff', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#1e2939'].map(
				(c) => (
					<div
						key={c}
						className="w-8 h-8 rounded-full ring-2 ring-white ring-offset-1 shadow-sm"
						style={{ background: c }}
					/>
				),
			)}
		</div>
		<div className="grid grid-cols-3 gap-3">
			{[
				{ label: t.square },
				{ label: t.round },
				{ label: t.dots },
			].map((style) => (
				<div
					key={style.label}
					className="aspect-square border border-divider rounded-xl flex flex-col items-center justify-center gap-2 hover:border-primary/40 transition-colors"
				>
					<HugeiconsIcon
						icon={QrCodeIcon}
						size={20}
						className="text-primary"
					/>
					<span className="text-[10px] text-default-400">{style.label}</span>
				</div>
			))}
		</div>
		<div className="flex items-center gap-3 bg-default-100 rounded-xl px-4 py-3">
			<HugeiconsIcon icon={Download04Icon} size={15} className="text-primary" />
			<span className="text-sm text-default-500">
				{t.exportAs}{' '}
				<strong className="text-foreground font-semibold">PNG, SVG</strong>
			</span>
		</div>
	</div>
)

const TrackingMockup = ({ t }: { t: MockupT }) => (
	<div className="bg-content1 border border-divider rounded-2xl p-6 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.06)] flex flex-col gap-4">
		<p className="text-xs font-semibold text-default-400 uppercase tracking-wider">
			{t.deviceBreakdown}
		</p>
		{[
			{ label: 'iOS', pct: 67, color: 'bg-primary' },
			{ label: 'Android', pct: 28, color: 'bg-emerald-500' },
			{ label: 'Desktop', pct: 5, color: 'bg-amber-400' },
		].map((d) => (
			<div key={d.label} className="flex items-center gap-3">
				<span className="text-sm text-default-500 w-16 shrink-0">{d.label}</span>
				<div className="flex-1 bg-default-100 rounded-full h-2">
					<div
						className={`${d.color} h-2 rounded-full`}
						style={{ width: `${d.pct}%` }}
					/>
				</div>
				<span className="text-sm font-semibold text-foreground w-8 text-right">
					{d.pct}%
				</span>
			</div>
		))}
		<div className="border-t border-divider pt-4 flex items-center gap-3">
			<div className="flex items-center gap-1.5">
				<HugeiconsIcon
					icon={SmartPhone01Icon}
					size={14}
					className="text-primary"
				/>
				<span className="text-xs text-default-400">
					95% mobile · 38 {t.countries.toLowerCase()}
				</span>
			</div>
		</div>
	</div>
)

// ─────────────────────────────────────────────────────────────────────────────
// Features Section
// ─────────────────────────────────────────────────────────────────────────────
const FeaturesSection = ({ t, mt }: { t: FeaturesT; mt: MockupT }) => {
	const zigzag = [
		{
			overline: t.analyticsOverline,
			title: t.analyticsTitle,
			description: t.analyticsDesc,
			bullets: [t.analyticsBullet1, t.analyticsBullet2, t.analyticsBullet3],
			icon: BarChartIcon,
			mockup: <AnalyticsMockup t={mt} />,
			reverse: false,
		},
		{
			overline: t.designOverline,
			title: t.designTitle,
			description: t.designDesc,
			bullets: [t.designBullet1, t.designBullet2, t.designBullet3],
			icon: PaintBoardIcon,
			mockup: <CustomMockup t={mt} />,
			reverse: true,
		},
		{
			overline: t.dynamicOverline,
			title: t.dynamicTitle,
			description: t.dynamicDesc,
			bullets: [t.dynamicBullet1, t.dynamicBullet2, t.dynamicBullet3],
			icon: Link01Icon,
			mockup: <TrackingMockup t={mt} />,
			reverse: false,
		},
	]

	const miniFeatures = [
		{ icon: LockPasswordIcon, title: t.mini1Title, desc: t.mini1Desc },
		{ icon: Folder01Icon, title: t.mini2Title, desc: t.mini2Desc },
		{ icon: WebProgrammingIcon, title: t.mini3Title, desc: t.mini3Desc },
		{ icon: UserGroupIcon, title: t.mini4Title, desc: t.mini4Desc },
	]

	return (
		<section className="py-24 px-4">
			<div className="max-w-6xl mx-auto">
				<ScrollReveal>
					<div className="mb-16 max-w-xl">
						<p className="text-primary text-xs font-semibold uppercase tracking-widest mb-3">
							— {t.label}
						</p>
						<h2 className="text-4xl md:text-5xl font-extrabold text-foreground leading-tight tracking-tight">
							{t.title}
						</h2>
					</div>
				</ScrollReveal>

				<div className="flex flex-col gap-20">
					{zigzag.map((feat) => (
						<div
							key={feat.title}
							className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${feat.reverse ? 'lg:[&>*:first-child]:order-2' : ''}`}
						>
							<ScrollReveal direction={feat.reverse ? 'right' : 'left'} delay={0.1}>
								<div className="flex flex-col gap-5">
									<div className="flex items-center gap-2">
										<div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
											<HugeiconsIcon icon={feat.icon} size={16} className="text-primary" />
										</div>
										<span className="text-xs font-semibold text-primary uppercase tracking-widest">
											{feat.overline}
										</span>
									</div>
									<h3 className="text-3xl font-bold text-foreground leading-tight tracking-tight">
										{feat.title}
									</h3>
									<p className="text-default-500 leading-relaxed">{feat.description}</p>
									<ul className="flex flex-col gap-2.5">
										{feat.bullets.map((b) => (
											<li key={b} className="flex items-center gap-2.5 text-sm">
												<HugeiconsIcon
													icon={CheckmarkCircle02Icon}
													size={15}
													className="text-emerald-500 shrink-0"
												/>
												<span className="text-default-600">{b}</span>
											</li>
										))}
									</ul>
								</div>
							</ScrollReveal>

							<ScrollReveal direction={feat.reverse ? 'left' : 'right'} delay={0.2}>
								{feat.mockup}
							</ScrollReveal>
						</div>
					))}
				</div>

				<div className="mt-20 grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-divider pt-16">
					{miniFeatures.map((f) => (
						<ScrollReveal key={f.title} delay={0.05}>
							<div className="flex gap-4 items-start p-5 rounded-xl border border-divider hover:border-primary/30 transition-colors">
								<div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center shrink-0 mt-0.5">
									<HugeiconsIcon icon={f.icon} size={16} className="text-primary" />
								</div>
								<div>
									<p className="font-semibold text-foreground text-sm mb-1">{f.title}</p>
									<p className="text-xs text-default-500 leading-relaxed">{f.desc}</p>
								</div>
							</div>
						</ScrollReveal>
					))}
				</div>
			</div>
		</section>
	)
}

// ─────────────────────────────────────────────────────────────────────────────
// How It Works Section
// ─────────────────────────────────────────────────────────────────────────────
const HowItWorksSection = ({ t }: { t: HowItWorksT }) => {
	const steps = [
		{ n: '01', icon: QrCodeIcon, title: t.step1Title, desc: t.step1Desc },
		{ n: '02', icon: PaintBoardIcon, title: t.step2Title, desc: t.step2Desc },
		{ n: '03', icon: BarChartIcon, title: t.step3Title, desc: t.step3Desc },
	]

	return (
		<section className="py-24 px-4 bg-content1">
			<div className="max-w-6xl mx-auto">
				<ScrollReveal>
					<div className="mb-14">
						<p className="text-primary text-xs font-semibold uppercase tracking-widest mb-3">
							— {t.label}
						</p>
						<h2 className="text-4xl font-extrabold text-foreground tracking-tight">
							{t.title}
						</h2>
					</div>
				</ScrollReveal>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
					<div
						className="hidden md:block absolute top-9 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-px"
						aria-hidden="true"
						style={{
							background:
								'linear-gradient(to right, transparent, var(--heroui-divider), transparent)',
						}}
					/>

					{steps.map((step, i) => (
						<ScrollReveal key={step.n} delay={i * 0.12}>
							<div className="flex flex-col gap-5">
								<div className="relative self-start">
									<div className="w-[72px] h-[72px] rounded-2xl bg-background border border-divider flex items-center justify-center shadow-sm">
										<HugeiconsIcon icon={step.icon} size={28} className="text-primary" />
									</div>
									<span className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shadow-md">
										{step.n}
									</span>
								</div>
								<div>
									<h3 className="text-lg font-bold text-foreground mb-1.5">{step.title}</h3>
									<p className="text-sm text-default-500 leading-relaxed">{step.desc}</p>
								</div>
							</div>
						</ScrollReveal>
					))}
				</div>
			</div>
		</section>
	)
}

// ─────────────────────────────────────────────────────────────────────────────
// Pricing Teaser Section
// ─────────────────────────────────────────────────────────────────────────────
const PricingTeaserSection = ({ t }: { t: PricingT }) => {
	const plans = [
		{
			id: 'free',
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
			id: 'pro',
			name: t.proName,
			price: '$12',
			period: t.perMonth,
			description: t.proDesc,
			highlighted: true,
			bullets: [t.proBullet1, t.proBullet2, t.proBullet3, t.proBullet4, t.proBullet5, t.proBullet6],
			cta: t.proCta,
			href: '/register',
		},
		{
			id: 'business',
			name: t.businessName,
			price: '$29',
			period: t.perMonth,
			description: t.businessDesc,
			highlighted: false,
			bullets: [t.businessBullet1, t.businessBullet2, t.businessBullet3, t.businessBullet4],
			cta: t.businessCta,
			href: '/register',
		},
	]

	return (
		<section className="py-24 px-4">
			<div className="max-w-6xl mx-auto">
				<ScrollReveal>
					<div className="mb-14">
						<p className="text-primary text-xs font-semibold uppercase tracking-widest mb-3">
							— {t.label}
						</p>
						<h2 className="text-4xl font-extrabold text-foreground tracking-tight">
							{t.title}
						</h2>
						<p className="mt-3 text-default-500 max-w-md">{t.subtitle}</p>
					</div>
				</ScrollReveal>

				<div className="grid grid-cols-1 md:grid-cols-[1fr_1.35fr_1fr] gap-5 items-stretch">
					{plans.map((plan, i) => (
						<ScrollReveal key={plan.id} delay={i * 0.08}>
							<div
								className={`relative flex flex-col h-full rounded-2xl border p-7 ${
									plan.highlighted
										? 'border-primary bg-primary/5 shadow-[0_12px_40px_-10px_rgba(70,95,255,0.2)]'
										: 'border-divider bg-content1'
								}`}
							>
								{plan.highlighted && (
									<div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
										<span className="bg-primary text-white text-xs font-bold px-4 py-1 rounded-full shadow-sm">
											{t.mostPopular}
										</span>
									</div>
								)}

								<div className="mb-5">
									<h3 className={`font-bold mb-0.5 ${plan.highlighted ? 'text-xl' : 'text-lg'} text-foreground`}>
										{plan.name}
									</h3>
									<p className="text-xs text-default-400 mb-4">{plan.description}</p>
									<div className="flex items-end gap-1">
										<span className={`font-extrabold text-foreground ${plan.highlighted ? 'text-5xl' : 'text-4xl'}`}>
											{plan.price}
										</span>
										<span className="text-default-400 text-sm mb-1.5">{plan.period}</span>
									</div>
								</div>

								<ul className="flex flex-col gap-2.5 mb-6 flex-1">
									{plan.bullets.map((b) => (
										<li key={b} className="flex items-start gap-2 text-sm">
											<HugeiconsIcon
												icon={CheckmarkCircle02Icon}
												size={15}
												className="text-emerald-500 mt-0.5 shrink-0"
											/>
											<span className="text-default-600">{b}</span>
										</li>
									))}
								</ul>

								<Link
									href={plan.href}
									className={`w-full inline-flex justify-center items-center font-semibold py-3 rounded-full transition-all active:scale-[0.98] ${
										plan.highlighted
											? 'bg-primary text-white hover:bg-primary/90 shadow-sm'
											: 'border border-divider hover:bg-content2'
									}`}
								>
									{plan.cta}
								</Link>
							</div>
						</ScrollReveal>
					))}
				</div>

				<div className="text-center mt-8">
					<Link
						href="/pricing"
						className="text-sm text-primary hover:underline font-medium inline-flex items-center gap-1"
					>
						{t.viewAll}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2.5"
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden="true"
						>
							<path d="M5 12h14M12 5l7 7-7 7" />
						</svg>
					</Link>
				</div>
			</div>
		</section>
	)
}

// ─────────────────────────────────────────────────────────────────────────────
// Final CTA Section
// ─────────────────────────────────────────────────────────────────────────────
const FinalCtaSection = ({ t }: { t: CtaT }) => (
	<section className="px-4 py-6">
		<div className="max-w-6xl mx-auto">
			<ScrollReveal>
				<div className="relative overflow-hidden rounded-3xl bg-zinc-950 dark:bg-content1 dark:border dark:border-divider px-8 md:px-16 py-16 md:py-20">
					<div
						className="absolute inset-0 pointer-events-none"
						aria-hidden="true"
					>
						<div className="absolute top-0 left-1/4 w-96 h-64 bg-primary/15 rounded-full blur-[80px]" />
						<div className="absolute bottom-0 right-1/4 w-80 h-64 bg-primary/10 rounded-full blur-[80px]" />
					</div>

					<div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
						<div className="max-w-lg">
							<p className="text-primary text-xs font-semibold uppercase tracking-widest mb-3">
								— {t.label}
							</p>
							<h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
								{t.title}
							</h2>
							<p className="mt-4 text-zinc-400 text-lg leading-relaxed">
								{t.subtitle}
							</p>
						</div>

						<div className="flex flex-col gap-3 shrink-0">
							<Link
								href="/register"
								className="inline-flex items-center justify-center gap-2 bg-primary text-white font-bold px-10 py-4 rounded-full text-base hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 whitespace-nowrap"
							>
								{t.button}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
									strokeLinecap="round"
									strokeLinejoin="round"
									aria-hidden="true"
								>
									<path d="M5 12h14M12 5l7 7-7 7" />
								</svg>
							</Link>
							<p className="text-xs text-zinc-500 text-center">{t.footnote}</p>
						</div>
					</div>
				</div>
			</ScrollReveal>
		</div>
	</section>
)

// ─────────────────────────────────────────────────────────────────────────────
// Page export
// ─────────────────────────────────────────────────────────────────────────────
const LandingPage = async () => {
	const tHero = await getTranslations('landing.hero')
	const tStats = await getTranslations('landing.stats')
	const tMockup = await getTranslations('landing.mockup')
	const tFeatures = await getTranslations('landing.features')
	const tHowItWorks = await getTranslations('landing.howItWorks')
	const tPricing = await getTranslations('landing.pricing')
	const tCta = await getTranslations('landing.cta')

	const hero: HeroT = {
		badge: tHero('badge'),
		headline1: tHero('headline1'),
		headline2: tHero('headline2'),
		headline3: tHero('headline3'),
		subtitle: tHero('subtitle'),
		ctaPrimary: tHero('ctaPrimary'),
		ctaSecondary: tHero('ctaSecondary'),
		trust1: tHero('trust1'),
		trust2: tHero('trust2'),
		trust3: tHero('trust3'),
	}

	const stats: StatsT = {
		qrs: tStats('qrs'),
		scans: tStats('scans'),
		uptime: tStats('uptime'),
		countries: tStats('countries'),
	}

	const mockup: MockupT = {
		analyticsLabel: tMockup('analyticsLabel'),
		scans: tMockup('scans'),
		today: tMockup('today'),
		countries: tMockup('countries'),
		qrStyle: tMockup('qrStyle'),
		square: tMockup('square'),
		round: tMockup('round'),
		dots: tMockup('dots'),
		exportAs: tMockup('exportAs'),
		deviceBreakdown: tMockup('deviceBreakdown'),
	}

	const features: FeaturesT = {
		label: tFeatures('label'),
		title: tFeatures('title'),
		analyticsOverline: tFeatures('analyticsOverline'),
		analyticsTitle: tFeatures('analyticsTitle'),
		analyticsDesc: tFeatures('analyticsDesc'),
		analyticsBullet1: tFeatures('analyticsBullet1'),
		analyticsBullet2: tFeatures('analyticsBullet2'),
		analyticsBullet3: tFeatures('analyticsBullet3'),
		designOverline: tFeatures('designOverline'),
		designTitle: tFeatures('designTitle'),
		designDesc: tFeatures('designDesc'),
		designBullet1: tFeatures('designBullet1'),
		designBullet2: tFeatures('designBullet2'),
		designBullet3: tFeatures('designBullet3'),
		dynamicOverline: tFeatures('dynamicOverline'),
		dynamicTitle: tFeatures('dynamicTitle'),
		dynamicDesc: tFeatures('dynamicDesc'),
		dynamicBullet1: tFeatures('dynamicBullet1'),
		dynamicBullet2: tFeatures('dynamicBullet2'),
		dynamicBullet3: tFeatures('dynamicBullet3'),
		mini1Title: tFeatures('mini1Title'),
		mini1Desc: tFeatures('mini1Desc'),
		mini2Title: tFeatures('mini2Title'),
		mini2Desc: tFeatures('mini2Desc'),
		mini3Title: tFeatures('mini3Title'),
		mini3Desc: tFeatures('mini3Desc'),
		mini4Title: tFeatures('mini4Title'),
		mini4Desc: tFeatures('mini4Desc'),
	}

	const howItWorks: HowItWorksT = {
		label: tHowItWorks('label'),
		title: tHowItWorks('title'),
		step1Title: tHowItWorks('step1Title'),
		step1Desc: tHowItWorks('step1Desc'),
		step2Title: tHowItWorks('step2Title'),
		step2Desc: tHowItWorks('step2Desc'),
		step3Title: tHowItWorks('step3Title'),
		step3Desc: tHowItWorks('step3Desc'),
	}

	const pricing: PricingT = {
		label: tPricing('label'),
		title: tPricing('title'),
		subtitle: tPricing('subtitle'),
		mostPopular: tPricing('mostPopular'),
		forever: tPricing('forever'),
		perMonth: tPricing('perMonth'),
		viewAll: tPricing('viewAll'),
		freeName: tPricing('freeName'),
		freeDesc: tPricing('freeDesc'),
		freeBullet1: tPricing('freeBullet1'),
		freeBullet2: tPricing('freeBullet2'),
		freeBullet3: tPricing('freeBullet3'),
		freeCta: tPricing('freeCta'),
		proName: tPricing('proName'),
		proDesc: tPricing('proDesc'),
		proBullet1: tPricing('proBullet1'),
		proBullet2: tPricing('proBullet2'),
		proBullet3: tPricing('proBullet3'),
		proBullet4: tPricing('proBullet4'),
		proBullet5: tPricing('proBullet5'),
		proBullet6: tPricing('proBullet6'),
		proCta: tPricing('proCta'),
		businessName: tPricing('businessName'),
		businessDesc: tPricing('businessDesc'),
		businessBullet1: tPricing('businessBullet1'),
		businessBullet2: tPricing('businessBullet2'),
		businessBullet3: tPricing('businessBullet3'),
		businessBullet4: tPricing('businessBullet4'),
		businessCta: tPricing('businessCta'),
	}

	const cta: CtaT = {
		label: tCta('label'),
		title: tCta('title'),
		subtitle: tCta('subtitle'),
		button: tCta('button'),
		footnote: tCta('footnote'),
	}

	return (
		<>
			<HeroSection t={hero} />
			<MarqueeTicker />
			<StatsStrip t={stats} />
			<FeaturesSection t={features} mt={mockup} />
			<HowItWorksSection t={howItWorks} />
			<PricingTeaserSection t={pricing} />
			<FinalCtaSection t={cta} />
		</>
	)
}

export default LandingPage
