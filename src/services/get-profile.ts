import { createClient } from '@/lib/supabase/server'

interface Params {
	user_id: string
}

export const getProfile = async ({ user_id }: Params) => {
	const supabase = await createClient()

	const { data, error } = await supabase
		.from('profiles')
		.select('*')
		.eq('id', user_id)
		.single()

	if (error) {
		return { error: "User doesn't exist" }
	}
	return { data }
}
