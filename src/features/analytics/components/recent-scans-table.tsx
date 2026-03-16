import type { FC } from 'react'
import Image from 'next/image'

interface Scan {
	qrName?: string
	os: string
	browser: string
	device: string
	country: string | null
	isUnique: boolean
	createdAt: string
}

interface RecentScansTranslations {
	recentScans: string
	lastActivities: string
	activities: string
	noScansRecorded: string
	qrColumn: string
	countryColumn: string
	platformColumn: string
	uniqueColumn: string
	uniqueScan: string
	repeatScan: string
}

interface Props {
	scans: Scan[]
	translations: RecentScansTranslations
}

const getCountryName = (code: string): string => {
	try {
		return new Intl.DisplayNames(['es'], { type: 'region' }).of(code) ?? code
	} catch {
		return code
	}
}

const RecentScansTable: FC<Props> = ({ scans, translations }) => {
	return (
		<div className="bg-content1 border border-divider rounded-2xl p-5 shadow-sm flex flex-col h-full">
			{/* Header */}
			<div className="flex items-center justify-between mb-4">
				<div>
					<h3 className="font-semibold text-base">{translations.recentScans}</h3>
					<p className="text-xs text-default-400 mt-0.5">{translations.lastActivities} {scans.length} {translations.activities}</p>
				</div>
			</div>

			{scans.length === 0 ? (
				<div className="flex-1 flex items-center justify-center text-default-400 text-sm">
					{translations.noScansRecorded}
				</div>
			) : (
				<div className="flex flex-col divide-y divide-divider overflow-auto">
					{/* Column headers */}
					<div className="grid grid-cols-[1fr_auto_auto_auto] gap-3 pb-2.5 text-xs font-medium text-default-400">
						<span>{translations.qrColumn}</span>
						<span>{translations.countryColumn}</span>
						<span>{translations.platformColumn}</span>
						<span>{translations.uniqueColumn}</span>
					</div>

					{scans.map((scan, i) => (
						<div key={i} className="grid grid-cols-[1fr_auto_auto_auto] gap-3 py-3 items-center">
							{/* QR name / date */}
							<div className="min-w-0">
								{scan.qrName ? (
									<p className="text-sm font-semibold text-default-700 truncate">{scan.qrName}</p>
								) : null}
								<p className={`text-xs text-default-400 ${scan.qrName ? 'mt-0.5' : 'text-sm font-medium text-default-700'}`}>
									{new Date(scan.createdAt).toLocaleString('es', {
										day: '2-digit',
										month: 'short',
										hour: '2-digit',
										minute: '2-digit',
									})}
								</p>
							</div>

							{/* Country + flag */}
							<div className="flex items-center gap-1.5 shrink-0">
								{scan.country ? (
									<>
										<div className="w-5 h-3.5 rounded-sm overflow-hidden shrink-0">
											<Image
												src={`https://flagcdn.com/20x15/${scan.country.toLowerCase()}.png`}
												alt={scan.country}
												width={20}
												height={15}
												className="w-full h-full object-cover"
												unoptimized
											/>
										</div>
										<span className="text-xs text-default-500 hidden sm:inline">
											{getCountryName(scan.country)}
										</span>
									</>
								) : (
									<span className="text-xs text-default-300">—</span>
								)}
							</div>

							{/* OS + Browser */}
							<div className="text-right shrink-0">
								<p className="text-xs font-medium text-default-600">{scan.os}</p>
								<p className="text-xs text-default-400">{scan.browser}</p>
							</div>

							{/* Unique badge */}
							<div className="shrink-0 text-right">
								<span
									className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${
										scan.isUnique
											? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
											: 'bg-default-100 text-default-500'
									}`}
								>
									{scan.isUnique ? translations.uniqueScan : translations.repeatScan}
								</span>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default RecentScansTable
