'use client'

import dynamic from 'next/dynamic'
import type { FC } from 'react'
import CountryList from './country-list'

interface WorldMapTranslations {
	scansDemography: string
	countryDistribution: string
	loadingMap: string
	unknown: string
	less: string
	more: string
	scans: string
}

interface Props {
	data: Record<string, number>
	translations: WorldMapTranslations
}

// Dynamic import is defined outside the component to avoid recreating it on every render
const MapChart = dynamic(() => import('./world-map-chart'), { ssr: false })

const WorldMap: FC<Props> = ({ data, translations }) => {
	if (Object.keys(data).length === 0) return null

	return (
		<div className="bg-content1 border border-divider rounded-2xl p-5 shadow-sm h-full">
			{/* Header */}
			<div className="mb-3">
				<h3 className="font-semibold text-base">{translations.scansDemography}</h3>
				<p className="text-xs text-default-400 mt-0.5">{translations.countryDistribution}</p>
			</div>

			{/* Map */}
			<div className="rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900/40">
				<MapChart
					data={data}
					translations={{
						unknown: translations.unknown,
						less: translations.less,
						more: translations.more,
						scans: translations.scans,
					}}
				/>
			</div>

			{/* Country list below map */}
			<CountryList data={data} scansLabel={translations.scans} />
		</div>
	)
}

export default WorldMap
