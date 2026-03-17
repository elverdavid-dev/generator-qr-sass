'use client'

import { useState, useTransition } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { toast } from 'sonner'
import { saveTemplate } from '@/features/qr-codes/services/mutations/template-actions'
import type { TemplateData } from '@/features/qr-codes/services/mutations/template-actions'

interface SaveTemplateModalTranslations {
	title: string
	namePlaceholder: string
	cancel: string
	save: string
	saved: string
}

interface Props {
	isOpen: boolean
	onOpenChange: (open: boolean) => void
	onClose: () => void
	templateData: Omit<TemplateData, 'name'>
	onSaved: () => void
	translations: SaveTemplateModalTranslations
}

export default function SaveTemplateModal({
	isOpen,
	onOpenChange,
	onClose,
	templateData,
	onSaved,
	translations,
}: Props) {
	const [name, setName] = useState('')
	const [isPending, startTransition] = useTransition()

	const handleSave = () => {
		if (!name.trim()) return
		startTransition(async () => {
			const res = await saveTemplate({ ...templateData, name: name.trim() })
			if (res.error) { toast.error(res.error); return }
			toast.success(translations.saved)
			setName('')
			onSaved()
			onClose()
		})
	}

	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange} size="sm">
			<ModalContent>
				<ModalHeader>{translations.title}</ModalHeader>
				<ModalBody>
					<Input
						autoFocus
						value={name}
						onValueChange={setName}
						placeholder={translations.namePlaceholder}
						onKeyDown={(e) => e.key === 'Enter' && handleSave()}
					/>
				</ModalBody>
				<ModalFooter>
					<Button variant="flat" onPress={onClose}>{translations.cancel}</Button>
					<Button color="primary" isLoading={isPending} onPress={handleSave} isDisabled={!name.trim()}>
						{translations.save}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}
