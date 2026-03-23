import { createAdminClient } from '@/shared/lib/supabase/admin'

export interface WebhookPayload {
	event: 'qr.scanned'
	qr_id: string
	qr_name: string
	slug: string
	timestamp: string
	scan: {
		ip: string
		browser: string
		os: string
		device_type: string
		country: string | null
		region: string | null
		city: string | null
		is_unique: boolean
	}
}

async function signPayload(payload: string, secret: string): Promise<string> {
	const enc = new TextEncoder()
	const key = await crypto.subtle.importKey(
		'raw',
		enc.encode(secret),
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign'],
	)
	const sig = await crypto.subtle.sign('HMAC', key, enc.encode(payload))
	return Array.from(new Uint8Array(sig))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('')
}

export const deliverWebhooks = async (
	user_id: string,
	payload: WebhookPayload,
) => {
	const supabase = createAdminClient()

	const { data: webhooks } = await supabase
		.from('webhooks')
		.select('url, secret')
		.eq('user_id', user_id)
		.eq('is_active', true)

	if (!webhooks || webhooks.length === 0) return

	const body = JSON.stringify(payload)

	await Promise.allSettled(
		webhooks.map(async (webhook) => {
			const headers: Record<string, string> = {
				'Content-Type': 'application/json',
				'X-QR-Event': payload.event,
				'X-QR-Timestamp': payload.timestamp,
			}

			if (webhook.secret) {
				const sig = await signPayload(body, webhook.secret)
				headers['X-QR-Signature'] = `sha256=${sig}`
			}

			await fetch(webhook.url, {
				method: 'POST',
				headers,
				body,
				signal: AbortSignal.timeout(5000),
			})
		}),
	)
}
