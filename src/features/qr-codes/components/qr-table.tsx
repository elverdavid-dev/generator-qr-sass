'use client'

import {
	Calendar03Icon,
	CancelCircleIcon,
	CheckmarkCircle02Icon,
	Edit02Icon,
	FingerPrintScanIcon,
	Folder01Icon,
	Link01Icon,
	Delete02Icon,
	Tick02Icon,
	Cancel01Icon,
	Crown02Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Pagination } from '@heroui/pagination'
import { Button } from '@heroui/button'
import { Checkbox } from '@heroui/checkbox'
import { Select, SelectItem } from '@heroui/select'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import type { Folder, QrCode } from '@/shared/types/database.types'
import { formatDate } from '@/shared/utils/format-date'
import { getTrackingUrl } from '@/shared/utils/get-tracking-url'
import { QRS_PAGE_SIZE } from '@/features/qr-codes/constants'
import { usePlan } from '@/shared/context/plan-context'
import { bulkDeleteQrs, bulkMoveToFolder, bulkToggleActive } from '@/features/qr-codes/services/mutations/bulk-qr-actions'
import QrActions from './qr-actions'
import QrPreview from './qr-preview'

interface ActionsTranslations {
	title: string
	download: string
	viewDetails: string
	moveToFolder: string
	deactivate: string
	activate: string
	edit: string
	delete: string
	deactivated: string
	activated: string
	deleteTitle: string
	deleteMessage: string
	deleted: string
	addFavorite: string
	removeFavorite: string
	favoriteAdded: string
	favoriteRemoved: string
}

interface FolderTranslations {
	moveTitle: string
	moveDesc: string
	noFolders: string
	moved: string
}

interface DownloadTranslations {
	title: string
	cancel: string
	scanMe: string
}

interface BulkTranslations {
	selected: string
	deleteSelected: string
	activateSelected: string
	deactivateSelected: string
	moveSelected: string
	confirmDelete: string
	deleted: string
	activated: string
	deactivated: string
	moved: string
	upgradeRequired: string
}

interface QrTableTranslations {
	active: string
	inactive: string
	scans: string
	total: string
	website: string
	noFolder: string
	noResults: string
	actions: ActionsTranslations
	folder: FolderTranslations
	download: DownloadTranslations
	bulk?: BulkTranslations
}

interface Props {
	qrs: QrCode[]
	folders: Folder[]
	total: number
	page: number
	translations: QrTableTranslations
}

