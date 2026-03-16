'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

const FLAGS: Record<string, string> = { es: '🇪🇸', en: '🇺🇸' }
const LABELS: Record<string, string> = { es: 'ES', en: 'EN' }

interface Props {
	currentLocale: string
	selectLabel?: string
}

export default function LanguageSwitcher({ currentLocale, selectLabel = 'Language' }: Props) {
	const router = useRouter()
	const [loading, setLoading] = useState(false)

	const toggle = async () => {
		const next = currentLocale === 'es' ? 'en' : 'es'
		setLoading(true)
		await fetch('/api/locale', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ locale: next }),
		})
		router.refresh()
		setLoading(false)
	}

	return (
		<button
			onClick={toggle}
			disabled={loading}
			title={selectLabel}
			className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium text-default-600 hover:bg-default-100 transition-colors disabled:opacity-50"
		>
			<span>{FLAGS[currentLocale]}</span>
			<span>{LABELS[currentLocale]}</span>
		</button>
	)
}
