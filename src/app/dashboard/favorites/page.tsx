import { BreadcrumbItem, Breadcrumbs } from '@heroui/breadcrumbs'
import { Home01Icon, StarIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/shared/lib/supabase/get-session'

const FavoritesPage = async () => {
	const { data: session } = await getSession()
	if (!session?.user) redirect('/login')

	return (
		<>
			<Breadcrumbs className="py-4">
				<BreadcrumbItem href="/dashboard">
					<HugeiconsIcon icon={Home01Icon} size={16} />
				</BreadcrumbItem>
				<BreadcrumbItem>Favoritos</BreadcrumbItem>
			</Breadcrumbs>

			<div className="py-6">
				<h1 className="text-3xl font-bold">Favoritos</h1>
				<p className="text-default-500 mt-1">Tus QR Codes marcados como favoritos</p>
			</div>

			<div className="flex flex-col items-center justify-center h-64 bg-content1 border border-divider rounded-2xl gap-4">
				<div className="p-4 bg-default-100 rounded-2xl">
					<HugeiconsIcon icon={StarIcon} size={32} className="text-default-400" />
				</div>
				<div className="text-center">
					<p className="font-semibold text-default-600">Próximamente</p>
					<p className="text-sm text-default-400 mt-1">
						La función de favoritos estará disponible pronto
					</p>
				</div>
				<Link
					href="/dashboard/qrs"
					className="text-sm text-primary underline"
				>
					Ver mis QR Codes
				</Link>
			</div>
		</>
	)
}

export default FavoritesPage
