'use client'

import { createBrowserClient } from '@supabase/ssr'
import { useEffect, useRef } from 'react'

declare global {
	interface Window {
		google?: {
			accounts: {
				id: {
					initialize: (config: object) => void
					prompt: () => void
					cancel: () => void
				}
			}
		}
	}
}

interface Props {
	redirectTo?: string
}

async function generateNonce(): Promise<[string, string]> {
	const raw = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))))
	const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw))
	const hashed = Array.from(new Uint8Array(hashBuffer))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('')
	return [raw, hashed]
}

export function GoogleOneTap({ redirectTo = '/dashboard/qrs' }: Props) {
	const initialized = useRef(false)

	useEffect(() => {
		const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
		const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
		const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

		if (!clientId || !supabaseUrl || !supabaseKey || initialized.current) return
		initialized.current = true

		const existing = document.getElementById('gsi-script')
		if (existing) {
			initOneTap(clientId, supabaseUrl, supabaseKey)
			return
		}

		const script = document.createElement('script')
		script.id = 'gsi-script'
		script.src = 'https://accounts.google.com/gsi/client'
		script.async = true
		script.defer = true
		script.onload = () => initOneTap(clientId, supabaseUrl, supabaseKey)
		document.head.appendChild(script)

		return () => {
			window.google?.accounts.id.cancel()
		}

		async function initOneTap(clientId: string, url: string, key: string) {
			const [rawNonce, hashedNonce] = await generateNonce()
			const supabase = createBrowserClient(url, key)

			window.google?.accounts.id.initialize({
				client_id: clientId,
				nonce: hashedNonce,
				callback: async (response: { credential: string }) => {
					const { error } = await supabase.auth.signInWithIdToken({
						provider: 'google',
						token: response.credential,
						nonce: rawNonce,
					})
					if (!error) window.location.href = redirectTo
				},
			})
			window.google?.accounts.id.prompt()
		}
	}, [redirectTo])

	return null
}
