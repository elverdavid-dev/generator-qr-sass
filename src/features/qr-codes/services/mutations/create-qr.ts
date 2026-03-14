'use server'
import { createAdminClient } from '@/shared/lib/supabase/admin'
import { getSession } from '@/shared/lib/supabase/get-session'
import { uploadImage } from '@/shared/lib/supabase/upload-image'
import { generateSlug } from '@/shared/utils/generate-slug'
import type { QrFormData } from '@/features/qr-codes/schemas/qr-schema'

export const createQr = async (formData: QrFormData) => {
	const { data: session } = await getSession()
	if (!session?.user) return { error: 'No autenticado' }

	const supabase = createAdminClient()

	let logo_url: string | null = null
	let logo_path: string | null = null

	// Upload logo if provided
	if (formData.logo && formData.logo.size > 0) {
		const upload = await uploadImage(formData.logo, 'images', 'logos')
		if ('error' in upload) return { error: upload.error }
		logo_url = upload.url_image
		logo_path = upload.image_path
	}

	const slug = generateSlug(formData.name)

	const { data, error } = await supabase
		.from('qrs')
		.insert({
			user_id: session.user.id,
			name: formData.name,
			qr_type: formData.qr_type,
			data: formData.data,
			bg_color: formData.bg_color,
			fg_color: formData.fg_color,
			dot_style: formData.dot_style ?? 'square',
			corner_square_style: formData.corner_square_style ?? 'square',
			corner_dot_style: formData.corner_dot_style ?? 'square',
			folder_id: formData.folder_id ?? null,
			slug,
			logo_url,
			logo_path,
		})
		.select()
		.single()

	if (error) return { error: error.message }
	return { data }
}
