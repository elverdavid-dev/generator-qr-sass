'use server'
import { createAdminClient } from '@/shared/lib/supabase/admin'
import { getSession } from '@/shared/lib/supabase/get-session'
import { uploadImage } from '@/shared/lib/supabase/upload-image'

interface UpdateProfileData {
	name?: string
	surname?: string
	phone?: string
	avatar?: File | null
}

export const updateProfile = async (data: UpdateProfileData) => {
	const { data: session } = await getSession()
	if (!session?.user) return { error: 'No autenticado' }

	const supabase = createAdminClient()
	const userId = session.user.id

	let avatar_url: string | undefined

	if (data.avatar && data.avatar.size > 0) {
		const upload = await uploadImage(data.avatar, 'images', 'avatars')
		if ('error' in upload) return { error: upload.error }
		avatar_url = upload.url_image
	}

	const { error } = await supabase
		.from('profiles')
		.update({
			name: data.name || null,
			surname: data.surname || null,
			phone: data.phone || null,
			...(avatar_url && { avatar_url }),
		})
		.eq('id', userId)

	if (error) return { error: error.message }
	return { success: true }
}
