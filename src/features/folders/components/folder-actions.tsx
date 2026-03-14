'use client'

import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	useDisclosure,
} from '@heroui/react'
import { Delete02Icon, Edit02Icon, MoreHorizontalIcon, ViewIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import dynamic from 'next/dynamic'
import type { FC } from 'react'
import { deleteFolder } from '@/features/folders/services/mutations/delete-folder'
import type { Folder } from '@/shared/types/database.types'

const ConfirmDeleteModal = dynamic(
	() => import('@/shared/components/confirm-delete-modal'),
)
const CreateFolderModal = dynamic(() => import('./create-folder-modal'))

interface Props {
	folder: Folder
}

const FolderActions: FC<Props> = ({ folder }) => {
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
				<DropdownMenu aria-label="Acciones de carpeta">
					<DropdownItem
						key="view"
						href={`/dashboard/qrs/folder/${folder.slug}`}
						startContent={<HugeiconsIcon icon={ViewIcon} size={16} />}
					>
						Ver contenido
					</DropdownItem>
					<DropdownItem
						key="edit"
						startContent={<HugeiconsIcon icon={Edit02Icon} size={16} />}
						onPress={editDisc.onOpen}
					>
						Editar nombre
					</DropdownItem>
					<DropdownItem
						key="delete"
						className="text-danger"
						color="danger"
						startContent={<HugeiconsIcon icon={Delete02Icon} size={16} />}
						onPress={deleteDisc.onOpen}
					>
						Eliminar carpeta
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>

			<ConfirmDeleteModal
				isOpen={deleteDisc.isOpen}
				onOpenChange={deleteDisc.onOpenChange}
				onClose={deleteDisc.onClose}
				onDelete={() => deleteFolder(folder.id)}
				title="Eliminar carpeta"
				description="Los QRs de esta carpeta quedarán sin carpeta asignada."
				notification_message="Carpeta eliminada"
			/>
			<CreateFolderModal
				isOpen={editDisc.isOpen}
				onOpenChange={editDisc.onOpenChange}
				onClose={editDisc.onClose}
				folder={folder}
			/>
		</>
	)
}

export default FolderActions
