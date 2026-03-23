'use client'

import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from '@heroui/modal'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { createWebhook } from '@/features/webhooks/services/mutations/webhook-actions'

interface Translations {
	addTitle: string
	nameLabel: string
	namePlaceholder: string
	urlLabel: string
	urlPlaceholder: string
	secretLabel: string
	secretPlaceholder: string
	secretHint: string
	save: string
	cancel: string
	successMsg: string
	errorMsg: string
}

interface Props {
	isOpen: boolean
	onClose: () => void
	translations: Translations
}

export default function AddWebhookModal({
	isOpen,
	onClose,
	translations: t,
}: Props) {
	const [name, setName] = useState('')
	const [url, setUrl] = useState('')
	const [secret, setSecret] = useState('')
	const [isPending, startTransition] = useTransition()

	const handleSave = () => {
		if (!name.trim() || !url.trim()) return
		startTransition(async () => {
			const result = await createWebhook({
				name: name.trim(),
				url: url.trim(),
				secret: secret.trim() || undefined,
			})
			if (result.error) {
				toast.error(result.error)
			} else {
				toast.success(t.successMsg)
				setName('')
				setUrl('')
				setSecret('')
				onClose()
			}
		})
	}

	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={(open) => !open && onClose()}
			size="md"
		>
			<ModalContent>
				<ModalHeader className="text-lg font-bold">{t.addTitle}</ModalHeader>
				<ModalBody className="gap-4">
					<Input
						label={t.nameLabel}
						placeholder={t.namePlaceholder}
						value={name}
						onValueChange={setName}
						isDisabled={isPending}
					/>
					<Input
						label={t.urlLabel}
						placeholder={t.urlPlaceholder}
						value={url}
						onValueChange={setUrl}
						type="url"
						isDisabled={isPending}
					/>
					<Input
						label={t.secretLabel}
						placeholder={t.secretPlaceholder}
						value={secret}
						onValueChange={setSecret}
						description={t.secretHint}
						isDisabled={isPending}
					/>
				</ModalBody>
				<ModalFooter>
					<Button variant="flat" onPress={onClose} isDisabled={isPending}>
						{t.cancel}
					</Button>
					<Button
						color="primary"
						onPress={handleSave}
						isLoading={isPending}
						isDisabled={!name.trim() || !url.trim()}
					>
						{t.save}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}
