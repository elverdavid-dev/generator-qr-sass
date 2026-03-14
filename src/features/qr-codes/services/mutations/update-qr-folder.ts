'use server'
import { createAdminClient } from '@/shared/lib/supabase/admin'

export const updateQrFolder = async (qrId: string, folderId: string | null) => {
	const supabase = createAdminClient()
	const { data, error } = await supabase
		.from('qrs')
		.update({ folder_id: folderId, updated_at: new Date().toISOString() })
		.eq('id', qrId)
		.select()
		.single()

	if (error) return { error: error.message }
	return { data }
}
