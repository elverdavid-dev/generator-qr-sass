import { BreadcrumbItem, Breadcrumbs } from '@heroui/breadcrumbs'
import { Home01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
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
	const t = await getTranslations('qrs')
	const tFolders = await getTranslations('folders')
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

	const qrTableTranslations = {
		active: t('active'),
		inactive: t('inactive'),
		scans: t('scans'),
		total: t('total'),
		website: t('website'),
		noFolder: t('noFolder'),
		noResults: t('noResults'),
		actions: {
			title: t('actions.title'),
			download: t('actions.download'),
			viewDetails: t('actions.viewDetails'),
			moveToFolder: t('actions.moveToFolder'),
			deactivate: t('actions.deactivate'),
			activate: t('actions.activate'),
			edit: t('actions.edit'),
			delete: t('actions.delete'),
			deactivated: t('actions.deactivated'),
			activated: t('actions.activated'),
			deleteTitle: t('actions.deleteTitle'),
			deleteMessage: t('actions.deleteMessage'),
			deleted: t('actions.deleted'),
		},
		folder: {
			moveTitle: t('folder.moveTitle'),
			moveDesc: t('folder.moveDesc'),
			noFolders: t('folder.noFolders'),
			moved: t('folder.moved'),
		},
		download: {
			title: t('download.title'),
			cancel: t('download.cancel'),
			scanMe: t('download.scanMe'),
		},
	}

	return (
		<>
			<Breadcrumbs className="py-4">
				<BreadcrumbItem href="/dashboard">
					<HugeiconsIcon icon={Home01Icon} size={16} />
				</BreadcrumbItem>
				<BreadcrumbItem>{t('title')}</BreadcrumbItem>
			</Breadcrumbs>

			<div className="flex items-center justify-between py-6">
				<div>
					<h1 className="text-3xl font-bold">{t('title')}</h1>
					<p className="text-default-500 mt-1">
						{t('subtitle')}
					</p>
				</div>
				<CreateQrButton label={t('createNew')} />
			</div>

			<FoldersSection
				folders={folders}
				translations={{
					title: tFolders('title'),
					newFolder: tFolders('newFolder'),
					editFolder: tFolders('editFolder'),
					noFolders: tFolders('noFolders'),
					name: tFolders('name'),
					namePlaceholder: tFolders('namePlaceholder'),
					cancel: tFolders('cancel'),
					save: tFolders('save'),
					create: tFolders('create'),
					created: tFolders('created'),
					updated: tFolders('updated'),
					actions: tFolders('actions'),
					viewContents: tFolders('viewContents'),
					editName: tFolders('editName'),
					delete: tFolders('delete'),
					deleteTitle: tFolders('deleteTitle'),
					deleteMessage: tFolders('deleteMessage'),
					deleted: tFolders('deleted'),
				}}
			/>

			<div className="mt-6">
				<Suspense>
					<SearchInput placeholder={t('search')} />
				</Suspense>
			</div>

			<Suspense fallback={<QrSkeletons />} key={`${q ?? ''}-${currentPage}`}>
				<QrTable qrs={qrs} folders={folders} total={total} page={currentPage} translations={qrTableTranslations} />
			</Suspense>
		</>
	)
}

export default QrsPage
