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
	Edit02Icon,
	MoreHorizontalIcon,
	ViewIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import dynamic from 'next/dynamic'
import type { FC } from 'react'
import { deleteFolder } from '@/features/folders/services/mutations/delete-folder'
import type { Folder } from '@/shared/types/database.types'

const ConfirmDeleteModal = dynamic(
	() => import('@/shared/components/confirm-delete-modal'),
)
const CreateFolderModal = dynamic(() => import('./create-folder-modal'))

interface FolderActionsTranslations {
	actions: string
	viewContents: string
	editName: string
	delete: string
	deleteTitle: string
	deleteMessage: string
	deleted: string
	editFolder: string
	name: string
	namePlaceholder: string
	cancel: string
	save: string
	create: string
	created: string
	updated: string
}

interface Props {
	folder: Folder
	translations: FolderActionsTranslations
}

const FolderActions: FC<Props> = ({ folder, translations }) => {
	const deleteDisc = useDisclosure()
	const editDisc = useDisclosure()

	return (
		<>
			<Dropdown>
				<DropdownTrigger>
					<Button isIconOnly variant="light" size="sm">
						<HugeiconsIcon icon={MoreHorizontalIcon} size={18} />
					</Button>
				</DropdownTrigger>
				<DropdownMenu aria-label={translations.actions}>
					<DropdownItem
						key="view"
						textValue={translations.viewContents}
						href={`/dashboard/qrs/folder/${folder.slug}`}
						startContent={<HugeiconsIcon icon={ViewIcon} size={16} />}
					>
						{translations.viewContents}
					</DropdownItem>
					<DropdownItem
						key="edit"
						textValue={translations.editName}
						startContent={<HugeiconsIcon icon={Edit02Icon} size={16} />}
						onPress={editDisc.onOpen}
					>
						{translations.editName}
					</DropdownItem>
					<DropdownItem
						key="delete"
						textValue={translations.delete}
						className="text-danger"
						color="danger"
						startContent={<HugeiconsIcon icon={Delete02Icon} size={16} />}
						onPress={deleteDisc.onOpen}
					>
						{translations.delete}
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>

			<ConfirmDeleteModal
				isOpen={deleteDisc.isOpen}
				onOpenChange={deleteDisc.onOpenChange}
				onClose={deleteDisc.onClose}
				onDelete={() => deleteFolder(folder.id)}
				title={translations.deleteTitle}
				description={translations.deleteMessage}
				notification_message={translations.deleted}
			/>
			<CreateFolderModal
				isOpen={editDisc.isOpen}
				onOpenChange={editDisc.onOpenChange}
				onClose={editDisc.onClose}
				folder={folder}
				translations={{
					editFolder: translations.editFolder,
					newFolder: translations.editFolder,
					name: translations.name,
					namePlaceholder: translations.namePlaceholder,
					cancel: translations.cancel,
					save: translations.save,
					create: translations.create,
					created: translations.created,
					updated: translations.updated,
				}}
			/>
		</>
	)
}

export default FolderActions
