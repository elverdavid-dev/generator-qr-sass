'use server'

import { revalidatePath } from 'next/cache'
import type { PlanId } from '@/features/billing/config/plans'
import { hasFeature } from '@/features/billing/config/plans'
import { createAdminClient } from '@/shared/lib/supabase/admin'
import { getSession } from '@/shared/lib/supabase/get-session'

const MAX_TEAM_MEMBERS = 10

export const inviteMember = async (
	email: string,
	role: 'admin' | 'member' = 'member',
) => {
	const { data: session } = await getSession()
	if (!session?.user) return { error: 'No autenticado' }

	const supabase = createAdminClient()

	const { data: profile } = await supabase
		.from('profiles')
		.select('plan, name, email')
		.eq('id', session.user.id)
		.single()

	if (!hasFeature((profile?.plan ?? 'free') as PlanId, 'teamManagement')) {
		return { error: 'Requiere plan Business' }
	}

	if (email === profile?.email) {
		return { error: 'No puedes invitarte a ti mismo' }
	}

	// Verificar límite de miembros
	const { count } = await supabase
		.from('team_members')
		.select('id', { count: 'exact', head: true })
		.eq('owner_id', session.user.id)
		.eq('status', 'active')

	if ((count ?? 0) >= MAX_TEAM_MEMBERS) {
		return { error: `Límite de ${MAX_TEAM_MEMBERS} miembros alcanzado` }
	}

	// Verificar si ya está invitado
	const { data: existing } = await supabase
		.from('team_members')
		.select('id, status')
		.eq('owner_id', session.user.id)
		.eq('email', email)
		.single()

	if (existing) {
		return {
			error:
				existing.status === 'active'
					? 'Ya es miembro del equipo'
					: 'Ya tiene una invitación pendiente',
		}
	}

	// Buscar si el usuario ya existe en la plataforma
	const { data: memberProfile } = await supabase
		.from('profiles')
		.select('id')
		.eq('email', email)
		.single()

	const { data: invite, error } = await supabase
		.from('team_members')
		.insert({
			owner_id: session.user.id,
			member_id: memberProfile?.id ?? null,
			email,
			role,
		})
		.select('token')
		.single()

	if (error) return { error: error.message }

	// Enviar email de invitación usando Supabase auth email
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
	const inviteUrl = `${baseUrl}/invite/${invite.token}`
	const ownerName = profile?.name ?? 'Un usuario'

	// Usar Supabase admin para enviar email (inviteUserByEmail)
	await supabase.auth.admin.inviteUserByEmail(email, {
		redirectTo: inviteUrl,
		data: {
			invite_token: invite.token,
			owner_name: ownerName,
		},
	})

	revalidatePath('/dashboard/team')
	return { success: true, inviteUrl }
}

export const removeMember = async (memberId: string) => {
	const { data: session } = await getSession()
	if (!session?.user) return { error: 'No autenticado' }

	const supabase = createAdminClient()

	const { error } = await supabase
		.from('team_members')
		.delete()
		.eq('id', memberId)
		.eq('owner_id', session.user.id)

	if (error) return { error: error.message }

	revalidatePath('/dashboard/team')
	return { success: true }
}

export const acceptInvite = async (token: string) => {
	const { data: session } = await getSession()
	if (!session?.user) return { error: 'No autenticado' }

	const supabase = createAdminClient()

	const { data: invite, error: fetchError } = await supabase
		.from('team_members')
		.select('id, owner_id, email, status')
		.eq('token', token)
		.single()

	if (fetchError || !invite) return { error: 'Invitación no válida o expirada' }
	if (invite.status === 'active')
		return { error: 'Esta invitación ya fue aceptada' }

	// Validate that the logged-in user's email matches the invite
	if (session.user.email?.toLowerCase() !== invite.email.toLowerCase()) {
		return { error: 'Esta invitación es para otro usuario' }
	}

	const { error } = await supabase
		.from('team_members')
		.update({
			member_id: session.user.id,
			status: 'active',
			joined_at: new Date().toISOString(),
			token: null,
		})
		.eq('id', invite.id)

	if (error) return { error: error.message }

	return { success: true, ownerId: invite.owner_id }
}

export const getTeamMembers = async () => {
	const { data: session } = await getSession()
	if (!session?.user) return { error: 'No autenticado' }

	const supabase = createAdminClient()

	const { data, error } = await supabase
		.from('team_members')
		.select(
			'id, email, role, status, invited_at, joined_at, profiles!member_id(name, avatar_url)',
		)
		.eq('owner_id', session.user.id)
		.order('invited_at', { ascending: false })

	if (error) return { error: error.message }
	return { data }
}

export const getMyTeam = async () => {
	const { data: session } = await getSession()
	if (!session?.user) return null

	const supabase = createAdminClient()

	const { data } = await supabase
		.from('team_members')
		.select('owner_id, role, profiles!owner_id(name, email, avatar_url)')
		.eq('member_id', session.user.id)
		.eq('status', 'active')
		.single()

	return data ?? null
}
