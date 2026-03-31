'use server'
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/shared/lib/supabase/admin'
import { getSession } from '@/shared/lib/supabase/get-session'
import { generateSlug } from '@/shared/utils/generate-slug'

export const createFolder = async (name: string) => {
	const { data: session } = await getSession()
	if (!session?.user) return { error: 'No autenticado' }

	const supabase = createAdminClient()
	const slug = generateSlug(name)

	const { data, error } = await supabase
		.from('folders')
		.insert({ name, slug, user_id: session.user.id })
		.select()
		.single()

	if (error) return { error: error.message }
	revalidatePath('/dashboard/qrs')
	return { data }
}
