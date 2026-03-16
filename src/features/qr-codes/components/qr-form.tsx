'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import type { Resolver } from 'react-hook-form'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import {
	GlobeIcon,
	Message01Icon,
	Mail02Icon,
	SmartPhone01Icon,
	Wifi01Icon,
	UserIcon,
	Location01Icon,
	Calendar03Icon,
	CreditCardIcon,
	ArrowLeft02Icon,
	ImageUploadIcon,
	SmartPhone02Icon,
	LockPasswordIcon,
	Timer02Icon,
	ListViewIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { cn } from '@heroui/theme'
import { qrSchema, type QrFormData } from '@/features/qr-codes/schemas/qr-schema'
import { createQr } from '@/features/qr-codes/services/mutations/create-qr'
import QrPreview from '@/features/qr-codes/components/qr-preview'
import type { Folder } from '@/shared/types/database.types'

const QR_TYPES = [
	{ id: 'url', name: 'URL', icon: GlobeIcon, color: 'bg-blue-500', placeholder: 'https://ejemplo.com' },
	{ id: 'text', name: 'Texto', icon: Message01Icon, color: 'bg-green-500', placeholder: 'Escribe tu mensaje...' },
	{ id: 'email', name: 'Email', icon: Mail02Icon, color: 'bg-purple-500', placeholder: 'correo@ejemplo.com' },
	{ id: 'phone', name: 'Teléfono', icon: SmartPhone01Icon, color: 'bg-orange-500', placeholder: '+1234567890' },
	{ id: 'wifi', name: 'WiFi', icon: Wifi01Icon, color: 'bg-indigo-500', placeholder: 'WIFI:T:WPA;S:MiRed;P:contraseña;;' },
	{ id: 'vcard', name: 'Contacto', icon: UserIcon, color: 'bg-pink-500', placeholder: 'BEGIN:VCARD\nVERSION:3.0\nFN:Nombre\nEND:VCARD' },
	{ id: 'location', name: 'Ubicación', icon: Location01Icon, color: 'bg-red-500', placeholder: 'geo:40.7128,-74.0060' },
	{ id: 'event', name: 'Evento', icon: Calendar03Icon, color: 'bg-yellow-500', placeholder: 'BEGIN:VEVENT\nSUMMARY:Mi Evento\nEND:VEVENT' },
	{ id: 'payment', name: 'Pago', icon: CreditCardIcon, color: 'bg-gray-500', placeholder: 'https://pago.ejemplo.com' },
]

const DOT_STYLES = [
	{ id: 'square', name: 'Cuadrado' },
	{ id: 'dots', name: 'Puntos' },
	{ id: 'rounded', name: 'Redondeado' },
	{ id: 'classy', name: 'Clásico' },
	{ id: 'classy-rounded', name: 'Clásico R.' },
	{ id: 'extra-rounded', name: 'Extra R.' },
]

const CORNER_SQUARE_STYLES = [
	{ id: 'square', name: 'Cuadrado' },
	{ id: 'dot', name: 'Círculo' },
	{ id: 'extra-rounded', name: 'Redondeado' },
]

const CORNER_DOT_STYLES = [
	{ id: 'square', name: 'Cuadrado' },
	{ id: 'dot', name: 'Círculo' },
]

const FRAME_STYLES = [
	{ id: 'none', name: 'Ninguno' },
	{ id: 'simple', name: 'Simple' },
	{ id: 'rounded', name: 'Redondeado' },
	{ id: 'bold', name: 'Grueso' },
]

interface Props {
	folders: Folder[]
}

