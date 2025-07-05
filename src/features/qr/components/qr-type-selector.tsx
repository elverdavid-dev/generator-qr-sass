'use client'

import { cn } from '@heroui/react'
import {
	Calendar03Icon,
	CreditCardIcon,
	GlobeIcon,
	Location01Icon,
	Mail02Icon,
	Message01Icon,
	SmartPhone01Icon,
	UserIcon,
	Wifi01Icon,
} from 'hugeicons-react'

const QrTypeSelector = () => {
	const qrTypes = [
		{
			id: 'url',
			name: 'URL/Sitio Web',
			description: 'Enlace a una página web',
			icon: GlobeIcon,
			color: 'bg-blue-500',
			borderColor: 'border-blue-500',
			popular: true,
		},
		{
			id: 'text',
			name: 'Texto',
			description: 'Texto plano o mensaje',
			icon: Message01Icon,
			color: 'bg-green-500',
			borderColor: 'border-green-500',
			popular: true,
		},
		{
			id: 'email',
			name: 'Email',
			description: 'Dirección de correo electrónico',
			icon: Mail02Icon,
			color: 'bg-purple-500',
			borderColor: 'border-purple-500',
			popular: true,
		},
		{
			id: 'phone',
			name: 'Teléfono',
			description: 'Número de teléfono',
			icon: SmartPhone01Icon,
			color: 'bg-orange-500',
			borderColor: 'border-orange-500',
			popular: false,
		},
		{
			id: 'wifi',
			name: 'WiFi',
			description: 'Credenciales de red WiFi',
			icon: Wifi01Icon,
			color: 'bg-indigo-500',
			borderColor: 'border-indigo-500',
			popular: true,
		},
		{
			id: 'vdiv',
			name: 'Contacto',
			description: 'Tarjeta de contacto (vdiv)',
			icon: UserIcon,
			color: 'bg-pink-500',
			borderColor: 'border-pink-500',
			popular: false,
		},
		{
			id: 'location',
			name: 'Ubicación',
			description: 'Coordenadas GPS',
			icon: Location01Icon,
			color: 'bg-red-500',
			borderColor: 'border-red-500',
			popular: false,
		},
		{
			id: 'event',
			name: 'Evento',
			description: 'Evento de calendario',
			icon: Calendar03Icon,
			color: 'bg-yellow-500',
			borderColor: 'border-yellow-500',
			popular: false,
		},
		{
			id: 'payment',
			name: 'Pago',
			description: 'Información de pago',
			icon: CreditCardIcon,
			color: 'bg-gray-500',
			popular: false,
			borderColor: 'border-gray-500',
		},
	]
	return (
		<section className="grid grid-cols-4 gap-4 mt-10">
			{qrTypes.map((qrType) => (
				<div
					key={qrType.id}
					className={cn(
						'p-4 rounded-2xl hover:shadow-lg flex items-center gap-4 border border-gray-200 bg-white',
					)}
				>
					{/* Icon */}
					<div
						className={cn(
							'flex items-center justify-center w-fit p-2 text-white rounded-2xl',
							qrType.color,
						)}
					>
						<qrType.icon size={24} />
					</div>
					<div className="flex flex-col">
						<h2 className="font-semibold">{qrType.name}</h2>
						<p className="text-sm text-gray-500">{qrType.description}</p>
					</div>
				</div>
			))}
		</section>
	)
}

export default QrTypeSelector
