import {
	BarChartIcon,
	PaintBoardIcon,
	Link01Icon,
	LockPasswordIcon,
	Download04Icon,
	Folder01Icon,
	CheckmarkCircle02Icon,
	ArrowRight02Icon,
	SparklesIcon,
	QrCodeIcon,
	GlobalIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Link from 'next/link'

// ─────────────────────────────────────────────────────────────────────────────
// QR Mockup — purely decorative, simulates a QR code with CSS
// ─────────────────────────────────────────────────────────────────────────────
const QrMockup = () => {
	// A hand-crafted pattern that looks like a real QR code (simplified)
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
		<div className="p-3 bg-white rounded-xl shadow-sm">
			<div className="grid gap-px" style={{ gridTemplateColumns: `repeat(21, 1fr)` }}>
				{rows.map((row, ri) =>
					row.map((cell, ci) => (
						<div
							// biome-ignore lint/suspicious/noArrayIndexKey: static decorative pattern
							key={`${ri}-${ci}`}
							className={`aspect-square rounded-[1px] ${cell ? 'bg-zinc-900' : 'bg-transparent'}`}
						/>
					)),
				)}
			</div>
		</div>
	)
}

// ─────────────────────────────────────────────────────────────────────────────
// Hero Section
// ─────────────────────────────────────────────────────────────────────────────
const HeroSection = () => (
	<section className="relative overflow-hidden py-20 md:py-32 px-4">
		{/* Background gradient blobs */}
		<div
			className="absolute inset-0 -z-10 pointer-events-none"
			aria-hidden="true"
		>
			<div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl" />
			<div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
		</div>

		<div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
			{/* Left: copy */}
			<div className="flex flex-col gap-6">
				{/* Badge */}
				<div className="inline-flex items-center gap-2 self-start px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
					<HugeiconsIcon icon={SparklesIcon} size={15} />
					<span>Genera QRs en segundos</span>
				</div>

				{/* Headline */}
				<h1 className="text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight text-foreground">
					Crea códigos QR
					<br />
					<span className="text-primary">profesionales</span> sin
					<br />
					esfuerzo
				</h1>

				{/* Subtitle */}
				<p className="text-lg text-default-500 leading-relaxed max-w-md">
					Genera, personaliza y rastrea tus códigos QR en un solo lugar. Analytics
					en tiempo real, redirecciones dinámicas y diseños impresionantes.
				</p>

				{/* CTA buttons */}
				<div className="flex flex-wrap gap-3">
					<Link href="/register" className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-7 py-3 rounded-full text-base hover:bg-primary/90 transition-colors">
						Crear QR gratis
						<HugeiconsIcon icon={ArrowRight02Icon} size={16} />
					</Link>
					<Link href="/pricing" className="inline-flex items-center gap-2 border border-divider font-semibold px-7 py-3 rounded-full text-base hover:bg-content2 transition-colors">
						Ver precios
					</Link>
				</div>

				{/* Social proof */}
				<div className="flex items-center gap-3 text-sm text-default-400">
					<HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} className="text-emerald-500 shrink-0" />
					<span>Sin tarjeta de crédito · Cancela cuando quieras</span>
				</div>
			</div>

			{/* Right: QR mockup card */}
			<div className="relative flex justify-center lg:justify-end">
				{/* Main card */}
				<div className="relative bg-content1 border border-divider rounded-3xl p-7 shadow-xl shadow-default/10 w-full max-w-sm">
					{/* Card header */}
					<div className="flex items-center gap-3 mb-5">
						<div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
							<HugeiconsIcon icon={QrCodeIcon} size={18} className="text-primary" />
						</div>
						<div>
							<p className="text-sm font-semibold text-foreground">mi-sitio-web.com</p>
							<p className="text-xs text-default-400">QR dinámico · Activo</p>
						</div>
						<div className="ml-auto w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_6px] shadow-emerald-400/60" />
					</div>

					{/* QR code */}
					<div className="flex justify-center mb-5">
						<QrMockup />
					</div>

					{/* Stats row */}
					<div className="grid grid-cols-3 gap-2 text-center">
						<div className="bg-default-100 rounded-xl py-2 px-1">
							<p className="text-base font-bold text-foreground">1,284</p>
							<p className="text-[10px] text-default-400">Escaneos</p>
						</div>
						<div className="bg-default-100 rounded-xl py-2 px-1">
							<p className="text-base font-bold text-foreground">38</p>
							<p className="text-[10px] text-default-400">Países</p>
						</div>
						<div className="bg-default-100 rounded-xl py-2 px-1">
							<p className="text-base font-bold text-foreground">99.9%</p>
							<p className="text-[10px] text-default-400">Uptime</p>
						</div>
					</div>
				</div>

				{/* Floating badge — top right */}
				<div className="absolute -top-4 -right-4 md:right-0 bg-content1 border border-divider rounded-2xl px-3.5 py-2.5 shadow-lg flex items-center gap-2">
					<div className="w-7 h-7 rounded-full bg-emerald-500/15 flex items-center justify-center">
						<HugeiconsIcon icon={GlobalIcon} size={14} className="text-emerald-500" />
					</div>
					<div>
						<p className="text-xs font-bold text-foreground">150+ Países</p>
						<p className="text-[10px] text-default-400">alcance global</p>
					</div>
				</div>

				{/* Floating badge — bottom left */}
				<div className="absolute -bottom-4 -left-4 md:left-0 bg-content1 border border-divider rounded-2xl px-3.5 py-2.5 shadow-lg flex items-center gap-2">
					<div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center">
						<HugeiconsIcon icon={QrCodeIcon} size={14} className="text-primary" />
					</div>
					<div>
						<p className="text-xs font-bold text-foreground">10k+ QRs</p>
						<p className="text-[10px] text-default-400">ya creados</p>
					</div>
				</div>
			</div>
		</div>
	</section>
)

