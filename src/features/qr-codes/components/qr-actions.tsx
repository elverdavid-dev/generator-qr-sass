'use client'

import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	useDisclosure,
} from '@heroui/react'
import {
	Delete02Icon,
	Download04Icon,
	Edit02Icon,
	Folder01Icon,
	MoreHorizontalIcon,
	Share01Icon,
	StarIcon,
	ToggleOnIcon,
	ViewIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import dynamic from 'next/dynamic'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { deleteQr } from '@/features/qr-codes/services/mutations/delete-qr'
import { toggleQrFavorite } from '@/features/qr-codes/services/mutations/toggle-qr-favorite'
import { toggleQrStatus } from '@/features/qr-codes/services/mutations/toggle-qr-status'
import type { Folder, QrCode } from '@/shared/types/database.types'
import { usePlan } from '@/shared/context/plan-context'

const DownloadQrModal = dynamic(() => import('./download-qr-modal'))
const ConfirmDeleteModal = dynamic(
	() => import('@/shared/components/confirm-delete-modal'),
)
const FolderSelectorModal = dynamic(() => import('./folder-selector-modal'))

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
	share: string
	shareCopied: string
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

interface QrTableTranslations {
	actions: ActionsTranslations
	folder: FolderTranslations
	download: DownloadTranslations
}

interface Props {
	qr: QrCode
	folders: Folder[]
	translations: QrTableTranslations
}

const QrActions = ({ qr, folders, translations }: Props) => {
	const [isPending, startTransition] = useTransition()
	const { hasFeature } = usePlan()
	const canShare = hasFeature('shareQr')
	const downloadDisc = useDisclosure()
	const deleteDisc = useDisclosure()
	const folderDisc = useDisclosure()

	const handleToggleStatus = () => {
		startTransition(async () => {
			const { error } = await toggleQrStatus(qr.id, !qr.is_active)
			if (error) {
				toast.error(error)
			} else {
				toast.success(qr.is_active ? translations.actions.deactivated : translations.actions.activated)
			}
		})
	}

	const handleToggleFavorite = () => {
		startTransition(async () => {
			const { error } = await toggleQrFavorite(qr.id, !qr.is_favorite)
			if (error) {
				toast.error(error)
			} else {
				toast.success(qr.is_favorite ? translations.actions.favoriteRemoved : translations.actions.favoriteAdded)
			}
		})
	}

	const handleShare = async () => {
		const slug = qr.custom_slug ?? qr.slug
		const shareUrl = `${window.location.origin}/share/${slug}`
		await navigator.clipboard.writeText(shareUrl)
		toast.success(translations.actions.shareCopied)
	}

	return (
		<>
			<Dropdown>
				<DropdownTrigger>
					<Button variant="light" isIconOnly size="sm">
						<HugeiconsIcon icon={MoreHorizontalIcon} size={18} />
					</Button>
				</DropdownTrigger>
				<DropdownMenu aria-label={translations.actions.title}>
					<DropdownItem
						key="download"
						startContent={<HugeiconsIcon icon={Download04Icon} size={16} />}
						onPress={downloadDisc.onOpen}
					>
						{translations.actions.download}
					</DropdownItem>
					<DropdownItem
						key="view"
						href={`/dashboard/qrs/${qr.slug}`}
						startContent={<HugeiconsIcon icon={ViewIcon} size={16} />}
					>
						{translations.actions.viewDetails}
					</DropdownItem>
					<DropdownItem
						key="folder"
						startContent={<HugeiconsIcon icon={Folder01Icon} size={16} />}
						onPress={folderDisc.onOpen}
					>
						{translations.actions.moveToFolder}
					</DropdownItem>
					<DropdownItem
						key="toggle"
						startContent={<HugeiconsIcon icon={ToggleOnIcon} size={16} />}
						onPress={handleToggleStatus}
						isDisabled={isPending}
					>
						{qr.is_active ? translations.actions.deactivate : translations.actions.activate}
					</DropdownItem>
					<DropdownItem
						key="favorite"
						startContent={
							<HugeiconsIcon
								icon={StarIcon}
								size={16}
								className={qr.is_favorite ? 'text-warning' : ''}
							/>
						}
						onPress={handleToggleFavorite}
						isDisabled={isPending}
					>
						{qr.is_favorite ? translations.actions.removeFavorite : translations.actions.addFavorite}
					</DropdownItem>
					<DropdownItem
						key="share"
						startContent={<HugeiconsIcon icon={Share01Icon} size={16} />}
						onPress={canShare ? handleShare : undefined}
						isDisabled={!canShare}
						description={!canShare ? 'Pro' : undefined}
					>
						{translations.actions.share}
					</DropdownItem>
					<DropdownItem
						key="edit"
						href={`/dashboard/qrs/${qr.slug}/edit`}
						startContent={<HugeiconsIcon icon={Edit02Icon} size={16} />}
					>
						{translations.actions.edit}
					</DropdownItem>
					<DropdownItem
						key="delete"
						className="text-danger"
						color="danger"
						startContent={<HugeiconsIcon icon={Delete02Icon} size={16} />}
						onPress={deleteDisc.onOpen}
					>
						{translations.actions.delete}
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>

			<DownloadQrModal
				isOpen={downloadDisc.isOpen}
				onOpenChange={downloadDisc.onOpenChange}
				onClose={downloadDisc.onClose}
				qr={qr}
				translations={translations.download}
			/>
			<ConfirmDeleteModal
				isOpen={deleteDisc.isOpen}
				onOpenChange={deleteDisc.onOpenChange}
				onClose={deleteDisc.onClose}
				onDelete={() => deleteQr(qr.id)}
				title={translations.actions.deleteTitle}
				description={translations.actions.deleteMessage}
				notification_message={translations.actions.deleted}
			/>
			<FolderSelectorModal
				isOpen={folderDisc.isOpen}
				onOpenChange={folderDisc.onOpenChange}
				onClose={folderDisc.onClose}
				folders={folders}
				qrId={qr.id}
				translations={translations.folder}
			/>
		</>
	)
}

export default QrActions
