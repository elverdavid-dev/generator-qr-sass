import { createHash } from 'node:crypto'
import { createAdminClient } from './supabase/admin'

export function hashApiKey(key: string): string {
	return createHash('sha256').update(key).digest('hex')
}

export function generateApiKey(): string {
	const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
	let random = ''
	const array = new Uint8Array(32)
	crypto.getRandomValues(array)
	for (const byte of array) {
		random += chars[byte % chars.length]
	}
	return `qrg_${random}`
}

export async function authenticateApiKey(
	request: Request,
): Promise<{ userId: string; keyId: string } | null> {
	const authHeader = request.headers.get('Authorization')
	if (!authHeader?.startsWith('Bearer ')) return null

	const key = authHeader.slice(7)
	if (!key.startsWith('qrg_')) return null

	const keyHash = hashApiKey(key)
	const supabase = createAdminClient()

	const { data } = await supabase
		.from('api_keys')
		.select('id, user_id, is_active')
		.eq('key_hash', keyHash)
		.single()

	if (!data || !data.is_active) return null

	// Actualizar last_used_at sin bloquear la respuesta
	supabase
		.from('api_keys')
		.update({ last_used_at: new Date().toISOString() })
		.eq('id', data.id)
		.then(() => {})

	return { userId: data.user_id, keyId: data.id }
}
