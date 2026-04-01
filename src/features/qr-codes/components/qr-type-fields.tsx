'use client'

import { useEffect, useState } from 'react'

const inputClass =
	'w-full p-2.5 border border-divider rounded-xl bg-content2 text-default-600 text-sm focus:outline-none focus:border-primary'

const selectClass =
	'w-full p-2.5 border border-divider rounded-xl bg-content2 text-default-600 text-sm focus:outline-none focus:border-primary'

const labelClass = 'text-xs text-default-500 mb-1 block'

export interface WifiFieldTranslations {
	ssid: string
	password: string
	security: string
	securityWpa: string
	securityWep: string
	securityNone: string
}

export interface VCardFieldTranslations {
	firstName: string
	lastName: string
	phone: string
	email: string
	company: string
	website: string
}

export interface LocationFieldTranslations {
	latitude: string
	longitude: string
	hint: string
}

export interface EventFieldTranslations {
	title: string
	start: string
	end: string
	location: string
	description: string
}

function parseWifi(raw: string) {
	const t = raw.match(/T:([^;]*)/)?.[1] ?? 'WPA'
	const s = raw.match(/S:([^;]*)/)?.[1] ?? ''
	const p = raw.match(/P:([^;]*)/)?.[1] ?? ''
	return { security: t, ssid: s, password: p }
}

interface WifiFieldsProps {
	onDataChange: (value: string) => void
	initialValue?: string
	translations: WifiFieldTranslations
}

export const WifiFields = ({
	onDataChange,
	initialValue,
	translations: t,
}: WifiFieldsProps) => {
	const parsed = initialValue?.startsWith('WIFI:')
		? parseWifi(initialValue)
		: null
	const [ssid, setSsid] = useState(parsed?.ssid ?? '')
	const [password, setPassword] = useState(parsed?.password ?? '')
	const [security, setSecurity] = useState(parsed?.security ?? 'WPA')

	useEffect(() => {
		const composed = `WIFI:T:${security};S:${ssid};P:${password};;`
		onDataChange(composed)
	}, [ssid, password, security, onDataChange])

	return (
		<div className="flex flex-col gap-3">
			<div>
				<label className={labelClass}>{t.ssid}</label>
				<input
					className={inputClass}
					value={ssid}
					onChange={(e) => setSsid(e.target.value)}
					placeholder="MyNetwork"
				/>
			</div>
			<div>
				<label className={labelClass}>{t.password}</label>
				<input
					className={inputClass}
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="••••••••"
				/>
			</div>
			<div>
				<label className={labelClass}>{t.security}</label>
				<select
					className={selectClass}
					value={security}
					onChange={(e) => setSecurity(e.target.value)}
				>
					<option value="WPA">{t.securityWpa}</option>
					<option value="WEP">{t.securityWep}</option>
					<option value="nopass">{t.securityNone}</option>
				</select>
			</div>
		</div>
	)
}

function parseVCard(raw: string) {
	const get = (key: string) =>
		raw.match(new RegExp(`${key}:([^\r\n]*)`))?.[1]?.trim() ?? ''
	const fn = get('FN')
	const parts = fn.split(' ')
	return {
		firstName: parts[0] ?? '',
		lastName: parts.slice(1).join(' '),
		phone: get('TEL'),
		email: get('EMAIL'),
		company: get('ORG'),
		website: get('URL'),
	}
}

interface VCardFieldsProps {
	onDataChange: (value: string) => void
	initialValue?: string
	translations: VCardFieldTranslations
}

export const VCardFields = ({
	onDataChange,
	initialValue,
	translations: t,
}: VCardFieldsProps) => {
	const parsed = initialValue?.includes('BEGIN:VCARD')
		? parseVCard(initialValue)
		: null
	const [firstName, setFirstName] = useState(parsed?.firstName ?? '')
	const [lastName, setLastName] = useState(parsed?.lastName ?? '')
	const [phone, setPhone] = useState(parsed?.phone ?? '')
	const [email, setEmail] = useState(parsed?.email ?? '')
	const [company, setCompany] = useState(parsed?.company ?? '')
	const [website, setWebsite] = useState(parsed?.website ?? '')

	useEffect(() => {
		const lines = [
			'BEGIN:VCARD',
			'VERSION:3.0',
			`FN:${firstName} ${lastName}`.trim(),
			phone ? `TEL:${phone}` : '',
			email ? `EMAIL:${email}` : '',
			company ? `ORG:${company}` : '',
			website ? `URL:${website}` : '',
			'END:VCARD',
		].filter(Boolean)
		onDataChange(lines.join('\n'))
	}, [firstName, lastName, phone, email, company, website, onDataChange])

	return (
		<div className="flex flex-col gap-3">
			<div className="grid grid-cols-2 gap-3">
				<div>
					<label className={labelClass}>{t.firstName}</label>
					<input
						className={inputClass}
						value={firstName}
						onChange={(e) => setFirstName(e.target.value)}
						placeholder="Juan"
					/>
				</div>
				<div>
					<label className={labelClass}>{t.lastName}</label>
					<input
						className={inputClass}
						value={lastName}
						onChange={(e) => setLastName(e.target.value)}
						placeholder="Pérez"
					/>
				</div>
			</div>
			<div>
				<label className={labelClass}>{t.phone}</label>
				<input
					className={inputClass}
					value={phone}
					onChange={(e) => setPhone(e.target.value)}
					placeholder="+57 300 000 0000"
				/>
			</div>
			<div>
				<label className={labelClass}>{t.email}</label>
				<input
					className={inputClass}
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="juan@empresa.com"
				/>
			</div>
			<div>
				<label className={labelClass}>{t.company}</label>
				<input
					className={inputClass}
					value={company}
					onChange={(e) => setCompany(e.target.value)}
					placeholder="Empresa S.A."
				/>
			</div>
			<div>
				<label className={labelClass}>{t.website}</label>
				<input
					className={inputClass}
					value={website}
					onChange={(e) => setWebsite(e.target.value)}
					placeholder="https://empresa.com"
				/>
			</div>
		</div>
	)
}

