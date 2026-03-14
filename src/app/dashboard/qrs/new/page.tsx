import { BreadcrumbItem, Breadcrumbs } from '@heroui/breadcrumbs'
import { Home01Icon, QrCodeIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { redirect } from 'next/navigation'
import { getSession } from '@/shared/lib/supabase/get-session'
import { getFolders } from '@/features/folders/services/queries/get-folders'
import QrForm from '@/features/qr-codes/components/qr-form'
import type { Folder } from '@/shared/types/database.types'

const NewQrPage = async () => {
	const { data: session } = await getSession()
	if (!session?.user) redirect('/login')

	const { data: folders } = await getFolders()

	return (
		<>
			<Breadcrumbs className="py-4">
				<BreadcrumbItem href="/dashboard">
					<HugeiconsIcon icon={Home01Icon} size={16} />
				</BreadcrumbItem>
				<BreadcrumbItem href="/dashboard/qrs">Mis QR Codes</BreadcrumbItem>
				<BreadcrumbItem>Nuevo QR</BreadcrumbItem>
			</Breadcrumbs>

			<div className="py-6">
				<div className="flex items-center gap-3">
					<div className="p-2 bg-primary/10 rounded-xl">
						<HugeiconsIcon icon={QrCodeIcon} size={24} className="text-primary" />
					</div>
					<div>
						<h1 className="text-3xl font-bold">Crear QR Code</h1>
						<p className="text-default-500 mt-1">
							Personaliza y genera tu código QR
						</p>
					</div>
				</div>
			</div>

			<QrForm folders={(folders as Folder[]) ?? []} />
		</>
	)
}

export default NewQrPage
