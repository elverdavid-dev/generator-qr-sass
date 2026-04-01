'use client'

import { Button } from '@heroui/react'
import { Alert01Icon, InformationCircleIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Link from 'next/link'
import { useState } from 'react'

interface Translations {
	title: string
	plan: string
	qrs: string
	scans: string
	of: string
	upgrade: string
	limitReached: string
	limitWarning: string
	limitDesc: string
	dismiss: string
}

interface Props {
	totalQrs: number
	monthScans: number
	maxQrs: number
	maxScans: number
	translations: Translations
}

const UsageBar = ({
	label,
	used,
	max,
	of,
}: {
	label: string
	used: number
	max: number
	of: string
}) => {
	const pct = Math.min((used / max) * 100, 100)
	const color =
		pct >= 90 ? 'bg-danger' : pct >= 70 ? 'bg-warning' : 'bg-primary'

	return (
		<div className="flex flex-col gap-1.5">
			<div className="flex items-center justify-between text-sm">
				<span className="text-default-600 font-medium">{label}</span>
				<span
					className={`font-semibold tabular-nums ${pct >= 90 ? 'text-danger' : pct >= 70 ? 'text-warning' : 'text-default-700'}`}
				>
					{used}{' '}
					<span className="text-default-400 font-normal">
						{of} {max}
					</span>
				</span>
			</div>
			<div className="h-2 bg-default-100 rounded-full overflow-hidden">
				<div
					className={`h-full rounded-full transition-all ${color}`}
					style={{ width: `${pct}%` }}
				/>
			</div>
		</div>
	)
}

const PlanUsageBanner = ({
	totalQrs,
	monthScans,
	maxQrs,
	maxScans,
	translations: t,
}: Props) => {
	const [dismissed, setDismissed] = useState(false)

	const scanPct = (monthScans / maxScans) * 100
	const qrPct = (totalQrs / maxQrs) * 100
	const isAtLimit = scanPct >= 100 || qrPct >= 100
	const isWarning = !isAtLimit && (scanPct >= 80 || qrPct >= 80)

	return (
		<div className="flex flex-col gap-3 mb-6">
			{/* Alert banner — only when at 80%+ */}
			{(isAtLimit || isWarning) && !dismissed && (
				<div
					className={`flex items-start gap-3 px-4 py-3 rounded-2xl border text-sm ${
						isAtLimit
							? 'bg-danger-50 border-danger-200 dark:bg-danger-950/30 dark:border-danger-800'
							: 'bg-warning-50 border-warning-200 dark:bg-warning-950/30 dark:border-warning-800'
					}`}
				>
					<HugeiconsIcon
						icon={isAtLimit ? Alert01Icon : InformationCircleIcon}
						size={18}
						className={`shrink-0 mt-0.5 ${isAtLimit ? 'text-danger' : 'text-warning'}`}
					/>
					<div className="flex-1 min-w-0">
						<p
							className={`font-semibold ${isAtLimit ? 'text-danger' : 'text-warning-700 dark:text-warning-400'}`}
						>
							{isAtLimit ? t.limitReached : t.limitWarning}
						</p>
						<p className="text-default-500 mt-0.5">{t.limitDesc}</p>
					</div>
					<div className="flex items-center gap-2 shrink-0">
						<Button
							as={Link}
							href="/dashboard/billing"
							size="sm"
							color={isAtLimit ? 'danger' : 'warning'}
							variant="flat"
							className="font-semibold"
						>
							{t.upgrade}
						</Button>
						<button
							type="button"
							onClick={() => setDismissed(true)}
							className="text-default-400 hover:text-default-600 transition-colors text-xs"
						>
							✕
						</button>
					</div>
				</div>
			)}

			{/* Usage card */}
			<div className="bg-content1 border border-divider rounded-2xl p-5 shadow-sm">
				<div className="flex items-center justify-between mb-4">
					<div>
						<p className="font-semibold text-sm">{t.title}</p>
						<p className="text-xs text-default-400">{t.plan}</p>
					</div>
					<Button
						as={Link}
						href="/dashboard/billing"
						size="sm"
						color="primary"
						variant="flat"
						className="font-semibold"
					>
						{t.upgrade}
					</Button>
				</div>
				<div className="flex flex-col gap-4">
					<UsageBar label={t.qrs} used={totalQrs} max={maxQrs} of={t.of} />
					<UsageBar
						label={t.scans}
						used={monthScans}
						max={maxScans}
						of={t.of}
					/>
				</div>
			</div>
		</div>
	)
}

export default PlanUsageBanner
