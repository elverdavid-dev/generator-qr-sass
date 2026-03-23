'use server'

import { revalidatePath } from 'next/cache'
import type { PlanId } from '@/features/billing/config/plans'
import { hasFeature } from '@/features/billing/config/plans'
import { getSession } from '@/shared/lib/supabase/get-session'
import { createClient } from '@/shared/lib/supabase/server'

interface CreateWebhookData {
	name: string
	url: string
	secret?: string
}

export const createWebhook = async (data: CreateWebhookData) => {
	const { data: session } = await getSession()
	if (!session?.user) return { error: 'No autenticado' }

	const supabase = await createClient()
	const { data: profile } = await supabase
		.from('profiles')
		.select('plan')
		.eq('id', session.user.id)
		.single()

	if (!hasFeature((profile?.plan ?? 'free') as PlanId, 'webhooks')) {
		return { error: 'Plan Business requerido' }
	}

	const { error } = await supabase.from('webhooks').insert({
		user_id: session.user.id,
		name: data.name,
		url: data.url,
		secret: data.secret ?? null,
	})

	if (error) return { error: error.message }
	revalidatePath('/dashboard/webhooks')
	return { success: true }
}

export const deleteWebhook = async (id: string) => {
	const { data: session } = await getSession()
	if (!session?.user) return { error: 'No autenticado' }

	const supabase = await createClient()
	const { error } = await supabase
		.from('webhooks')
		.delete()
		.eq('id', id)
		.eq('user_id', session.user.id)

	if (error) return { error: error.message }
	revalidatePath('/dashboard/webhooks')
	return { success: true }
}

export const toggleWebhook = async (id: string, is_active: boolean) => {
	const { data: session } = await getSession()
	if (!session?.user) return { error: 'No autenticado' }

	const supabase = await createClient()
	const { error } = await supabase
		.from('webhooks')
		.update({ is_active })
		.eq('id', id)
		.eq('user_id', session.user.id)

	if (error) return { error: error.message }
	revalidatePath('/dashboard/webhooks')
	return { success: true }
}
