import { BreadcrumbItem, Breadcrumbs } from '@heroui/breadcrumbs'
import { Edit02Icon, Home01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { redirect, notFound } from 'next/navigation'
import { getSession } from '@/shared/lib/supabase/get-session'
import { getQrBySlug } from '@/features/qr-codes/services/queries/get-qr-by-slug'
import { getFolders } from '@/features/folders/services/queries/get-folders'
import QrEditForm from '@/features/qr-codes/components/qr-edit-form'
import type { Folder, QrCode } from '@/shared/types/database.types'

interface Props {
	params: Promise<{ slug: string }>
}

const EditQrPage = async ({ params }: Props) => {
	const { slug } = await params
	const { data: session } = await getSession()
	if (!session?.user) redirect('/login')

	const [qrResult, foldersResult] = await Promise.allSettled([
		getQrBySlug(slug),
		getFolders(),
	])

	const qr =
		qrResult.status === 'fulfilled' && !qrResult.value.error
			? (qrResult.value.data as QrCode)
			: null

	if (!qr) notFound()

	const folders: Folder[] =
		foldersResult.status === 'fulfilled'
			? (foldersResult.value.data as Folder[]) ?? []
			: []

	return (
		<>
			<Breadcrumbs className="py-4">
				<BreadcrumbItem href="/dashboard">
					<HugeiconsIcon icon={Home01Icon} size={16} />
				</BreadcrumbItem>
				<BreadcrumbItem href="/dashboard/qrs">Mis QR Codes</BreadcrumbItem>
				<BreadcrumbItem>Editar QR</BreadcrumbItem>
			</Breadcrumbs>

			<div className="py-6">
				<div className="flex items-center gap-3">
					<div className="p-2 bg-primary/10 rounded-xl">
						<HugeiconsIcon icon={Edit02Icon} size={24} className="text-primary" />
					</div>
					<div>
						<h1 className="text-3xl font-bold">Editar QR Code</h1>
						<p className="text-default-500 mt-1 capitalize">{qr.name}</p>
					</div>
				</div>
			</div>

			<QrEditForm qr={qr} folders={folders} />
		</>
	)
}

export default EditQrPage
