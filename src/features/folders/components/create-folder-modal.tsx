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
import { useRouter } from 'next/navigation'
import { type FC, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
	createFolderSchema,
	type FolderFormData,
} from '@/features/folders/schemas/folder-schema'
import { createFolder } from '@/features/folders/services/mutations/create-folder'
import { updateFolder } from '@/features/folders/services/mutations/update-folder'
import type { Folder } from '@/shared/types/database.types'

interface CreateFolderTranslations {
	editFolder: string
	newFolder: string
	name: string
	namePlaceholder: string
	cancel: string
	save: string
	create: string
	created: string
	updated: string
	nameRequired: string
}

interface Props {
	folder?: Folder
	isOpen: boolean
	onOpenChange: VoidFunction
	onClose: VoidFunction
	translations: CreateFolderTranslations
}

const CreateFolderModal: FC<Props> = ({
	folder,
	isOpen,
	onOpenChange,
	onClose,
	translations,
}) => {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<FolderFormData>({
		resolver: zodResolver(
			createFolderSchema({ nameRequired: translations.nameRequired }),
		),
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
			toast.success(folder ? translations.updated : translations.created)
			reset()
			onClose()
			router.refresh()
		})
	}

	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
			<ModalContent>
				<ModalHeader>
					{folder ? translations.editFolder : translations.newFolder}
				</ModalHeader>
				<ModalBody>
					<form id="folder-form" onSubmit={handleSubmit(onSubmit)}>
						<Input
							label={translations.name}
							labelPlacement="outside"
							placeholder={translations.namePlaceholder}
							variant="bordered"
							{...register('name')}
							isInvalid={!!errors.name}
							errorMessage={errors.name?.message}
						/>
					</form>
				</ModalBody>
				<ModalFooter>
					<Button variant="bordered" onPress={onClose}>
						{translations.cancel}
					</Button>
					<Button
						color="primary"
						type="submit"
						form="folder-form"
						isLoading={isPending}
					>
						{folder ? translations.save : translations.create}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}

export default CreateFolderModal