// ─────────────────────────────────────────────────────────────────────────────
// Stats Bar
// ─────────────────────────────────────────────────────────────────────────────
const stats = [
	{ value: '10,000+', label: 'QRs creados' },
	{ value: '500K+', label: 'Escaneos totales' },
	{ value: '99.9%', label: 'Uptime garantizado' },
	{ value: '150+', label: 'Países alcanzados' },
]

const StatsBar = () => (
	<section className="px-4">
		<div className="max-w-6xl mx-auto border-t border-b border-divider py-10">
			<div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
				{stats.map((stat) => (
					<div key={stat.label} className="flex flex-col gap-1">
						<span className="text-3xl font-extrabold text-primary">{stat.value}</span>
						<span className="text-sm text-default-500">{stat.label}</span>
					</div>
				))}
			</div>
		</div>
	</section>
)

// ─────────────────────────────────────────────────────────────────────────────
// How It Works
// ─────────────────────────────────────────────────────────────────────────────
const steps = [
	{
		number: '01',
		icon: QrCodeIcon,
		title: 'Elige el tipo',
		description:
			'URL, WiFi, contacto vCard, redes sociales, menú de restaurante y más. Tenemos el tipo que necesitas.',
	},
	{
		number: '02',
		icon: PaintBoardIcon,
		title: 'Personaliza el diseño',
		description:
			'Selecciona colores, formas de módulo, añade tu logo y crea un QR que represente tu marca.',
	},
	{
		number: '03',
		icon: Download04Icon,
		title: 'Descarga y comparte',
		description:
			'Exporta en PNG, SVG o PDF de alta resolución. O comparte directamente con un enlace corto.',
	},
]

