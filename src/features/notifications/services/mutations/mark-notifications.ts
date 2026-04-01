'use server'

import { createClient } from '@/shared/lib/supabase/server'

export const markAsRead = async (id: string) => {
	const supabase = await createClient()
	const { error } = await supabase
		.from('notifications')
		.update({ is_read: true })
		.eq('id', id)

	return { error }
}

export const markAllAsRead = async () => {
	const supabase = await createClient()
	const { error } = await supabase
		.from('notifications')
		.update({ is_read: true })
		.eq('is_read', false)

	return { error }
}
