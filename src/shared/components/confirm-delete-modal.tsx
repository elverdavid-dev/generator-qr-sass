'use client'

import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from '@heroui/react'
import type { FC } from 'react'
import { useTransition } from 'react'
import { toast } from 'sonner'

interface Props {
	isOpen: boolean
	onOpenChange: VoidFunction
	onClose: VoidFunction
	onDelete: () => Promise<{ error?: string; success?: boolean }>
	title: string
	description: string
	notification_message: string
}

const ConfirmDeleteModal: FC<Props> = ({
	isOpen,
	onOpenChange,
	onClose,
	onDelete,
	title,
	description,
	notification_message,
}) => {
	const [isLoading, startTransition] = useTransition()

	const handleDelete = () => {
		startTransition(async () => {
			const result = await onDelete()
			if (result?.error) {
				toast.error(result.error)
				return
			}
			toast.success(notification_message)
			onClose()
		})
	}

	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
			<ModalContent>
				<ModalHeader>{title}</ModalHeader>
				<ModalBody>
					<p className="text-default-500">{description}</p>
				</ModalBody>
				<ModalFooter>
					<Button variant="bordered" onPress={onClose}>
						Cancelar
					</Button>
					<Button color="danger" onPress={handleDelete} isLoading={isLoading}>
						Eliminar
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}

export default ConfirmDeleteModal
