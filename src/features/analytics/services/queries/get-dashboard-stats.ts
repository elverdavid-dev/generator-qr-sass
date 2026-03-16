'use server'
import { createClient } from '@/shared/lib/supabase/server'
import { getSession } from '@/shared/lib/supabase/get-session'

export const getDashboardStats = async () => {
	const { data: session } = await getSession()
	if (!session?.user) return { error: 'No autenticado' }

	const supabase = await createClient()
	const userId = session.user.id

	const now = new Date()
	const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
	const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

	const [totalQrsRes, activeQrsRes, todayRes, monthRes, recentQrsRes] = await Promise.all([
		supabase.from('qrs').select('id', { count: 'exact', head: true }).eq('user_id', userId),
		supabase.from('qrs').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('is_active', true),
		supabase.from('qr_scans').select('id', { count: 'exact', head: true }).eq('user_id', userId).gte('created_at', startOfToday),
		supabase.from('qr_scans').select('id', { count: 'exact', head: true }).eq('user_id', userId).gte('created_at', startOfMonth),
		supabase.from('qrs').select('*, folders(name)').eq('user_id', userId).order('created_at', { ascending: false }).limit(5),
	])

	return {
		data: {
			totalQrs: totalQrsRes.count ?? 0,
			activeQrs: activeQrsRes.count ?? 0,
			todayScans: todayRes.count ?? 0,
			monthScans: monthRes.count ?? 0,
			recentQrs: recentQrsRes.data ?? [],
		},
	}
}
