import {
	FingerPrintScanIcon,
	Clock01Icon,
	Home01Icon,
	Analytics02Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { BreadcrumbItem, Breadcrumbs } from '@heroui/breadcrumbs'
import { redirect, notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { BackToQrButton } from '../qr-nav-buttons'
import { getSession } from '@/shared/lib/supabase/get-session'
import { getQrBySlug } from '@/features/qr-codes/services/queries/get-qr-by-slug'
import { getQrAnalytics } from '@/features/analytics/services/queries/get-qr-analytics'
import MetricCard from '@/features/analytics/components/metric-card'
import RadialGauge from '@/features/analytics/components/radial-gauge'
import ChartArea from '@/features/analytics/components/chart-area'
import ChartBar from '@/features/analytics/components/chart-bar'
import ChartDonut from '@/features/analytics/components/chart-donut'
import RecentScansTable from '@/features/analytics/components/recent-scans-table'
import WorldMap from '@/features/analytics/components/world-map'
import type { QrCode } from '@/shared/types/database.types'

interface Props {
	params: Promise<{ slug: string }>
}

const QrAnalyticsPage = async ({ params }: Props) => {
	const t = await getTranslations('analytics')
	const tQrs = await getTranslations('qrs')
	const { slug } = await params
	const { data: session } = await getSession()
	if (!session?.user) redirect('/login')

	const { data: qr, error: qrError } = await getQrBySlug(slug)
	if (qrError || !qr) notFound()

	const typedQr = qr as QrCode
	const { data: analytics, error } = await getQrAnalytics(typedQr.id)

	if (error || !analytics) {
		return (
			<div className="flex items-center justify-center h-64 text-default-400">
				{t('failedLoad')}
			</div>
		)
	}

	const {
		totalScans,
		uniqueScans,
		uniqueRate,
		todayScans,
		weekScans,
		monthScans,
		weekChange,
		monthChange,
		scansPerDay,
		scansPerWeek,
		scansPerMonth,
		byHour,
		byOs,
		byDevice,
		byBrowser,
		byCountry,
		recentScans,
	} = analytics

	const toChart = (record: Record<string, number>) => ({
		labels: Object.keys(record),
		series: Object.values(record),
	})

	const chartAreaTranslations = {
		chartTitle: t('chartTitle'),
		chartTotal: t('chartTotal'),
		chartScans: t('chartScans'),
		daily: t('daily'),
		weekly: t('weekly'),
		monthly: t('monthly'),
		scansLabel: t('scansLabel'),
	}

	const chartBarTranslations = {
		scansLabel: t('scansLabel'),
	}

	const worldMapTranslations = {
		scansDemography: t('scansDemography'),
		countryDistribution: t('countryDistribution'),
		loadingMap: t('loadingMap'),
		unknown: t('unknown'),
		less: t('less'),
		more: t('more'),
		scans: t('chartScans'),
	}

	const recentScansTranslations = {
		recentScans: t('recentScans'),
		lastActivities: t('lastActivities'),
		activities: t('activities'),
		noScansRecorded: t('noScansRecorded'),
		qrColumn: t('qrColumn'),
		countryColumn: t('countryColumn'),
		platformColumn: t('platformColumn'),
		uniqueColumn: t('uniqueColumn'),
		uniqueScan: t('uniqueScan'),
		repeatScan: t('repeatScan'),
	}

	return (
		<div className="pb-12">
			<Breadcrumbs className="py-4">
				<BreadcrumbItem href="/dashboard">
					<HugeiconsIcon icon={Home01Icon} size={16} />
				</BreadcrumbItem>
				<BreadcrumbItem href="/dashboard/qrs">{tQrs('title')}</BreadcrumbItem>
				<BreadcrumbItem href={`/dashboard/qrs/${slug}`} className="capitalize">
					{typedQr.name}
				</BreadcrumbItem>
				<BreadcrumbItem>{t('title')}</BreadcrumbItem>
			</Breadcrumbs>

			<div className="py-6 flex items-start justify-between gap-4">
				<div>
					<div className="flex items-center gap-2 mb-1">
						<HugeiconsIcon icon={Analytics02Icon} size={22} className="text-primary" />
						<h1 className="text-3xl font-bold capitalize">{typedQr.name}</h1>
					</div>
					<p className="text-default-500">{t('individualTitle')}</p>
				</div>
				<BackToQrButton slug={slug} label={tQrs('nav.back')} />
			</div>

			{/* ── Metric cards + radial gauge ── */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
				<div className="lg:col-span-2 grid grid-cols-2 gap-4">
					<MetricCard
						icon={FingerPrintScanIcon}
						label={t('totalScans')}
						amount={totalScans}
						change={monthChange}
						subInfo={`${uniqueScans.toLocaleString('es')} ${t('unique')}`}
						iconBg="bg-indigo-50 dark:bg-indigo-950/40"
						iconColor="text-indigo-600 dark:text-indigo-400"
					/>
					<MetricCard
						icon={Clock01Icon}
						label={t('todayScans')}
						amount={todayScans}
						subInfo={`${weekScans.toLocaleString('es')} ${t('thisWeek')}`}
						iconBg="bg-violet-50 dark:bg-violet-950/40"
						iconColor="text-violet-600 dark:text-violet-400"
					/>
					<MetricCard
						icon={Clock01Icon}
						label={t('thisWeekLabel')}
						amount={weekScans}
						change={weekChange}
						subInfo={`${monthScans.toLocaleString('es')} ${t('thisMonth')}`}
						iconBg="bg-amber-50 dark:bg-amber-950/40"
						iconColor="text-amber-600 dark:text-amber-400"
					/>
					<MetricCard
						icon={FingerPrintScanIcon}
						label={t('uniqueScans')}
						amount={uniqueScans}
						subInfo={`${uniqueRate}% ${t('ofTotal')}`}
						iconBg="bg-emerald-50 dark:bg-emerald-950/40"
						iconColor="text-emerald-600 dark:text-emerald-400"
					/>
				</div>

				<RadialGauge
					title={t('uniquenessRate')}
					subtitle={t('uniqueVsTotal')}
					value={uniqueRate}
					stats={[
						{ label: t('thisWeekLabel'), value: weekScans, change: weekChange },
						{ label: t('thisMonthLabel'), value: monthScans, change: monthChange },
						{ label: t('uniqueLabel'), value: uniqueScans },
					]}
				/>
			</div>

			{totalScans > 0 ? (
				<>
					{/* ── Area chart ── */}
					<div className="mt-6">
						<ChartArea
							scansPerDay={scansPerDay}
							scansPerWeek={scansPerWeek}
							scansPerMonth={scansPerMonth}
							translations={chartAreaTranslations}
						/>
					</div>

					{/* ── Map + Recent scans ── */}
					{Object.keys(byCountry).length > 0 ? (
						<div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
							<WorldMap data={byCountry} translations={worldMapTranslations} />
							<RecentScansTable scans={recentScans} translations={recentScansTranslations} />
						</div>
					) : (
						<div className="mt-6">
							<RecentScansTable scans={recentScans} translations={recentScansTranslations} />
						</div>
					)}

					{/* ── Device donuts ── */}
					<div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
						<ChartDonut title={t('os')} {...toChart(byOs)} />
						<ChartDonut
							title={t('browser')}
							{...toChart(byBrowser)}
							colors={['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5']}
						/>
						<ChartDonut
							title={t('device')}
							{...toChart(byDevice)}
							colors={['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe']}
						/>
					</div>

					{/* ── By hour ── */}
					<div className="mt-6">
						<ChartBar
							title={t('scansByHourDay')}
							labels={Array.from({ length: 24 }, (_, i) => `${i}h`)}
							series={byHour}
							color="#6366f1"
							translations={chartBarTranslations}
						/>
					</div>
				</>
			) : (
				<div className="mt-6 flex flex-col items-center justify-center h-56 bg-content1 border border-divider rounded-2xl text-default-400 gap-2">
					<div className="opacity-25">
						<HugeiconsIcon icon={FingerPrintScanIcon} size={36} />
					</div>
					<p className="font-medium text-sm">{t('noScans')}</p>
					<p className="text-xs">{t('noScansDescSingle')}</p>
				</div>
			)}
		</div>
	)
}

export default QrAnalyticsPage
