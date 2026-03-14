'use client'

import dynamic from 'next/dynamic'
import type { FC } from 'react'
import type { ApexOptions } from 'apexcharts'

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
	const options: ApexOptions = {
		colors,
		labels,
		title: {
			text: title,
			align: 'center',
			style: { fontSize: '15px', fontWeight: 600 },
		},
		legend: {
			position: 'bottom',
			fontSize: '13px',
			markers: { size: 5 },
		},
		chart: {
			type: 'donut',
			fontFamily: 'Manrope Variable, sans-serif',
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
						name: { show: true, fontSize: '16px', fontWeight: 600 },
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
