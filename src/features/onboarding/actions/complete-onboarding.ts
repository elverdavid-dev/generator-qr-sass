'use server'

import { createClient } from '@/shared/lib/supabase/server'
import { getSession } from '@/shared/lib/supabase/get-session'
import { revalidatePath } from 'next/cache'

export const completeOnboarding = async () => {
	const { data: session } = await getSession()
	if (!session?.user) return { error: 'No autenticado' }

	const supabase = await createClient()
	const { error } = await supabase
		.from('profiles')
		.update({ onboarding_completed: true })
		.eq('id', session.user.id)

	if (error) return { error: error.message }
	revalidatePath('/dashboard')
	return { success: true }
}
