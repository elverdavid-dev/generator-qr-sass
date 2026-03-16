'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import type { ApexOptions } from 'apexcharts'

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

type Period = 'day' | 'week' | 'month'

interface DataPoint {
	date: string
	count: number
}

interface Props {
	scansPerDay: DataPoint[]
	scansPerWeek: DataPoint[]
	scansPerMonth: DataPoint[]
}

const PERIODS: { key: Period; label: string }[] = [
	{ key: 'day', label: 'Diario' },
	{ key: 'week', label: 'Semanal' },
	{ key: 'month', label: 'Mensual' },
]

const formatLabel = (date: string, period: Period): string => {
	if (period === 'month') {
		const [year, month] = date.split('-')
		return new Date(Number(year), Number(month) - 1).toLocaleString('es', { month: 'short', year: '2-digit' })
	}
	if (period === 'week') {
		const d = new Date(date)
		return d.toLocaleString('es', { day: '2-digit', month: 'short' })
	}
	// day
	const d = new Date(date)
	return d.toLocaleString('es', { day: '2-digit', month: 'short' })
}

export default function ChartArea({ scansPerDay, scansPerWeek, scansPerMonth }: Props) {
	const [period, setPeriod] = useState<Period>('day')

	const datasets: Record<Period, DataPoint[]> = {
		day: scansPerDay,
		week: scansPerWeek,
		month: scansPerMonth,
	}

	const data = datasets[period]
	const total = data.reduce((s, d) => s + d.count, 0)

	const options: ApexOptions = {
		chart: {
			type: 'area',
			fontFamily: 'Manrope Variable, sans-serif',
			toolbar: { show: false },
			zoom: { enabled: false },
		},
		xaxis: {
			categories: data.map((d) => formatLabel(d.date, period)),
			tickAmount: Math.min(data.length, 8),
			labels: { style: { fontSize: '11px', colors: '#94a3b8' }, rotate: 0 },
			axisBorder: { show: false },
			axisTicks: { show: false },
		},
		yaxis: { min: 0, labels: { style: { fontSize: '11px', colors: '#94a3b8' } } },
		dataLabels: { enabled: false },
		stroke: { curve: 'smooth', width: 2.5 },
		fill: {
			type: 'gradient',
			gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0.02, stops: [0, 100] },
		},
		colors: ['#3641f5'],
		grid: {
			borderColor: 'rgba(148,163,184,0.15)',
			strokeDashArray: 4,
			xaxis: { lines: { show: false } },
		},
		tooltip: {
			theme: 'dark',
			y: { formatter: (v) => `${v} escaneos` },
		},
	}

	return (
		<div className="bg-content1 border border-divider rounded-2xl p-5 shadow-sm">
			{/* Header */}
			<div className="flex flex-wrap items-start justify-between gap-3 mb-4">
				<div>
					<h3 className="font-semibold text-base">Escaneos en el tiempo</h3>
					<p className="text-xs text-default-400 mt-0.5">
						Total:{' '}
						<span className="font-semibold text-default-600">{total.toLocaleString('es')}</span>{' '}
						escaneos
					</p>
				</div>

				{/* Period selector */}
				<div className="flex items-center bg-default-100 rounded-xl p-1 gap-1">
					{PERIODS.map(({ key, label }) => (
						<button
							key={key}
							type="button"
							onClick={() => setPeriod(key)}
							className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
								period === key
									? 'bg-content1 text-foreground shadow-sm'
									: 'text-default-400 hover:text-default-600'
							}`}
						>
							{label}
						</button>
					))}
				</div>
			</div>

			<ReactApexChart
				type="area"
				options={options}
				series={[{ name: 'Escaneos', data: data.map((d) => d.count) }]}
				height={260}
			/>
		</div>
	)
}
