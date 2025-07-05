'use client'
import { Button } from '@heroui/react'
import Image from 'next/image'

// este componente es un placeholder para el boton de google,se usa para que el componente se pueda renderizar de manera asincrona

const GooglePlaceholderButton = () => {
	return (
		<Button
			fullWidth
			variant="bordered"
			className="mb-6"
			size="lg"
			startContent={
				<Image
					src="/google-icon.svg"
					width={25}
					height={25}
					alt="logo google"
				/>
			}
		>
			Iniciar sesión con Google
		</Button>
	)
}

export default GooglePlaceholderButton
