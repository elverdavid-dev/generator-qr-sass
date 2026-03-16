'use client'

import { Button } from '@heroui/button'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Props {
	label: string
}

export default function ManageSubscriptionButton({ label }: Props) {
	const router = useRouter()
	const [loading, setLoading] = useState(false)

	const handleClick = async () => {
		setLoading(true)
		try {
			const res = await fetch('/api/lemonsqueezy/portal', { method: 'POST' })
			const { url, error } = await res.json()
			if (url) router.push(url)
			if (error) console.error(error)
		} finally {
			setLoading(false)
		}
	}

	return (
		<Button
			color="warning"
			variant="flat"
			isLoading={loading}
			onPress={handleClick}
			className="font-semibold"
		>
			{label}
		</Button>
	)
}
