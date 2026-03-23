'use client'

import { HugeiconsIcon } from '@hugeicons/react'
import type { FC } from 'react'

interface Props {
	label: string
	amount: number
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	icon: any
	iconBg?: string
	iconColor?: string
	change?: number | null
	subInfo?: string
}

const MetricCard: FC<Props> = ({
	icon,
	amount,
	label,
	iconBg = 'bg-default-100',
	iconColor = 'text-default-500',
	change,
	subInfo,
}) => {
	const isPositive = change != null && change > 0
	const isNegative = change != null && change < 0

	return (
		<div className="flex flex-col gap-3 bg-content1 border border-divider rounded-2xl p-5 w-full shadow-sm">
			<div className="flex items-center justify-between">
				<div
					className={`w-9 h-9 flex items-center justify-center ${iconBg} rounded-xl`}
				>
					<HugeiconsIcon icon={icon} size={18} className={iconColor} />
				</div>
				{change != null && (
					<span
						className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-full ${
							isPositive
								? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
								: isNegative
									? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
									: 'bg-default-100 text-default-500'
						}`}
					>
						{isPositive ? '↑' : isNegative ? '↓' : '—'}
						{Math.abs(change)}%
					</span>
				)}
			</div>

			<div>
				<p className="text-[1.75rem] font-bold leading-none tabular-nums">
					{amount.toLocaleString()}
				</p>
				<p className="text-sm text-default-400 mt-1">{label}</p>
				{subInfo && (
					<p className="text-xs text-default-300 mt-0.5">{subInfo}</p>
				)}
			</div>
		</div>
	)
}

export default MetricCard
