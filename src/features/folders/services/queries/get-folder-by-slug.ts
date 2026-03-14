'use server'
import { createClient } from '@/shared/lib/supabase/server'

export const getFolderBySlug = async (slug: string) => {
	const supabase = await createClient()
	const { data, error } = await supabase
		.from('folders')
		.select('*')
		.eq('slug', slug)
		.single()

	if (error) return { error: error.message }
	return { data }
}