function parseLocation(raw: string) {
	const coords = raw.replace('geo:', '').split(',')
	return { lat: coords[0] ?? '', lng: coords[1] ?? '' }
}

interface LocationFieldsProps {
	onDataChange: (value: string) => void
	initialValue?: string
	translations: LocationFieldTranslations
}

export const LocationFields = ({
	onDataChange,
	initialValue,
	translations: t,
}: LocationFieldsProps) => {
	const parsed = initialValue?.startsWith('geo:')
		? parseLocation(initialValue)
		: null
	const [lat, setLat] = useState(parsed?.lat ?? '')
	const [lng, setLng] = useState(parsed?.lng ?? '')

	useEffect(() => {
		if (lat && lng) onDataChange(`geo:${lat},${lng}`)
	}, [lat, lng, onDataChange])

	return (
		<div className="flex flex-col gap-3">
			<div className="grid grid-cols-2 gap-3">
				<div>
					<label className={labelClass}>{t.latitude}</label>
					<input
						className={inputClass}
						value={lat}
						onChange={(e) => setLat(e.target.value)}
						placeholder="4.7110"
					/>
				</div>
				<div>
					<label className={labelClass}>{t.longitude}</label>
					<input
						className={inputClass}
						value={lng}
						onChange={(e) => setLng(e.target.value)}
						placeholder="-74.0721"
					/>
				</div>
			</div>
			<p className="text-xs text-default-400">{t.hint}</p>
		</div>
	)
}

function toICalDate(dt: string) {
	return dt.replace(/[-:]/g, '').replace('T', 'T').slice(0, 15) + 'Z'
}

function fromICalDate(dt: string) {
	if (!dt || dt.length < 8) return ''
	const d = dt.replace('Z', '')
	const date = `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`
	const time =
		d.length >= 13 ? `T${d.slice(9, 11)}:${d.slice(11, 13)}` : 'T00:00'
	return `${date}${time}`
}

function parseEvent(raw: string) {
	const get = (key: string) =>
		raw.match(new RegExp(`${key}:([^\r\n]*)`))?.[1]?.trim() ?? ''
	return {
		title: get('SUMMARY'),
		start: fromICalDate(get('DTSTART')),
		end: fromICalDate(get('DTEND')),
		location: get('LOCATION'),
		description: get('DESCRIPTION'),
	}
}

interface EventFieldsProps {
	onDataChange: (value: string) => void
	initialValue?: string
	translations: EventFieldTranslations
}

export const EventFields = ({
	onDataChange,
	initialValue,
	translations: t,
}: EventFieldsProps) => {
	const parsed = initialValue?.includes('BEGIN:VEVENT')
		? parseEvent(initialValue)
		: null
	const [title, setTitle] = useState(parsed?.title ?? '')
	const [start, setStart] = useState(parsed?.start ?? '')
	const [end, setEnd] = useState(parsed?.end ?? '')
	const [location, setLocation] = useState(parsed?.location ?? '')
	const [description, setDescription] = useState(parsed?.description ?? '')

	useEffect(() => {
		const lines = [
			'BEGIN:VEVENT',
			`SUMMARY:${title}`,
			start ? `DTSTART:${toICalDate(start)}` : '',
			end ? `DTEND:${toICalDate(end)}` : '',
			location ? `LOCATION:${location}` : '',
			description ? `DESCRIPTION:${description}` : '',
			'END:VEVENT',
		].filter(Boolean)
		onDataChange(lines.join('\n'))
	}, [title, start, end, location, description, onDataChange])

	return (
		<div className="flex flex-col gap-3">
			<div>
				<label className={labelClass}>{t.title}</label>
				<input
					className={inputClass}
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder="My Event"
				/>
			</div>
			<div className="grid grid-cols-2 gap-3">
				<div>
					<label className={labelClass}>{t.start}</label>
					<input
						className={inputClass}
						type="datetime-local"
						value={start}
						onChange={(e) => setStart(e.target.value)}
					/>
				</div>
				<div>
					<label className={labelClass}>{t.end}</label>
					<input
						className={inputClass}
						type="datetime-local"
						value={end}
						onChange={(e) => setEnd(e.target.value)}
					/>
				</div>
			</div>
			<div>
				<label className={labelClass}>{t.location}</label>
				<input
					className={inputClass}
					value={location}
					onChange={(e) => setLocation(e.target.value)}
					placeholder="Bogotá, Colombia"
				/>
			</div>
			<div>
				<label className={labelClass}>{t.description}</label>
				<input
					className={inputClass}
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					placeholder="..."
				/>
			</div>
		</div>
	)
}
