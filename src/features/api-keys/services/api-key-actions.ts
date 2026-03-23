'use server'

import { revalidatePath } from 'next/cache'
import { generateApiKey, hashApiKey } from '@/shared/lib/api-key-auth'
import { createAdminClient } from '@/shared/lib/supabase/admin'
import { getSession } from '@/shared/lib/supabase/get-session'
import { hasFeature } from '@/features/billing/config/plans'
import type { PlanId } from '@/features/billing/config/plans'

export const createApiKey = async (name: string) => {
	const { data: session } = await getSession()
	if (!session?.user) return { error: 'No autenticado' }

	const supabase = createAdminClient()

	const { data: profile } = await supabase
		.from('profiles')
		.select('plan')
		.eq('id', session.user.id)
		.single()

	if (!hasFeature((profile?.plan ?? 'free') as PlanId, 'api')) {
		return { error: 'Requiere plan Business' }
	}

	const rawKey = generateApiKey()
	const keyHash = hashApiKey(rawKey)
	const keyPrefix = rawKey.slice(0, 12)

	const { data: inserted, error } = await supabase
		.from('api_keys')
		.insert({
			user_id: session.user.id,
			name,
			key_hash: keyHash,
			key_prefix: keyPrefix,
		})
		.select('id')
		.single()

	if (error || !inserted) return { error: error?.message ?? 'Error al crear la clave' }

	revalidatePath('/dashboard/api')
	// Devolvemos la key en texto plano UNA SOLA VEZ
	return { key: rawKey, id: inserted.id }
}

export const revokeApiKey = async (id: string) => {
	const { data: session } = await getSession()
	if (!session?.user) return { error: 'No autenticado' }

	const supabase = createAdminClient()

	const { error } = await supabase
		.from('api_keys')
		.delete()
		.eq('id', id)
		.eq('user_id', session.user.id)

	if (error) return { error: error.message }

	revalidatePath('/dashboard/api')
	return { success: true }
}

export const getApiKeys = async () => {
	const { data: session } = await getSession()
	if (!session?.user) return { error: 'No autenticado' }

	const supabase = createAdminClient()

	const { data, error } = await supabase
		.from('api_keys')
		.select('id, name, key_prefix, is_active, last_used_at, created_at')
		.eq('user_id', session.user.id)
		.order('created_at', { ascending: false })

	if (error) return { error: error.message }
	return { data }
}
