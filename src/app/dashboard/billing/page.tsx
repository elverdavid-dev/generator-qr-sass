import { BreadcrumbItem, Breadcrumbs } from '@heroui/breadcrumbs'
import { CheckmarkCircle02Icon, Crown02Icon, Home01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/shared/lib/supabase/get-session'
import { getProfile } from '@/features/auth/services/queries/get-profile'
import { PLANS } from '@/features/billing/config/plans'
import ManageSubscriptionButton from './manage-subscription-button'

const BillingPage = async () => {
	const { data: session } = await getSession()
	if (!session?.user) redirect('/login')

	const { data: profile } = await getProfile({ user_id: session.user.id })
	if (!profile) redirect('/dashboard')

	const currentPlan = PLANS[(profile.plan ?? 'free') as keyof typeof PLANS]
	const isPaid = profile.plan !== 'free'

	return (
		<>
			<Breadcrumbs className="py-4">
				<BreadcrumbItem href="/dashboard">
					<HugeiconsIcon icon={Home01Icon} size={16} />
				</BreadcrumbItem>
				<BreadcrumbItem>Facturación</BreadcrumbItem>
			</Breadcrumbs>

			<div className="py-6">
				<div className="flex items-center gap-2 mb-1">
					<HugeiconsIcon icon={Crown02Icon} size={22} className="text-amber-500" />
					<h1 className="text-3xl font-bold">Facturación</h1>
				</div>
				<p className="text-default-500">Gestiona tu plan y suscripción</p>
			</div>

			<div className="max-w-2xl flex flex-col gap-6">
				{/* Current plan card */}
				<div className={`rounded-2xl border p-6 ${isPaid ? 'border-amber-500/30 bg-amber-500/5' : 'border-divider bg-content1'}`}>
					<div className="flex items-start justify-between gap-4">
						<div>
							<div className="flex items-center gap-2 mb-1">
								<HugeiconsIcon icon={Crown02Icon} size={18} className={isPaid ? 'text-amber-500' : 'text-default-400'} />
								<h2 className="text-lg font-bold">Plan {currentPlan.name}</h2>
								<span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${isPaid ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' : 'bg-default-100 text-default-500'}`}>
									{isPaid ? 'Activo' : 'Gratis'}
								</span>
							</div>
							<p className="text-default-500 text-sm">{currentPlan.description}</p>
							{isPaid && (
								<p className="text-sm font-semibold mt-2">
									${currentPlan.price} <span className="text-default-400 font-normal">/ mes</span>
								</p>
							)}
						</div>
					</div>

					{/* Features */}
					<ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
						{currentPlan.features.map((feature) => (
							<li key={feature} className="flex items-center gap-2 text-sm text-default-600">
								<HugeiconsIcon icon={CheckmarkCircle02Icon} size={15} className="text-emerald-500 shrink-0" />
								{feature}
							</li>
						))}
					</ul>

					{/* Actions */}
					<div className="mt-6 flex flex-wrap gap-3">
						{isPaid ? (
							<ManageSubscriptionButton />
						) : (
							<Link
								href="/pricing"
								className="bg-primary text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-primary/90 transition-colors"
							>
								Mejorar a Pro
							</Link>
						)}
						{!isPaid && (
							<Link
								href="/pricing"
								className="border border-divider text-sm font-semibold px-5 py-2 rounded-xl hover:bg-default-50 transition-colors"
							>
								Ver todos los planes
							</Link>
						)}
					</div>
				</div>

				{/* Info for free users */}
				{!isPaid && (
					<div className="rounded-2xl border border-divider bg-content1 p-6">
						<h3 className="font-semibold mb-3">¿Qué incluye Pro?</h3>
						<ul className="flex flex-col gap-2">
							{PLANS.pro.features.map((feature) => (
								<li key={feature} className="flex items-center gap-2 text-sm text-default-600">
									<HugeiconsIcon icon={CheckmarkCircle02Icon} size={15} className="text-emerald-500 shrink-0" />
									{feature}
								</li>
							))}
						</ul>
						<Link
							href="/pricing"
							className="mt-4 inline-block bg-primary text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-primary/90 transition-colors"
						>
							Mejorar a Pro — $12/mes
						</Link>
					</div>
				)}

				{/* Manage info */}
				{isPaid && (
					<p className="text-xs text-default-400 text-center">
						Al gestionar tu suscripción puedes cancelar, cambiar de plan o actualizar tu método de pago.
						La cancelación es efectiva al final del período actual.
					</p>
				)}
			</div>
		</>
	)
}

export default BillingPage
