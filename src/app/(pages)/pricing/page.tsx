import { CheckmarkCircle02Icon, Cancel01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Link from 'next/link'
import { getSession } from '@/shared/lib/supabase/get-session'
import { getProfile } from '@/features/auth/services/queries/get-profile'
import { PLANS } from '@/features/billing/config/plans'
import type { PlanId } from '@/features/billing/config/plans'
import PricingButton from './pricing-button'

export const metadata = { title: 'Precios — QRSaaS' }

const PricingPage = async () => {
	const { data: session } = await getSession()
	const profile = session?.user
		? (await getProfile({ user_id: session.user.id })).data
		: null
	const currentPlan: PlanId = profile?.plan ?? 'free'

	const plans = [PLANS.free, PLANS.pro, PLANS.business]

	return (
		<div className="py-16 px-4">
			{/* Header */}
			<div className="text-center mb-12">
				<h1 className="text-4xl font-bold mb-3">Precios simples y transparentes</h1>
				<p className="text-default-500 text-lg max-w-xl mx-auto">
					Empieza gratis. Escala cuando lo necesites. Sin sorpresas.
				</p>
			</div>

			{/* Plans grid */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
				{plans.map((plan) => {
					const isCurrent = currentPlan === plan.id
					const isHighlighted = plan.highlighted

					return (
						<div
							key={plan.id}
							className={`relative flex flex-col rounded-2xl border p-7 ${
								isHighlighted
									? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
									: 'border-divider bg-content1'
							}`}
						>
							{isHighlighted && (
								<div className="absolute -top-3 left-1/2 -translate-x-1/2">
									<span className="bg-primary text-white text-xs font-bold px-4 py-1 rounded-full">
										Más popular
									</span>
								</div>
							)}

							{/* Plan header */}
							<div className="mb-6">
								<h2 className="text-xl font-bold mb-1">{plan.name}</h2>
								<p className="text-sm text-default-500 mb-4">{plan.description}</p>
								<div className="flex items-end gap-1">
									<span className="text-4xl font-bold">${plan.price}</span>
									{plan.price > 0 && (
										<span className="text-default-400 mb-1">/mes</span>
									)}
									{plan.price === 0 && (
										<span className="text-default-400 mb-1">para siempre</span>
									)}
								</div>
							</div>

							{/* CTA */}
							<PricingButton
								planId={plan.id}
								isCurrent={isCurrent}
								isLoggedIn={!!session?.user}
								isHighlighted={!!isHighlighted}
								lsVariantId={plan.lsVariantId}
							/>

							{/* Features */}
							<ul className="mt-6 flex flex-col gap-3">
								{plan.features.map((feature) => (
									<li key={feature} className="flex items-start gap-2 text-sm">
										<HugeiconsIcon
											icon={CheckmarkCircle02Icon}
											size={16}
											className="text-emerald-500 mt-0.5 shrink-0"
										/>
										<span className="text-default-700">{feature}</span>
									</li>
								))}
							</ul>
						</div>
					)
				})}
			</div>

			{/* FAQ footer */}
			<p className="text-center text-sm text-default-400 mt-10">
				¿Preguntas?{' '}
				<Link href="mailto:soporte@tudominio.com" className="text-primary hover:underline">
					Contáctanos
				</Link>
				. Cancela en cualquier momento, sin penalizaciones.
			</p>
		</div>
	)
}

export default PricingPage
