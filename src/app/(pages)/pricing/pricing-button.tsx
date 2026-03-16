'use client'

import { Button } from '@heroui/button'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { PlanId } from '@/features/billing/config/plans'

interface Props {
	planId: PlanId
	isCurrent: boolean
	isLoggedIn: boolean
	isHighlighted: boolean
	lsVariantId: string | null
}

export default function PricingButton({
	planId,
	isCurrent,
	isLoggedIn,
	isHighlighted,
	lsVariantId,
}: Props) {
	const router = useRouter()
	const [loading, setLoading] = useState(false)

	const handleClick = async () => {
		if (!isLoggedIn) {
			router.push('/register')
			return
		}

		if (planId === 'free' || !lsVariantId) return

		setLoading(true)
		try {
			const res = await fetch('/api/lemonsqueezy/checkout', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ variantId: lsVariantId }),
			})
			const { url } = await res.json()
			if (url) router.push(url)
		} finally {
			setLoading(false)
		}
	}

	if (isCurrent) {
		return (
			<Button variant="flat" color="default" isDisabled className="w-full">
				Plan actual
			</Button>
		)
	}

	if (planId === 'free') {
		return (
			<Button
				variant="bordered"
				className="w-full"
				onPress={() => router.push(isLoggedIn ? '/dashboard' : '/register')}
			>
				{isLoggedIn ? 'Ir al dashboard' : 'Empezar gratis'}
			</Button>
		)
	}

	return (
		<Button
			color="primary"
			variant={isHighlighted ? 'solid' : 'flat'}
			className="w-full"
			isLoading={loading}
			onPress={handleClick}
		>
			Elegir {planId === 'pro' ? 'Pro' : 'Business'}
		</Button>
	)
}
