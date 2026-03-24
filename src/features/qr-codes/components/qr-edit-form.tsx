'use client'

import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { cn } from '@heroui/theme'
import { zodResolver } from '@hookform/resolvers/zod'
import {
	ArrowLeft02Icon,
	Calendar03Icon,
	CreditCardIcon,
	GlobeIcon,
	ImageUploadIcon,
	ListViewIcon,
	Location01Icon,
	LockPasswordIcon,
	Mail02Icon,
	Message01Icon,
	SmartPhone01Icon,
	SmartPhone02Icon,
	UserIcon,
	Wifi01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import type { Resolver } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import QrPreview from '@/features/qr-codes/components/qr-preview'
import {
	type QrFormData,
	createQrSchema,
} from '@/features/qr-codes/schemas/qr-schema'
import { updateQr } from '@/features/qr-codes/services/mutations/update-qr'
import type { Folder, QrCode } from '@/shared/types/database.types'

export interface QrEditFormTranslations {
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
	frame: string
	frameColor: string
	frameText: string
	framePlaceholder: string
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
	cancel: string
	submit: string
	preview: string
	noName: string
	updated: string
	dot: {
		square: string
		dots: string
		rounded: string
		classic: string
		classicR: string
		extraR: string
	}
	corner: { square: string; circle: string }
	frameStyle: { none: string; simple: string; rounded: string; thick: string }
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
	qr: QrCode
	folders: Folder[]
	translations: QrEditFormTranslations
}

const QrEditForm = ({ qr, folders, translations }: Props) => {
	const router = useRouter()
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [logoPreview, setLogoPreview] = useState<string | null>(
		qr.logo_url ?? null,
	)

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

	const FRAME_STYLES = [
		{ id: 'none', name: translations.frameStyle.none },
		{ id: 'simple', name: translations.frameStyle.simple },
		{ id: 'rounded', name: translations.frameStyle.rounded },
		{ id: 'bold', name: translations.frameStyle.thick },
	]

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<QrFormData>({
		resolver: zodResolver(createQrSchema(translations.validation)) as Resolver<QrFormData>,
		defaultValues: {
			name: qr.name,
			qr_type: qr.qr_type,
			data: qr.data,
			bg_color: qr.bg_color,
			fg_color: qr.fg_color,
			dot_style: qr.dot_style ?? 'square',
			corner_square_style: qr.corner_square_style ?? 'square',
			corner_dot_style: qr.corner_dot_style ?? 'square',
			dot_color_2: qr.dot_color_2 ?? undefined,
			dot_gradient_type:
				(qr.dot_gradient_type as 'linear' | 'radial') ?? 'linear',
			frame_style:
				(qr.frame_style as 'none' | 'simple' | 'rounded' | 'bold') ?? 'none',
			frame_color: qr.frame_color ?? '#000000',
			frame_text: qr.frame_text ?? translations.framePlaceholder,
			folder_id: qr.folder_id ?? undefined,
			password: qr.password ?? undefined,
			expires_at: qr.expires_at ? qr.expires_at.slice(0, 16) : undefined,
			max_scans: qr.max_scans ?? undefined,
			ios_url: qr.ios_url ?? undefined,
			android_url: qr.android_url ?? undefined,
		},
	})

	const watchedType = watch('qr_type')
	const watchedData = watch('data')
	const watchedBg = watch('bg_color')
	const watchedFg = watch('fg_color')
	const watchedDotStyle = watch('dot_style')
	const watchedCornerSquare = watch('corner_square_style')
	const watchedCornerDot = watch('corner_dot_style')
	const watchedName = watch('name')
	const watchedDotColor2 = watch('dot_color_2')
	const watchedGradientType = watch('dot_gradient_type')
	const watchedFrameStyle = watch('frame_style')
	const watchedFrameColor = watch('frame_color')
	const watchedFrameText = watch('frame_text')

	const selectedType = QR_TYPES.find((t) => t.id === watchedType) ?? QR_TYPES[0]
	const qrValue = watchedData || watchedName || 'preview'
	const hasGradient = !!watchedDotColor2
	const hasFrame = watchedFrameStyle !== 'none'

	const onSubmit = async (data: QrFormData) => {
		const result = await updateQr(qr.id, data)
		if (result.error) {
			toast.error(result.error)
			return
		}
		toast.success(translations.updated)
		router.push('/dashboard/qrs')
	}

	const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return
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

	const sectionTitle = (text: string) => (
		<h2 className="font-semibold mb-3 text-default-700">{text}</h2>
	)

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex gap-8">
			{/* Left: Config panel */}
			<div className="flex-1 flex flex-col gap-6">
				{/* QR Type */}
				<div>
					{sectionTitle(translations.qrType)}
					<div className="grid grid-cols-3 gap-2">
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
										'p-1.5 rounded-lg text-white shrink-0',
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

				{/* Content */}
				<div>
					{sectionTitle(translations.content)}
					<Input
						{...register('data')}
						placeholder={selectedType.placeholder}
						isInvalid={!!errors.data}
						errorMessage={errors.data?.message}
						variant="bordered"
					/>
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
					<div className="grid grid-cols-3 gap-2">
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
					<div className="flex gap-4">
						<div className="flex flex-col gap-1">
							<label className="text-xs text-default-500">
								{translations.background}
							</label>
							<div className="flex items-center gap-2 p-2 border border-divider rounded-xl bg-content1">
								<input
									type="color"
									{...register('bg_color')}
									className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
								/>
								<span className="text-sm font-mono text-default-600">
									{watchedBg}
								</span>
							</div>
						</div>
						<div className="flex flex-col gap-1">
							<label className="text-xs text-default-500">
								{translations.qrColor}
							</label>
							<div className="flex items-center gap-2 p-2 border border-divider rounded-xl bg-content1">
								<input
									type="color"
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
					{sectionTitle(translations.colorGradient)}
					<div className="flex flex-col gap-3">
						<div className="flex items-center justify-between p-3 bg-content1 border border-divider rounded-xl">
							<span className="text-sm text-default-600">
								{translations.enableGradient}
							</span>
							<button
								type="button"
								onClick={() =>
									setValue('dot_color_2', hasGradient ? null : '#ff6600')
								}
								className={cn(
									'relative w-10 h-6 rounded-full transition-colors',
									hasGradient ? 'bg-primary' : 'bg-default-200',
								)}
							>
								<span
									className={cn(
										'absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform',
										hasGradient ? 'translate-x-5' : 'translate-x-1',
									)}
								/>
							</button>
						</div>
						{hasGradient && (
							<div className="flex gap-3 items-end">
								<div className="flex flex-col gap-1">
									<label className="text-xs text-default-500">
										{translations.color2}
									</label>
									<div className="flex items-center gap-2 p-2 border border-divider rounded-xl bg-content1">
										<input
											type="color"
											{...register('dot_color_2')}
											className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
										/>
										<span className="text-sm font-mono text-default-600">
											{watchedDotColor2}
										</span>
									</div>
								</div>
								<div className="flex flex-col gap-1 flex-1">
									<label className="text-xs text-default-500">
										{translations.gradientType}
									</label>
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

				{/* Frame */}
				<div>
					{sectionTitle(translations.frame)}
					<div className="flex flex-col gap-3">
						<div className="grid grid-cols-4 gap-2">
							{FRAME_STYLES.map((style) => (
								<button
									key={style.id}
									type="button"
									onClick={() =>
										setValue(
											'frame_style',
											style.id as 'none' | 'simple' | 'rounded' | 'bold',
										)
									}
									className={styleButtonClass(watchedFrameStyle === style.id)}
								>
									{style.name}
								</button>
							))}
						</div>
						{hasFrame && (
							<div className="flex gap-3">
								<div className="flex flex-col gap-1">
									<label className="text-xs text-default-500">
										{translations.frameColor}
									</label>
									<div className="flex items-center gap-2 p-2 border border-divider rounded-xl bg-content1">
										<input
											type="color"
											{...register('frame_color')}
											className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
										/>
									</div>
								</div>
								<div className="flex flex-col gap-1 flex-1">
									<label className="text-xs text-default-500">
										{translations.frameText}
									</label>
									<input
										{...register('frame_text')}
										placeholder={translations.framePlaceholder}
										className="w-full p-2.5 border border-divider rounded-xl bg-content1 text-default-600 text-sm focus:outline-none focus:border-primary uppercase"
									/>
								</div>
							</div>
						)}
					</div>
				</div>

				{/* Logo */}
				<div>
					{sectionTitle(translations.logo)}
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
							<label className="text-xs text-default-500 mb-1 block">
								<HugeiconsIcon
									icon={LockPasswordIcon}
									size={12}
									className="inline mr-1"
								/>
								{translations.password}
							</label>
							<input
								{...register('password')}
								type="text"
								placeholder={translations.passwordPlaceholder}
								className="w-full p-2.5 border border-divider rounded-xl bg-content2 text-default-600 text-sm focus:outline-none focus:border-primary"
							/>
						</div>
						<div className="grid grid-cols-2 gap-3">
							<div>
								<label className="text-xs text-default-500 mb-1 block">
									<HugeiconsIcon
										icon={Calendar03Icon}
										size={12}
										className="inline mr-1"
									/>
									{translations.expiry}
								</label>
								<input
									{...register('expires_at')}
									type="datetime-local"
									className="w-full p-2.5 border border-divider rounded-xl bg-content2 text-default-600 text-sm focus:outline-none focus:border-primary"
								/>
							</div>
							<div>
								<label className="text-xs text-default-500 mb-1 block">
									<HugeiconsIcon
										icon={ListViewIcon}
										size={12}
										className="inline mr-1"
									/>
									{translations.maxScans}
								</label>
								<input
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

				{/* Device targeting — only for URL-based types */}
				{(watchedType === 'url' || watchedType === 'payment') && (
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
								<label className="text-xs text-default-500 mb-1 block">
									{translations.iosUrl}
								</label>
								<input
									{...register('ios_url')}
									type="url"
									placeholder="https://apps.apple.com/..."
									className="w-full p-2.5 border border-divider rounded-xl bg-content2 text-default-600 text-sm focus:outline-none focus:border-primary"
								/>
							</div>
							<div>
								<label className="text-xs text-default-500 mb-1 block">
									{translations.androidUrl}
								</label>
								<input
									{...register('android_url')}
									type="url"
									placeholder="https://play.google.com/..."
									className="w-full p-2.5 border border-divider rounded-xl bg-content2 text-default-600 text-sm focus:outline-none focus:border-primary"
								/>
							</div>
						</div>
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

			{/* Right: Live preview */}
			<div className="w-72 shrink-0">
				<div className="sticky top-6">
					<h2 className="font-semibold mb-3 text-default-700">
						{translations.preview}
					</h2>
					<div className="bg-content1 border border-divider rounded-2xl p-6 flex flex-col items-center gap-4 shadow-sm">
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
							frameStyle={watchedFrameStyle ?? 'none'}
							frameColor={watchedFrameColor ?? '#000000'}
							frameText={watchedFrameText ?? translations.framePlaceholder}
							logoUrl={logoPreview}
							className="rounded-lg overflow-hidden"
						/>
						<div className="text-center">
							<p className="font-semibold text-sm capitalize truncate max-w-48">
								{watchedName || translations.noName}
							</p>
							<span
								className={cn(
									'text-xs px-2 py-0.5 rounded-full text-white inline-block mt-1',
									selectedType.color,
								)}
							>
								{selectedType.name}
							</span>
						</div>
					</div>
				</div>
			</div>
		</form>
	)
}

export default QrEditForm
