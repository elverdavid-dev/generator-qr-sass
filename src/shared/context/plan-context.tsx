'use client'

import { createContext, type ReactNode, useContext } from 'react'
import {
	getPlan,
	hasFeature,
	type PlanFeatures,
	type PlanId,
} from '@/features/billing/config/plans'

interface PlanContextValue {
	plan: PlanId
	hasFeature: (feature: keyof PlanFeatures) => boolean
	isPro: boolean
	isBusiness: boolean
	isPaid: boolean
}

const PlanContext = createContext<PlanContextValue | null>(null)

export const PlanProvider = ({
	plan,
	children,
}: {
	plan: PlanId
	children: ReactNode
}) => {
	const value: PlanContextValue = {
		plan,
		hasFeature: (feature) => hasFeature(plan, feature),
		isPro: plan === 'pro',
		isBusiness: plan === 'business',
		isPaid: plan === 'pro' || plan === 'business',
	}

	return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>
}

export const usePlan = (): PlanContextValue => {
	const ctx = useContext(PlanContext)
	if (!ctx) throw new Error('usePlan must be used within PlanProvider')
	return ctx
}
