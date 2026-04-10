'use client'

import {
	Building04Icon,
	Calendar03Icon,
	Call02Icon,
	Copy01Icon,
	Download04Icon,
	GlobeIcon,
	Link01Icon,
	Location01Icon,
	Mail02Icon,
	SmartPhone01Icon,
	Tick02Icon,
	ViewIcon,
	ViewOffIcon,
	Wifi01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useState } from 'react'

// ─── Parsers ────────────────────────────────────────────────────────────────

function parseWifi(data: string) {
	const get = (key: string) => {
		const match = data.match(new RegExp(`${key}:([^;]*)`))
		return match?.[1] ?? ''
	}
	return {
		ssid: get('S'),
		password: get('P'),
		type: get('T'),
		hidden: get('H') === 'true',
	}
}

function parseVCard(data: string) {
	const get = (key: string) => {
		const match = data.match(new RegExp(`^${key}[^:]*:(.*)`, 'm'))
		return match?.[1]?.trim() ?? ''
	}
	return {
		name: get('FN'),
		phone: get('TEL'),
		email: get('EMAIL'),
		company: get('ORG'),
		website: get('URL'),
	}
}

function parseEvent(data: string) {
	const get = (key: string) => {
		const match = data.match(new RegExp(`^${key}:(.*)`, 'm'))
		return match?.[1]?.trim() ?? ''
	}
	const parseDate = (val: string) => {
		if (!val) return null
		try {
			// YYYYMMDDTHHMMSSZ or YYYYMMDD
			const clean = val.replace(/[TZ]/g, '')
			const y = clean.slice(0, 4)
			const mo = clean.slice(4, 6)
			const d = clean.slice(6, 8)
			const h = clean.slice(8, 10) || '00'
			const mi = clean.slice(10, 12) || '00'
			return new Date(`${y}-${mo}-${d}T${h}:${mi}:00`)
		} catch {
			return null
		}
	}
	return {
		title: get('SUMMARY'),
		start: parseDate(get('DTSTART')),
		end: parseDate(get('DTEND')),
		location: get('LOCATION'),
		description: get('DESCRIPTION'),
	}
}

function formatDate(date: Date | null) {
	if (!date) return ''
	return date.toLocaleString('es', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	})
}

// ─── Shared helpers ──────────────────────────────────────────────────────────

function CopyButton({ value, label }: { value: string; label?: string }) {
	const [copied, setCopied] = useState(false)
	const copy = async () => {
		await navigator.clipboard.writeText(value)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}
	return (
		<button
			type="button"
			onClick={copy}
			className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
		>
			<HugeiconsIcon icon={copied ? Tick02Icon : Copy01Icon} size={14} />
			{copied ? 'Copiado' : (label ?? 'Copiar')}
		</button>
	)
}

function ReadonlyField({
	label,
	value,
	icon,
	copyable = true,
	multiline = false,
}: {
	label: string
	value: string
	icon?: React.ReactNode
	copyable?: boolean
	multiline?: boolean
}) {
	if (!value) return null
	return (
		<div className="flex flex-col gap-1.5">
			<span className="text-xs text-default-400 flex items-center gap-1">
				{icon}
				{label}
			</span>
			<div className="flex items-start gap-2">
				<div className="flex-1 bg-content2 border border-divider rounded-xl px-3 py-2.5">
					{multiline ? (
						<p className="text-sm text-default-700 whitespace-pre-wrap break-all">
							{value}
						</p>
					) : (
						<p className="text-sm text-default-700 break-all">{value}</p>
					)}
				</div>
				{copyable && <CopyButton value={value} />}
			</div>
		</div>
	)
}

// ─── Type-specific views ─────────────────────────────────────────────────────

function TextView({ data }: { data: string }) {
	const [copied, setCopied] = useState(false)

	const copy = async () => {
		await navigator.clipboard.writeText(data)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="bg-content2 border border-divider rounded-xl p-4">
				<p className="text-sm text-default-700 whitespace-pre-wrap break-all">
					{data}
				</p>
			</div>
			<button
				type="button"
				onClick={copy}
				className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-colors"
			>
				<HugeiconsIcon
					icon={copied ? Tick02Icon : Copy01Icon}
					size={16}
				/>
				{copied ? '¡Copiado!' : 'Copiar texto'}
			</button>
		</div>
	)
}

function EmailView({ data }: { data: string }) {
	return (
		<div className="flex flex-col gap-4">
			<ReadonlyField
				label="Dirección de correo"
				value={data}
				icon={<HugeiconsIcon icon={Mail02Icon} size={12} />}
			/>
			<a
				href={`mailto:${data}`}
				className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-colors"
			>
				<HugeiconsIcon icon={Mail02Icon} size={16} />
				Enviar correo
			</a>
		</div>
	)
}

