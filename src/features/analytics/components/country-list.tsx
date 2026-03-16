import type { FC } from 'react'
import Image from 'next/image'

interface Props {
	data: Record<string, number>
	scansLabel: string
}

const getCountryName = (code: string): string => {
	try {
		return new Intl.DisplayNames(['es'], { type: 'region' }).of(code) ?? code
	} catch {
		return code
	}
}

const CountryList: FC<Props> = ({ data, scansLabel }) => {
	const entries = Object.entries(data).sort((a, b) => b[1] - a[1])
	const total = entries.reduce((s, [, v]) => s + v, 0)

	if (entries.length === 0) return null

	return (
		<div className="flex flex-col gap-3 mt-4">
			{entries.map(([code, count]) => {
				const pct = total > 0 ? Math.round((count / total) * 100) : 0
				const name = getCountryName(code)

				return (
					<div key={code} className="flex items-center gap-3">
						{/* Circular flag */}
						<div className="w-9 h-9 shrink-0 rounded-full overflow-hidden border-2 border-white dark:border-default-200 shadow-sm">
							<Image
								src={`https://flagcdn.com/40x30/${code.toLowerCase()}.png`}
								alt={name}
								width={40}
								height={30}
								className="w-full h-full object-cover"
								unoptimized
							/>
						</div>

						{/* Name + count + bar */}
						<div className="flex-1 min-w-0">
							<div className="flex justify-between items-center mb-1.5">
								<div>
									<span className="text-sm font-semibold text-default-700">{name}</span>
									<span className="ml-2 text-xs text-default-400">{count.toLocaleString('es')} {scansLabel}</span>
								</div>
								<span className="text-sm font-bold text-default-600 ml-2">{pct}%</span>
							</div>
							<div className="h-1.5 bg-default-100 rounded-full overflow-hidden">
								<div
									className="h-full rounded-full transition-all duration-700"
									style={{
										width: `${pct}%`,
										background: 'linear-gradient(90deg, #3641f5, #7592ff)',
									}}
								/>
							</div>
						</div>
					</div>
				)
			})}
		</div>
	)
}

export default CountryList
