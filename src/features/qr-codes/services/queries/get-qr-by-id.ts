'use server'
import { createClient } from '@/shared/lib/supabase/server'

export const getQrById = async (id: string) => {
	const supabase = await createClient()
	const { data, error } = await supabase
		.from('qrs')
		.select('*')
		.eq('id', id)
		.single()

	if (error) return { error: error.message }
	return { data }
}
