'use server'
import { createAdminClient } from '@/shared/lib/supabase/admin'
import { getSession } from '@/shared/lib/supabase/get-session'
import { uploadImage } from '@/shared/lib/supabase/upload-image'
import { generateSlug } from '@/shared/utils/generate-slug'
import type { QrFormData } from '@/features/qr-codes/schemas/qr-schema'
import { canCreateQr } from '@/features/billing/config/plans'
import type { PlanId } from '@/features/billing/config/plans'

export const createQr = async (formData: QrFormData) => {
	const { data: session } = await getSession()
	if (!session?.user) return { error: 'No autenticado' }

	const supabase = createAdminClient()

	// Enforce plan limits
	const { data: profile } = await supabase
		.from('profiles')
		.select('plan')
		.eq('id', session.user.id)
		.single()

	const plan = (profile?.plan ?? 'free') as PlanId
	const { count } = await supabase
		.from('qrs')
		.select('id', { count: 'exact', head: true })
		.eq('user_id', session.user.id)

	if (!canCreateQr(plan, count ?? 0)) {
		return {
			error: 'Has alcanzado el límite de QR codes de tu plan. Actualiza a Pro para crear ilimitados.',
		}
	}

	let logo_url: string | null = null
	let logo_path: string | null = null

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
			dot_color_2: formData.dot_color_2 ?? null,
			dot_gradient_type: formData.dot_gradient_type ?? 'linear',
			frame_style: formData.frame_style ?? 'none',
			frame_color: formData.frame_color ?? '#000000',
			frame_text: formData.frame_text ?? 'ESCANÉAME',
			folder_id: formData.folder_id || null,
			password: formData.password || null,
			expires_at: formData.expires_at || null,
			max_scans: formData.max_scans ?? null,
			ios_url: formData.ios_url || null,
			android_url: formData.android_url || null,
			slug,
			logo_url,
			logo_path,
		})
		.select()
		.single()

	if (error) return { error: error.message }
	return { data }
}
