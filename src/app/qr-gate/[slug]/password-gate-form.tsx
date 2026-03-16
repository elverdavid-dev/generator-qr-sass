'use client'

import { useState } from 'react'

interface Props {
	slug: string
}

const PasswordGateForm = ({ slug }: Props) => {
	const [password, setPassword] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)
		setLoading(true)

		try {
			const res = await fetch('/api/qr-gate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ slug, password }),
			})

			const json = await res.json()

			if (!res.ok) {
				setError(json.error ?? 'Contraseña incorrecta')
				setLoading(false)
				return
			}

			window.location.href = json.redirectUrl
		} catch {
			setError('Error al verificar la contraseña')
			setLoading(false)
		}
	}

	return (
		<form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
			<input
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				placeholder="Ingresa la contraseña"
				className="w-full p-3 border border-divider rounded-xl bg-content2 text-sm focus:outline-none focus:border-primary"
				autoFocus
			/>
			{error && (
				<p className="text-danger text-xs text-center">{error}</p>
			)}
			<button
				type="submit"
				disabled={loading || !password}
				className="w-full p-3 rounded-xl bg-primary text-white text-sm font-semibold disabled:opacity-50 transition-opacity"
			>
				{loading ? 'Verificando...' : 'Acceder'}
			</button>
		</form>
	)
}

export default PasswordGateForm
