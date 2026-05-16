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

		async function handleCredential(response: { credential: string }, url: string, key: string) {
			const supabase = createBrowserClient(url, key)
			const { error } = await supabase.auth.signInWithIdToken({
				provider: 'google',
				token: response.credential,
			})
			if (!error) {
				window.location.href = redirectTo
			}
		}

		function initOneTap(clientId: string, url: string, key: string) {
			window.google?.accounts.id.initialize({
				client_id: clientId,
				callback: (response: { credential: string }) => {
					handleCredential(response, url, key)
				},
			})
			window.google?.accounts.id.prompt()
		}
	}, [redirectTo])

	return null
}
