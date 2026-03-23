'use client'

import { Button } from '@heroui/button'
import { Switch } from '@heroui/switch'
import { Tooltip } from '@heroui/tooltip'
import {
	Add01Icon,
	Copy01Icon,
	Delete02Icon,
	WebhookIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import dynamic from 'next/dynamic'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import {
	deleteWebhook,
	toggleWebhook,
} from '@/features/webhooks/services/mutations/webhook-actions'
import type { Webhook } from '@/shared/types/database.types'

const AddWebhookModal = dynamic(() => import('./add-webhook-modal'))

interface Translations {
	empty: string
	emptyDesc: string
	addWebhook: string
	active: string
	inactive: string
	deleteLabel: string
	copySecret: string
	secretCopied: string
	deleteConfirm: string
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
	webhooks: Webhook[]
	translations: Translations
}

export default function WebhookList({
	webhooks: initial,
	translations: t,
}: Props) {
	const [webhooks, setWebhooks] = useState(initial)
	const [modalOpen, setModalOpen] = useState(false)
	const [deletingId, setDeletingId] = useState<string | null>(null)
	const [, startTransition] = useTransition()

	const handleToggle = (id: string, value: boolean) => {
		setWebhooks((prev) =>
			prev.map((w) => (w.id === id ? { ...w, is_active: value } : w)),
		)
		startTransition(async () => {
			const result = await toggleWebhook(id, value)
			if (result.error) {
				setWebhooks((prev) =>
					prev.map((w) => (w.id === id ? { ...w, is_active: !value } : w)),
				)
				toast.error(result.error)
			}
		})
	}

	const handleDelete = (id: string) => {
		setDeletingId(id)
		startTransition(async () => {
			const result = await deleteWebhook(id)
			if (result.error) {
				toast.error(result.error)
			} else {
				setWebhooks((prev) => prev.filter((w) => w.id !== id))
			}
			setDeletingId(null)
		})
	}

	const handleCopySecret = (secret: string) => {
		navigator.clipboard.writeText(secret)
		toast.success(t.secretCopied)
	}

	return (
		<>
			<div className="flex flex-col gap-4">
				{webhooks.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-16 gap-4 border border-dashed border-divider rounded-2xl text-center">
						<div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
							<HugeiconsIcon
								icon={WebhookIcon}
								size={28}
								className="text-primary"
							/>
						</div>
						<div>
							<p className="font-semibold text-foreground">{t.empty}</p>
							<p className="text-sm text-default-500 mt-1">{t.emptyDesc}</p>
						</div>
						<Button
							color="primary"
							radius="full"
							startContent={<HugeiconsIcon icon={Add01Icon} size={16} />}
							onPress={() => setModalOpen(true)}
						>
							{t.addWebhook}
						</Button>
					</div>
				) : (
					<>
						<div className="flex justify-end">
							<Button
								color="primary"
								radius="full"
								size="sm"
								startContent={<HugeiconsIcon icon={Add01Icon} size={15} />}
								onPress={() => setModalOpen(true)}
							>
								{t.addWebhook}
							</Button>
						</div>

						<div className="flex flex-col gap-3">
							{webhooks.map((webhook) => (
								<div
									key={webhook.id}
									className="flex items-start gap-4 p-4 rounded-2xl border border-divider bg-content1"
								>
									<div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
										<HugeiconsIcon
											icon={WebhookIcon}
											size={18}
											className="text-primary"
										/>
									</div>

									<div className="flex-1 min-w-0">
										<p className="font-semibold text-sm text-foreground truncate">
											{webhook.name}
										</p>
										<p className="text-xs text-default-400 truncate mt-0.5">
											{webhook.url}
										</p>
										{webhook.secret && (
											<div className="flex items-center gap-1 mt-1.5">
												<p className="text-xs text-default-400 font-mono">
													••••••••{webhook.secret.slice(-4)}
												</p>
												<Tooltip content={t.copySecret}>
													<button
														type="button"
														onClick={() => handleCopySecret(webhook.secret!)}
														className="text-default-400 hover:text-primary transition-colors"
													>
														<HugeiconsIcon icon={Copy01Icon} size={12} />
													</button>
												</Tooltip>
											</div>
										)}
									</div>

									<div className="flex items-center gap-2 shrink-0">
										<Switch
											size="sm"
											isSelected={webhook.is_active}
											onValueChange={(value) => handleToggle(webhook.id, value)}
											aria-label={webhook.is_active ? t.active : t.inactive}
										/>
										<Tooltip content={t.deleteLabel} color="danger">
											<Button
												isIconOnly
												size="sm"
												variant="light"
												color="danger"
												onPress={() => handleDelete(webhook.id)}
												isLoading={deletingId === webhook.id}
											>
												<HugeiconsIcon icon={Delete02Icon} size={16} />
											</Button>
										</Tooltip>
									</div>
								</div>
							))}
						</div>
					</>
				)}
			</div>

			{modalOpen && (
				<AddWebhookModal
					isOpen={modalOpen}
					onClose={() => setModalOpen(false)}
					translations={{
						addTitle: t.addTitle,
						nameLabel: t.nameLabel,
						namePlaceholder: t.namePlaceholder,
						urlLabel: t.urlLabel,
						urlPlaceholder: t.urlPlaceholder,
						secretLabel: t.secretLabel,
						secretPlaceholder: t.secretPlaceholder,
						secretHint: t.secretHint,
						save: t.save,
						cancel: t.cancel,
						successMsg: t.successMsg,
						errorMsg: t.errorMsg,
					}}
				/>
			)}
		</>
	)
}
