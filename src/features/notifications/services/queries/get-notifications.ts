'use server'

import { createClient } from '@/shared/lib/supabase/server'
import type { Notification } from '@/shared/types/database.types'

export const getNotifications = async (limit = 20) => {
	const supabase = await createClient()
	const { data, error } = await supabase
		.from('notifications')
		.select('*')
		.order('created_at', { ascending: false })
		.limit(limit)

	return { data: (data as Notification[]) ?? [], error }
}

export const getUnreadCount = async () => {
	const supabase = await createClient()
	const { count, error } = await supabase
		.from('notifications')
		.select('id', { count: 'exact', head: true })
		.eq('is_read', false)

	return { count: count ?? 0, error }
}
