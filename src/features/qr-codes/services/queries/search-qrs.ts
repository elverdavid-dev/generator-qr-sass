'use server'
import { QRS_PAGE_SIZE } from '@/features/qr-codes/constants'
import { getSession } from '@/shared/lib/supabase/get-session'
import { createClient } from '@/shared/lib/supabase/server'

export const searchQrs = async (query: string, page = 1) => {
	const { data: session } = await getSession()
	if (!session?.user) return { error: 'No autenticado' }

	const supabase = await createClient()
	const from = (page - 1) * QRS_PAGE_SIZE
	const to = from + QRS_PAGE_SIZE - 1

	const { data, error, count } = await supabase
		.from('qrs')
		.select('*, folders(name)', { count: 'exact' })
		.eq('user_id', session.user.id)
		.ilike('name', `%${query}%`)
		.order('created_at', { ascending: false })
		.range(from, to)

	if (error) return { error: error.message }
	return { data, count: count ?? 0 }
}
