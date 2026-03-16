import { BreadcrumbItem, Breadcrumbs } from '@heroui/breadcrumbs'
import { Home01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getSession } from '@/shared/lib/supabase/get-session'
import { getQrs } from '@/features/qr-codes/services/queries/get-qrs'
import { searchQrs } from '@/features/qr-codes/services/queries/search-qrs'
import { getFolders } from '@/features/folders/services/queries/get-folders'
import QrTable from '@/features/qr-codes/components/qr-table'
import FoldersSection from '@/features/folders/components/folders-section'
import SearchInput from '@/features/qr-codes/components/search-input'
import CreateQrButton from '@/features/qr-codes/components/create-qr-button'
import type { Folder, QrCode } from '@/shared/types/database.types'

interface Props {
	searchParams: Promise<{ q?: string; page?: string }>
}

const QrSkeletons = () => (
	<div className="flex flex-col gap-3 mt-3">
		{Array.from({ length: 4 }).map((_, i) => (
			// biome-ignore lint/suspicious/noArrayIndexKey: skeleton items
			<div key={i} className="h-20 bg-default-100 rounded-2xl animate-pulse" />
		))}
	</div>
)

const QrsPage = async ({ searchParams }: Props) => {
	const { data: session } = await getSession()
	if (!session?.user) redirect('/login')

	const { q, page: pageParam } = await searchParams
	const currentPage = Math.max(1, Number(pageParam) || 1)

	const [foldersResult, qrsResult] = await Promise.allSettled([
		getFolders(),
		q ? searchQrs(q, currentPage) : getQrs(currentPage),
	])

	const folders: Folder[] =
		foldersResult.status === 'fulfilled'
			? (foldersResult.value.data as Folder[]) ?? []
			: []

	const qrs: QrCode[] =
		qrsResult.status === 'fulfilled'
			? (qrsResult.value.data as QrCode[]) ?? []
			: []

	const total =
		qrsResult.status === 'fulfilled' && 'count' in qrsResult.value
			? (qrsResult.value.count ?? 0)
			: 0

	return (
		<>
			<Breadcrumbs className="py-4">
				<BreadcrumbItem href="/dashboard">
					<HugeiconsIcon icon={Home01Icon} size={16} />
				</BreadcrumbItem>
				<BreadcrumbItem>Mis QR Codes</BreadcrumbItem>
			</Breadcrumbs>

			<div className="flex items-center justify-between py-6">
				<div>
					<h1 className="text-3xl font-bold">Mis QR Codes</h1>
					<p className="text-default-500 mt-1">
						Gestiona todos tus códigos QR desde un solo lugar
					</p>
				</div>
				<CreateQrButton />
			</div>

			<FoldersSection folders={folders} />

			<div className="mt-6">
				<Suspense>
					<SearchInput />
				</Suspense>
			</div>

			<Suspense fallback={<QrSkeletons />} key={`${q ?? ''}-${currentPage}`}>
				<QrTable qrs={qrs} folders={folders} total={total} page={currentPage} />
			</Suspense>
		</>
	)
}

export default QrsPage
