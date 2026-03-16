'use client'

import dynamic from 'next/dynamic'
import type { FC } from 'react'
import type { ApexOptions } from 'apexcharts'

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface Props {
	title: string
	labels: string[]
	series: number[]
	horizontal?: boolean
	color?: string
	height?: number
}

const ChartBar: FC<Props> = ({
	title,
	labels,
	series,
	horizontal = false,
	color = '#3641f5',
	height = 280,
}) => {
	const options: ApexOptions = {
		chart: {
			type: 'bar',
			fontFamily: 'Manrope Variable, sans-serif',
			toolbar: { show: false },
		},
		title: {
			text: title,
			style: { fontSize: '15px', fontWeight: 600 },
		},
		plotOptions: {
			bar: { horizontal, borderRadius: 4 },
		},
		xaxis: {
			categories: labels,
			labels: { style: { fontSize: '12px' } },
		},
		yaxis: { min: 0, labels: { style: { fontSize: '12px' } } },
		dataLabels: { enabled: false },
		colors: [color],
		grid: { borderColor: 'rgba(128,128,128,0.1)', strokeDashArray: 4 },
		tooltip: { theme: 'dark' },
	}

	return (
		<div className="bg-content1 border border-divider rounded-2xl p-5 shadow-sm">
			<ReactApexChart
				type="bar"
				options={options}
				series={[{ name: 'Escaneos', data: series }]}
				height={height}
			/>
		</div>
	)
}

export default ChartBar
