import type { EmailOtpType } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'
import { createProfile } from '@/features/auth/services/create-profile'
import { createClient } from '@/shared/lib/supabase/server'

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url)
	const token_hash = searchParams.get('token_hash')
	const type = searchParams.get('type') as EmailOtpType | null
	const next = searchParams.get('next') ?? '/'

	if (!token_hash || !type) {
		redirect('/error')
	}

	const supabase = await createClient()
	const { error, data } = await supabase.auth.verifyOtp({ type, token_hash })

	if (error) {
		console.error('verifyOtp error', error)
		redirect('/error')
	}

	if (data.user) {
		const { error: errorCreateUserProfile } = await createProfile({
			id: data.user.id,
			email: data.user.user_metadata.email,
		})
		if (errorCreateUserProfile) {
			console.error('errorCreateUserProfile', errorCreateUserProfile)
		}
	}

	redirect(next)
}
