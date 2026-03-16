'use server'
import { revalidatePath } from 'next/cache'
import { getSession } from '@/shared/lib/supabase/get-session'
import { createClient } from '@/shared/lib/supabase/server'

export const toggleQrFavorite = async (qrId: string, isFavorite: boolean) => {
	const { data: session } = await getSession()
	if (!session?.user) return { error: 'Unauthenticated' }

	const supabase = await createClient()
	const { error } = await supabase
		.from('qrs')
		.update({ is_favorite: isFavorite })
		.eq('id', qrId)
		.eq('user_id', session.user.id)

	if (error) return { error: error.message }

	revalidatePath('/dashboard/qrs')
	revalidatePath('/dashboard/favorites')
	return { success: true }
}
