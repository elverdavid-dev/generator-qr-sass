import {
	FingerPrintScanIcon,
	QrCodeIcon,
	Clock01Icon,
	Calendar03Icon,
	ChartColumnIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { redirect } from 'next/navigation'
import { getSession } from '@/shared/lib/supabase/get-session'
import { getAnalytics } from '@/features/analytics/services/queries/get-analytics'
import MetricCard from '@/features/analytics/components/metric-card'
import RadialGauge from '@/features/analytics/components/radial-gauge'
import ChartDonut from '@/features/analytics/components/chart-donut'
import ChartArea from '@/features/analytics/components/chart-area'
import ChartBar from '@/features/analytics/components/chart-bar'
import RecentScansTable from '@/features/analytics/components/recent-scans-table'
import WorldMap from '@/features/analytics/components/world-map'

const page = async () => {
	const { data: session } = await getSession()
	if (!session?.user) redirect('/login')

	const { data: analytics, error } = await getAnalytics()

	if (error || !analytics) {
		return (
			<div className="flex items-center justify-center h-64 text-default-400">
				No se pudieron cargar las analíticas
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

	return (
		<div className="pb-12">
			<div className="py-6">
				<h1 className="text-3xl font-bold">Analíticas</h1>
				<p className="text-default-500 mt-1">Rendimiento de tus códigos QR</p>
			</div>

			{/* ── 4 metric cards + radial gauge ── */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
				<div className="lg:col-span-2 grid grid-cols-2 gap-4">
					<MetricCard
						icon={QrCodeIcon}
						label="QRs creados"
						amount={totalQrs}
						subInfo={`${activeQrs} activos · ${inactiveQrs} inactivos`}
						iconBg="bg-blue-50 dark:bg-blue-950/40"
						iconColor="text-blue-600 dark:text-blue-400"
					/>
					<MetricCard
						icon={FingerPrintScanIcon}
						label="Escaneos totales"
						amount={totalScansAllTime}
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
						icon={ChartColumnIcon}
						label="Promedio por QR"
						amount={avgScansPerQr}
						change={weekChange}
						subInfo={`${monthScans.toLocaleString('es')} este mes`}
						iconBg="bg-amber-50 dark:bg-amber-950/40"
						iconColor="text-amber-600 dark:text-amber-400"
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

			{hasScans ? (
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

					{/* ── By hour + Top QRs ── */}
					<div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
						<ChartBar
							title="Escaneos por hora"
							labels={Array.from({ length: 24 }, (_, i) => `${i}h`)}
							series={byHour}
							color="#6366f1"
						/>
						{topQrs.some((q) => q.scans > 0) && (
							<ChartBar
								title="Top QRs más escaneados"
								labels={topQrs.map((q) => q.name)}
								series={topQrs.map((q) => q.scans)}
								horizontal
								color="#10b981"
							/>
						)}
					</div>

					{/* ── QR type donut (only if more than 1 type) ── */}
					{Object.keys(byQrType).length > 1 && (
						<div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
							<ChartDonut
								title="Tipos de QR"
								{...toChart(byQrType)}
								colors={['#3641f5', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899']}
							/>
						</div>
					)}
				</>
			) : (
				<div className="mt-6 flex flex-col items-center justify-center h-56 bg-content1 border border-divider rounded-2xl text-default-400 gap-2">
					<div className="opacity-25">
						<HugeiconsIcon icon={FingerPrintScanIcon} size={36} />
					</div>
					<p className="font-medium text-sm">Aún no hay escaneos</p>
					<p className="text-xs">Los datos aparecerán cuando alguien escanee tus QRs</p>
				</div>
			)}
		</div>
	)
}

export default page
