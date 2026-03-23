'use client'

import { useTheme } from 'next-themes'
import { useState } from 'react'
import {
	ComposableMap,
	Geographies,
	Geography,
	ZoomableGroup,
} from 'react-simple-maps'

// ISO alpha-2 → ISO numeric (ISO 3166-1) used by world-atlas topojson
const ALPHA2_TO_NUMERIC: Record<string, number> = {
	AF: 4,
	AL: 8,
	DZ: 12,
	AS: 16,
	AD: 20,
	AO: 24,
	AG: 28,
	AR: 32,
	AM: 51,
	AU: 36,
	AT: 40,
	AZ: 31,
	BS: 44,
	BH: 48,
	BD: 50,
	BB: 52,
	BY: 112,
	BE: 56,
	BZ: 84,
	BJ: 204,
	BT: 64,
	BO: 68,
	BA: 70,
	BW: 72,
	BR: 76,
	BN: 96,
	BG: 100,
	BF: 854,
	BI: 108,
	CV: 132,
	KH: 116,
	CM: 120,
	CA: 124,
	CF: 140,
	TD: 148,
	CL: 152,
	CN: 156,
	CO: 170,
	KM: 174,
	CG: 178,
	CD: 180,
	CR: 188,
	CI: 384,
	HR: 191,
	CU: 192,
	CY: 196,
	CZ: 203,
	DK: 208,
	DJ: 262,
	DM: 212,
	DO: 214,
	EC: 218,
	EG: 818,
	SV: 222,
	GQ: 226,
	ER: 232,
	EE: 233,
	ET: 231,
	FJ: 242,
	FI: 246,
	FR: 250,
	GA: 266,
	GM: 270,
	GE: 268,
	DE: 276,
	GH: 288,
	GR: 300,
	GL: 304,
	GD: 308,
	GT: 320,
	GN: 324,
	GW: 624,
	GY: 328,
	HT: 332,
	VA: 336,
	HN: 340,
	HK: 344,
	HU: 348,
	IS: 352,
	IN: 356,
	ID: 360,
	IR: 364,
	IQ: 368,
	IE: 372,
	IL: 376,
	IT: 380,
	JM: 388,
	JP: 392,
	JO: 400,
	KZ: 398,
	KE: 404,
	KI: 296,
	KP: 408,
	KR: 410,
	KW: 414,
	KG: 417,
	LA: 418,
	LV: 428,
	LB: 422,
	LS: 426,
	LR: 430,
	LY: 434,
	LI: 438,
	LT: 440,
	LU: 442,
	MO: 446,
	MG: 450,
	MW: 454,
	MY: 458,
	MV: 462,
	ML: 466,
	MT: 470,
	MH: 584,
	MR: 478,
	MU: 480,
	MX: 484,
	FM: 583,
	MD: 498,
	MC: 492,
	MN: 496,
	ME: 499,
	MA: 504,
	MZ: 508,
	MM: 104,
	NA: 516,
	NR: 520,
	NP: 524,
	NL: 528,
	NZ: 554,
	NI: 558,
	NE: 562,
	NG: 566,
	MK: 807,
	NO: 578,
	OM: 512,
	PK: 586,
	PW: 585,
	PS: 275,
	PA: 591,
	PG: 598,
	PY: 600,
	PE: 604,
	PH: 608,
	PL: 616,
	PT: 620,
	PR: 630,
	QA: 634,
	RO: 642,
	RU: 643,
	RW: 646,
	KN: 659,
	LC: 662,
	VC: 670,
	WS: 882,
	SM: 674,
	ST: 678,
	SA: 682,
	SN: 686,
	RS: 688,
	SC: 690,
	SL: 694,
	SG: 702,
	SK: 703,
	SI: 705,
	SB: 90,
	SO: 706,
	ZA: 710,
	SS: 728,
	ES: 724,
	LK: 144,
	SD: 729,
	SR: 740,
	SZ: 748,
	SE: 752,
	CH: 756,
	SY: 760,
	TW: 158,
	TJ: 762,
	TZ: 834,
	TH: 764,
	TL: 626,
	TG: 768,
	TO: 776,
	TT: 780,
	TN: 788,
	TR: 792,
	TM: 795,
	TV: 798,
	UG: 800,
	UA: 804,
	AE: 784,
	GB: 826,
	US: 840,
	UY: 858,
	UZ: 860,
	VU: 548,
	VE: 862,
	VN: 704,
	YE: 887,
	ZM: 894,
	ZW: 716,
}

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

