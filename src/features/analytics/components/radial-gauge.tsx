'use client'

import type { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface Stat {
	label: string
	value: number
	change?: number | null
}

interface Props {
	title: string
	subtitle: string
	value: number
	stats: Stat[]
	color?: string
}

export default function RadialGauge({
	title,
	subtitle,
	value,
	stats,
	color = '#3641f5',
}: Props) {
	const { resolvedTheme } = useTheme()
	const isDark = resolvedTheme === 'dark'

	const options: ApexOptions = {
		chart: {
			type: 'radialBar',
			fontFamily: 'Manrope Variable, sans-serif',
			sparkline: { enabled: true },
		},
		plotOptions: {
			radialBar: {
				startAngle: -135,
				endAngle: 135,
				hollow: { size: '65%' },
				track: {
					background: isDark ? '#334155' : '#e2e8f0',
					strokeWidth: '100%',
					margin: 0,
				},
				dataLabels: {
					name: { show: false },
					value: {
						fontSize: '2rem',
						fontWeight: 700,
						offsetY: 10,
						color: isDark ? '#e2e8f0' : '#1e2939',
						formatter: (val) => `${val}%`,
					},
				},
			},
		},
		fill: { colors: [color] },
		stroke: { lineCap: 'round' },
		labels: [title],
	}

	return (
		<div className="flex flex-col bg-content1 border border-divider rounded-2xl p-5 shadow-sm h-full">
			{/* Header */}
			<div className="mb-2">
				<h3 className="font-semibold text-base">{title}</h3>
				<p className="text-xs text-default-400 mt-0.5">{subtitle}</p>
			</div>

			{/* Chart */}
			<div className="flex-1 flex items-center justify-center">
				<ReactApexChart
					type="radialBar"
					options={options}
					series={[value]}
					height={220}
					width={220}
				/>
			</div>

			{/* Stats row */}
			<div
				className="grid border-t border-divider pt-4 mt-2"
				style={{ gridTemplateColumns: `repeat(${stats.length}, 1fr)` }}
			>
				{stats.map((stat, i) => (
					<div
						key={stat.label}
						className={`flex flex-col items-center gap-0.5 ${i > 0 ? 'border-l border-divider' : ''}`}
					>
						<span className="text-xs text-default-400">{stat.label}</span>
						<div className="flex items-center gap-1">
							<span className="font-bold tabular-nums text-foreground">
								{stat.value.toLocaleString()}
							</span>
							{stat.change !== null && stat.change !== undefined && (
								<span
									className={`text-xs font-semibold ${
										stat.change > 0
											? 'text-emerald-500'
											: stat.change < 0
												? 'text-rose-500'
												: 'text-default-400'
									}`}
								>
									{stat.change > 0 ? '↑' : stat.change < 0 ? '↓' : ''}
								</span>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
