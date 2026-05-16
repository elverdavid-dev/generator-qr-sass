'use client'

import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { Tooltip, useDisclosure } from '@heroui/react'
import { cn } from '@heroui/theme'
import { zodResolver } from '@hookform/resolvers/zod'
import {
	ArrowLeft02Icon,
	Calendar03Icon,
	CreditCardIcon,
	Crown02Icon,
	FloppyDiskIcon,
	GlobeIcon,
	ImageUploadIcon,
	InformationCircleIcon,
	LinkSquare01Icon,
	ListViewIcon,
	Location01Icon,
	LockPasswordIcon,
	Mail02Icon,
	Message01Icon,
	SmartPhone01Icon,
	SmartPhone02Icon,
	Timer02Icon,
	UserIcon,
	Wifi01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import type { Resolver } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import QrPreview from '@/features/qr-codes/components/qr-preview'
import { SmartRedirectBuilder } from '@/features/qr-codes/components/smart-redirect-builder'
import {
	createQrSchema,
	type QrFormData,
} from '@/features/qr-codes/schemas/qr-schema'
import { createQr } from '@/features/qr-codes/services/mutations/create-qr'
import { usePlan } from '@/shared/context/plan-context'
import type { Folder, QrTemplate } from '@/shared/types/database.types'
import {
	EventFields,
	LocationFields,
	VCardFields,
	WifiFields,
} from './qr-type-fields'

const TemplateSelector = dynamic(() => import('./template-selector'))
const SaveTemplateModal = dynamic(() => import('./save-template-modal'))

export interface QrFormTranslations {
	qrType: string
	name: string
	namePlaceholder: string
	content: string
	dotStyle: string
	outerCorners: string
	innerCorners: string
	colors: string
	background: string
	qrColor: string
	colorGradient: string
	enableGradient: string
	color2: string
	gradientType: string
	linear: string
	radial: string
	logo: string
	changeLogo: string
	uploadLogo: string
	folder: string
	noFolder: string
	protection: string
	password: string
	passwordPlaceholder: string
	expiry: string
	maxScans: string
	maxScansPlaceholder: string
	deviceRedirect: string
	deviceRedirectDesc: string
	iosUrl: string
	androidUrl: string
	smartRedirect: string
	smartRedirectDesc: string
	smartRedirectTranslations: {
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
	cancel: string
	submit: string
	preview: string
	noName: string
	customSlug: string
	customSlugPlaceholder: string
	customSlugDesc: string
	utm: string
	utmSource: string
	utmMedium: string
	utmCampaign: string
	utmTerm: string
	utmContent: string
	created: string
	dot: {
		square: string
		dots: string
		rounded: string
		classic: string
		classicR: string
		extraR: string
	}
	corner: { square: string; circle: string }
	types: {
		url: string
		text: string
		email: string
		phone: string
		wifi: string
		contact: string
		location: string
		event: string
		payment: string
		app: string
	}
	templates: {
		title: string
		empty: string
		apply: string
		delete: string
		deleted: string
		upgradeRequired: string
		saveAs: string
		saveTitle: string
		namePlaceholder: string
		save: string
		saved: string
	}
	hints: {
		gradient: string
		logo: string
		customSlug: string
		utm: string
		password: string
		expiry: string
		maxScans: string
	}
	fields: {
		wifi: {
			ssid: string
			password: string
			security: string
			securityWpa: string
			securityWep: string
			securityNone: string
		}
		vcard: {
			firstName: string
			lastName: string
			phone: string
			email: string
			company: string
			website: string
		}
		location: {
			latitude: string
			longitude: string
			hint: string
		}
		event: {
			title: string
			start: string
			end: string
			location: string
			description: string
		}
	}
	validation: {
		nameRequired: string
		contentRequired: string
		slugPattern: string
		slugMin: string
		slugMax: string
		frameScanMe: string
	}
}

interface Props {
	folders: Folder[]
	translations: QrFormTranslations
	templates?: QrTemplate[]
}

const QrForm = ({ folders, translations, templates = [] }: Props) => {
	const router = useRouter()
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [logoPreview, setLogoPreview] = useState<string | null>(null)
	const { hasFeature } = usePlan()
	const canCustomSlug = hasFeature('customSlug')
	const canTemplates = hasFeature('templates')
	const saveTemplateDisc = useDisclosure()

	const QR_TYPES = [
		{
			id: 'url',
			name: translations.types.url,
			icon: GlobeIcon,
			color: 'bg-blue-500',
			placeholder: 'https://example.com',
		},
		{
			id: 'text',
			name: translations.types.text,
			icon: Message01Icon,
			color: 'bg-green-500',
			placeholder: 'Write your message...',
		},
		{
			id: 'email',
			name: translations.types.email,
			icon: Mail02Icon,
			color: 'bg-purple-500',
			placeholder: 'email@example.com',
		},
		{
			id: 'phone',
			name: translations.types.phone,
			icon: SmartPhone01Icon,
			color: 'bg-orange-500',
			placeholder: '+1234567890',
		},
		{
			id: 'wifi',
			name: translations.types.wifi,
			icon: Wifi01Icon,
			color: 'bg-indigo-500',
			placeholder: 'WIFI:T:WPA;S:NetworkName;P:password;;',
		},
		{
			id: 'vcard',
			name: translations.types.contact,
			icon: UserIcon,
			color: 'bg-pink-500',
			placeholder: 'BEGIN:VCARD\nVERSION:3.0\nFN:Name\nEND:VCARD',
		},
		{
			id: 'location',
			name: translations.types.location,
			icon: Location01Icon,
			color: 'bg-red-500',
			placeholder: 'geo:40.7128,-74.0060',
		},
		{
			id: 'event',
			name: translations.types.event,
			icon: Calendar03Icon,
			color: 'bg-yellow-500',
			placeholder: 'BEGIN:VEVENT\nSUMMARY:My Event\nEND:VEVENT',
		},
		{
			id: 'payment',
			name: translations.types.payment,
			icon: CreditCardIcon,
			color: 'bg-gray-500',
			placeholder: 'https://payment.example.com',
		},
		{
			id: 'app',
			name: translations.types.app,
			icon: SmartPhone02Icon,
			color: 'bg-sky-500',
			placeholder: 'https://myapp.com',
		},
	]

	const DOT_STYLES = [
		{ id: 'square', name: translations.dot.square },
		{ id: 'dots', name: translations.dot.dots },
		{ id: 'rounded', name: translations.dot.rounded },
		{ id: 'classy', name: translations.dot.classic },
		{ id: 'classy-rounded', name: translations.dot.classicR },
		{ id: 'extra-rounded', name: translations.dot.extraR },
	]

	const CORNER_SQUARE_STYLES = [
		{ id: 'square', name: translations.corner.square },
		{ id: 'dot', name: translations.corner.circle },
		{ id: 'extra-rounded', name: translations.dot.rounded },
	]

	const CORNER_DOT_STYLES = [
		{ id: 'square', name: translations.corner.square },
		{ id: 'dot', name: translations.corner.circle },
	]

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		control,
		formState: { errors, isSubmitting },
	} = useForm<QrFormData>({
		resolver: zodResolver(
			createQrSchema(translations.validation),
		) as Resolver<QrFormData>,
		defaultValues: {
			qr_type: 'url',
			bg_color: '#ffffff',
			fg_color: '#000000',
			dot_style: 'square',
			corner_square_style: 'square',
			corner_dot_style: 'square',
			dot_gradient_type: 'linear',
		},
	})

	const [
		watchedType,
		watchedData,
		watchedBg,
		watchedFg,
		watchedDotStyle,
		watchedCornerSquare,
		watchedCornerDot,
		watchedName,
		watchedDotColor2,
		watchedGradientType,
	] = watch([
		'qr_type',
		'data',
		'bg_color',
		'fg_color',
		'dot_style',
		'corner_square_style',
		'corner_dot_style',
		'name',
		'dot_color_2',
		'dot_gradient_type',
	])

	const selectedType = QR_TYPES.find((t) => t.id === watchedType) ?? QR_TYPES[0]
	const qrValue = watchedData || watchedName || 'preview'
	const hasGradient = !!watchedDotColor2


	const onSubmit = async (data: QrFormData) => {
		const { logo, ...restData } = data
		const result = await createQr(restData, logo)
		if (result.error) {
			toast.error(result.error)
			return
		}
		toast.success(translations.created)
		router.push('/dashboard/qrs')
	}

	const handleApplyTemplate = (t: QrTemplate) => {
		setValue('fg_color', t.fg_color)
		setValue('bg_color', t.bg_color)
		setValue('dot_style', t.dot_style)
		setValue('corner_square_style', t.corner_square_style)
		setValue('corner_dot_style', t.corner_dot_style)
		setValue('dot_color_2', t.dot_color_2 ?? null)
		setValue('dot_gradient_type', t.dot_gradient_type as 'linear' | 'radial')
	}

	const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return
		if (file.size > 2 * 1024 * 1024) {
			toast.error('La imagen no puede superar los 2MB')
			e.target.value = ''
			return
		}
		setValue('logo', file)
		const url = URL.createObjectURL(file)
		setLogoPreview(url)
	}

	const styleButtonClass = (active: boolean) =>
		cn(
			'p-2.5 rounded-xl border text-xs font-medium transition-all',
			active
				? 'border-primary bg-primary/5 text-primary'
				: 'border-divider bg-content1 text-default-600 hover:border-default-400',
		)

	const InfoTooltip = ({ content }: { content: string }) => (
		<Tooltip
			content={content}
			placement="right"
			classNames={{ content: 'max-w-56 text-xs' }}
		>
			<span className="cursor-help inline-flex text-default-400 hover:text-default-600 transition-colors">
				<HugeiconsIcon icon={InformationCircleIcon} size={14} />
			</span>
		</Tooltip>
	)

	const sectionTitle = (text: string, hint?: string) => (
		<div className="flex items-center gap-1.5 mb-3">
			<h2 className="font-semibold text-default-700">{text}</h2>
			{hint && <InfoTooltip content={hint} />}
		</div>
	)

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)} className="flex gap-8">
				{/* Left: Config panel */}
				<div className="flex-1 flex flex-col gap-6 min-w-0">
					{/* Mobile-only preview */}
					<div className="md:hidden rounded-2xl overflow-hidden border border-divider shadow-sm">
						<div className="relative bg-zinc-950 flex flex-col items-center py-6 px-4">
							<div className="absolute inset-0 pointer-events-none" aria-hidden="true">
								<div
									className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full blur-3xl opacity-25"
									style={{ backgroundColor: watchedFg ?? '#6366f1' }}
								/>
							</div>
							{/* Live badge */}
							<div className="absolute top-3 right-3 flex items-center gap-1.5 bg-zinc-800/80 backdrop-blur-sm rounded-full px-2.5 py-1">
								<span className="relative flex h-1.5 w-1.5">
									<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
									<span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
								</span>
								<span className="text-[10px] font-medium text-emerald-400">Live</span>
							</div>
							<div className="relative z-10 bg-white rounded-xl p-2.5 shadow-2xl ring-1 ring-black/5">
								<QrPreview
									value={qrValue}
									size={150}
									fgColor={watchedFg ?? '#000000'}
									bgColor={watchedBg ?? '#ffffff'}
									dotStyle={watchedDotStyle ?? 'square'}
									cornerSquareStyle={watchedCornerSquare ?? 'square'}
									cornerDotStyle={watchedCornerDot ?? 'square'}
									dotColor2={watchedDotColor2}
									dotGradientType={watchedGradientType ?? 'linear'}
									logoUrl={logoPreview}
								/>
							</div>
						</div>
						<div className="bg-content1 px-4 py-3 flex items-center gap-2.5 border-t border-divider">
							<div className={cn('w-7 h-7 rounded-lg flex items-center justify-center shrink-0', selectedType.color)}>
								<HugeiconsIcon icon={selectedType.icon} size={14} className="text-white" />
							</div>
							<div className="min-w-0">
								<p className="font-semibold text-sm truncate leading-tight">
									{watchedName || translations.noName}
								</p>
								<p className="text-xs text-default-400 truncate leading-tight">
									{watchedData || selectedType.name}
								</p>
							</div>
						</div>
					</div>
					{/* Templates */}
					<TemplateSelector
						templates={templates}
						onApply={handleApplyTemplate}
						translations={translations.templates}
					/>

					{/* QR Type */}
					<div>
						{sectionTitle(translations.qrType)}
						<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
							{QR_TYPES.map((type) => (
								<button
									key={type.id}
									type="button"
									onClick={() => setValue('qr_type', type.id)}
									className={cn(
										'flex items-center gap-2 p-3 rounded-xl border text-left transition-all text-sm',
										watchedType === type.id
											? 'border-primary bg-primary/5 text-primary'
											: 'border-divider bg-content1 text-default-600 hover:border-default-400',
									)}
								>
									<span
										className={cn(
											'p-1.5 rounded-lg text-white flex-shrink-0',
											type.color,
										)}
									>
										<HugeiconsIcon icon={type.icon} size={14} />
									</span>
									{type.name}
								</button>
							))}
						</div>
					</div>

					{/* Name */}
					<div>
						{sectionTitle(translations.name)}
						<Input
							{...register('name')}
							placeholder={translations.namePlaceholder}
							isInvalid={!!errors.name}
							errorMessage={errors.name?.message}
							variant="bordered"
						/>
					</div>

					{/* Custom slug (Pro+) */}
					<div>
						<div className="flex items-center justify-between mb-1">
							<label
								htmlFor="custom_slug"
								className="flex items-center gap-1.5 text-sm font-medium text-default-700"
							>
								<HugeiconsIcon icon={LinkSquare01Icon} size={14} />
								{translations.customSlug}
								<InfoTooltip content={translations.hints.customSlug} />
							</label>
							{!canCustomSlug && (
								<span className="flex items-center gap-1 text-xs text-primary font-medium">
									<HugeiconsIcon icon={Crown02Icon} size={12} />
									Pro
								</span>
							)}
						</div>
						<Input
							{...register('custom_slug')}
							id="custom_slug"
							placeholder={translations.customSlugPlaceholder}
							isDisabled={!canCustomSlug}
							isInvalid={!!errors.custom_slug}
							errorMessage={errors.custom_slug?.message}
							variant="bordered"
							description={
								canCustomSlug ? translations.customSlugDesc : undefined
							}
							startContent={
								<span className="text-xs text-default-400 shrink-0">qr/</span>
							}
						/>
					</div>

					{/* Content */}
					<div>
						{sectionTitle(translations.content)}
						{watchedType === 'wifi' ? (
							<WifiFields
								onDataChange={(v) => setValue('data', v)}
								translations={translations.fields.wifi}
							/>
						) : watchedType === 'vcard' ? (
							<VCardFields
								onDataChange={(v) => setValue('data', v)}
								translations={translations.fields.vcard}
							/>
						) : watchedType === 'location' ? (
							<LocationFields
								onDataChange={(v) => setValue('data', v)}
								translations={translations.fields.location}
							/>
						) : watchedType === 'event' ? (
							<EventFields
								onDataChange={(v) => setValue('data', v)}
								translations={translations.fields.event}
							/>
						) : (
							<Input
								{...register('data')}
								placeholder={selectedType.placeholder}
								isInvalid={!!errors.data}
								errorMessage={errors.data?.message}
								variant="bordered"
							/>
						)}
					</div>

					{/* Dot style */}
					<div>
						{sectionTitle(translations.dotStyle)}
						<div className="grid grid-cols-3 gap-2">
							{DOT_STYLES.map((style) => (
								<button
									key={style.id}
									type="button"
									onClick={() => setValue('dot_style', style.id)}
									className={styleButtonClass(watchedDotStyle === style.id)}
								>
									{style.name}
								</button>
							))}
						</div>
					</div>

					{/* Corner square style */}
					<div>
						{sectionTitle(translations.outerCorners)}
						<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
							{CORNER_SQUARE_STYLES.map((style) => (
								<button
									key={style.id}
									type="button"
									onClick={() => setValue('corner_square_style', style.id)}
									className={styleButtonClass(watchedCornerSquare === style.id)}
								>
									{style.name}
								</button>
							))}
						</div>
					</div>

					{/* Corner dot style */}
					<div>
						{sectionTitle(translations.innerCorners)}
						<div className="grid grid-cols-2 gap-2">
							{CORNER_DOT_STYLES.map((style) => (
								<button
									key={style.id}
									type="button"
									onClick={() => setValue('corner_dot_style', style.id)}
									className={styleButtonClass(watchedCornerDot === style.id)}
								>
									{style.name}
								</button>
							))}
						</div>
					</div>

					{/* Colors */}
					<div>
						{sectionTitle(translations.colors)}
						<div className="grid grid-cols-2 gap-3">
							<div className="flex flex-col gap-1">
								<label htmlFor="bg_color" className="text-xs text-default-500">
									{translations.background}
								</label>
								<div className="flex items-center gap-2 p-2 border border-divider rounded-xl bg-content1">
									<input
										type="color"
										id="bg_color"
										{...register('bg_color')}
										className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
									/>
									<span className="text-sm font-mono text-default-600">
										{watchedBg}
									</span>
								</div>
							</div>
							<div className="flex flex-col gap-1">
								<label htmlFor="fg_color" className="text-xs text-default-500">
									{translations.qrColor}
								</label>
								<div className="flex items-center gap-2 p-2 border border-divider rounded-xl bg-content1">
									<input
										type="color"
										id="fg_color"
										{...register('fg_color')}
										className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
									/>
									<span className="text-sm font-mono text-default-600">
										{watchedFg}
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Gradient */}
					<div>
						{sectionTitle(
							translations.colorGradient,
							translations.hints.gradient,
						)}
						<div className="flex flex-col gap-3">
							<div className="flex items-center justify-between p-3 bg-content1 border border-divider rounded-xl">
								<span className="text-sm text-default-600">
									{translations.enableGradient}
								</span>
								<div
									role="switch"
									aria-checked={hasGradient}
									tabIndex={0}
									onClick={() =>
										setValue('dot_color_2', hasGradient ? null : '#ff6600')
									}
									onKeyDown={(e) => {
										if (e.key === 'Enter' || e.key === ' ')
											setValue('dot_color_2', hasGradient ? null : '#ff6600')
									}}
									className={cn(
										'relative w-10 h-6 rounded-full transition-colors cursor-pointer select-none',
										hasGradient ? 'bg-primary' : 'bg-default-300',
									)}
								>
									<span
										className={cn(
											'absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform',
											hasGradient ? 'translate-x-5' : 'translate-x-1',
										)}
									/>
								</div>
							</div>
							{hasGradient && (
								<div className="flex gap-3 items-end">
									<div className="flex flex-col gap-1">
										<label
											htmlFor="dot_color_2"
											className="text-xs text-default-500"
										>
											{translations.color2}
										</label>
										<div className="flex items-center gap-2 p-2 border border-divider rounded-xl bg-content1">
											<input
												type="color"
												id="dot_color_2"
												{...register('dot_color_2')}
												className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
											/>
											<span className="text-sm font-mono text-default-600">
												{watchedDotColor2}
											</span>
										</div>
									</div>
									<div className="flex flex-col gap-1 flex-1">
										<span className="text-xs text-default-500">
											{translations.gradientType}
										</span>
										<div className="grid grid-cols-2 gap-2">
											<button
												type="button"
												onClick={() => setValue('dot_gradient_type', 'linear')}
												className={styleButtonClass(
													watchedGradientType === 'linear',
												)}
											>
												{translations.linear}
											</button>
											<button
												type="button"
												onClick={() => setValue('dot_gradient_type', 'radial')}
												className={styleButtonClass(
													watchedGradientType === 'radial',
												)}
											>
												{translations.radial}
											</button>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>

					{/* Logo */}
					<div>
						{sectionTitle(translations.logo, translations.hints.logo)}
						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							onChange={handleLogoChange}
							className="hidden"
						/>
						<button
							type="button"
							onClick={() => fileInputRef.current?.click()}
							className="flex items-center gap-3 w-full p-4 border-2 border-dashed border-divider rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-default-500 hover:text-primary"
						>
							{logoPreview ? (
								<>
									<img
										src={logoPreview}
										alt="Logo"
										className="w-8 h-8 object-contain rounded"
									/>
									<span className="text-sm">{translations.changeLogo}</span>
								</>
							) : (
								<>
									<HugeiconsIcon icon={ImageUploadIcon} size={20} />
									<span className="text-sm">{translations.uploadLogo}</span>
								</>
							)}
						</button>
					</div>

					{/* Folder */}
					{folders.length > 0 && (
						<div>
							{sectionTitle(translations.folder)}
							<select
								{...register('folder_id')}
								className="w-full p-2.5 border border-divider rounded-xl bg-content1 text-default-600 text-sm focus:outline-none focus:border-primary"
							>
								<option value="">{translations.noFolder}</option>
								{folders.map((folder) => (
									<option key={folder.id} value={folder.id}>
										{folder.name}
									</option>
								))}
							</select>
						</div>
					)}

					{/* Protection & limits */}
					<div className="bg-content1 border border-divider rounded-2xl p-4 flex flex-col gap-4">
						<div className="flex items-center gap-2 text-default-600">
							<HugeiconsIcon icon={LockPasswordIcon} size={16} />
							<span className="font-semibold text-sm">
								{translations.protection}
							</span>
						</div>
						<div className="grid grid-cols-1 gap-3">
							<div>
								<label
									htmlFor="password"
									className="flex items-center gap-1 text-xs text-default-500 mb-1"
								>
									<HugeiconsIcon icon={LockPasswordIcon} size={12} />
									{translations.password}
									<InfoTooltip content={translations.hints.password} />
								</label>
								<input
									id="password"
									{...register('password')}
									type="text"
									placeholder={translations.passwordPlaceholder}
									className="w-full p-2.5 border border-divider rounded-xl bg-content2 text-default-600 text-sm focus:outline-none focus:border-primary"
								/>
							</div>
							<div className="grid grid-cols-2 gap-3">
								<div>
									<label
										htmlFor="expires_at"
										className="flex items-center gap-1 text-xs text-default-500 mb-1"
									>
										<HugeiconsIcon icon={Calendar03Icon} size={12} />
										{translations.expiry}
										<InfoTooltip content={translations.hints.expiry} />
									</label>
									<input
										id="expires_at"
										{...register('expires_at')}
										type="datetime-local"
										className="w-full p-2.5 border border-divider rounded-xl bg-content2 text-default-600 text-sm focus:outline-none focus:border-primary"
									/>
								</div>
								<div>
									<label
										htmlFor="max_scans"
										className="flex items-center gap-1 text-xs text-default-500 mb-1"
									>
										<HugeiconsIcon icon={ListViewIcon} size={12} />
										{translations.maxScans}
										<InfoTooltip content={translations.hints.maxScans} />
									</label>
									<input
										id="max_scans"
										{...register('max_scans')}
										type="number"
										min={1}
										placeholder={translations.maxScansPlaceholder}
										className="w-full p-2.5 border border-divider rounded-xl bg-content2 text-default-600 text-sm focus:outline-none focus:border-primary"
									/>
								</div>
							</div>
						</div>
					</div>

					{/* UTM Parameters (Pro+) — only for URL types */}
					{(watchedType === 'url' || watchedType === 'payment') && (
						<div className="bg-content1 border border-divider rounded-2xl p-4 flex flex-col gap-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2 text-default-600">
									<HugeiconsIcon icon={LinkSquare01Icon} size={16} />
									<span className="font-semibold text-sm">
										{translations.utm}
									</span>
									<InfoTooltip content={translations.hints.utm} />
								</div>
								{!hasFeature('utmParams') && (
									<span className="flex items-center gap-1 text-xs text-primary font-medium">
										<HugeiconsIcon icon={Crown02Icon} size={12} />
										Pro
									</span>
								)}
							</div>
							<div className="grid grid-cols-2 gap-3">
								{[
									{
										field: 'utm_source',
										label: translations.utmSource,
										placeholder: 'google',
									},
									{
										field: 'utm_medium',
										label: translations.utmMedium,
										placeholder: 'qr',
									},
									{
										field: 'utm_campaign',
										label: translations.utmCampaign,
										placeholder: 'promo-verano',
									},
									{
										field: 'utm_term',
										label: translations.utmTerm,
										placeholder: 'keyword',
									},
									{
										field: 'utm_content',
										label: translations.utmContent,
										placeholder: 'variante-a',
									},
								].map(({ field, label, placeholder }) => (
									<div key={field}>
										<label
											htmlFor={field}
											className="text-xs text-default-500 mb-1 block"
										>
											{label}
										</label>
										<input
											id={field}
											{...register(field as any)}
											type="text"
											placeholder={placeholder}
											disabled={!canCustomSlug && !hasFeature('utmParams')}
											className="w-full p-2.5 border border-divider rounded-xl bg-content2 text-default-600 text-sm focus:outline-none focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
										/>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Device targeting — only for App type */}
					{watchedType === 'app' && (
						<div className="bg-content1 border border-divider rounded-2xl p-4 flex flex-col gap-4">
							<div className="flex items-center gap-2 text-default-600">
								<HugeiconsIcon icon={SmartPhone02Icon} size={16} />
								<span className="font-semibold text-sm">
									{translations.deviceRedirect}
								</span>
							</div>
							<p className="text-xs text-default-400 -mt-2">
								{translations.deviceRedirectDesc}
							</p>
							<div className="grid grid-cols-1 gap-3">
								<div>
									<label
										htmlFor="ios_url"
										className="text-xs text-default-500 mb-1 block"
									>
										{translations.iosUrl}
									</label>
									<input
										id="ios_url"
										{...register('ios_url')}
										type="url"
										placeholder="https://apps.apple.com/..."
										className="w-full p-2.5 border border-divider rounded-xl bg-content2 text-default-600 text-sm focus:outline-none focus:border-primary"
									/>
								</div>
								<div>
									<label
										htmlFor="android_url"
										className="text-xs text-default-500 mb-1 block"
									>
										{translations.androidUrl}
									</label>
									<input
										id="android_url"
										{...register('android_url')}
										type="url"
										placeholder="https://play.google.com/..."
										className="w-full p-2.5 border border-divider rounded-xl bg-content2 text-default-600 text-sm focus:outline-none focus:border-primary"
									/>
								</div>
							</div>
						</div>
					)}

					{/* Smart redirect — only for URL-based types, Pro+ */}
					{(watchedType === 'url' || watchedType === 'payment') && (
						<div className="bg-content1 border border-divider rounded-2xl p-4 flex flex-col gap-4">
							<div className="flex items-center gap-2 text-default-600">
								<HugeiconsIcon icon={Timer02Icon} size={16} />
								<span className="font-semibold text-sm">
									{translations.smartRedirect}
								</span>
								{!hasFeature('conditionalRedirect') && (
									<Tooltip content={translations.smartRedirectDesc}>
										<HugeiconsIcon
											icon={Crown02Icon}
											size={14}
											className="text-warning ml-auto"
										/>
									</Tooltip>
								)}
							</div>
							<p className="text-xs text-default-400 -mt-2">
								{translations.smartRedirectDesc}
							</p>
							{hasFeature('conditionalRedirect') ? (
								<SmartRedirectBuilder
									// biome-ignore lint/suspicious/noExplicitAny: react-hook-form generic
									control={control as any}
									translations={translations.smartRedirectTranslations}
								/>
							) : (
								<p className="text-xs text-default-300 italic">
									{translations.smartRedirectDesc}
								</p>
							)}
						</div>
					)}

					{/* Actions */}
					<div className="flex gap-3 pt-2">
						<Button
							as={Link}
							href="/dashboard/qrs"
							variant="flat"
							startContent={<HugeiconsIcon icon={ArrowLeft02Icon} size={16} />}
						>
							{translations.cancel}
						</Button>
						{canTemplates && (
							<Button
								type="button"
								variant="flat"
								startContent={<HugeiconsIcon icon={FloppyDiskIcon} size={16} />}
								onPress={saveTemplateDisc.onOpen}
							>
								{translations.templates.saveAs}
							</Button>
						)}
						<Button
							type="submit"
							color="primary"
							isLoading={isSubmitting}
							className="flex-1"
						>
							{translations.submit}
						</Button>
					</div>
				</div>

				{/* Right: Live preview — hidden on mobile */}
				<div className="hidden md:block w-72 shrink-0">
					<div className="sticky top-6 flex flex-col gap-2">
						<div className="flex items-center justify-between px-0.5">
							<h2 className="text-xs font-semibold text-default-400 uppercase tracking-widest">
								{translations.preview}
							</h2>
							<div className="flex items-center gap-1.5 bg-content2 rounded-full px-2.5 py-1">
								<span className="relative flex h-1.5 w-1.5">
									<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
									<span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
								</span>
								<span className="text-[10px] font-medium text-emerald-500">Live</span>
							</div>
						</div>
						<div className="rounded-2xl overflow-hidden border border-divider shadow-lg">
							{/* Dark showcase */}
							<div className="relative bg-zinc-950 flex flex-col items-center justify-center py-10 px-6">
								<div className="absolute inset-0 pointer-events-none" aria-hidden="true">
									<div
										className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 rounded-full blur-3xl opacity-20 transition-colors duration-500"
										style={{ backgroundColor: watchedFg ?? '#6366f1' }}
									/>
								</div>
								<div className="relative z-10 bg-white rounded-2xl p-3 shadow-2xl ring-1 ring-black/5">
									<QrPreview
										value={qrValue}
										size={200}
										fgColor={watchedFg ?? '#000000'}
										bgColor={watchedBg ?? '#ffffff'}
										dotStyle={watchedDotStyle ?? 'square'}
										cornerSquareStyle={watchedCornerSquare ?? 'square'}
										cornerDotStyle={watchedCornerDot ?? 'square'}
										dotColor2={watchedDotColor2}
										dotGradientType={watchedGradientType ?? 'linear'}
										logoUrl={logoPreview}
									/>
								</div>
							</div>
							{/* Info footer */}
							<div className="bg-content1 px-5 py-4 flex items-center gap-3 border-t border-divider">
								<div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', selectedType.color)}>
									<HugeiconsIcon icon={selectedType.icon} size={18} className="text-white" />
								</div>
								<div className="min-w-0 flex-1">
									<p className="font-semibold text-sm truncate leading-tight">
										{watchedName || translations.noName}
									</p>
									<p className="text-xs text-default-400 truncate leading-tight mt-0.5">
										{watchedData || selectedType.name}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</form>

			<SaveTemplateModal
				isOpen={saveTemplateDisc.isOpen}
				onOpenChange={saveTemplateDisc.onOpenChange}
				onClose={saveTemplateDisc.onClose}
				templateData={{
					fg_color: watchedFg ?? '#000000',
					bg_color: watchedBg ?? '#ffffff',
					dot_style: watchedDotStyle ?? 'square',
					corner_square_style: watchedCornerSquare ?? 'square',
					corner_dot_style: watchedCornerDot ?? 'square',
					dot_color_2: watchedDotColor2 ?? null,
					dot_gradient_type: watchedGradientType ?? 'linear',
				}}
				onSaved={() => {}}
				translations={{
					title: translations.templates.saveTitle,
					namePlaceholder: translations.templates.namePlaceholder,
					cancel: translations.cancel,
					save: translations.templates.save,
					saved: translations.templates.saved,
				}}
			/>
		</>
	)
}

export default QrForm
