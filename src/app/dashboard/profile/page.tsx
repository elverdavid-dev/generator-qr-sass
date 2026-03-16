import { BreadcrumbItem, Breadcrumbs } from '@heroui/breadcrumbs'
import { Home01Icon, UserAccountIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { redirect } from 'next/navigation'
import { getSession } from '@/shared/lib/supabase/get-session'
import { getProfile } from '@/features/auth/services/queries/get-profile'
import ProfileForm from './profile-form'

const ProfilePage = async () => {
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
				<BreadcrumbItem>Perfil</BreadcrumbItem>
			</Breadcrumbs>

			<div className="py-6">
				<div className="flex items-center gap-2 mb-1">
					<HugeiconsIcon icon={UserAccountIcon} size={22} className="text-primary" />
					<h1 className="text-3xl font-bold">Mi perfil</h1>
				</div>
				<p className="text-default-500">Gestiona tu información personal</p>
			</div>

			<div className="max-w-lg">
				<div className="bg-content1 border border-divider rounded-2xl p-6 shadow-sm">
					<ProfileForm profile={profile} />
				</div>
			</div>
		</>
	)
}

export default ProfilePage
