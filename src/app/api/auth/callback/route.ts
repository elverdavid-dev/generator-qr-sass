import { NextResponse } from 'next/server'
import { createProfile } from '@/features/auth/services/create-profile'
import { createClient } from '@/shared/lib/supabase/server'
import { getProfile } from '@/features/auth/services/queries/get-profile'

export async function GET(request: Request) {
	try {
		const { searchParams, origin } = new URL(request.url)
		const code = searchParams.get('code')
		// si next esta en los params, usarlo como la url de redireccionamiento
		const next = searchParams.get('next') ?? '/'

		// si el codigo existe significa que el usuario se ha autenticado correctamente
		if (code) {
			const supabase = await createClient()
			// intercambiar el codigo por una sesion
			const { error, data } = await supabase.auth.exchangeCodeForSession(code)

			// si hay un error, redirigir al usuario a la url de error
			if (error) {
				return NextResponse.redirect(`${origin}/error`)
			}

			// verificar si el usuario ya tiene un perfil creado
			const { data: userProfile } = await getProfile({
				user_id: data.user.id,
			})

			// si el usuario no tiene un perfil creado, crear uno
			if (data.session && !userProfile) {
				const { error: errorCreateUserProfile } = await createProfile({
					id: data.user.id,
					email: data.user.user_metadata?.email,
					name: data.user.user_metadata?.name,
					phone: data.user.phone,
					avatar_url: data.user.user_metadata?.avatar_url,
				})

				// si hay un error al crear el perfil, mostrarlo en la consola
				if (errorCreateUserProfile) {
					console.error('errorCreateUserProfile', errorCreateUserProfile)
				}
			}

			// si no hay error, redirigir al usuario a la url de redireccionamiento
			if (!error) {
				const forwardedHost = request.headers.get('x-forwarded-host')

				// si el entorno es local, redirigir al usuario a la url de redireccionamiento
				const isLocalEnv = process.env.NODE_ENV === 'development'

				if (isLocalEnv) {
					// si el entorno es local, redirigir al usuario a la url de redireccionamiento
					return NextResponse.redirect(`${origin}${next}`)
				} else if (forwardedHost) {
					// si el entorno es de produccion, redirigir al usuario a la url de redireccionamiento
					return NextResponse.redirect(`https://${forwardedHost}${next}`)
				} else {
					// si el entorno es de produccion, redirigir al usuario a la url de redireccionamiento
					return NextResponse.redirect(`${origin}${next}`)
				}
			}
		}

		// si hay un error, redirigir al usuario a la url de error
		return NextResponse.redirect(`${origin}/`)
	} catch (error) {
		console.error('error', error)
		return NextResponse.redirect(`${origin}/error`)
	}
}
