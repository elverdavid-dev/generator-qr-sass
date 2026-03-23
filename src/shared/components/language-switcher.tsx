'use client'

import { useRouter } from 'next/navigation'
import { useLoader } from '@/shared/context/loader-context'

const FLAGS: Record<string, string> = { es: '🇪🇸', en: '🇺🇸' }
const LABELS: Record<string, string> = { es: 'ES', en: 'EN' }

interface Props {
	currentLocale: string
	selectLabel?: string
	loadingMessage?: string
}

export default function LanguageSwitcher({
	currentLocale,
	selectLabel = 'Language',
	loadingMessage,
}: Props) {
	const router = useRouter()
	const { showLoader, hideLoader } = useLoader()

	const toggle = async () => {
		const next = currentLocale === 'es' ? 'en' : 'es'
		showLoader(loadingMessage)
		await fetch('/api/locale', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ locale: next }),
		})
		router.refresh()
		hideLoader()
	}

	return (
		<button
			onClick={toggle}
			title={selectLabel}
			className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium text-default-600 hover:bg-default-100 transition-colors"
		>
			<span>{FLAGS[currentLocale]}</span>
			<span>{LABELS[currentLocale]}</span>
		</button>
	)
}
