import {
	ChartColumnIcon,
	Clock01Icon,
	FingerPrintScanIcon,
	QrCodeIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { redirect } from 'next/navigation'
import { getLocale, getTranslations } from 'next-intl/server'
import ChartArea from '@/features/analytics/components/chart-area'
import ChartBar from '@/features/analytics/components/chart-bar'
import ChartDonut from '@/features/analytics/components/chart-donut'
import ExportCsvButton from '@/features/analytics/components/export-csv-button'
import MetricCard from '@/features/analytics/components/metric-card'
import RadialGauge from '@/features/analytics/components/radial-gauge'
import RecentScansTable from '@/features/analytics/components/recent-scans-table'
import WorldMap from '@/features/analytics/components/world-map'
import { getAnalytics } from '@/features/analytics/services/queries/get-analytics'
import { getSession } from '@/shared/lib/supabase/get-session'

const page = async () => {
	const [t, locale] = await Promise.all([
		getTranslations('analytics'),
		getLocale(),
	])
	const { data: session } = await getSession()
	if (!session?.user) redirect('/login')

	const { data: analytics, error } = await getAnalytics()

	if (error || !analytics) {
		return (
			<div className="flex items-center justify-center h-64 text-default-400">
				{t('failedLoad')}
			</div>
		)
	}

	const {
		totalQrs,
		activeQrs,
		inactiveQrs,
		uniqueScans,
		uniqueRate,
		totalScansAllTime,
		todayScans,
		weekScans,
		monthScans,
		avgScansPerQr,
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
		byQrType,
		topQrs,
		recentScans,
	} = analytics

	const toChart = (record: Record<string, number>) => ({
		labels: Object.keys(record),
		series: Object.values(record),
	})

	const hasScans = totalScansAllTime > 0

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
			<div className="py-6 flex items-start justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold">{t('title')}</h1>
					<p className="text-default-500 mt-1">{t('subtitle')}</p>
				</div>
				<ExportCsvButton label={t('exportCsv')} errorLabel={t('exportError')} />
			</div>

			{/* ── 4 metric cards + radial gauge ── */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
				<div className="lg:col-span-2 grid grid-cols-2 gap-4">
					<MetricCard
						icon={QrCodeIcon}
						label={t('qrsCreated')}
						amount={totalQrs}
						subInfo={`${activeQrs} ${t('active')} · ${inactiveQrs} ${t('inactive')}`}
						iconBg="bg-blue-50 dark:bg-blue-950/40"
						iconColor="text-blue-600 dark:text-blue-400"
					/>
					<MetricCard
						icon={FingerPrintScanIcon}
						label={t('totalScans')}
						amount={totalScansAllTime}
						change={monthChange}
						subInfo={`${uniqueScans.toLocaleString(locale)} ${t('unique')}`}
						iconBg="bg-indigo-50 dark:bg-indigo-950/40"
						iconColor="text-indigo-600 dark:text-indigo-400"
					/>
					<MetricCard
						icon={Clock01Icon}
						label={t('todayScans')}
						amount={todayScans}
						subInfo={`${weekScans.toLocaleString(locale)} ${t('thisWeek')}`}
						iconBg="bg-violet-50 dark:bg-violet-950/40"
						iconColor="text-violet-600 dark:text-violet-400"
					/>
					<MetricCard
						icon={ChartColumnIcon}
						label={t('avgPerQr')}
						amount={avgScansPerQr}
						change={weekChange}
						subInfo={`${monthScans.toLocaleString(locale)} ${t('thisMonth')}`}
						iconBg="bg-amber-50 dark:bg-amber-950/40"
						iconColor="text-amber-600 dark:text-amber-400"
					/>
				</div>

				<RadialGauge
					title={t('uniquenessRate')}
					subtitle={t('uniqueVsTotal')}
					value={uniqueRate}
					stats={[
						{ label: t('thisWeekLabel'), value: weekScans, change: weekChange },
						{
							label: t('thisMonthLabel'),
							value: monthScans,
							change: monthChange,
						},
						{ label: t('uniqueLabel'), value: uniqueScans },
					]}
				/>
			</div>

			{hasScans ? (
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
							<RecentScansTable
								scans={recentScans}
								translations={recentScansTranslations}
							/>
						</div>
					) : (
						<div className="mt-6">
							<RecentScansTable
								scans={recentScans}
								translations={recentScansTranslations}
							/>
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

					{/* ── By hour + Top QRs ── */}
					<div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
						<ChartBar
							title={t('scansByHour')}
							labels={Array.from({ length: 24 }, (_, i) => `${i}h`)}
							series={byHour}
							color="#6366f1"
							translations={chartBarTranslations}
						/>
						{topQrs.some((q) => q.scans > 0) && (
							<ChartBar
								title={t('topQrs')}
								labels={topQrs.map((q) => q.name)}
								series={topQrs.map((q) => q.scans)}
								horizontal
								color="#10b981"
								translations={chartBarTranslations}
							/>
						)}
					</div>

					{/* ── QR type donut (only if more than 1 type) ── */}
					{Object.keys(byQrType).length > 1 && (
						<div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
							<ChartDonut
								title={t('qrTypes')}
								{...toChart(byQrType)}
								colors={[
									'#3641f5',
									'#f59e0b',
									'#10b981',
									'#ef4444',
									'#8b5cf6',
									'#ec4899',
								]}
							/>
						</div>
					)}
				</>
			) : (
				<div className="mt-6 flex flex-col items-center justify-center h-56 bg-content1 border border-divider rounded-2xl text-default-400 gap-2">
					<div className="opacity-25">
						<HugeiconsIcon icon={FingerPrintScanIcon} size={36} />
					</div>
					<p className="font-medium text-sm">{t('noScans')}</p>
					<p className="text-xs">{t('noScansDesc')}</p>
				</div>
			)}
		</div>
	)
}

export default page
