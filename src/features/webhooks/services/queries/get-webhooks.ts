import { getSession } from '@/shared/lib/supabase/get-session'
import { createClient } from '@/shared/lib/supabase/server'
import type { Webhook } from '@/shared/types/database.types'

export const getWebhooks = async (): Promise<{
	data: Webhook[] | null
	error: string | null
}> => {
	const { data: session } = await getSession()
	if (!session?.user) return { data: null, error: 'No autenticado' }

	const supabase = await createClient()
	const { data, error } = await supabase
		.from('webhooks')
		.select('*')
		.eq('user_id', session.user.id)
		.order('created_at', { ascending: false })

	if (error) return { data: null, error: error.message }
	return { data: data as Webhook[], error: null }
}
