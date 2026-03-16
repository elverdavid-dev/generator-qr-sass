import {
	FingerPrintScanIcon,
	Clock01Icon,
	Home01Icon,
	Analytics02Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { BreadcrumbItem, Breadcrumbs } from '@heroui/breadcrumbs'
import { redirect, notFound } from 'next/navigation'
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
				No se pudieron cargar las analíticas
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

	return (
		<div className="pb-12">
			<Breadcrumbs className="py-4">
				<BreadcrumbItem href="/dashboard">
					<HugeiconsIcon icon={Home01Icon} size={16} />
				</BreadcrumbItem>
				<BreadcrumbItem href="/dashboard/qrs">Mis QR Codes</BreadcrumbItem>
				<BreadcrumbItem href={`/dashboard/qrs/${slug}`} className="capitalize">
					{typedQr.name}
				</BreadcrumbItem>
				<BreadcrumbItem>Analíticas</BreadcrumbItem>
			</Breadcrumbs>

			<div className="py-6 flex items-start justify-between gap-4">
				<div>
					<div className="flex items-center gap-2 mb-1">
						<HugeiconsIcon icon={Analytics02Icon} size={22} className="text-primary" />
						<h1 className="text-3xl font-bold capitalize">{typedQr.name}</h1>
					</div>
					<p className="text-default-500">Rendimiento individual del código QR</p>
				</div>
				<BackToQrButton slug={slug} />
			</div>

			{/* ── Metric cards + radial gauge ── */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
				<div className="lg:col-span-2 grid grid-cols-2 gap-4">
					<MetricCard
						icon={FingerPrintScanIcon}
						label="Escaneos totales"
						amount={totalScans}
						change={monthChange}
						subInfo={`${uniqueScans.toLocaleString('es')} únicos`}
						iconBg="bg-indigo-50 dark:bg-indigo-950/40"
						iconColor="text-indigo-600 dark:text-indigo-400"
					/>
					<MetricCard
						icon={Clock01Icon}
						label="Escaneos hoy"
						amount={todayScans}
						subInfo={`${weekScans.toLocaleString('es')} esta semana`}
						iconBg="bg-violet-50 dark:bg-violet-950/40"
						iconColor="text-violet-600 dark:text-violet-400"
					/>
					<MetricCard
						icon={Clock01Icon}
						label="Esta semana"
						amount={weekScans}
						change={weekChange}
						subInfo={`${monthScans.toLocaleString('es')} este mes`}
						iconBg="bg-amber-50 dark:bg-amber-950/40"
						iconColor="text-amber-600 dark:text-amber-400"
					/>
					<MetricCard
						icon={FingerPrintScanIcon}
						label="Escaneos únicos"
						amount={uniqueScans}
						subInfo={`${uniqueRate}% del total`}
						iconBg="bg-emerald-50 dark:bg-emerald-950/40"
						iconColor="text-emerald-600 dark:text-emerald-400"
					/>
				</div>

				<RadialGauge
					title="Tasa de unicidad"
					subtitle="Escaneos únicos vs. totales"
					value={uniqueRate}
					stats={[
						{ label: 'Esta semana', value: weekScans, change: weekChange },
						{ label: 'Este mes', value: monthScans, change: monthChange },
						{ label: 'Únicos', value: uniqueScans },
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
						/>
					</div>

					{/* ── Map + Recent scans ── */}
					{Object.keys(byCountry).length > 0 ? (
						<div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
							<WorldMap data={byCountry} />
							<RecentScansTable scans={recentScans} />
						</div>
					) : (
						<div className="mt-6">
							<RecentScansTable scans={recentScans} />
						</div>
					)}

					{/* ── Device donuts ── */}
					<div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
						<ChartDonut title="Sistema operativo" {...toChart(byOs)} />
						<ChartDonut
							title="Navegador"
							{...toChart(byBrowser)}
							colors={['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5']}
						/>
						<ChartDonut
							title="Dispositivo"
							{...toChart(byDevice)}
							colors={['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe']}
						/>
					</div>

					{/* ── By hour ── */}
					<div className="mt-6">
						<ChartBar
							title="Escaneos por hora del día"
							labels={Array.from({ length: 24 }, (_, i) => `${i}h`)}
							series={byHour}
							color="#6366f1"
						/>
					</div>
				</>
			) : (
				<div className="mt-6 flex flex-col items-center justify-center h-56 bg-content1 border border-divider rounded-2xl text-default-400 gap-2">
					<div className="opacity-25">
						<HugeiconsIcon icon={FingerPrintScanIcon} size={36} />
					</div>
					<p className="font-medium text-sm">Aún no hay escaneos</p>
					<p className="text-xs">Los datos aparecerán cuando alguien escanee este QR</p>
				</div>
			)}
		</div>
	)
}

export default QrAnalyticsPage
