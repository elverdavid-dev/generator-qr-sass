import { BreadcrumbItem, Breadcrumbs } from '@heroui/breadcrumbs'
import { Home01Icon, QrCodeIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getSession } from '@/shared/lib/supabase/get-session'
import { getFolders } from '@/features/folders/services/queries/get-folders'
import QrForm from '@/features/qr-codes/components/qr-form'
import type { Folder } from '@/shared/types/database.types'

const NewQrPage = async () => {
	const t = await getTranslations('qrs')
	const { data: session } = await getSession()
	if (!session?.user) redirect('/login')

	const { data: folders } = await getFolders()

	const formTranslations = {
		qrType: t('form.qrType'),
		name: t('form.name'),
		namePlaceholder: t('form.namePlaceholder'),
		content: t('form.content'),
		dotStyle: t('form.dotStyle'),
		outerCorners: t('form.outerCorners'),
		innerCorners: t('form.innerCorners'),
		colors: t('form.colors'),
		background: t('form.background'),
		qrColor: t('form.qrColor'),
		colorGradient: t('form.colorGradient'),
		enableGradient: t('form.enableGradient'),
		color2: t('form.color2'),
		gradientType: t('form.gradientType'),
		linear: t('form.linear'),
		radial: t('form.radial'),
		frame: t('form.frame'),
		frameColor: t('form.frameColor'),
		frameText: t('form.frameText'),
		framePlaceholder: t('form.framePlaceholder'),
		logo: t('form.logo'),
		changeLogo: t('form.changeLogo'),
		uploadLogo: t('form.uploadLogo'),
		folder: t('form.folder'),
		noFolder: t('form.noFolder'),
		protection: t('form.protection'),
		password: t('form.password'),
		passwordPlaceholder: t('form.passwordPlaceholder'),
		expiry: t('form.expiry'),
		maxScans: t('form.maxScans'),
		maxScansPlaceholder: t('form.maxScansPlaceholder'),
		deviceRedirect: t('form.deviceRedirect'),
		deviceRedirectDesc: t('form.deviceRedirectDesc'),
		iosUrl: t('form.iosUrl'),
		androidUrl: t('form.androidUrl'),
		cancel: t('form.cancel'),
		submit: t('form.create'),
		preview: t('form.preview'),
		noName: t('form.noName'),
		customSlug: t('customSlug'),
		customSlugPlaceholder: t('customSlugPlaceholder'),
		customSlugDesc: t('customSlugDesc'),
		utm: t('form.utm'),
		utmSource: t('form.utmSource'),
		utmMedium: t('form.utmMedium'),
		utmCampaign: t('form.utmCampaign'),
		utmTerm: t('form.utmTerm'),
		utmContent: t('form.utmContent'),
		created: t('form.created'),
		dot: {
			square: t('form.dot.square'),
			dots: t('form.dot.dots'),
			rounded: t('form.dot.rounded'),
			classic: t('form.dot.classic'),
			classicR: t('form.dot.classicR'),
			extraR: t('form.dot.extraR'),
		},
		corner: {
			square: t('form.corner.square'),
			circle: t('form.corner.circle'),
		},
		frameStyle: {
			none: t('form.frameStyle.none'),
			simple: t('form.frameStyle.simple'),
			rounded: t('form.frameStyle.rounded'),
			thick: t('form.frameStyle.thick'),
		},
		types: {
			url: t('types.url'),
			text: t('types.text'),
			email: t('types.email'),
			phone: t('types.phone'),
			wifi: t('types.wifi'),
			contact: t('types.contact'),
			location: t('types.location'),
			event: t('types.event'),
			payment: t('types.payment'),
		},
	}

	return (
		<>
			<Breadcrumbs className="py-4">
				<BreadcrumbItem href="/dashboard">
					<HugeiconsIcon icon={Home01Icon} size={16} />
				</BreadcrumbItem>
				<BreadcrumbItem href="/dashboard/qrs">{t('title')}</BreadcrumbItem>
				<BreadcrumbItem>{t('new.breadcrumb')}</BreadcrumbItem>
			</Breadcrumbs>

			<div className="py-6">
				<div className="flex items-center gap-3">
					<div className="p-2 bg-primary/10 rounded-xl">
						<HugeiconsIcon icon={QrCodeIcon} size={24} className="text-primary" />
					</div>
					<div>
						<h1 className="text-3xl font-bold">{t('new.title')}</h1>
						<p className="text-default-500 mt-1">
							{t('new.subtitle')}
						</p>
					</div>
				</div>
			</div>

			<QrForm folders={(folders as Folder[]) ?? []} translations={formTranslations} />
		</>
	)
}

export default NewQrPage