function PhoneView({ data }: { data: string }) {
	return (
		<div className="flex flex-col gap-4">
			<ReadonlyField
				label="Número de teléfono"
				value={data}
				icon={<HugeiconsIcon icon={SmartPhone01Icon} size={12} />}
			/>
			<a
				href={`tel:${data}`}
				className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-colors"
			>
				<HugeiconsIcon icon={Call02Icon} size={16} />
				Llamar
			</a>
		</div>
	)
}

function WifiView({ data }: { data: string }) {
	const { ssid, password, type } = parseWifi(data)
	const [showPassword, setShowPassword] = useState(false)

	return (
		<div className="flex flex-col gap-4">
			<ReadonlyField
				label="Red WiFi"
				value={ssid}
				icon={<HugeiconsIcon icon={Wifi01Icon} size={12} />}
			/>

			{type && (
				<div className="flex flex-col gap-1.5">
					<span className="text-xs text-default-400">Seguridad</span>
					<span className="text-sm text-default-700 font-medium">{type}</span>
				</div>
			)}

			{password && (
				<div className="flex flex-col gap-1.5">
					<span className="text-xs text-default-400">Contraseña</span>
					<div className="flex items-center gap-2">
						<div className="flex-1 flex items-center gap-2 bg-content2 border border-divider rounded-xl px-3 py-2.5">
							<p className="text-sm text-default-700 flex-1 break-all">
								{showPassword
									? password
									: '•'.repeat(Math.min(password.length, 20))}
							</p>
							<button
								type="button"
								onClick={() => setShowPassword((v) => !v)}
								className="text-default-400 hover:text-default-700 transition-colors shrink-0"
							>
								<HugeiconsIcon
									icon={showPassword ? ViewOffIcon : ViewIcon}
									size={16}
								/>
							</button>
						</div>
						<CopyButton value={password} label="Copiar clave" />
					</div>
				</div>
			)}
		</div>
	)
}

