export type PlanId = 'free' | 'pro' | 'business'

export interface PlanConfig {
	id: PlanId
	name: string
	description: string
	price: number // USD/month
	lsVariantId: string | null
	maxQrs: number // -1 = unlimited
	maxScansPerMonth: number // -1 = unlimited
	features: string[]
	highlighted?: boolean
}

export const PLANS: Record<PlanId, PlanConfig> = {
	free: {
		id: 'free',
		name: 'Free',
		description: 'Para empezar a explorar',
		price: 0,
		lsVariantId: null,
		maxQrs: 3,
		maxScansPerMonth: 500,
		features: [
			'3 QR codes',
			'500 escaneos / mes',
			'Analytics básico',
			'Personalización de colores',
			'Descarga PNG',
		],
	},
	pro: {
		id: 'pro',
		name: 'Pro',
		description: 'Para creadores y profesionales',
		price: 12,
		lsVariantId: process.env.NEXT_PUBLIC_LS_PRO_VARIANT_ID ?? null,
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
	},
	business: {
		id: 'business',
		name: 'Business',
		description: 'Para equipos y empresas',
		price: 29,
		lsVariantId: process.env.NEXT_PUBLIC_LS_BUSINESS_VARIANT_ID ?? null,
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
	},
}

export const getPlan = (planId: PlanId): PlanConfig => PLANS[planId]

export const canCreateQr = (planId: PlanId, currentQrCount: number): boolean => {
	const plan = getPlan(planId)
	if (plan.maxQrs === -1) return true
	return currentQrCount < plan.maxQrs
}
