'use server'
import { redirect } from 'next/navigation'
import { createClient } from '@/shared/lib/supabase/server'

interface Params {
	redirect_url?: string
}
export const loginGoogleService = async ({ redirect_url }: Params) => {
	const supabase = await createClient()
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

	const { data } = await supabase.auth.signInWithOAuth({
		provider: 'google',
		options: {
			redirectTo: `${baseUrl}/api/auth/callback?next=${redirect_url}`,
			queryParams: {
				access_type: 'offline',
				prompt: 'consent',
			},
		},
	})

	if (data.url) {
		redirect(data.url)
	}
}
