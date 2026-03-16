import { BreadcrumbItem, Breadcrumbs } from '@heroui/breadcrumbs'
import { Home01Icon, UserAccountIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getSession } from '@/shared/lib/supabase/get-session'
import { getProfile } from '@/features/auth/services/queries/get-profile'
import ProfileForm from './profile-form'

const ProfilePage = async () => {
	const t = await getTranslations('profile')
	const { data: session } = await getSession()
	if (!session?.user) redirect('/login')

	const { data: profile, error } = await getProfile({ user_id: session.user.id })
	if (error || !profile) redirect('/dashboard')

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
					<HugeiconsIcon icon={UserAccountIcon} size={22} className="text-primary" />
					<h1 className="text-3xl font-bold">{t('title')}</h1>
				</div>
				<p className="text-default-500">{t('subtitle')}</p>
			</div>

			<div className="max-w-lg">
				<div className="bg-content1 border border-divider rounded-2xl p-6 shadow-sm">
					<ProfileForm
						profile={profile}
						translations={{
							email: t('email'),
							name: t('name'),
							namePlaceholder: t('namePlaceholder'),
							surname: t('surname'),
							surnamePlaceholder: t('surnamePlaceholder'),
							phone: t('phone'),
							phonePlaceholder: t('phonePlaceholder'),
							changePhoto: t('changePhoto'),
							save: t('save'),
							successMessage: t('successMessage'),
						}}
					/>
				</div>
			</div>
		</>
	)
}

export default ProfilePage
