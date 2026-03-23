import { describe, it, expect } from 'vitest'
import {
	PLANS,
	canCreateQr,
	hasFeature,
	getRequiredPlanForFeature,
	getPlan,
} from '@/features/billing/config/plans'

describe('getPlan', () => {
	it('returns the correct plan config', () => {
		expect(getPlan('free').id).toBe('free')
		expect(getPlan('pro').id).toBe('pro')
		expect(getPlan('business').id).toBe('business')
	})
})

describe('canCreateQr', () => {
	it('free plan: allows up to 3 QRs', () => {
		expect(canCreateQr('free', 0)).toBe(true)
		expect(canCreateQr('free', 2)).toBe(true)
		expect(canCreateQr('free', 3)).toBe(false)
		expect(canCreateQr('free', 10)).toBe(false)
	})

	it('pro plan: unlimited QRs', () => {
		expect(canCreateQr('pro', 0)).toBe(true)
		expect(canCreateQr('pro', 1000)).toBe(true)
	})

	it('business plan: unlimited QRs', () => {
		expect(canCreateQr('business', 0)).toBe(true)
		expect(canCreateQr('business', 9999)).toBe(true)
	})
})

describe('hasFeature', () => {
	it('free plan has no premium features', () => {
		expect(hasFeature('free', 'customSlug')).toBe(false)
		expect(hasFeature('free', 'webhooks')).toBe(false)
		expect(hasFeature('free', 'api')).toBe(false)
		expect(hasFeature('free', 'teamManagement')).toBe(false)
	})

	it('pro plan has pro features but not business-only features', () => {
		expect(hasFeature('pro', 'customSlug')).toBe(true)
		expect(hasFeature('pro', 'utmParams')).toBe(true)
		expect(hasFeature('pro', 'advancedAnalytics')).toBe(true)
		expect(hasFeature('pro', 'webhooks')).toBe(false)
		expect(hasFeature('pro', 'api')).toBe(false)
		expect(hasFeature('pro', 'teamManagement')).toBe(false)
	})

	it('business plan has all features', () => {
		expect(hasFeature('business', 'customSlug')).toBe(true)
		expect(hasFeature('business', 'webhooks')).toBe(true)
		expect(hasFeature('business', 'api')).toBe(true)
		expect(hasFeature('business', 'teamManagement')).toBe(true)
		expect(hasFeature('business', 'customDomain')).toBe(true)
	})
})

describe('getRequiredPlanForFeature', () => {
	it('returns pro for pro-level features', () => {
		expect(getRequiredPlanForFeature('customSlug')).toBe('pro')
		expect(getRequiredPlanForFeature('utmParams')).toBe('pro')
		expect(getRequiredPlanForFeature('advancedAnalytics')).toBe('pro')
	})

	it('returns business for business-only features', () => {
		expect(getRequiredPlanForFeature('webhooks')).toBe('business')
		expect(getRequiredPlanForFeature('api')).toBe('business')
		expect(getRequiredPlanForFeature('teamManagement')).toBe('business')
		expect(getRequiredPlanForFeature('customDomain')).toBe('business')
	})
})

describe('PLANS yearly pricing', () => {
	it('free plan has no yearly price', () => {
		expect(PLANS.free.yearlyPrice).toBe(0)
		expect(PLANS.free.lsYearlyVariantId).toBeNull()
	})

	it('pro yearly price is cheaper than 12x monthly', () => {
		const monthlyCost = PLANS.pro.price * 12
		expect(PLANS.pro.yearlyPrice).toBeLessThan(monthlyCost)
	})

	it('business yearly price is cheaper than 12x monthly', () => {
		const monthlyCost = PLANS.business.price * 12
		expect(PLANS.business.yearlyPrice).toBeLessThan(monthlyCost)
	})

	it('pro monthly display price is $8 when billed annually', () => {
		expect(Math.round(PLANS.pro.yearlyPrice / 12)).toBe(8)
	})
})
