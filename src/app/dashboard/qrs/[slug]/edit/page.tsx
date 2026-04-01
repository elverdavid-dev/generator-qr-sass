import { BreadcrumbItem, Breadcrumbs } from '@heroui/breadcrumbs'
import { Edit02Icon, Home01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { notFound, redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getFolders } from '@/features/folders/services/queries/get-folders'
import QrEditForm from '@/features/qr-codes/components/qr-edit-form'
import { getQrBySlug } from '@/features/qr-codes/services/queries/get-qr-by-slug'
import { getSession } from '@/shared/lib/supabase/get-session'
import type { Folder, QrCode } from '@/shared/types/database.types'

interface Props {
	params: Promise<{ slug: string }>
}

const EditQrPage = async ({ params }: Props) => {
	const t = await getTranslations('qrs')
	const { slug } = await params
	const { data: session } = await getSession()
	if (!session?.user) redirect('/login')

	const [qrResult, foldersResult] = await Promise.allSettled([
		getQrBySlug(slug),
		getFolders(),
	])

	const qr =
		qrResult.status === 'fulfilled' && !qrResult.value.error
			? (qrResult.value.data as QrCode)
			: null

	if (!qr) notFound()

	const folders: Folder[] =
		foldersResult.status === 'fulfilled'
			? ((foldersResult.value.data as Folder[]) ?? [])
			: []

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
		smartRedirect: t('form.smartRedirect'),
		smartRedirectDesc: t('form.smartRedirectDesc'),
		smartRedirectTranslations: {
			scheduleTitle: t('form.smartScheduleTitle'),
			scheduleDesc: t('form.smartScheduleDesc'),
			countryTitle: t('form.smartCountryTitle'),
			countryDesc: t('form.smartCountryDesc'),
			addRule: t('form.smartAddRule'),
			url: t('form.smartUrl'),
			days: t('form.smartDays'),
			from: t('form.smartFrom'),
			to: t('form.smartTo'),
			countries: t('form.smartCountries'),
			noRules: t('form.smartNoRules'),
		},
		cancel: t('form.cancel'),
		submit: t('form.save'),
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
		updated: t('form.updated'),
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
			corners: t('form.frameStyle.corners'),
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
		hints: {
			gradient: t('hints.gradient'),
			logo: t('hints.logo'),
			frame: t('hints.frame'),
			customSlug: t('hints.customSlug'),
			utm: t('hints.utm'),
			password: t('hints.password'),
			expiry: t('hints.expiry'),
			maxScans: t('hints.maxScans'),
		},
		fields: {
			wifi: {
				ssid: t('fields.wifi.ssid'),
				password: t('fields.wifi.password'),
				security: t('fields.wifi.security'),
				securityWpa: t('fields.wifi.securityWpa'),
				securityWep: t('fields.wifi.securityWep'),
				securityNone: t('fields.wifi.securityNone'),
			},
			vcard: {
				firstName: t('fields.vcard.firstName'),
				lastName: t('fields.vcard.lastName'),
				phone: t('fields.vcard.phone'),
				email: t('fields.vcard.email'),
				company: t('fields.vcard.company'),
				website: t('fields.vcard.website'),
			},
			location: {
				latitude: t('fields.location.latitude'),
				longitude: t('fields.location.longitude'),
				hint: t('fields.location.hint'),
			},
			event: {
				title: t('fields.event.title'),
				start: t('fields.event.start'),
				end: t('fields.event.end'),
				location: t('fields.event.location'),
				description: t('fields.event.description'),
			},
		},
		validation: {
			nameRequired: t('validation.nameRequired'),
			contentRequired: t('validation.contentRequired'),
			slugPattern: t('validation.slugPattern'),
			slugMin: t('validation.slugMin'),
			slugMax: t('validation.slugMax'),
			frameScanMe: t('validation.frameScanMe'),
		},
	}

	return (
		<>
			<Breadcrumbs className="py-4">
				<BreadcrumbItem href="/dashboard">
					<HugeiconsIcon icon={Home01Icon} size={16} />
				</BreadcrumbItem>
				<BreadcrumbItem href="/dashboard/qrs">{t('title')}</BreadcrumbItem>
				<BreadcrumbItem>{t('edit.breadcrumb')}</BreadcrumbItem>
			</Breadcrumbs>

			<div className="py-6">
				<div className="flex items-center gap-3">
					<div className="p-2 bg-primary/10 rounded-xl">
						<HugeiconsIcon
							icon={Edit02Icon}
							size={24}
							className="text-primary"
						/>
					</div>
					<div>
						<h1 className="text-3xl font-bold">{t('edit.title')}</h1>
						<p className="text-default-500 mt-1 capitalize">{qr.name}</p>
					</div>
				</div>
			</div>

			<QrEditForm qr={qr} folders={folders} translations={formTranslations} />
		</>
	)
}

export default EditQrPage