const HowItWorksSection = () => (
	<section className="py-24 px-4">
		<div className="max-w-6xl mx-auto">
			{/* Heading */}
			<div className="text-center mb-16">
				<p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
					Proceso
				</p>
				<h2 className="text-4xl md:text-5xl font-extrabold text-foreground">
					Tan simple como 1, 2, 3
				</h2>
				<p className="mt-4 text-default-500 text-lg max-w-xl mx-auto">
					En menos de un minuto tienes tu código QR listo para usar.
				</p>
			</div>

			{/* Steps */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
				{/* Connecting line (desktop) */}
				<div
					className="hidden md:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-divider"
					aria-hidden="true"
				/>

				{steps.map((step) => (
					<div key={step.number} className="flex flex-col items-center text-center gap-5">
						{/* Number badge + icon */}
						<div className="relative">
							<div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
								<HugeiconsIcon icon={step.icon} size={32} className="text-primary" />
							</div>
							<span className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shadow-md">
								{step.number}
							</span>
						</div>
						<div>
							<h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
							<p className="text-default-500 leading-relaxed text-sm">{step.description}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	</section>
)

// ─────────────────────────────────────────────────────────────────────────────
// Features Grid
// ─────────────────────────────────────────────────────────────────────────────
const features = [
	{
		icon: BarChartIcon,
		color: 'bg-violet-500/10 text-violet-500',
		title: 'Analytics en tiempo real',
		description:
			'Visualiza escaneos por país, dispositivo y hora. Toma decisiones basadas en datos reales.',
	},
	{
		icon: PaintBoardIcon,
		color: 'bg-pink-500/10 text-pink-500',
		title: 'QR personalizables',
		description:
			'Adapta colores, formas y añade tu logo. Cada QR puede reflejar la identidad de tu marca.',
	},
	{
		icon: Link01Icon,
		color: 'bg-blue-500/10 text-blue-500',
		title: 'Redirecciones dinámicas',
		description:
			'Cambia la URL destino sin reimprimir el QR. Ideal para campañas y materiales físicos.',
	},
	{
		icon: LockPasswordIcon,
		color: 'bg-amber-500/10 text-amber-500',
		title: 'Protección con contraseña',
		description:
			'Restringe el acceso a tu contenido con una contraseña. Control total sobre quién escanea.',
	},
	{
		icon: Download04Icon,
		color: 'bg-emerald-500/10 text-emerald-500',
		title: 'Múltiples formatos',
		description:
			'Descarga en PNG, SVG o PDF en alta resolución. Listo para impresión y uso digital.',
	},
	{
		icon: Folder01Icon,
		color: 'bg-primary/10 text-primary',
		title: 'Gestión de carpetas',
		description:
			'Organiza tus QRs en carpetas y encuentra lo que necesitas al instante, sin desorden.',
	},
]

const FeaturesSection = () => (
	<section className="py-24 px-4 bg-content1">
		<div className="max-w-6xl mx-auto">
			{/* Heading */}
			<div className="text-center mb-16">
				<p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
					Características
				</p>
				<h2 className="text-4xl md:text-5xl font-extrabold text-foreground">
					Todo lo que necesitas
				</h2>
				<p className="mt-4 text-default-500 text-lg max-w-xl mx-auto">
					Herramientas profesionales pensadas para escalar con tu negocio.
				</p>
			</div>

			{/* Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{features.map((feat) => (
					<div
						key={feat.title}
						className="group bg-background border border-divider rounded-2xl p-6 flex flex-col gap-4 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 transition-all duration-300"
					>
						<div className={`w-12 h-12 rounded-xl flex items-center justify-center ${feat.color}`}>
							<HugeiconsIcon icon={feat.icon} size={22} />
						</div>
						<div>
							<h3 className="text-lg font-bold text-foreground mb-1">{feat.title}</h3>
							<p className="text-sm text-default-500 leading-relaxed">{feat.description}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	</section>
)

// ─────────────────────────────────────────────────────────────────────────────
// Pricing Teaser
// ─────────────────────────────────────────────────────────────────────────────
const pricingPlans = [
	{
		name: 'Free',
		price: '$0',
		period: 'para siempre',
		description: 'Ideal para empezar y explorar.',
		highlighted: false,
		bullets: ['Hasta 3 QRs activos', 'Formatos PNG y SVG', 'Analytics básico'],
		cta: 'Comenzar gratis',
		href: '/register',
	},
	{
		name: 'Pro',
		price: '$12',
		period: 'por mes',
		description: 'Para creadores y freelancers.',
		highlighted: true,
		bullets: ['QRs ilimitados', 'Redirecciones dinámicas', 'Analytics completo'],
		cta: 'Elegir Pro',
		href: '/register',
	},
	{
		name: 'Business',
		price: '$29',
		period: 'por mes',
		description: 'Equipos y marcas en crecimiento.',
		highlighted: false,
		bullets: ['Todo de Pro incluido', 'Múltiples usuarios', 'Soporte prioritario'],
		cta: 'Elegir Business',
		href: '/register',
	},
]

const PricingTeaserSection = () => (
	<section className="py-24 px-4">
		<div className="max-w-6xl mx-auto">
			{/* Heading */}
			<div className="text-center mb-16">
				<p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
					Precios
				</p>
				<h2 className="text-4xl md:text-5xl font-extrabold text-foreground">
					Planes para todos
				</h2>
				<p className="mt-4 text-default-500 text-lg max-w-xl mx-auto">
					Comienza gratis y escala cuando lo necesites. Sin sorpresas.
				</p>
			</div>

			{/* Plan cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
				{pricingPlans.map((plan) => (
					<div
						key={plan.name}
						className={`relative flex flex-col rounded-2xl border p-7 ${
							plan.highlighted
								? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
								: 'border-divider bg-content1'
						}`}
					>
						{plan.highlighted && (
							<div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
								<span className="bg-primary text-white text-xs font-bold px-4 py-1 rounded-full shadow">
									Más popular
								</span>
							</div>
						)}

						<div className="mb-5">
							<h3 className="text-lg font-bold text-foreground mb-0.5">{plan.name}</h3>
							<p className="text-sm text-default-400 mb-4">{plan.description}</p>
							<div className="flex items-end gap-1.5">
								<span className="text-4xl font-extrabold text-foreground">{plan.price}</span>
								<span className="text-default-400 text-sm mb-1">{plan.period}</span>
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

			{/* Link to full pricing */}
			<div className="text-center mt-10">
				<Link
					href="/pricing"
					className="inline-flex items-center gap-1.5 text-primary hover:underline font-medium text-sm"
				>
					Ver todos los detalles
					<HugeiconsIcon icon={ArrowRight02Icon} size={14} />
				</Link>
			</div>
		</div>
	</section>
)

// ─────────────────────────────────────────────────────────────────────────────
// Final CTA
// ─────────────────────────────────────────────────────────────────────────────
const FinalCtaSection = () => (
	<section className="py-24 px-4">
		<div className="max-w-3xl mx-auto text-center bg-primary/8 border border-primary/20 rounded-3xl px-8 py-16 relative overflow-hidden">
			{/* Decorative circles */}
			<div
				className="absolute inset-0 pointer-events-none"
				aria-hidden="true"
			>
				<div className="absolute -top-16 -left-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
				<div className="absolute -bottom-16 -right-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
			</div>

			<div className="relative z-10 flex flex-col items-center gap-6">
				<div className="w-16 h-16 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center">
					<HugeiconsIcon icon={SparklesIcon} size={28} className="text-primary" />
				</div>

				<h2 className="text-4xl md:text-5xl font-extrabold text-foreground">
					¿Listo para empezar?
				</h2>

				<p className="text-default-500 text-lg max-w-md">
					Únete a miles de equipos que ya confían en QR Generator para sus
					campañas, negocios y proyectos personales.
				</p>

				<Link href="/register" className="inline-flex items-center gap-2 bg-primary text-white font-bold px-10 py-3.5 rounded-full text-base shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors">
					Crear cuenta gratis
					<HugeiconsIcon icon={ArrowRight02Icon} size={17} />
				</Link>

				<p className="text-sm text-default-400">
					Sin tarjeta de crédito · Cancela cuando quieras
				</p>
			</div>
		</div>
	</section>
)

// ─────────────────────────────────────────────────────────────────────────────
// Page export
// ─────────────────────────────────────────────────────────────────────────────
export const metadata = {
	title: 'QR Generator — Crea códigos QR profesionales',
	description:
		'Genera, personaliza y rastrea tus códigos QR en segundos. Analytics en tiempo real, redirecciones dinámicas y diseños impresionantes.',
}

const LandingPage = () => {
	return (
		<>
			<HeroSection />
			<StatsBar />
			<HowItWorksSection />
			<FeaturesSection />
			<PricingTeaserSection />
			<FinalCtaSection />
		</>
	)
}

export default LandingPage
