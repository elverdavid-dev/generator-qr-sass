'use client'

import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
} from '@heroui/react'
import { Folder01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { updateQrFolder } from '@/features/qr-codes/services/mutations/update-qr-folder'
import type { Folder } from '@/shared/types/database.types'

interface FolderTranslations {
	moveTitle: string
	moveDesc: string
	noFolders: string
	moved: string
}

interface Props {
	isOpen: boolean
	onOpenChange: VoidFunction
	onClose: VoidFunction
	folders: Folder[]
	qrId: string
	translations: FolderTranslations
}

const FolderSelectorModal = ({
	isOpen,
	onOpenChange,
	onClose,
	folders,
	qrId,
	translations,
}: Props) => {
	const [isPending, startTransition] = useTransition()
	const [loadingId, setLoadingId] = useState<string | null>(null)

	const handleSelect = (folderId: string, folderName: string) => {
		setLoadingId(folderId)
		startTransition(async () => {
			const { error } = await updateQrFolder(qrId, folderId)
			if (error) {
				toast.error(error)
			} else {
				toast.success(`${translations.moved} "${folderName}"`)
				onClose()
			}
			setLoadingId(null)
		})
	}

	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
			<ModalContent>
				<ModalHeader>{translations.moveTitle}</ModalHeader>
				<ModalBody className="pb-6">
					<p className="text-sm text-default-500 mb-3">
						{translations.moveDesc}
					</p>
					{folders.length === 0 ? (
						<p className="text-sm text-default-400 text-center py-4">
							{translations.noFolders}
						</p>
					) : (
						<div className="flex flex-col gap-2">
							{folders.map((folder) => (
								<Button
									key={folder.id}
									variant="flat"
									startContent={<HugeiconsIcon icon={Folder01Icon} size={18} />}
									onPress={() => handleSelect(folder.id, folder.name)}
									isLoading={loadingId === folder.id}
									className="justify-start capitalize"
								>
									{folder.name}
								</Button>
							))}
						</div>
					)}
				</ModalBody>
			</ModalContent>
		</Modal>
	)
}

export default FolderSelectorModal