const QrTable = ({ qrs, folders, total, page, translations }: Props) => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const totalPages = Math.ceil(total / QRS_PAGE_SIZE)
	const { hasFeature } = usePlan()
	const canBulk = hasFeature('bulkActions')

	const [selected, setSelected] = useState<Set<string>>(new Set())
	const [isPending, startTransition] = useTransition()

	const bulk = translations.bulk

	const toggleSelect = (id: string) => {
		setSelected((prev) => {
			const next = new Set(prev)
			if (next.has(id)) next.delete(id)
			else next.add(id)
			return next
		})
	}

	const toggleAll = () => {
		if (selected.size === qrs.length) setSelected(new Set())
		else setSelected(new Set(qrs.map((q) => q.id)))
	}

	const clearSelection = () => setSelected(new Set())

	const handleBulkDelete = () => {
		if (!bulk) return
		if (!window.confirm(bulk.confirmDelete)) return
		startTransition(async () => {
			const res = await bulkDeleteQrs(Array.from(selected))
			if (res.error) { toast.error(res.error); return }
			toast.success(bulk.deleted)
			clearSelection()
		})
	}

	const handleBulkToggle = (active: boolean) => {
		if (!bulk) return
		startTransition(async () => {
			const res = await bulkToggleActive(Array.from(selected), active)
			if (res.error) { toast.error(res.error); return }
			toast.success(active ? bulk.activated : bulk.deactivated)
			clearSelection()
		})
	}

	const handleBulkMove = (folderId: string | null) => {
		if (!bulk) return
		startTransition(async () => {
			const res = await bulkMoveToFolder(Array.from(selected), folderId)
			if (res.error) { toast.error(res.error); return }
			toast.success(bulk.moved)
			clearSelection()
		})
	}

	const handlePageChange = (newPage: number) => {
		const params = new URLSearchParams(searchParams.toString())
		if (newPage === 1) params.delete('page')
		else params.set('page', String(newPage))
		router.push(`?${params.toString()}`)
	}

	if (qrs.length === 0) {
		return <div className="text-center text-default-400 py-16">{translations.noResults}</div>
	}

	return (
		<div>
			{/* Bulk toolbar */}
			{canBulk && selected.size > 0 && bulk && (
				<div className="mt-4 mb-3 flex items-center gap-2 bg-content1 border border-primary/30 rounded-2xl px-4 py-2.5 shadow-md">
					<span className="text-sm font-semibold text-primary mr-2">
						{selected.size} {bulk.selected}
					</span>
					<Button size="sm" variant="flat" color="danger" isDisabled={isPending}
						startContent={<HugeiconsIcon icon={Delete02Icon} size={14} />}
						onPress={handleBulkDelete}>
						{bulk.deleteSelected}
					</Button>
					<Button size="sm" variant="flat" color="success" isDisabled={isPending}
						startContent={<HugeiconsIcon icon={Tick02Icon} size={14} />}
						onPress={() => handleBulkToggle(true)}>
						{bulk.activateSelected}
					</Button>
					<Button size="sm" variant="flat" isDisabled={isPending}
						startContent={<HugeiconsIcon icon={Cancel01Icon} size={14} />}
						onPress={() => handleBulkToggle(false)}>
						{bulk.deactivateSelected}
					</Button>
					{folders.length > 0 && (
						<Select
							size="sm"
							placeholder={bulk.moveSelected}
							isDisabled={isPending}
							className="w-44"
							variant="flat"
							items={[{ id: 'none', name: translations.noFolder }, ...folders]}
							onChange={(e) => {
								if (e.target.value !== '') handleBulkMove(e.target.value === 'none' ? null : e.target.value)
							}}
						>
							{(item) => <SelectItem key={item.id}>{item.name}</SelectItem>}
						</Select>
					)}
					<button type="button" onClick={clearSelection} className="ml-auto text-xs text-default-400 hover:text-default-600">✕</button>
				</div>
			)}

			{/* Upgrade hint for free users */}
			{!canBulk && bulk && (
				<div className="mb-3 flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-xl px-4 py-2">
					<HugeiconsIcon icon={Crown02Icon} size={14} className="text-primary" />
					<span className="text-xs text-default-500">{bulk.upgradeRequired}</span>
				</div>
			)}

			<section className="flex flex-col gap-3 mt-3">
				{/* Select all row */}
				{canBulk && (
					<div className="flex items-center gap-3 px-1">
						<Checkbox
							isSelected={selected.size === qrs.length && qrs.length > 0}
							isIndeterminate={selected.size > 0 && selected.size < qrs.length}
							onValueChange={toggleAll}
							size="sm"
							color="primary"
						>
							<span className="text-xs text-default-400">Seleccionar todo</span>
						</Checkbox>
					</div>
				)}

				{qrs.map((qr) => (
					<div
						key={qr.id}
						className={`flex items-center justify-between gap-6 p-5 bg-content1 rounded-2xl border shadow-sm transition-colors ${
							selected.has(qr.id) ? 'border-primary/40 bg-primary/5' : 'border-divider'
						}`}
					>
						{/* Checkbox */}
						{canBulk && (
							<Checkbox
								isSelected={selected.has(qr.id)}
								onValueChange={() => toggleSelect(qr.id)}
								size="sm"
								color="primary"
								className="shrink-0"
							/>
						)}

						{/* QR preview + info */}
						<div className="flex items-center gap-4 min-w-0 flex-1">
							<QrPreview
								value={getTrackingUrl(qr.custom_slug ?? qr.slug)}
								size={56}
								fgColor={qr.fg_color}
								bgColor={qr.bg_color}
								dotStyle={qr.dot_style ?? 'square'}
								className="rounded-lg border border-divider shrink-0 overflow-hidden"
							/>
							<div className="min-w-0">
								<span className="text-xs text-primary font-medium">
									{qr.qr_type === 'url' ? translations.website : qr.qr_type}
								</span>
								<h3 className="font-semibold capitalize truncate max-w-48">{qr.name}</h3>
								<span className="text-xs text-default-400 flex items-center gap-1">
									<HugeiconsIcon icon={Calendar03Icon} size={12} />
									{formatDate(qr.created_at)}
								</span>
							</div>
						</div>

						{/* Folder + link */}
						<div className="flex-col gap-1 min-w-0 max-md:hidden flex">
							<span className="text-sm text-default-500 flex items-center gap-1">
								<HugeiconsIcon icon={Folder01Icon} size={14} />
								{qr.folders?.name ?? translations.noFolder}
							</span>
							<a
								href={qr.data}
								target="_blank"
								rel="noopener noreferrer"
								className="text-sm text-primary flex items-center gap-1 underline truncate max-w-52"
							>
								<HugeiconsIcon icon={Link01Icon} size={14} />
								{qr.data}
							</a>
							<span className="text-xs text-default-400 flex items-center gap-1">
								<HugeiconsIcon icon={Edit02Icon} size={12} />
								{formatDate(qr.updated_at)}
							</span>
						</div>

						{/* Status */}
						<div className="text-sm shrink-0">
							{qr.is_active ? (
								<span className="text-emerald-500 flex items-center gap-1">
									<HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} />
									{translations.active}
								</span>
							) : (
								<span className="text-danger flex items-center gap-1">
									<HugeiconsIcon icon={CancelCircleIcon} size={16} />
									{translations.inactive}
								</span>
							)}
						</div>

						{/* Scan count */}
						<div className="text-sm text-default-500 flex items-center gap-1 shrink-0">
							<HugeiconsIcon icon={FingerPrintScanIcon} size={16} />
							<span>
								<strong className="text-lg text-primary">{qr.scan_count ?? 0}</strong>{' '}
								{translations.scans}
							</span>
						</div>

						{/* Actions */}
						<QrActions qr={qr} folders={folders} translations={translations} />
					</div>
				))}
			</section>

			{totalPages > 1 && (
				<div className="flex items-center justify-between mt-6 pb-4">
					<p className="text-sm text-default-400">
						{total} QR{total !== 1 ? 's' : ''} {translations.total}
					</p>
					<Pagination
						page={page}
						total={totalPages}
						onChange={handlePageChange}
						color="primary"
						variant="flat"
						showControls
					/>
				</div>
			)}
		</div>
	)
}

export default QrTable
