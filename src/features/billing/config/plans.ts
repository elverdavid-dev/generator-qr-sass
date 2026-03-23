export type PlanId = 'free' | 'pro' | 'business'

export interface PlanFeatures {
	customSlug: boolean
	utmParams: boolean
	bulkActions: boolean
	shareQr: boolean
	templates: boolean
	svgDownload: boolean
	advancedAnalytics: boolean
	conditionalRedirect: boolean
	noWatermark: boolean
	webhooks: boolean
	api: boolean
	teamManagement: boolean
	customDomain: boolean
}

export interface PlanConfig {
	id: PlanId
	name: string
	description: string
	price: number // USD/month
	yearlyPrice: number // USD/year (0 = not available)
	lsVariantId: string | null
	lsYearlyVariantId: string | null
	maxQrs: number // -1 = unlimited
	maxScansPerMonth: number // -1 = unlimited
	features: string[]
	planFeatures: PlanFeatures
	highlighted?: boolean
}

export const PLANS: Record<PlanId, PlanConfig> = {
	free: {
		id: 'free',
		name: 'Free',
		description: 'Para empezar a explorar',
		price: 0,
		yearlyPrice: 0,
		lsVariantId: null,
		lsYearlyVariantId: null,
		maxQrs: 3,
		maxScansPerMonth: 100,
		features: [
			'3 QR codes',
			'100 escaneos / mes',
			'Analytics básico',
			'Personalización de colores',
			'Descarga PNG',
		],
		planFeatures: {
			customSlug: false,
			utmParams: false,
			bulkActions: false,
			shareQr: false,
			templates: false,
			svgDownload: false,
			advancedAnalytics: false,
			conditionalRedirect: false,
			noWatermark: false,
			webhooks: false,
			api: false,
			teamManagement: false,
			customDomain: false,
		},
	},
	pro: {
		id: 'pro',
		name: 'Pro',
		description: 'Para creadores y profesionales',
		price: 12,
		yearlyPrice: 96, // $8/mes × 12 — ahorra 33%
		lsVariantId: process.env.NEXT_PUBLIC_LS_PRO_VARIANT_ID ?? null,
		lsYearlyVariantId: process.env.NEXT_PUBLIC_LS_PRO_ANNUAL_VARIANT_ID ?? null,
		maxQrs: -1,
		maxScansPerMonth: -1,
		highlighted: true,
		features: [
			'QR codes ilimitados',
			'Escaneos ilimitados',
			'Analytics avanzado + mapa mundial',
			'Todas las personalizaciones',
			'Descarga PNG / SVG',
			'Redirecciones condicionales',
			'Sin marca de agua',
		],
		planFeatures: {
			customSlug: true,
			utmParams: true,
			bulkActions: true,
			shareQr: true,
			templates: true,
			svgDownload: true,
			advancedAnalytics: true,
			conditionalRedirect: true,
			noWatermark: true,
			webhooks: false,
			api: false,
			teamManagement: false,
			customDomain: false,
		},
	},
	business: {
		id: 'business',
		name: 'Business',
		description: 'Para equipos y empresas',
		price: 29,
		yearlyPrice: 232, // ~$19.33/mes × 12 — ahorra 33%
		lsVariantId: process.env.NEXT_PUBLIC_LS_BUSINESS_VARIANT_ID ?? null,
		lsYearlyVariantId: process.env.NEXT_PUBLIC_LS_BUSINESS_ANNUAL_VARIANT_ID ?? null,
		maxQrs: -1,
		maxScansPerMonth: -1,
		features: [
			'Todo lo de Pro',
			'Dominio personalizado',
			'Hasta 10 usuarios',
			'Acceso a API REST',
			'Generación masiva (CSV)',
			'Soporte prioritario',
			'Reportes por email',
		],
		planFeatures: {
			customSlug: true,
			utmParams: true,
			bulkActions: true,
			shareQr: true,
			templates: true,
			svgDownload: true,
			advancedAnalytics: true,
			conditionalRedirect: true,
			noWatermark: true,
			webhooks: true,
			api: true,
			teamManagement: true,
			customDomain: true,
		},
	},
}

export const getPlan = (planId: PlanId): PlanConfig => PLANS[planId]

export const canCreateQr = (
	planId: PlanId,
	currentQrCount: number,
): boolean => {
	const plan = getPlan(planId)
	if (plan.maxQrs === -1) return true
	return currentQrCount < plan.maxQrs
}

export const hasFeature = (
	planId: PlanId,
	feature: keyof PlanFeatures,
): boolean => {
	return PLANS[planId].planFeatures[feature]
}

export const getRequiredPlanForFeature = (
	feature: keyof PlanFeatures,
): PlanId => {
	if (PLANS.pro.planFeatures[feature]) return 'pro'
	return 'business'
}
