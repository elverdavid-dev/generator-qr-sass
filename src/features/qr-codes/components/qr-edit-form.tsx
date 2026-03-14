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
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { QRCodeCanvas } from 'qrcode.react'
import { toast } from 'sonner'
import { cn } from '@heroui/theme'
import { qrSchema, type QrFormData } from '@/features/qr-codes/schemas/qr-schema'
import { updateQr } from '@/features/qr-codes/services/mutations/update-qr'
import type { Folder, QrCode } from '@/shared/types/database.types'

const QR_TYPES = [
	{ id: 'url', name: 'URL', icon: GlobeIcon, color: 'bg-blue-500', placeholder: 'https://ejemplo.com' },
	{ id: 'text', name: 'Texto', icon: Message01Icon, color: 'bg-green-500', placeholder: 'Escribe tu mensaje...' },
	{ id: 'email', name: 'Email', icon: Mail02Icon, color: 'bg-purple-500', placeholder: 'correo@ejemplo.com' },
	{ id: 'phone', name: 'Teléfono', icon: SmartPhone01Icon, color: 'bg-orange-500', placeholder: '+1234567890' },
	{ id: 'wifi', name: 'WiFi', icon: Wifi01Icon, color: 'bg-indigo-500', placeholder: 'WIFI:T:WPA;S:MiRed;P:contraseña;;' },
	{ id: 'vcard', name: 'Contacto', icon: UserIcon, color: 'bg-pink-500', placeholder: 'BEGIN:VCARD...' },
	{ id: 'location', name: 'Ubicación', icon: Location01Icon, color: 'bg-red-500', placeholder: 'geo:40.7128,-74.0060' },
	{ id: 'event', name: 'Evento', icon: Calendar03Icon, color: 'bg-yellow-500', placeholder: 'BEGIN:VEVENT...' },
	{ id: 'payment', name: 'Pago', icon: CreditCardIcon, color: 'bg-gray-500', placeholder: 'https://pago.ejemplo.com' },
]

interface Props {
	qr: QrCode
	folders: Folder[]
}

const QrEditForm = ({ qr, folders }: Props) => {
	const router = useRouter()
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [logoPreview, setLogoPreview] = useState<string | null>(qr.logo_url ?? null)

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<QrFormData>({
		resolver: zodResolver(qrSchema) as Resolver<QrFormData>,
		defaultValues: {
			name: qr.name,
			qr_type: qr.qr_type,
			data: qr.data,
			bg_color: qr.bg_color,
			fg_color: qr.fg_color,
			folder_id: qr.folder_id ?? undefined,
		},
	})

	const watchedType = watch('qr_type')
	const watchedData = watch('data')
	const watchedBg = watch('bg_color')
	const watchedFg = watch('fg_color')
	const watchedName = watch('name')

	const selectedType = QR_TYPES.find((t) => t.id === watchedType) ?? QR_TYPES[0]
	const qrValue = watchedData || watchedName || 'preview'

	const onSubmit = async (data: QrFormData) => {
		const result = await updateQr(qr.id, data)
		if (result.error) {
			toast.error(result.error)
			return
		}
		toast.success('QR actualizado correctamente')
		router.push('/dashboard/qrs')
	}

	const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return
		setValue('logo', file)
		const url = URL.createObjectURL(file)
		setLogoPreview(url)
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex gap-8">
			{/* Left: Config panel */}
			<div className="flex-1 flex flex-col gap-6">
				{/* QR Type selector */}
				<div>
					<h2 className="font-semibold mb-3 text-default-700">Tipo de QR</h2>
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
					<h2 className="font-semibold mb-3 text-default-700">Nombre del QR</h2>
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
					<h2 className="font-semibold mb-3 text-default-700">Contenido</h2>
					<Input
						{...register('data')}
						placeholder={selectedType.placeholder}
						isInvalid={!!errors.data}
						errorMessage={errors.data?.message}
						variant="bordered"
					/>
				</div>

				{/* Colors */}
				<div>
					<h2 className="font-semibold mb-3 text-default-700">Colores</h2>
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

				{/* Logo */}
				<div>
					<h2 className="font-semibold mb-3 text-default-700">Logo (opcional)</h2>
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
						<h2 className="font-semibold mb-3 text-default-700">Carpeta (opcional)</h2>
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
						Guardar cambios
					</Button>
				</div>
			</div>

			{/* Right: Live preview */}
			<div className="w-72 flex-shrink-0">
				<div className="sticky top-6">
					<h2 className="font-semibold mb-3 text-default-700">Vista previa</h2>
					<div className="bg-content1 border border-divider rounded-2xl p-6 flex flex-col items-center gap-4 shadow-sm">
						<QRCodeCanvas
							value={qrValue}
							size={200}
							fgColor={watchedFg ?? '#000000'}
							bgColor={watchedBg ?? '#ffffff'}
							imageSettings={
								logoPreview
									? { src: logoPreview, height: 40, width: 40, excavate: true }
									: undefined
							}
							className="rounded-lg"
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

export default QrEditForm
