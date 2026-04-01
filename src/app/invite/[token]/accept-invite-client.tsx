'use client'

import { Button } from '@heroui/button'
import { CheckmarkCircle02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface Props {
	ownerName: string
}

export default function AcceptInviteClient({ ownerName }: Props) {
	const router = useRouter()

	useEffect(() => {
		const timer = setTimeout(() => router.push('/dashboard'), 3000)
		return () => clearTimeout(timer)
	}, [router])

	return (
		<section className="flex items-center justify-center min-h-screen bg-background px-4">
			<div className="bg-content1 border border-divider rounded-3xl p-10 max-w-sm w-full text-center flex flex-col items-center gap-5">
				<div className="w-20 h-20 bg-success/10 rounded-3xl flex items-center justify-center">
					<HugeiconsIcon
						icon={CheckmarkCircle02Icon}
						size={40}
						className="text-success"
					/>
				</div>
				<div>
					<h1 className="text-2xl font-bold mb-2">¡Te uniste al equipo!</h1>
					<p className="text-default-500 text-sm">
						Ahora eres parte del equipo de{' '}
						<span className="font-semibold text-foreground">{ownerName}</span>.
						Serás redirigido al dashboard en unos segundos.
					</p>
				</div>
				<Button
					color="primary"
					radius="full"
					className="w-full"
					onPress={() => router.push('/dashboard')}
				>
					Ir al dashboard →
				</Button>
			</div>
		</section>
	)
}
