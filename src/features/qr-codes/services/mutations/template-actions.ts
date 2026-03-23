'use server'

import { revalidatePath } from 'next/cache'
import { hasFeature } from '@/features/billing/config/plans'
import { getSession } from '@/shared/lib/supabase/get-session'
import { createClient } from '@/shared/lib/supabase/server'

export interface TemplateData {
	name: string
	fg_color: string
	bg_color: string
	dot_style: string
	corner_square_style: string
	corner_dot_style: string
	dot_color_2?: string | null
	dot_gradient_type: string
	frame_style: string
	frame_color: string
	frame_text: string
	logo_url?: string | null
}

export const saveTemplate = async (data: TemplateData) => {
	const { data: session } = await getSession()
	if (!session?.user) return { error: 'No autenticado' }

	const supabase = await createClient()

	const { data: profile } = await supabase
		.from('profiles')
		.select('plan')
		.eq('id', session.user.id)
		.single()

	if (!profile || !hasFeature(profile.plan, 'templates')) {
		return { error: 'Requiere plan Pro' }
	}

	const { error } = await supabase
		.from('qr_templates')
		.insert({ ...data, user_id: session.user.id })

	if (error) return { error: error.message }
	revalidatePath('/dashboard/qrs/new')
	return { success: true }
}

export const deleteTemplate = async (id: string) => {
	const { data: session } = await getSession()
	if (!session?.user) return { error: 'No autenticado' }

	const supabase = await createClient()
	const { error } = await supabase
		.from('qr_templates')
		.delete()
		.eq('id', id)
		.eq('user_id', session.user.id)

	if (error) return { error: error.message }
	revalidatePath('/dashboard/qrs/new')
	return { success: true }
}