const QrForm = ({ folders }: Props) => {
	const router = useRouter()
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [logoPreview, setLogoPreview] = useState<string | null>(null)

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<QrFormData>({
		resolver: zodResolver(qrSchema) as Resolver<QrFormData>,
		defaultValues: {
			qr_type: 'url',
			bg_color: '#ffffff',
			fg_color: '#000000',
			dot_style: 'square',
			corner_square_style: 'square',
			corner_dot_style: 'square',
			dot_gradient_type: 'linear',
			frame_style: 'none',
			frame_color: '#000000',
			frame_text: 'ESCANÉAME',
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
		const result = await createQr(data)
		if (result.error) {
			toast.error(result.error)
			return
		}
		toast.success('QR creado correctamente')
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
					{sectionTitle('Tipo de QR')}
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
								<span className={cn('p-1.5 rounded-lg text-white flex-shrink-0', type.color)}>
									<HugeiconsIcon icon={type.icon} size={14} />
								</span>
								{type.name}
							</button>
						))}
					</div>
				</div>

				{/* Name */}
				<div>
					{sectionTitle('Nombre del QR')}
					<Input
						{...register('name')}
						placeholder="Ej. Mi página web"
						isInvalid={!!errors.name}
						errorMessage={errors.name?.message}
						variant="bordered"
					/>
				</div>

				{/* Content */}
				<div>
					{sectionTitle('Contenido')}
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
					{sectionTitle('Estilo de puntos')}
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
					{sectionTitle('Esquinas externas')}
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
					{sectionTitle('Esquinas internas')}
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
					{sectionTitle('Colores')}
					<div className="flex gap-4">
						<div className="flex flex-col gap-1">
							<label className="text-xs text-default-500">Fondo</label>
							<div className="flex items-center gap-2 p-2 border border-divider rounded-xl bg-content1">
								<input
									type="color"
									{...register('bg_color')}
									className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
								/>
								<span className="text-sm font-mono text-default-600">{watchedBg}</span>
							</div>
						</div>
						<div className="flex flex-col gap-1">
							<label className="text-xs text-default-500">Color QR</label>
							<div className="flex items-center gap-2 p-2 border border-divider rounded-xl bg-content1">
								<input
									type="color"
									{...register('fg_color')}
									className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
								/>
								<span className="text-sm font-mono text-default-600">{watchedFg}</span>
							</div>
						</div>
					</div>
				</div>

				{/* Gradient */}
				<div>
					{sectionTitle('Degradado de color')}
					<div className="flex flex-col gap-3">
						<div className="flex items-center justify-between p-3 bg-content1 border border-divider rounded-xl">
							<span className="text-sm text-default-600">Activar degradado</span>
							<button
								type="button"
								onClick={() => setValue('dot_color_2', hasGradient ? null : '#ff6600')}
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
									<label className="text-xs text-default-500">Color 2</label>
									<div className="flex items-center gap-2 p-2 border border-divider rounded-xl bg-content1">
										<input
											type="color"
											{...register('dot_color_2')}
											className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
										/>
										<span className="text-sm font-mono text-default-600">{watchedDotColor2}</span>
									</div>
								</div>
								<div className="flex flex-col gap-1 flex-1">
									<label className="text-xs text-default-500">Tipo</label>
									<div className="grid grid-cols-2 gap-2">
										<button
											type="button"
											onClick={() => setValue('dot_gradient_type', 'linear')}
											className={styleButtonClass(watchedGradientType === 'linear')}
										>
											Lineal
										</button>
										<button
											type="button"
											onClick={() => setValue('dot_gradient_type', 'radial')}
											className={styleButtonClass(watchedGradientType === 'radial')}
										>
											Radial
										</button>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>

				{/* Frame */}
				<div>
					{sectionTitle('Marco')}
					<div className="flex flex-col gap-3">
						<div className="grid grid-cols-4 gap-2">
							{FRAME_STYLES.map((style) => (
								<button
									key={style.id}
									type="button"
									onClick={() => setValue('frame_style', style.id as 'none' | 'simple' | 'rounded' | 'bold')}
									className={styleButtonClass(watchedFrameStyle === style.id)}
								>
									{style.name}
								</button>
							))}
						</div>
						{hasFrame && (
							<div className="flex gap-3">
								<div className="flex flex-col gap-1">
									<label className="text-xs text-default-500">Color marco</label>
									<div className="flex items-center gap-2 p-2 border border-divider rounded-xl bg-content1">
										<input
											type="color"
											{...register('frame_color')}
											className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
										/>
									</div>
								</div>
								<div className="flex flex-col gap-1 flex-1">
									<label className="text-xs text-default-500">Texto del marco</label>
									<input
										{...register('frame_text')}
										placeholder="ESCANÉAME"
										className="w-full p-2.5 border border-divider rounded-xl bg-content1 text-default-600 text-sm focus:outline-none focus:border-primary uppercase"
									/>
								</div>
							</div>
						)}
					</div>
				</div>

				{/* Logo */}
				<div>
					{sectionTitle('Logo (opcional)')}
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
								<img src={logoPreview} alt="Logo" className="w-8 h-8 object-contain rounded" />
								<span className="text-sm">Cambiar logo</span>
							</>
						) : (
							<>
								<HugeiconsIcon icon={ImageUploadIcon} size={20} />
								<span className="text-sm">Subir logo PNG o SVG</span>
							</>
						)}
					</button>
				</div>

				{/* Folder */}
				{folders.length > 0 && (
					<div>
						{sectionTitle('Carpeta (opcional)')}
						<select
							{...register('folder_id')}
							className="w-full p-2.5 border border-divider rounded-xl bg-content1 text-default-600 text-sm focus:outline-none focus:border-primary"
						>
							<option value="">Sin carpeta</option>
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
						<span className="font-semibold text-sm">Protección y límites</span>
					</div>
					<div className="grid grid-cols-1 gap-3">
						<div>
							<label className="text-xs text-default-500 mb-1 block">
								<HugeiconsIcon icon={LockPasswordIcon} size={12} className="inline mr-1" />
								Contraseña (opcional)
							</label>
							<input
								{...register('password')}
								type="text"
								placeholder="Ej. mi-clave-123"
								className="w-full p-2.5 border border-divider rounded-xl bg-content2 text-default-600 text-sm focus:outline-none focus:border-primary"
							/>
						</div>
						<div className="grid grid-cols-2 gap-3">
							<div>
								<label className="text-xs text-default-500 mb-1 block">
									<HugeiconsIcon icon={Calendar03Icon} size={12} className="inline mr-1" />
									Expira el (opcional)
								</label>
								<input
									{...register('expires_at')}
									type="datetime-local"
									className="w-full p-2.5 border border-divider rounded-xl bg-content2 text-default-600 text-sm focus:outline-none focus:border-primary"
								/>
							</div>
							<div>
								<label className="text-xs text-default-500 mb-1 block">
									<HugeiconsIcon icon={ListViewIcon} size={12} className="inline mr-1" />
									Máx. escaneos (opcional)
								</label>
								<input
									{...register('max_scans')}
									type="number"
									min={1}
									placeholder="Ej. 100"
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
							<span className="font-semibold text-sm">Redirección por dispositivo</span>
						</div>
						<p className="text-xs text-default-400 -mt-2">
							Redirige a URLs distintas según el dispositivo del usuario. Si se deja vacío, usa el contenido principal.
						</p>
						<div className="grid grid-cols-1 gap-3">
							<div>
								<label className="text-xs text-default-500 mb-1 block">URL para iOS (App Store)</label>
								<input
									{...register('ios_url')}
									type="url"
									placeholder="https://apps.apple.com/..."
									className="w-full p-2.5 border border-divider rounded-xl bg-content2 text-default-600 text-sm focus:outline-none focus:border-primary"
								/>
							</div>
							<div>
								<label className="text-xs text-default-500 mb-1 block">URL para Android (Play Store)</label>
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
						Cancelar
					</Button>
					<Button type="submit" color="primary" isLoading={isSubmitting} className="flex-1">
						Crear QR
					</Button>
				</div>
			</div>

			{/* Right: Live preview */}
			<div className="w-72 flex-shrink-0">
				<div className="sticky top-6">
					<h2 className="font-semibold mb-3 text-default-700">Vista previa</h2>
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
							frameText={watchedFrameText ?? 'ESCANÉAME'}
							logoUrl={logoPreview}
							className="rounded-lg overflow-hidden"
						/>
						<div className="text-center">
							<p className="font-semibold text-sm capitalize truncate max-w-48">
								{watchedName || 'Sin nombre'}
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

export default QrForm
