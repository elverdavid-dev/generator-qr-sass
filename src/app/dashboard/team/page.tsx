import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getSession } from '@/shared/lib/supabase/get-session'
import { getProfile } from '@/features/auth/services/queries/get-profile'
import { hasFeature } from '@/features/billing/config/plans'
import type { PlanId } from '@/features/billing/config/plans'
import { getTeamMembers } from '@/features/team/services/team-actions'
import TeamManager from '@/features/team/components/team-manager'

export default async function TeamPage() {
	const { data: session } = await getSession()
	if (!session?.user) redirect('/login')

	const { data: profile } = await getProfile({ user_id: session.user.id })
	const plan = (profile?.plan ?? 'free') as PlanId

	if (!hasFeature(plan, 'teamManagement')) {
		redirect('/dashboard/billing')
	}

	const [{ data: members }, t] = await Promise.all([
		getTeamMembers(),
		getTranslations('team'),
	])

	const translations = {
		title: t('title'),
		subtitle: t('subtitle'),
		invite: t('invite'),
		noMembers: t('noMembers'),
		noMembersDesc: t('noMembersDesc'),
		emailLabel: t('emailLabel'),
		roleLabel: t('roleLabel'),
		roleMember: t('roleMember'),
		roleAdmin: t('roleAdmin'),
		sendInvite: t('sendInvite'),
		sending: t('sending'),
		cancel: t('cancel'),
		remove: t('remove'),
		removeConfirm: t('removeConfirm'),
		removeDesc: t('removeDesc'),
		pending: t('pending'),
		active: t('active'),
		admin: t('admin'),
		member: t('member'),
		joined: t('joined'),
		invited: t('invited'),
		never: t('never'),
		inviteSent: t('inviteSent'),
		inviteLink: t('inviteLink'),
		copyLink: t('copyLink'),
		copied: t('copied'),
		slotsUsed: t('slotsUsed'),
	}

	return (
		<TeamManager
			initialMembers={(members ?? []) as Parameters<typeof TeamManager>[0]['initialMembers']}
			maxMembers={10}
			translations={translations}
		/>
	)
}
