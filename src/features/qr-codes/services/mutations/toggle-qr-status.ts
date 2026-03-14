'use server'
import { createAdminClient } from '@/shared/lib/supabase/admin'

export const toggleQrStatus = async (id: string, is_active: boolean) => {
	const supabase = createAdminClient()
	const { data, error } = await supabase
		.from('qrs')
		.update({ is_active, updated_at: new Date().toISOString() })
		.eq('id', id)
		.select()
		.single()

	if (error) return { error: error.message }
	return { data }
}
