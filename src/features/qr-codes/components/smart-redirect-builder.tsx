'use client'

import { Add01Icon, Delete02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { type Control, useFieldArray } from 'react-hook-form'

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const DAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Top countries for the selector
const COUNTRY_OPTIONS = [
	{ code: 'US', name: 'United States' }, { code: 'MX', name: 'México' },
	{ code: 'CO', name: 'Colombia' }, { code: 'AR', name: 'Argentina' },
	{ code: 'ES', name: 'España' }, { code: 'BR', name: 'Brasil' },
	{ code: 'CL', name: 'Chile' }, { code: 'PE', name: 'Perú' },
	{ code: 'VE', name: 'Venezuela' }, { code: 'EC', name: 'Ecuador' },
	{ code: 'GT', name: 'Guatemala' }, { code: 'CR', name: 'Costa Rica' },
	{ code: 'DE', name: 'Germany' }, { code: 'FR', name: 'France' },
	{ code: 'GB', name: 'United Kingdom' }, { code: 'IT', name: 'Italy' },
	{ code: 'CA', name: 'Canada' }, { code: 'AU', name: 'Australia' },
	{ code: 'JP', name: 'Japan' }, { code: 'CN', name: 'China' },
]

interface Props {
	// biome-ignore lint/suspicious/noExplicitAny: react-hook-form control
	control: Control<any>
	locale?: 'es' | 'en'
	translations: {
		scheduleTitle: string
		scheduleDesc: string
		countryTitle: string
		countryDesc: string
		addRule: string
		url: string
		days: string
		from: string
		to: string
		countries: string
		noRules: string
	}
}

const inputCls = 'w-full p-2 border border-divider rounded-xl bg-content2 text-default-600 text-sm focus:outline-none focus:border-primary'

export function SmartRedirectBuilder({ control, locale = 'es', translations: t }: Props) {
	const dayLabels = locale === 'en' ? DAYS_EN : DAYS

	const schedule = useFieldArray({ control, name: 'schedule_rules' })
	const country = useFieldArray({ control, name: 'country_rules' })

	return (
		<div className="flex flex-col gap-5">
			{/* ── Schedule rules ── */}
			<div className="flex flex-col gap-3">
				<div>
					<p className="text-sm font-semibold text-default-700">{t.scheduleTitle}</p>
					<p className="text-xs text-default-400 mt-0.5">{t.scheduleDesc}</p>
				</div>

				{schedule.fields.length === 0 && (
					<p className="text-xs text-default-300 italic">{t.noRules}</p>
				)}

				{schedule.fields.map((field, idx) => (
					<div key={field.id} className="flex flex-col gap-2 p-3 border border-divider rounded-xl bg-content2">
						{/* Days */}
						<div className="flex flex-wrap gap-1.5">
							{dayLabels.map((d, di) => (
								<DayToggle
									key={d}
									label={d}
									dayIndex={di}
									control={control}
									name={`schedule_rules.${idx}.days`}
								/>
							))}
						</div>
						{/* From / To */}
						<div className="grid grid-cols-2 gap-2">
							<div>
								<label className="text-[10px] text-default-400 mb-1 block">{t.from}</label>
								<TimeInput control={control} name={`schedule_rules.${idx}.from`} />
							</div>
							<div>
								<label className="text-[10px] text-default-400 mb-1 block">{t.to}</label>
								<TimeInput control={control} name={`schedule_rules.${idx}.to`} />
							</div>
						</div>
						{/* URL */}
						<div>
							<label className="text-[10px] text-default-400 mb-1 block">{t.url}</label>
							<UrlInput control={control} name={`schedule_rules.${idx}.url`} />
						</div>
						<button
							type="button"
							onClick={() => schedule.remove(idx)}
							className="self-end flex items-center gap-1 text-xs text-danger hover:text-danger/70"
						>
							<HugeiconsIcon icon={Delete02Icon} size={13} />
						</button>
					</div>
				))}

				<button
					type="button"
					onClick={() => schedule.append({ days: [1, 2, 3, 4, 5], from: '09:00', to: '18:00', url: '' })}
					className="self-start flex items-center gap-1.5 text-xs text-primary hover:underline"
				>
					<HugeiconsIcon icon={Add01Icon} size={13} />
					{t.addRule}
				</button>
			</div>

			{/* ── Country rules ── */}
			<div className="flex flex-col gap-3">
				<div>
					<p className="text-sm font-semibold text-default-700">{t.countryTitle}</p>
					<p className="text-xs text-default-400 mt-0.5">{t.countryDesc}</p>
				</div>

				{country.fields.length === 0 && (
					<p className="text-xs text-default-300 italic">{t.noRules}</p>
				)}

				{country.fields.map((field, idx) => (
					<div key={field.id} className="flex flex-col gap-2 p-3 border border-divider rounded-xl bg-content2">
						<div>
							<label className="text-[10px] text-default-400 mb-1 block">{t.countries}</label>
							<CountrySelect control={control} name={`country_rules.${idx}.countries`} options={COUNTRY_OPTIONS} />
						</div>
						<div>
							<label className="text-[10px] text-default-400 mb-1 block">{t.url}</label>
							<UrlInput control={control} name={`country_rules.${idx}.url`} />
						</div>
						<button
							type="button"
							onClick={() => country.remove(idx)}
							className="self-end flex items-center gap-1 text-xs text-danger hover:text-danger/70"
						>
							<HugeiconsIcon icon={Delete02Icon} size={13} />
						</button>
					</div>
				))}

				<button
					type="button"
					onClick={() => country.append({ countries: [], url: '' })}
					className="self-start flex items-center gap-1.5 text-xs text-primary hover:underline"
				>
					<HugeiconsIcon icon={Add01Icon} size={13} />
					{t.addRule}
				</button>
			</div>
		</div>
	)
}

// ── Sub-components ──────────────────────────────────────────────────────────

function DayToggle({
	label,
	dayIndex,
	control,
	name,
}: {
	label: string
	dayIndex: number
	// biome-ignore lint/suspicious/noExplicitAny: react-hook-form
	control: Control<any>
	name: string
}) {
	const { field } = useControllerCompat(control, name)
	const selected: number[] = field.value ?? []
	const active = selected.includes(dayIndex)

	const toggle = () => {
		field.onChange(
			active ? selected.filter((d) => d !== dayIndex) : [...selected, dayIndex],
		)
	}

	return (
		<button
			type="button"
			onClick={toggle}
			className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
				active ? 'bg-primary text-white' : 'bg-default-100 text-default-500 hover:bg-default-200'
			}`}
		>
			{label}
		</button>
	)
}

// biome-ignore lint/suspicious/noExplicitAny: react-hook-form
function useControllerCompat(control: Control<any>, name: string) {
	const { useController } = require('react-hook-form')
	return useController({ control, name })
}

function TimeInput({ control, name }: { control: Control<any>; name: string }) {
	const { field } = useControllerCompat(control, name)
	return (
		<input
			{...field}
			type="time"
			className={inputCls}
		/>
	)
}

function UrlInput({ control, name }: { control: Control<any>; name: string }) {
	const { field } = useControllerCompat(control, name)
	return (
		<input
			{...field}
			type="url"
			placeholder="https://..."
			className={inputCls}
		/>
	)
}

function CountrySelect({
	control,
	name,
	options,
}: {
	control: Control<any>
	name: string
	options: { code: string; name: string }[]
}) {
	const { field } = useControllerCompat(control, name)
	const selected: string[] = field.value ?? []

	const toggle = (code: string) => {
		field.onChange(
			selected.includes(code)
				? selected.filter((c) => c !== code)
				: [...selected, code],
		)
	}

	return (
		<div className="flex flex-wrap gap-1.5">
			{options.map(({ code, name }) => (
				<button
					key={code}
					type="button"
					onClick={() => toggle(code)}
					title={name}
					className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
						selected.includes(code)
							? 'bg-primary text-white'
							: 'bg-default-100 text-default-500 hover:bg-default-200'
					}`}
				>
					{code}
				</button>
			))}
		</div>
	)
}
