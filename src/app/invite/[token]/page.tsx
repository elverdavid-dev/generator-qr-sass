import { redirect } from 'next/navigation'
import { getSession } from '@/shared/lib/supabase/get-session'
import { acceptInvite } from '@/features/team/services/team-actions'
import { createAdminClient } from '@/shared/lib/supabase/admin'
import AcceptInviteClient from './accept-invite-client'

interface Props {
	params: Promise<{ token: string }>
}

export default async function InvitePage({ params }: Props) {
	const { token } = await params

	// Verificar que la invitación existe
	const supabase = createAdminClient()
	const { data: invite } = await supabase
		.from('team_members')
		.select('id, email, status, profiles!owner_id(name, email)')
		.eq('token', token)
		.single()

	if (!invite || invite.status === 'active') {
		redirect('/dashboard')
	}

	const { data: session } = await getSession()

	// Si no está logueado, redirigir al login con el token como next
	if (!session?.user) {
		redirect(`/login?next=/invite/${token}`)
	}

	// Si está logueado, aceptar automáticamente
	const result = await acceptInvite(token)

	if ('error' in result) {
		redirect('/dashboard')
	}

	const rawProfile = invite.profiles as unknown
	const ownerProfile = Array.isArray(rawProfile)
		? (rawProfile[0] as { name: string | null; email: string } | undefined) ?? null
		: (rawProfile as { name: string | null; email: string } | null)

	return (
		<AcceptInviteClient
			ownerName={ownerProfile?.name ?? ownerProfile?.email ?? 'tu equipo'}
		/>
	)
}
