import { BreadcrumbItem, Breadcrumbs } from '@heroui/breadcrumbs'
import { Home01Icon, StarIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getFolders } from '@/features/folders/services/queries/get-folders'
import QrTable from '@/features/qr-codes/components/qr-table'
import { getFavoriteQrs } from '@/features/qr-codes/services/queries/get-favorite-qrs'
import { getSession } from '@/shared/lib/supabase/get-session'
import type { Folder, QrCode } from '@/shared/types/database.types'

const FavoritesPage = async () => {
	const [t, tQrs] = await Promise.all([
		getTranslations('favorites'),
		getTranslations('qrs'),
	])
	const { data: session } = await getSession()
	if (!session?.user) redirect('/login')

	const [favoritesResult, foldersResult] = await Promise.allSettled([
		getFavoriteQrs(),
		getFolders(),
	])

	const qrs: QrCode[] =
		favoritesResult.status === 'fulfilled' && 'data' in favoritesResult.value
			? ((favoritesResult.value.data as QrCode[]) ?? [])
			: []

	const folders: Folder[] =
		foldersResult.status === 'fulfilled' && 'data' in foldersResult.value
			? ((foldersResult.value.data as Folder[]) ?? [])
			: []

	const qrTableTranslations = {
		active: tQrs('active'),
		inactive: tQrs('inactive'),
		scans: tQrs('scans'),
		total: tQrs('total'),
		website: tQrs('website'),
		noFolder: tQrs('noFolder'),
		noResults: t('empty'),
		actions: {
			title: tQrs('actions.title'),
			download: tQrs('actions.download'),
			viewDetails: tQrs('actions.viewDetails'),
			moveToFolder: tQrs('actions.moveToFolder'),
			deactivate: tQrs('actions.deactivate'),
			activate: tQrs('actions.activate'),
			edit: tQrs('actions.edit'),
			delete: tQrs('actions.delete'),
			deactivated: tQrs('actions.deactivated'),
			activated: tQrs('actions.activated'),
			deleteTitle: tQrs('actions.deleteTitle'),
			deleteMessage: tQrs('actions.deleteMessage'),
			deleted: tQrs('actions.deleted'),
			addFavorite: tQrs('actions.addFavorite'),
			removeFavorite: tQrs('actions.removeFavorite'),
			favoriteAdded: tQrs('actions.favoriteAdded'),
			favoriteRemoved: tQrs('actions.favoriteRemoved'),
			share: tQrs('actions.share'),
			shareCopied: tQrs('actions.shareCopied'),
			saveFromQr: tQrs('actions.saveFromQr'),
			templateSaved: tQrs('actions.templateSaved'),
			templateNamePlaceholder: tQrs('templates.namePlaceholder'),
			templateCancel: tQrs('download.cancel'),
			templateSave: tQrs('templates.save'),
		},
		folder: {
			moveTitle: tQrs('folder.moveTitle'),
			moveDesc: tQrs('folder.moveDesc'),
			noFolders: tQrs('folder.noFolders'),
			moved: tQrs('folder.moved'),
		},
		download: {
			title: tQrs('download.title'),
			cancel: tQrs('download.cancel'),
			scanMe: tQrs('download.scanMe'),
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
					<div className="flex items-center gap-2">
						<span className="bg-warning/10 p-2 rounded-xl">
							<HugeiconsIcon
								icon={StarIcon}
								size={20}
								className="text-warning"
							/>
						</span>
						<h1 className="text-3xl font-bold">{t('title')}</h1>
					</div>
					<p className="text-default-500 mt-1">{t('subtitle')}</p>
				</div>
			</div>

			{qrs.length === 0 ? (
				<div className="flex flex-col items-center justify-center h-64 bg-content1 border border-divider rounded-2xl gap-4">
					<div className="p-4 bg-warning/10 rounded-2xl">
						<HugeiconsIcon
							icon={StarIcon}
							size={32}
							className="text-warning/60"
						/>
					</div>
					<div className="text-center">
						<p className="font-semibold text-default-600">{t('empty')}</p>
						<p className="text-sm text-default-400 mt-1">{t('emptyDesc')}</p>
					</div>
					<Link
						href="/dashboard/qrs"
						className="text-sm text-primary hover:underline"
					>
						{t('goToQrs')}
					</Link>
				</div>
			) : (
				<QrTable
					qrs={qrs}
					folders={folders}
					total={qrs.length}
					page={1}
					translations={qrTableTranslations}
				/>
			)}
		</>
	)
}

export default FavoritesPage
