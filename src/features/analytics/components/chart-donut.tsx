'use client'

import type { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'
import type { FC } from 'react'

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface Props {
	title: string
	labels: string[]
	series: number[]
	colors?: string[]
}

const ChartDonut: FC<Props> = ({
	title,
	labels,
	series,
	colors = ['#3641f5', '#7592ff', '#9CB9FF', '#B8CEFF', '#D4E2FF'],
}) => {
	const { resolvedTheme } = useTheme()
	const isDark = resolvedTheme === 'dark'
	const titleColor = isDark ? '#e2e8f0' : '#1e2939'
	const legendColor = isDark ? '#8d9db0' : '#64748b'

	const options: ApexOptions = {
		colors,
		labels,
		title: {
			text: title,
			align: 'center',
			style: { fontSize: '15px', fontWeight: 600, color: titleColor },
		},
		legend: {
			position: 'bottom',
			fontSize: '13px',
			markers: { size: 5 },
			labels: { colors: legendColor },
		},
		chart: {
			type: 'donut',
			fontFamily: 'Manrope Variable, sans-serif',
			background: 'transparent',
		},
		tooltip: { enabled: false },
		states: { hover: { filter: { type: 'none' } } },
		stroke: { show: false },
		plotOptions: {
			pie: {
				expandOnClick: false,
				donut: {
					size: '60%',
					labels: {
						show: true,
						name: {
							show: true,
							fontSize: '16px',
							fontWeight: 600,
							color: titleColor,
						},
						value: { color: titleColor },
					},
				},
			},
		},
	}

	return (
		<div className="bg-content1 border border-divider rounded-2xl p-5 shadow-sm">
			<ReactApexChart
				type="donut"
				options={options}
				series={series.length > 0 ? series : [1]}
				width={300}
			/>
		</div>
	)
}

export default ChartDonut
