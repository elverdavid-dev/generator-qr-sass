import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { getProfile } from '@/features/auth/services/queries/get-profile'
import type { PlanId } from '@/features/billing/config/plans'
import { PLANS } from '@/features/billing/config/plans'
import { getSession } from '@/shared/lib/supabase/get-session'
import PricingCards from './pricing-cards'

export const metadata: Metadata = {
	title: 'Precios — Planes Free, Pro y Business',
	description:
		'Elige el plan que mejor se adapta a ti. Free para empezar, Pro para creadores y Business para equipos. Suscripción mensual o anual con 33% de descuento.',
	alternates: {
		canonical: `${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/pricing`,
	},
	openGraph: {
		title: 'Precios de QR Generator — Free, Pro y Business',
		description:
			'Planes desde $0. QR codes ilimitados, analytics avanzado, redirecciones condicionales y API REST. Cancela en cualquier momento.',
		url: `${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/pricing`,
		images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Precios QR Generator' }],
	},
}

const PricingPage = async () => {
	const t = await getTranslations('pricing')
	const tp = await getTranslations('pricing.plans')
	const { data: session } = await getSession()
	const profile = session?.user
		? (await getProfile({ user_id: session.user.id })).data
		: null
	const currentPlan: PlanId = profile?.plan ?? 'free'

	const plans = [
		{
			...PLANS.free,
			description: tp('freeDesc'),
			features: [tp('freeFeature1'), tp('freeFeature2'), tp('freeFeature3'), tp('freeFeature4'), tp('freeFeature5')],
		},
		{
			...PLANS.pro,
			description: tp('proDesc'),
			features: [tp('proFeature1'), tp('proFeature2'), tp('proFeature3'), tp('proFeature4'), tp('proFeature5'), tp('proFeature6'), tp('proFeature7')],
		},
		{
			...PLANS.business,
			description: tp('businessDesc'),
			features: [tp('businessFeature1'), tp('businessFeature2'), tp('businessFeature3'), tp('businessFeature4'), tp('businessFeature5'), tp('businessFeature6'), tp('businessFeature7')],
		},
	].map((plan) => ({
		id: plan.id,
		name: plan.name,
		description: plan.description,
		price: plan.price,
		yearlyPrice: plan.yearlyPrice,
		lsVariantId: plan.lsVariantId,
		lsYearlyVariantId: plan.lsYearlyVariantId,
		features: plan.features,
		highlighted: plan.highlighted,
	}))

	return (
		<div className="py-16 px-4">
			<div className="text-center mb-12">
				<h1 className="text-4xl font-bold mb-3">{t('title')}</h1>
				<p className="text-default-500 text-lg max-w-xl mx-auto">
					{t('subtitle')}
				</p>
			</div>

			<PricingCards
				plans={plans}
				currentPlan={currentPlan}
				isLoggedIn={!!session?.user}
				labels={{
					currentPlan: t('currentPlan'),
					goToDashboard: t('goToDashboard'),
					startFree: t('startFree'),
					choosePro: t('choosePro'),
					chooseBusiness: t('chooseBusiness'),
					monthly: t('monthly'),
					yearly: t('yearly'),
					savePercent: t('savePercent'),
					perMonth: t('perMonth'),
					perYear: t('perYear'),
					billedYearly: t('billedYearly'),
					mostPopular: t('mostPopular'),
					forever: t('forever'),
				}}
			/>

			<p className="text-center text-sm text-default-400 mt-10">
				{t('questions')}{' '}
				<Link
					href="mailto:soporte@tudominio.com"
					className="text-primary hover:underline"
				>
					{t('contactUs')}
				</Link>
				. {t('cancelAnytime')}
			</p>
		</div>
	)
}

export default PricingPage
