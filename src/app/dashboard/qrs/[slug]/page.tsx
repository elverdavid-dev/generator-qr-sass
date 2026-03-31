import { BreadcrumbItem, Breadcrumbs } from '@heroui/breadcrumbs'
import {
	Calendar03Icon,
	CancelCircleIcon,
	CheckmarkCircle02Icon,
	FingerPrintScanIcon,
	Home01Icon,
	Link01Icon,
	QrCodeIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { notFound, redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import QrPreview from '@/features/qr-codes/components/qr-preview'
import { getQrBySlug } from '@/features/qr-codes/services/queries/get-qr-by-slug'
import { getSession } from '@/shared/lib/supabase/get-session'
import type { QrCode } from '@/shared/types/database.types'
import { formatDate } from '@/shared/utils/format-date'
import { ViewAnalyticsButton } from './qr-nav-buttons'

interface Props {
	params: Promise<{ slug: string }>
}

const QrDetailPage = async ({ params }: Props) => {
	const t = await getTranslations('qrs')
	const { slug } = await params
	const { data: session } = await getSession()
	if (!session?.user) redirect('/login')

	const { data: qr, error } = await getQrBySlug(slug)
	if (error || !qr) notFound()

	const typedQr = qr as QrCode
	const trackingUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/t/${typedQr.slug}`

	return (
		<>
			<Breadcrumbs className="py-4">
				<BreadcrumbItem href="/dashboard">
					<HugeiconsIcon icon={Home01Icon} size={16} />
				</BreadcrumbItem>
				<BreadcrumbItem href="/dashboard/qrs">{t('title')}</BreadcrumbItem>
				<BreadcrumbItem className="capitalize">{typedQr.name}</BreadcrumbItem>
			</Breadcrumbs>

			<div className="py-6 flex items-start justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold capitalize">{typedQr.name}</h1>
					<p className="text-default-500 mt-1">{t('detail.totalScans')}</p>
				</div>
				<ViewAnalyticsButton slug={slug} label={t('nav.viewAnalytics')} />
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* QR Preview */}
				<div className="bg-content1 border border-divider rounded-2xl p-6 flex flex-col items-center gap-4 shadow-sm">
					<QrPreview
						value={trackingUrl}
						size={180}
						fgColor={typedQr.fg_color}
						bgColor={typedQr.bg_color}
						dotStyle={typedQr.dot_style ?? 'square'}
						cornerSquareStyle={typedQr.corner_square_style ?? 'square'}
						cornerDotStyle={typedQr.corner_dot_style ?? 'square'}
						logoUrl={typedQr.logo_url}
						className="rounded-lg overflow-hidden"
					/>
					<div className="text-center">
						<p className="font-semibold capitalize">{typedQr.name}</p>
						<span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
							{typedQr.qr_type}
						</span>
					</div>
				</div>

				{/* Info */}
				<div className="md:col-span-2 flex flex-col gap-4">
					{/* Stats */}
					<div className="grid grid-cols-2 gap-4">
						<div className="bg-content1 border border-divider rounded-2xl p-4 shadow-sm">
							<div className="flex items-center gap-2 text-default-500 mb-1">
								<HugeiconsIcon icon={FingerPrintScanIcon} size={16} />
								<span className="text-sm">{t('detail.totalScans')}</span>
							</div>
							<p className="text-3xl font-bold text-primary">
								{typedQr.scan_count ?? 0}
							</p>
						</div>
						<div className="bg-content1 border border-divider rounded-2xl p-4 shadow-sm">
							<div className="flex items-center gap-2 text-default-500 mb-1">
								{typedQr.is_active ? (
									<HugeiconsIcon
										icon={CheckmarkCircle02Icon}
										size={16}
										className="text-emerald-500"
									/>
								) : (
									<HugeiconsIcon
										icon={CancelCircleIcon}
										size={16}
										className="text-danger"
									/>
								)}
								<span className="text-sm">{t('detail.status')}</span>
							</div>
							<p
								className={`text-lg font-semibold ${typedQr.is_active ? 'text-emerald-500' : 'text-danger'}`}
							>
								{typedQr.is_active ? t('active') : t('inactive')}
							</p>
						</div>
					</div>

					{/* Details */}
					<div className="bg-content1 border border-divider rounded-2xl p-6 shadow-sm flex flex-col gap-4">
						<div className="flex items-start gap-3">
							<HugeiconsIcon
								icon={Link01Icon}
								size={16}
								className="text-default-400 mt-0.5 shrink-0"
							/>
							<div className="min-w-0">
								<p className="text-xs text-default-400 mb-1">
									{t('detail.content')}
								</p>
								<p className="text-sm text-default-700 break-all">
									{typedQr.data}
								</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<HugeiconsIcon
								icon={QrCodeIcon}
								size={16}
								className="text-default-400 mt-0.5 shrink-0"
							/>
							<div>
								<p className="text-xs text-default-400 mb-1">
									{t('detail.trackingUrl')}
								</p>
								<a
									href={trackingUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="text-sm text-primary underline break-all"
								>
									{trackingUrl}
								</a>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<HugeiconsIcon
								icon={Calendar03Icon}
								size={16}
								className="text-default-400 shrink-0"
							/>
							<div>
								<p className="text-xs text-default-400 mb-1">
									{t('detail.createdAt')}
								</p>
								<p className="text-sm text-default-700">
									{formatDate(typedQr.created_at)}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default QrDetailPage
