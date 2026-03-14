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
	ToggleOnIcon,
	ViewIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import dynamic from 'next/dynamic'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { deleteQr } from '@/features/qr-codes/services/mutations/delete-qr'
import { toggleQrStatus } from '@/features/qr-codes/services/mutations/toggle-qr-status'
import type { Folder, QrCode } from '@/shared/types/database.types'

const DownloadQrModal = dynamic(() => import('./download-qr-modal'))
const ConfirmDeleteModal = dynamic(
	() => import('@/shared/components/confirm-delete-modal'),
)
const FolderSelectorModal = dynamic(() => import('./folder-selector-modal'))

interface Props {
	qr: QrCode
	folders: Folder[]
}

const QrActions = ({ qr, folders }: Props) => {
	const [isPending, startTransition] = useTransition()
	const downloadDisc = useDisclosure()
	const deleteDisc = useDisclosure()
	const folderDisc = useDisclosure()

	const handleToggleStatus = () => {
		startTransition(async () => {
			const { error } = await toggleQrStatus(qr.id, !qr.is_active)
			if (error) {
				toast.error(error)
			} else {
				toast.success(qr.is_active ? 'QR desactivado' : 'QR activado')
			}
		})
	}

	return (
		<>
			<Dropdown>
				<DropdownTrigger>
					<Button variant="light" isIconOnly size="sm">
						<HugeiconsIcon icon={MoreHorizontalIcon} size={18} />
					</Button>
				</DropdownTrigger>
				<DropdownMenu aria-label="Acciones del QR">
					<DropdownItem
						key="download"
						startContent={<HugeiconsIcon icon={Download04Icon} size={16} />}
						onPress={downloadDisc.onOpen}
					>
						Descargar
					</DropdownItem>
					<DropdownItem
						key="view"
						href={`/dashboard/qrs/${qr.slug}`}
						startContent={<HugeiconsIcon icon={ViewIcon} size={16} />}
					>
						Ver detalles
					</DropdownItem>
					<DropdownItem
						key="folder"
						startContent={<HugeiconsIcon icon={Folder01Icon} size={16} />}
						onPress={folderDisc.onOpen}
					>
						Mover a carpeta
					</DropdownItem>
					<DropdownItem
						key="toggle"
						startContent={<HugeiconsIcon icon={ToggleOnIcon} size={16} />}
						onPress={handleToggleStatus}
						isDisabled={isPending}
					>
						{qr.is_active ? 'Desactivar' : 'Activar'}
					</DropdownItem>
					<DropdownItem
						key="edit"
						href={`/dashboard/qrs/${qr.slug}/edit`}
						startContent={<HugeiconsIcon icon={Edit02Icon} size={16} />}
					>
						Editar
					</DropdownItem>
					<DropdownItem
						key="delete"
						className="text-danger"
						color="danger"
						startContent={<HugeiconsIcon icon={Delete02Icon} size={16} />}
						onPress={deleteDisc.onOpen}
					>
						Eliminar
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>

			<DownloadQrModal
				isOpen={downloadDisc.isOpen}
				onOpenChange={downloadDisc.onOpenChange}
				onClose={downloadDisc.onClose}
				qr={qr}
			/>
			<ConfirmDeleteModal
				isOpen={deleteDisc.isOpen}
				onOpenChange={deleteDisc.onOpenChange}
				onClose={deleteDisc.onClose}
				onDelete={() => deleteQr(qr.id)}
				title="Eliminar QR"
				description="¿Estás seguro? Esta acción no se puede deshacer."
				notification_message="QR eliminado correctamente"
			/>
			<FolderSelectorModal
				isOpen={folderDisc.isOpen}
				onOpenChange={folderDisc.onOpenChange}
				onClose={folderDisc.onClose}
				folders={folders}
				qrId={qr.id}
			/>
		</>
	)
}

export default QrActions
