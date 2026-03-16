'use client'

import dynamic from 'next/dynamic'
import type { FC } from 'react'
import CountryList from './country-list'

const MapChart = dynamic(() => import('./world-map-chart'), {
	ssr: false,
	loading: () => (
		<div className="w-full h-60 flex items-center justify-center text-default-400 text-sm">
			Cargando mapa...
		</div>
	),
})

interface Props {
	data: Record<string, number>
}

const WorldMap: FC<Props> = ({ data }) => {
	if (Object.keys(data).length === 0) return null

	return (
		<div className="bg-content1 border border-divider rounded-2xl p-5 shadow-sm h-full">
			{/* Header */}
			<div className="mb-3">
				<h3 className="font-semibold text-base">Demografía de escaneos</h3>
				<p className="text-xs text-default-400 mt-0.5">Distribución por país de origen</p>
			</div>

			{/* Map */}
			<div className="rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900/40">
				<MapChart data={data} />
			</div>

			{/* Country list below map */}
			<CountryList data={data} />
		</div>
	)
}

export default WorldMap
