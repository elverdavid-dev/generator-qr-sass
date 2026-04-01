'use client'

import type { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'
import type { FC } from 'react'

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface Translations {
	scansLabel: string
}

interface Props {
	title: string
	labels: string[]
	series: number[]
	horizontal?: boolean
	color?: string
	height?: number
	translations: Translations
}

const ChartBar: FC<Props> = ({
	title,
	labels,
	series,
	horizontal = false,
	color = '#3641f5',
	height = 280,
	translations,
}) => {
	const { resolvedTheme } = useTheme()
	const isDark = resolvedTheme === 'dark'
	const labelColor = isDark ? '#8d9db0' : '#64748b'
	const titleColor = isDark ? '#e2e8f0' : '#1e2939'

	const options: ApexOptions = {
		chart: {
			type: 'bar',
			fontFamily: 'Manrope Variable, sans-serif',
			toolbar: { show: false },
			background: 'transparent',
		},
		title: {
			text: title,
			style: { fontSize: '15px', fontWeight: 600, color: titleColor },
		},
		plotOptions: {
			bar: { horizontal, borderRadius: 4 },
		},
		xaxis: {
			categories: labels,
			labels: {
				style: { fontSize: '11px', colors: labelColor },
				rotate: 0,
				hideOverlappingLabels: true,
				trim: false,
			},
			axisBorder: { show: false },
			axisTicks: { show: false },
		},
		yaxis: {
			min: 0,
			labels: { style: { fontSize: '12px', colors: labelColor } },
		},
		dataLabels: { enabled: false },
		colors: [color],
		grid: {
			borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
			strokeDashArray: 4,
		},
		tooltip: { theme: isDark ? 'dark' : 'light' },
	}

	return (
		<div className="bg-content1 border border-divider rounded-2xl p-5 shadow-sm">
			<ReactApexChart
				type="bar"
				options={options}
				series={[{ name: translations.scansLabel, data: series }]}
				height={height}
			/>
		</div>
	)
}

export default ChartBar
