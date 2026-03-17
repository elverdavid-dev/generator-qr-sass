import { BreadcrumbItem, Breadcrumbs } from '@heroui/breadcrumbs'
import { Home01Icon, WebhookIcon, Crown02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { getSession } from '@/shared/lib/supabase/get-session'
import { getProfile } from '@/features/auth/services/queries/get-profile'
import { getWebhooks } from '@/features/webhooks/services/queries/get-webhooks'
import WebhookList from '@/features/webhooks/components/webhook-list'

const WebhooksPage = async () => {
	const t = await getTranslations('webhooks')
	const { data: session } = await getSession()
	if (!session?.user) redirect('/login')

	const { data: profile } = await getProfile({ user_id: session.user.id })
	if (!profile) redirect('/dashboard')

	const isBusiness = profile.plan === 'business'
	const { data: webhooks } = isBusiness ? await getWebhooks() : { data: [] }

	const listTranslations = {
		empty: t('empty'),
		emptyDesc: t('emptyDesc'),
		addWebhook: t('addWebhook'),
		active: t('active'),
		inactive: t('inactive'),
		deleteLabel: t('deleteLabel'),
		copySecret: t('copySecret'),
		secretCopied: t('secretCopied'),
		deleteConfirm: t('deleteConfirm'),
		addTitle: t('addTitle'),
		nameLabel: t('nameLabel'),
		namePlaceholder: t('namePlaceholder'),
		urlLabel: t('urlLabel'),
		urlPlaceholder: t('urlPlaceholder'),
		secretLabel: t('secretLabel'),
		secretPlaceholder: t('secretPlaceholder'),
		secretHint: t('secretHint'),
		save: t('save'),
		cancel: t('cancel'),
		successMsg: t('successMsg'),
		errorMsg: t('errorMsg'),
	}

	return (
		<>
			<Breadcrumbs className="py-4">
				<BreadcrumbItem href="/dashboard">
					<HugeiconsIcon icon={Home01Icon} size={16} />
				</BreadcrumbItem>
				<BreadcrumbItem>{t('title')}</BreadcrumbItem>
			</Breadcrumbs>

			<div className="py-6">
				<div className="flex items-center gap-2 mb-1">
					<HugeiconsIcon icon={WebhookIcon} size={22} className="text-primary" />
					<h1 className="text-3xl font-bold">{t('title')}</h1>
				</div>
				<p className="text-default-500">{t('subtitle')}</p>
			</div>

			{!isBusiness ? (
				<div className="max-w-lg flex flex-col items-center text-center gap-5 py-16 mx-auto">
					<div className="w-20 h-20 rounded-3xl bg-amber-500/10 flex items-center justify-center">
						<HugeiconsIcon icon={Crown02Icon} size={32} className="text-amber-500" />
					</div>
					<div>
						<h2 className="text-xl font-bold mb-2">{t('upgradeTitle')}</h2>
						<p className="text-default-500 leading-relaxed">{t('upgradeDesc')}</p>
					</div>
					<Link
						href="/pricing"
						className="bg-primary text-white font-semibold px-6 py-2.5 rounded-full hover:bg-primary/90 transition-colors text-sm"
					>
						{t('upgradeCta')}
					</Link>
				</div>
			) : (
				<div className="max-w-2xl flex flex-col gap-6">
					{/* Info card */}
					<div className="rounded-2xl border border-divider bg-content1 p-5">
						<h2 className="font-semibold text-sm mb-1">{t('howItWorksTitle')}</h2>
						<p className="text-sm text-default-500 leading-relaxed">{t('howItWorksDesc')}</p>
					</div>

					<WebhookList webhooks={webhooks ?? []} translations={listTranslations} />
				</div>
			)}
		</>
	)
}

export default WebhooksPage