function VCardView({ data }: { data: string }) {
	const { name, phone, email, company, website } = parseVCard(data)

	const downloadVcf = () => {
		const blob = new Blob([data], { type: 'text/vcard' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = `${name || 'contacto'}.vcf`
		a.click()
		URL.revokeObjectURL(url)
	}

	return (
		<div className="flex flex-col gap-4">
			{name && (
				<div className="flex items-center gap-3 p-4 bg-content2 border border-divider rounded-xl">
					<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
						{name.charAt(0).toUpperCase()}
					</div>
					<div>
						<p className="font-semibold text-default-800">{name}</p>
						{company && (
							<p className="text-xs text-default-400 flex items-center gap-1 mt-0.5">
								<HugeiconsIcon icon={Building04Icon} size={11} />
								{company}
							</p>
						)}
					</div>
				</div>
			)}

			<div className="flex flex-col gap-3">
				{phone && (
					<ReadonlyField
						label="Teléfono"
						value={phone}
						icon={<HugeiconsIcon icon={SmartPhone01Icon} size={12} />}
					/>
				)}
				{email && (
					<ReadonlyField
						label="Correo"
						value={email}
						icon={<HugeiconsIcon icon={Mail02Icon} size={12} />}
					/>
				)}
				{website && (
					<ReadonlyField
						label="Sitio web"
						value={website}
						icon={<HugeiconsIcon icon={GlobeIcon} size={12} />}
					/>
				)}
			</div>

			<button
				type="button"
				onClick={downloadVcf}
				className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-colors"
			>
				<HugeiconsIcon icon={Download04Icon} size={16} />
				Agregar contacto
			</button>
		</div>
	)
}

function LocationView({ data }: { data: string }) {
	const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(data)}`

	return (
		<div className="flex flex-col gap-4">
			<ReadonlyField
				label="Dirección / Coordenadas"
				value={data}
				icon={<HugeiconsIcon icon={Location01Icon} size={12} />}
				multiline
			/>
			<a
				href={mapsUrl}
				target="_blank"
				rel="noopener noreferrer"
				className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-colors"
			>
				<HugeiconsIcon icon={Location01Icon} size={16} />
				Ver en Google Maps
			</a>
		</div>
	)
}

function EventView({ data }: { data: string }) {
	const { title, start, end, location, description } = parseEvent(data)

	const addToCalendar = () => {
		const blob = new Blob(
			[`BEGIN:VCALENDAR\nVERSION:2.0\n${data}\nEND:VCALENDAR`],
			{
				type: 'text/calendar',
			},
		)
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = `${title || 'evento'}.ics`
		a.click()
		URL.revokeObjectURL(url)
	}

	return (
		<div className="flex flex-col gap-4">
			{title && (
				<div className="p-4 bg-content2 border border-divider rounded-xl">
					<p className="font-semibold text-default-800 text-base">{title}</p>
				</div>
			)}

			<div className="flex flex-col gap-3">
				{start && (
					<div className="flex flex-col gap-1">
						<span className="text-xs text-default-400 flex items-center gap-1">
							<HugeiconsIcon icon={Calendar03Icon} size={12} />
							Inicio
						</span>
						<span className="text-sm text-default-700 capitalize">
							{formatDate(start)}
						</span>
					</div>
				)}
				{end && (
					<div className="flex flex-col gap-1">
						<span className="text-xs text-default-400 flex items-center gap-1">
							<HugeiconsIcon icon={Calendar03Icon} size={12} />
							Fin
						</span>
						<span className="text-sm text-default-700 capitalize">
							{formatDate(end)}
						</span>
					</div>
				)}
				{location && (
					<ReadonlyField
						label="Lugar"
						value={location}
						icon={<HugeiconsIcon icon={Location01Icon} size={12} />}
						copyable={false}
					/>
				)}
				{description && (
					<ReadonlyField
						label="Descripción"
						value={description}
						multiline
						copyable={false}
					/>
				)}
			</div>

			<button
				type="button"
				onClick={addToCalendar}
				className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-colors"
			>
				<HugeiconsIcon icon={Calendar03Icon} size={16} />
				Agregar al calendario
			</button>
		</div>
	)
}

// ─── QR type metadata ────────────────────────────────────────────────────────

const TYPE_META: Record<string, { label: string; icon: React.ReactNode }> = {
	text: {
		label: 'Texto',
		icon: (
			<HugeiconsIcon icon={Link01Icon} size={20} className="text-primary" />
		),
	},
	email: {
		label: 'Correo electrónico',
		icon: (
			<HugeiconsIcon icon={Mail02Icon} size={20} className="text-primary" />
		),
	},
	phone: {
		label: 'Teléfono',
		icon: (
			<HugeiconsIcon
				icon={SmartPhone01Icon}
				size={20}
				className="text-primary"
			/>
		),
	},
	wifi: {
		label: 'Red WiFi',
		icon: (
			<HugeiconsIcon icon={Wifi01Icon} size={20} className="text-primary" />
		),
	},
	vcard: {
		label: 'Contacto',
		icon: (
			<HugeiconsIcon
				icon={SmartPhone01Icon}
				size={20}
				className="text-primary"
			/>
		),
	},
	location: {
		label: 'Ubicación',
		icon: (
			<HugeiconsIcon icon={Location01Icon} size={20} className="text-primary" />
		),
	},
	event: {
		label: 'Evento',
		icon: (
			<HugeiconsIcon icon={Calendar03Icon} size={20} className="text-primary" />
		),
	},
}

// ─── Main export ─────────────────────────────────────────────────────────────

interface Props {
	name: string
	qrType: string
	data: string
}

export function QrViewContent({ name, qrType, data }: Props) {
	const meta = TYPE_META[qrType] ?? {
		label: 'Contenido',
		icon: (
			<HugeiconsIcon icon={Link01Icon} size={20} className="text-primary" />
		),
	}

	return (
		<div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-background to-content1">
			<div className="w-full max-w-sm flex flex-col gap-4">
				{/* Header card */}
				<div className="bg-content1 border border-divider rounded-2xl p-6 shadow-sm flex flex-col items-center gap-3 text-center">
					<div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
						{meta.icon}
					</div>
					<div>
						<p className="text-xs text-default-400 uppercase tracking-wide font-medium">
							{meta.label}
						</p>
						<h1 className="text-lg font-bold text-default-800 mt-0.5">
							{name}
						</h1>
					</div>
				</div>

				{/* Content card */}
				<div className="bg-content1 border border-divider rounded-2xl p-6 shadow-sm">
					{qrType === 'text' && <TextView data={data} />}
					{qrType === 'email' && <EmailView data={data} />}
					{qrType === 'phone' && <PhoneView data={data} />}
					{qrType === 'wifi' && <WifiView data={data} />}
					{qrType === 'vcard' && <VCardView data={data} />}
					{qrType === 'location' && <LocationView data={data} />}
					{qrType === 'event' && <EventView data={data} />}
				</div>
			</div>
		</div>
	)
}
