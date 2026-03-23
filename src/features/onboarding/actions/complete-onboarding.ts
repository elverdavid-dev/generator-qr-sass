'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/shared/lib/supabase/admin'
import { getSession } from '@/shared/lib/supabase/get-session'

export const completeOnboarding = async () => {
	const { data: session } = await getSession()
	if (!session?.user) return { error: 'No autenticado' }

	const supabase = createAdminClient()
	const { error } = await supabase
		.from('profiles')
		.update({ onboarding_completed: true })
		.eq('id', session.user.id)

	if (error) return { error: error.message }
	revalidatePath('/dashboard')
	return { success: true }
}
