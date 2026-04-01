import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import ApiKeysManager from '@/features/api-keys/components/api-keys-manager'
import { getApiKeys } from '@/features/api-keys/services/api-key-actions'
import { getProfile } from '@/features/auth/services/queries/get-profile'
import type { PlanId } from '@/features/billing/config/plans'
import { hasFeature } from '@/features/billing/config/plans'
import { getSession } from '@/shared/lib/supabase/get-session'

export default async function ApiPage() {
	const { data: session } = await getSession()
	if (!session?.user) redirect('/login')

	const { data: profile } = await getProfile({ user_id: session.user.id })
	const plan = (profile?.plan ?? 'free') as PlanId

	if (!hasFeature(plan, 'api')) {
		redirect('/dashboard/billing')
	}

	const [{ data: keys }, t] = await Promise.all([
		getApiKeys(),
		getTranslations('api'),
	])

	const translations = {
		title: t('title'),
		subtitle: t('subtitle'),
		newKey: t('newKey'),
		noKeys: t('noKeys'),
		noKeysDesc: t('noKeysDesc'),
		created: t('created'),
		lastUsed: t('lastUsed'),
		never: t('never'),
		revoke: t('revoke'),
		revokeConfirm: t('revokeConfirm'),
		revokeDesc: t('revokeDesc'),
		cancel: t('cancel'),
		generating: t('generating'),
		keyReady: t('keyReady'),
		keyReadyDesc: t('keyReadyDesc'),
		copyKey: t('copyKey'),
		copied: t('copied'),
		close: t('close'),
		nameLabel: t('nameLabel'),
		namePlaceholder: t('namePlaceholder'),
		generate: t('generate'),
		docsTitle: t('docsTitle'),
		docsAuth: t('docsAuth'),
		active: t('active'),
	}

	return (
		<ApiKeysManager
			initialKeys={keys ?? []}
			baseUrl={process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}
			translations={translations}
		/>
	)
}