interface TooltipState {
	name: string
	scans: number
	x: number
	y: number
}

interface MapTranslations {
	unknown: string
	less: string
	more: string
	scans: string
}

interface Props {
	data: Record<string, number>
	translations: MapTranslations
}

// Build a numeric → scan count map
const buildNumericMap = (
	data: Record<string, number>,
): Record<number, number> =>
	Object.entries(data).reduce<Record<number, number>>(
		(acc, [alpha2, count]) => {
			const num = ALPHA2_TO_NUMERIC[alpha2]
			if (num !== undefined) acc[num] = count
			return acc
		},
		{},
	)

const getCountryName = (code: string): string => {
	try {
		return new Intl.DisplayNames(['es'], { type: 'region' }).of(code) ?? code
	} catch {
		return code
	}
}

// Blue gradient: no scans → light; many scans → deep blue
const getColor = (count: number, max: number, isDark: boolean): string => {
	if (count === 0) return isDark ? '#334155' : '#e2e8f0'
	const t = Math.min(count / max, 1)
	// interpolate from #bfdbfe (blue-200) → #1d4ed8 (blue-700)
	const r = Math.round(191 + (29 - 191) * t)
	const g = Math.round(219 + (78 - 219) * t)
	const b = Math.round(254 + (216 - 254) * t)
	return `rgb(${r},${g},${b})`
}

export default function WorldMapChart({ data, translations }: Props) {
	const [tooltip, setTooltip] = useState<TooltipState | null>(null)
	const { resolvedTheme } = useTheme()
	const isDark = resolvedTheme === 'dark'

	const numericMap = buildNumericMap(data)
	const max = Math.max(...Object.values(numericMap), 1)

	// Build alpha2 → name map for tooltip
	const alpha2ToName = Object.fromEntries(
		Object.keys(data).map((code) => [ALPHA2_TO_NUMERIC[code], code]),
	)

	return (
		<div className="relative w-full select-none">
			<ComposableMap
				projection="geoMercator"
				projectionConfig={{ scale: 120, center: [10, 20] }}
				style={{ width: '100%', height: '380px' }}
			>
				<ZoomableGroup>
					<Geographies geography={GEO_URL}>
						{({ geographies }) =>
							geographies.map((geo) => {
								const id = Number(geo.id)
								const count = numericMap[id] ?? 0
								const alpha2 = alpha2ToName[id]

								return (
									<Geography
										key={geo.rsmKey}
										geography={geo}
										fill={getColor(count, max, isDark)}
										stroke={isDark ? '#1e293b' : '#fff'}
										strokeWidth={0.4}
										style={{
											default: {
												outline: 'none',
												cursor: count > 0 ? 'pointer' : 'default',
											},
											hover: {
												outline: 'none',
												fill:
													count > 0
														? '#2563eb'
														: isDark
															? '#475569'
															: '#cbd5e1',
											},
											pressed: { outline: 'none' },
										}}
										onMouseEnter={(e) => {
											if (count === 0) return
											const name = alpha2
												? getCountryName(alpha2)
												: (geo.properties?.name ?? translations.unknown)
											setTooltip({
												name,
												scans: count,
												x: e.clientX,
												y: e.clientY,
											})
										}}
										onMouseMove={(e) => {
											if (tooltip)
												setTooltip((t) =>
													t ? { ...t, x: e.clientX, y: e.clientY } : null,
												)
										}}
										onMouseLeave={() => setTooltip(null)}
									/>
								)
							})
						}
					</Geographies>
				</ZoomableGroup>
			</ComposableMap>

			{tooltip && (
				<div
					className="fixed z-50 pointer-events-none px-3 py-2 rounded-lg bg-foreground text-background text-xs shadow-lg"
					style={{ left: tooltip.x + 12, top: tooltip.y - 36 }}
				>
					<span className="font-semibold">{tooltip.name}</span>
					<span className="ml-2 opacity-80">
						{tooltip.scans} {translations.scans}
					</span>
				</div>
			)}

			{/* Legend */}
			<div className="flex items-center gap-2 mt-2 justify-end">
				<span className="text-xs text-default-400">{translations.less}</span>
				<div className="flex h-2 w-24 rounded overflow-hidden">
					{[0.1, 0.3, 0.5, 0.7, 0.9].map((t) => (
						<div
							key={t}
							className="flex-1"
							style={{ background: getColor(t * max, max, isDark) }}
						/>
					))}
				</div>
				<span className="text-xs text-default-400">{translations.more}</span>
			</div>
		</div>
	)
}
