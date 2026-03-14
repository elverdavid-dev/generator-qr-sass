'use server'
import { createAdminClient } from '@/shared/lib/supabase/admin'
import { uploadImage } from '@/shared/lib/supabase/upload-image'
import type { QrFormData } from '@/features/qr-codes/schemas/qr-schema'

export const updateQr = async (id: string, formData: Partial<QrFormData>) => {
	const supabase = createAdminClient()

	let logo_url: string | undefined
	let logo_path: string | undefined

	if (formData.logo && formData.logo.size > 0) {
		const upload = await uploadImage(formData.logo, 'images', 'logos')
		if ('error' in upload) return { error: upload.error }
		logo_url = upload.url_image
		logo_path = upload.image_path
	}

	const { data, error } = await supabase
		.from('qrs')
		.update({
			name: formData.name,
			data: formData.data,
			bg_color: formData.bg_color,
			fg_color: formData.fg_color,
			folder_id: formData.folder_id ?? null,
			updated_at: new Date().toISOString(),
			...(logo_url && { logo_url, logo_path }),
		})
		.eq('id', id)
		.select()
		.single()

	if (error) return { error: error.message }
	return { data }
}
