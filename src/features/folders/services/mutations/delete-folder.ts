'use server'
import { createAdminClient } from '@/shared/lib/supabase/admin'

export const deleteFolder = async (id: string) => {
	const supabase = createAdminClient()

	// QRs with this folder_id will have folder_id set to null (ON DELETE SET NULL)
	const { error } = await supabase.from('folders').delete().eq('id', id)

	if (error) return { error: error.message }
	return { success: true }
}
