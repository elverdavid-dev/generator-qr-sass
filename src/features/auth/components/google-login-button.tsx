'use client'
import { Button } from '@heroui/react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { loginGoogleService } from '@/features/auth/services/login-google'

const GoogleLoginButton = () => {
	const searchParams = useSearchParams()
	const redirect_url = searchParams.get('redirect_url')

	const handleClick = () => {
		loginGoogleService({ redirect_url: redirect_url ?? '/dashboard/qrs' })
	}
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
			onPress={handleClick}
		>
			Iniciar sesión con Google
		</Button>
	)
}

export default GoogleLoginButton
