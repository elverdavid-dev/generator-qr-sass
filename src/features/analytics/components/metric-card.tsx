import type { FC } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'

interface Props {
	label: string
	amount: number
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	icon: any
	iconColor?: string
}

const MetricCard: FC<Props> = ({ icon, amount, label, iconColor }) => {
	return (
		<div className="flex items-center justify-between bg-content1 border border-divider rounded-2xl py-5 px-8 w-full shadow-sm">
			<div className="flex items-center gap-3">
				<div className="p-3 bg-default-100 rounded-xl">
					<HugeiconsIcon
						icon={icon}
						size={32}
						className={iconColor ?? 'text-default-500'}
					/>
				</div>
				<h2 className="font-semibold text-default-700">{label}</h2>
			</div>
			<span className="text-3xl font-bold">{amount}</span>
		</div>
	)
}

export default MetricCard
