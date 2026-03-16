'use server'
import { getSession } from '@/shared/lib/supabase/get-session'
import { createClient } from '@/shared/lib/supabase/server'

export const getFavoriteQrs = async () => {
	const { data: session } = await getSession()
	if (!session?.user) return { error: 'Unauthenticated' }

	const supabase = await createClient()
	const { data, error } = await supabase
		.from('qrs')
		.select('*, folders(name)')
		.eq('user_id', session.user.id)
		.eq('is_favorite', true)
		.order('created_at', { ascending: false })

	if (error) return { error: error.message }
	return { data }
}
