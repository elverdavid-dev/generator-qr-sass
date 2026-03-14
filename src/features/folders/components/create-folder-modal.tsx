'use client'

import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { type FC, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { createFolder } from '@/features/folders/services/mutations/create-folder'
import { updateFolder } from '@/features/folders/services/mutations/update-folder'
import { folderSchema, type FolderFormData } from '@/features/folders/schemas/folder-schema'
import type { Folder } from '@/shared/types/database.types'

interface Props {
	folder?: Folder
	isOpen: boolean
	onOpenChange: VoidFunction
	onClose: VoidFunction
}

const CreateFolderModal: FC<Props> = ({ folder, isOpen, onOpenChange, onClose }) => {
	const [isPending, startTransition] = useTransition()
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<FolderFormData>({
		resolver: zodResolver(folderSchema),
		defaultValues: { name: folder?.name ?? '' },
	})

	const onSubmit = (data: FolderFormData) => {
		startTransition(async () => {
			const result = folder
				? await updateFolder(folder.id, data.name)
				: await createFolder(data.name)

			if (result.error) {
				toast.error(result.error)
				return
			}
			toast.success(folder ? 'Carpeta actualizada' : 'Carpeta creada')
			reset()
			onClose()
		})
	}

	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
			<ModalContent>
				<ModalHeader>
					{folder ? 'Editar carpeta' : 'Nueva carpeta'}
				</ModalHeader>
				<ModalBody>
					<form id="folder-form" onSubmit={handleSubmit(onSubmit)}>
						<Input
							label="Nombre"
							labelPlacement="outside"
							placeholder="Ej: Clientes, Marketing..."
							variant="bordered"
							{...register('name')}
							isInvalid={!!errors.name}
							errorMessage={errors.name?.message}
						/>
					</form>
				</ModalBody>
				<ModalFooter>
					<Button variant="bordered" onPress={onClose}>
						Cancelar
					</Button>
					<Button
						color="primary"
						type="submit"
						form="folder-form"
						isLoading={isPending}
					>
						{folder ? 'Guardar cambios' : 'Crear carpeta'}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}

export default CreateFolderModal
