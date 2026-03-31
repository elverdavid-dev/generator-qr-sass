'use server'
import type { QrFormData } from '@/features/qr-codes/schemas/qr-schema'
import { createAdminClient } from '@/shared/lib/supabase/admin'
import { uploadImage } from '@/shared/lib/supabase/upload-image'

export const updateQr = async (id: string, formData: Omit<Partial<QrFormData>, 'logo'>, logo?: File) => {
	const supabase = createAdminClient()

	let logo_url: string | undefined
	let logo_path: string | undefined

	if (logo && logo.size > 0) {
		const upload = await uploadImage(logo, 'images', 'logos')
		if ('error' in upload) return { error: upload.error }
		logo_url = upload.url_image
		logo_path = upload.image_path
	}

	const { data, error } = await supabase
		.from('qrs')
		.update({
			name: formData.name,
			qr_type: formData.qr_type,
			data: formData.data,
			bg_color: formData.bg_color,
			fg_color: formData.fg_color,
			dot_style: formData.dot_style,
			corner_square_style: formData.corner_square_style,
			corner_dot_style: formData.corner_dot_style,
			dot_color_2: formData.dot_color_2 ?? null,
			dot_gradient_type: formData.dot_gradient_type,
			frame_style: formData.frame_style,
			frame_color: formData.frame_color,
			frame_text: formData.frame_text,
			folder_id: formData.folder_id || null,
			password: formData.password || null,
			expires_at: formData.expires_at || null,
			max_scans: formData.max_scans ?? null,
			ios_url: formData.ios_url || null,
			android_url: formData.android_url || null,
			updated_at: new Date().toISOString(),
			...(logo_url && { logo_url, logo_path }),
		})
		.eq('id', id)
		.select()
		.single()

	if (error) return { error: error.message }
	return { data }
}
