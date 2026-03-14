import { FingerPrintScanIcon, QrCode01Icon, QrCodeIcon } from '@hugeicons/core-free-icons'
import { redirect } from 'next/navigation'
import { getSession } from '@/shared/lib/supabase/get-session'
import { getAnalytics } from '@/features/analytics/services/queries/get-analytics'
import MetricCard from '@/features/analytics/components/metric-card'
import ChartDonut from '@/features/analytics/components/chart-donut'

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

	const { totalScans, uniqueScans, totalQrs, byOs, byDevice, byBrowser } = analytics

	const toChart = (record: Record<string, number>) => ({
		labels: Object.keys(record),
		series: Object.values(record),
	})

	return (
		<>
			<div className="py-6">
				<h1 className="text-3xl font-bold">Analíticas</h1>
				<p className="text-default-500 mt-1">
					Monitorea el rendimiento de tus códigos QR
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<MetricCard icon={QrCodeIcon} label="QR Codes creados" amount={totalQrs} />
				<MetricCard
					icon={FingerPrintScanIcon}
					label="Escaneos totales"
					amount={totalScans}
					iconColor="text-emerald-500"
				/>
				<MetricCard
					icon={QrCode01Icon}
					label="Escaneos únicos"
					amount={uniqueScans}
					iconColor="text-indigo-500"
				/>
			</div>

			{totalScans > 0 ? (
				<div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
					<ChartDonut title="Por sistema operativo" {...toChart(byOs)} />
					<ChartDonut
						title="Por navegador"
						{...toChart(byBrowser)}
						colors={['#10b981', '#34d399', '#6ee7b7', '#a7f3d0']}
					/>
					<ChartDonut
						title="Por dispositivo"
						{...toChart(byDevice)}
						colors={['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe']}
					/>
				</div>
			) : (
				<div className="mt-8 flex items-center justify-center h-48 bg-content1 border border-divider rounded-2xl text-default-400">
					Aún no hay escaneos registrados
				</div>
			)}
		</>
	)
}

export default page
