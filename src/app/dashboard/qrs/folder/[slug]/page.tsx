import { BreadcrumbItem, Breadcrumbs } from '@heroui/breadcrumbs'
import { Folder01Icon, Home01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'
import { getFolderBySlug } from '@/features/folders/services/queries/get-folder-by-slug'
import { getFolders } from '@/features/folders/services/queries/get-folders'
import QrTable from '@/features/qr-codes/components/qr-table'
import { getQrsByFolder } from '@/features/qr-codes/services/queries/get-qrs-by-folder'
import { getSession } from '@/shared/lib/supabase/get-session'
import type { Folder, QrCode } from '@/shared/types/database.types'

interface Props {
	params: Promise<{ slug: string }>
	searchParams: Promise<{ page?: string }>
}

const QrSkeletons = () => (
	<div className="flex flex-col gap-3 mt-3">
		{Array.from({ length: 4 }).map((_, i) => (
			// biome-ignore lint/suspicious/noArrayIndexKey: skeleton items
			<div key={i} className="h-20 bg-default-100 rounded-2xl animate-pulse" />
		))}
	</div>
)

const FolderViewPage = async ({ params, searchParams }: Props) => {
	const t = await getTranslations('qrs')
	const { slug } = await params
	const { page: pageParam } = await searchParams
	const currentPage = Math.max(1, Number(pageParam) || 1)

	const { data: session } = await getSession()
	if (!session?.user) redirect('/login')

	const folderResult = await getFolderBySlug(slug)
	const folder = 'data' in folderResult ? (folderResult.data as Folder) : null
	if (!folder) notFound()

	const [qrsResult, foldersResult] = await Promise.allSettled([
		getQrsByFolder(folder.id, currentPage),
		getFolders(),
	])

	const qrs: QrCode[] =
		qrsResult.status === 'fulfilled' && 'data' in qrsResult.value
			? ((qrsResult.value.data as QrCode[]) ?? [])
			: []

	const total =
		qrsResult.status === 'fulfilled' && 'count' in qrsResult.value
			? (qrsResult.value.count ?? 0)
			: 0

	const folders: Folder[] =
		foldersResult.status === 'fulfilled' && 'data' in foldersResult.value
			? ((foldersResult.value.data as Folder[]) ?? [])
			: []

	const qrTableTranslations = {
		active: t('active'),
		inactive: t('inactive'),
		scans: t('scans'),
		total: t('total'),
		website: t('website'),
		noFolder: t('noFolder'),
		noResults: t('folderView.empty'),
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
			addFavorite: t('actions.addFavorite'),
			removeFavorite: t('actions.removeFavorite'),
			favoriteAdded: t('actions.favoriteAdded'),
			favoriteRemoved: t('actions.favoriteRemoved'),
			share: t('actions.share'),
			shareCopied: t('actions.shareCopied'),
			saveFromQr: t('actions.saveFromQr'),
			templateSaved: t('actions.templateSaved'),
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
				<BreadcrumbItem href="/dashboard/qrs">{t('title')}</BreadcrumbItem>
				<BreadcrumbItem>
					<HugeiconsIcon icon={Folder01Icon} size={14} className="mr-1" />
					{folder.name}
				</BreadcrumbItem>
			</Breadcrumbs>

			<div className="flex items-center justify-between py-6">
				<div>
					<div className="flex items-center gap-2">
						<span className="bg-primary/10 p-2 rounded-xl">
							<HugeiconsIcon
								icon={Folder01Icon}
								size={20}
								className="text-primary"
							/>
						</span>
						<h1 className="text-3xl font-bold capitalize">{folder.name}</h1>
					</div>
					<p className="text-default-500 mt-1">{t('folderView.subtitle')}</p>
				</div>
				<Link
					href="/dashboard/qrs"
					className="text-sm text-default-500 hover:text-primary transition-colors"
				>
					← {t('folderView.backToQrs')}
				</Link>
			</div>

			<Suspense fallback={<QrSkeletons />} key={currentPage}>
				<QrTable
					qrs={qrs}
					folders={folders}
					total={total}
					page={currentPage}
					translations={qrTableTranslations}
				/>
			</Suspense>
		</>
	)
}

export default FolderViewPage
