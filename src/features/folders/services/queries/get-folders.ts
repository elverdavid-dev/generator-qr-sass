'use server'
import { getSession } from '@/shared/lib/supabase/get-session'
import { createClient } from '@/shared/lib/supabase/server'

export const getFolders = async () => {
	const { data: session } = await getSession()
	if (!session?.user) return { error: 'No autenticado' }

	const supabase = await createClient()
	const { data, error } = await supabase
		.from('folders')
		.select('id, name, slug, created_at, qrs(count)')
		.eq('user_id', session.user.id)
		.order('created_at', { ascending: false })

	if (error) return { error: error.message }

	// Flatten the count from Supabase aggregation
	const folders = data.map((f) => ({
		id: f.id,
		user_id: session.user.id,
		name: f.name,
		slug: f.slug,
		created_at: f.created_at,
		qr_count: (f.qrs as unknown as { count: number }[])[0]?.count ?? 0,
	}))

	return { data: folders }
}
