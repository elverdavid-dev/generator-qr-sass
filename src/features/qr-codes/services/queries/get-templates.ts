'use server'

import { createClient } from '@/shared/lib/supabase/server'
import { getSession } from '@/shared/lib/supabase/get-session'

export const getTemplates = async () => {
	const { data: session } = await getSession()
	if (!session?.user) return { data: [], error: 'No autenticado' }

	const supabase = await createClient()
	const { data, error } = await supabase
		.from('qr_templates')
		.select('*')
		.eq('user_id', session.user.id)
		.order('created_at', { ascending: false })

	return { data: data ?? [], error: error?.message ?? null }
}
