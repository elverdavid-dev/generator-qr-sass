'use server'
import { createClient } from '@/shared/lib/supabase/server'
import { getSession } from '@/shared/lib/supabase/get-session'

export const getQrs = async () => {
	const { data: session } = await getSession()
	if (!session?.user) return { error: 'No autenticado' }

	const supabase = await createClient()
	const { data, error } = await supabase
		.from('qrs')
		.select('*, folders(name)')
		.eq('user_id', session.user.id)
		.order('created_at', { ascending: false })

	if (error) return { error: error.message }
	return { data }
}
