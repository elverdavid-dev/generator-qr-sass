'use server'

import { createAdminClient } from '@/shared/lib/supabase/admin'
import { getSession } from '@/shared/lib/supabase/get-session'
import { revalidatePath } from 'next/cache'

const getAuthenticatedUserAndIds = async (ids: string[]) => {
	const { data: session } = await getSession()
	if (!session?.user) return { error: 'No autenticado' as const }
	if (!ids.length) return { error: 'No se seleccionaron QRs' as const }
	return { userId: session.user.id, supabase: createAdminClient() }
}

export const bulkDeleteQrs = async (ids: string[]) => {
	const result = await getAuthenticatedUserAndIds(ids)
	if ('error' in result) return { error: result.error }
	const { userId, supabase } = result

	const { error } = await supabase
		.from('qrs')
		.delete()
		.in('id', ids)
		.eq('user_id', userId)

	if (error) return { error: error.message }
	revalidatePath('/dashboard/qrs')
	return { success: true }
}

export const bulkToggleActive = async (ids: string[], isActive: boolean) => {
	const result = await getAuthenticatedUserAndIds(ids)
	if ('error' in result) return { error: result.error }
	const { userId, supabase } = result

	const { error } = await supabase
		.from('qrs')
		.update({ is_active: isActive })
		.in('id', ids)
		.eq('user_id', userId)

	if (error) return { error: error.message }
	revalidatePath('/dashboard/qrs')
	return { success: true }
}

export const bulkMoveToFolder = async (ids: string[], folderId: string | null) => {
	const result = await getAuthenticatedUserAndIds(ids)
	if ('error' in result) return { error: result.error }
	const { userId, supabase } = result

	const { error } = await supabase
		.from('qrs')
		.update({ folder_id: folderId })
		.in('id', ids)
		.eq('user_id', userId)

	if (error) return { error: error.message }
	revalidatePath('/dashboard/qrs')
	return { success: true }
}
