'use server'
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/shared/lib/supabase/admin'
import { generateSlug } from '@/shared/utils/generate-slug'

export const updateFolder = async (id: string, name: string) => {
	const supabase = createAdminClient()
	const slug = generateSlug(name)

	const { data, error } = await supabase
		.from('folders')
		.update({ name, slug })
		.eq('id', id)
		.select()
		.single()

	if (error) return { error: error.message }
	revalidatePath('/dashboard/qrs')
	return { data }
}
