'use client'

import { useState } from 'react'
import { CheckmarkCircle02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import type { PlanId } from '@/features/billing/config/plans'
import PricingButton from './pricing-button'

interface PlanData {
	id: PlanId
	name: string
	description: string
	price: number
	yearlyPrice: number
	lsVariantId: string | null
	lsYearlyVariantId: string | null
	features: string[]
	highlighted?: boolean
}

interface Labels {
	currentPlan: string
	goToDashboard: string
	startFree: string
	choosePro: string
	chooseBusiness: string
	monthly: string
	yearly: string
	savePercent: string
	perMonth: string
	perYear: string
	billedYearly: string
	mostPopular: string
	forever: string
}

interface Props {
	plans: PlanData[]
	currentPlan: PlanId
	isLoggedIn: boolean
	labels: Labels
}

export default function PricingCards({ plans, currentPlan, isLoggedIn, labels }: Props) {
	const [isYearly, setIsYearly] = useState(false)

	return (
		<div>
			{/* Billing toggle */}
			<div className="flex items-center justify-center gap-3 mb-10">
				<span className={`text-sm font-medium ${!isYearly ? 'text-foreground' : 'text-default-400'}`}>
					{labels.monthly}
				</span>
				<button
					type="button"
					onClick={() => setIsYearly(v => !v)}
					className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
						isYearly ? 'bg-primary' : 'bg-default-300'
					}`}
					aria-label="Toggle billing period"
				>
					<span
						className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
							isYearly ? 'translate-x-6' : 'translate-x-0'
						}`}
					/>
				</button>
				<div className="flex items-center gap-2">
					<span className={`text-sm font-medium ${isYearly ? 'text-foreground' : 'text-default-400'}`}>
						{labels.yearly}
					</span>
					<span className="text-xs font-semibold bg-emerald-500/15 text-emerald-500 px-2 py-0.5 rounded-full">
						{labels.savePercent}
					</span>
				</div>
			</div>

			{/* Plan cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
				{plans.map((plan) => {
					const isCurrent = currentPlan === plan.id
					const isHighlighted = plan.highlighted
					const displayPrice = isYearly && plan.yearlyPrice > 0
						? Math.round(plan.yearlyPrice / 12)
						: plan.price
					const variantId = isYearly ? (plan.lsYearlyVariantId ?? plan.lsVariantId) : plan.lsVariantId

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
										{labels.mostPopular}
									</span>
								</div>
							)}

							<div className="mb-6">
								<h2 className="text-xl font-bold mb-1">{plan.name}</h2>
								<p className="text-sm text-default-500 mb-4">{plan.description}</p>
								<div className="flex items-end gap-1">
									<span className="text-4xl font-bold">${displayPrice}</span>
									{plan.price > 0 ? (
										<div className="flex flex-col mb-1">
											<span className="text-default-400 text-sm leading-tight">{labels.perMonth}</span>
											{isYearly && plan.yearlyPrice > 0 && (
												<span className="text-default-400 text-xs leading-tight">{labels.billedYearly}</span>
											)}
										</div>
									) : (
										<span className="text-default-400 mb-1">{labels.forever}</span>
									)}
								</div>
							</div>

							<PricingButton
								planId={plan.id}
								isCurrent={isCurrent}
								isLoggedIn={isLoggedIn}
								isHighlighted={!!isHighlighted}
								lsVariantId={variantId}
								labels={{
									currentPlan: labels.currentPlan,
									goToDashboard: labels.goToDashboard,
									startFree: labels.startFree,
									choosePro: labels.choosePro,
									chooseBusiness: labels.chooseBusiness,
								}}
							/>

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
		</div>
	)
}
