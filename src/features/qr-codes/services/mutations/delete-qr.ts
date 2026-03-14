'use server'
import { createAdminClient } from '@/shared/lib/supabase/admin'

export const deleteQr = async (id: string) => {
	const supabase = createAdminClient()

	// Get logo_path before deleting to clean up storage
	const { data: qr } = await supabase
		.from('qrs')
		.select('logo_path')
		.eq('id', id)
		.single()

	const { error } = await supabase.from('qrs').delete().eq('id', id)
	if (error) return { error: error.message }

	// Clean up logo from storage if exists
	if (qr?.logo_path) {
		await supabase.storage.from('images').remove([qr.logo_path])
	}

	return { success: true }
}
