import type { EmailOtpType } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'
import { createProfile } from '@/features/auth/services/create-profile'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
	// obtener los params de la url
	const { searchParams } = new URL(request.url)
	// obtener el token_hash
	const token_hash = searchParams.get('token_hash')
	// obtener el type
	const type = searchParams.get('type') as EmailOtpType | null
	// obtener el next
	const next = searchParams.get('next') ?? '/'

	try {
		// verificar si el token_hash y el type existen
		if (token_hash && type) {
			const supabase = await createClient()
			// verificar el token_hash y el type
			const { error, data } = await supabase.auth.verifyOtp({
				type,
				token_hash,
			})

			// verificar si el usuario existe
			if (data.user) {
				// crear el perfil del usuario
				const { error: errorCreateUserProfile } = await createProfile({
					id: data.user.id,
					email: data.user.user_metadata.email,
				})
				// verificar si hay un error al crear el perfil
				if (errorCreateUserProfile) {
					console.error('errorCreateUserProfile', errorCreateUserProfile)
				}
			}

			// verificar si hay un error
			if (!error) {
				// redirigir al usuario a la url de redireccionamiento
				redirect(next)
			}
		}
	} catch (error) {
		// verificar si hay un error
		console.error('error', error)
		redirect('/error')
	}
}
