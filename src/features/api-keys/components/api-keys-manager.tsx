'use client'

import { Button } from '@heroui/button'
import { Chip } from '@heroui/chip'
import { Input } from '@heroui/input'
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from '@heroui/modal'
import { Tooltip } from '@heroui/tooltip'
import { useDisclosure } from '@heroui/use-disclosure'
import {
	Add01Icon,
	Copy01Icon,
	Delete02Icon,
	EyeIcon,
	Key01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useState } from 'react'
import { toast } from 'sonner'
import {
	createApiKey,
	revokeApiKey,
} from '@/features/api-keys/services/api-key-actions'

interface ApiKey {
	id: string
	name: string
	key_prefix: string
	is_active: boolean
	last_used_at: string | null
	created_at: string
}

interface Props {
	initialKeys: ApiKey[]
	baseUrl: string
	translations: {
		title: string
		subtitle: string
		newKey: string
		noKeys: string
		noKeysDesc: string
		created: string
		lastUsed: string
		never: string
		revoke: string
		revokeConfirm: string
		revokeDesc: string
		cancel: string
		generating: string
		keyReady: string
		keyReadyDesc: string
		copyKey: string
		copied: string
		close: string
		nameLabel: string
		namePlaceholder: string
		generate: string
		docsTitle: string
		docsAuth: string
		active: string
	}
}

export default function ApiKeysManager({
	initialKeys,
	baseUrl,
	translations: t,
}: Props) {
	const [keys, setKeys] = useState<ApiKey[]>(initialKeys)
	const [newKeyName, setNewKeyName] = useState('')
	const [generatedKey, setGeneratedKey] = useState<string | null>(null)
	const [revokeId, setRevokeId] = useState<string | null>(null)
	const [isCreating, setIsCreating] = useState(false)
	const [isRevoking, setIsRevoking] = useState(false)

	const createDisc = useDisclosure()
	const keyReadyDisc = useDisclosure()
	const revokeDisc = useDisclosure()

	const handleCreate = async () => {
		if (!newKeyName.trim()) return
		setIsCreating(true)
		const result = await createApiKey(newKeyName.trim())
		setIsCreating(false)

		if ('error' in result) {
			toast.error(result.error)
			return
		}

		setGeneratedKey(result.key ?? null)
		setNewKeyName('')
		createDisc.onClose()
		keyReadyDisc.onOpen()

		// Refrescar lista
		const prefix = result.key?.slice(0, 12) ?? ''
		setKeys((prev) => [
			{
				id: result.id ?? crypto.randomUUID(),
				name: newKeyName.trim(),
				key_prefix: prefix,
				is_active: true,
				last_used_at: null,
				created_at: new Date().toISOString(),
			},
			...prev,
		])
	}

	const handleRevoke = async () => {
		if (!revokeId) return
		setIsRevoking(true)
		const result = await revokeApiKey(revokeId)
		setIsRevoking(false)

		if ('error' in result) {
			toast.error(result.error)
			return
		}

		setKeys((prev) => prev.filter((k) => k.id !== revokeId))
		revokeDisc.onClose()
		toast.success(t.revoke)
	}

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text)
		toast.success(t.copied)
	}

	const formatDate = (date: string | null) => {
		if (!date) return t.never
		return new Intl.DateTimeFormat('es', { dateStyle: 'medium' }).format(
			new Date(date),
		)
	}

	return (
		<div className="flex flex-col gap-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">{t.title}</h1>
					<p className="text-default-500 text-sm mt-1">{t.subtitle}</p>
				</div>
				<Button
					color="primary"
					startContent={<HugeiconsIcon icon={Add01Icon} size={16} />}
					onPress={createDisc.onOpen}
				>
					{t.newKey}
				</Button>
			</div>

			{/* Keys list */}
			{keys.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-16 gap-3 border border-dashed border-divider rounded-xl">
					<div className="w-14 h-14 bg-default-100 rounded-2xl flex items-center justify-center">
						<HugeiconsIcon
							icon={Key01Icon}
							size={26}
							className="text-default-400"
						/>
					</div>
					<p className="font-semibold text-default-600">{t.noKeys}</p>
					<p className="text-sm text-default-400">{t.noKeysDesc}</p>
				</div>
			) : (
				<div className="flex flex-col gap-2">
					{keys.map((key) => (
						<div
							key={key.id}
							className="flex items-center gap-4 p-4 border border-divider rounded-xl bg-content1"
						>
							<div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
								<HugeiconsIcon
									icon={Key01Icon}
									size={18}
									className="text-primary"
								/>
							</div>
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2">
									<span className="font-medium text-sm">{key.name}</span>
									<Chip size="sm" variant="flat" color="success">
										{t.active}
									</Chip>
								</div>
								<p className="text-xs text-default-400 font-mono mt-0.5">
									{key.key_prefix}••••••••••••••••••••••••
								</p>
							</div>
							<div className="hidden sm:flex flex-col items-end text-xs text-default-400 gap-0.5">
								<span>
									{t.created}: {formatDate(key.created_at)}
								</span>
								<span>
									{t.lastUsed}: {formatDate(key.last_used_at)}
								</span>
							</div>
							<Tooltip content={t.revoke} color="danger">
								<Button
									isIconOnly
									variant="light"
									color="danger"
									size="sm"
									onPress={() => {
										setRevokeId(key.id)
										revokeDisc.onOpen()
									}}
								>
									<HugeiconsIcon icon={Delete02Icon} size={16} />
								</Button>
							</Tooltip>
						</div>
					))}
				</div>
			)}

			{/* Docs */}
			<div className="border border-divider rounded-xl p-5 flex flex-col gap-3">
				<h2 className="font-semibold text-sm flex items-center gap-2">
					<HugeiconsIcon
						icon={EyeIcon}
						size={16}
						className="text-default-400"
					/>
					{t.docsTitle}
				</h2>
				<p className="text-xs text-default-500">{t.docsAuth}</p>
				<div className="flex items-center gap-2 bg-content2 rounded-lg px-3 py-2 font-mono text-xs">
					<span className="flex-1 truncate text-default-600">
						Authorization: Bearer qrg_••••••••••••••••••••••••••••••••
					</span>
				</div>
				<div className="flex flex-col gap-1.5">
					{[
						{
							method: 'GET',
							path: `${baseUrl}/api/v1/qrs`,
							desc: 'Listar QRs',
						},
						{ method: 'POST', path: `${baseUrl}/api/v1/qrs`, desc: 'Crear QR' },
						{
							method: 'GET',
							path: `${baseUrl}/api/v1/qrs/:id`,
							desc: 'Obtener QR',
						},
						{
							method: 'PATCH',
							path: `${baseUrl}/api/v1/qrs/:id`,
							desc: 'Actualizar QR',
						},
						{
							method: 'DELETE',
							path: `${baseUrl}/api/v1/qrs/:id`,
							desc: 'Eliminar QR',
						},
					].map((e) => (
						<div
							key={e.path + e.method}
							className="flex items-center gap-2 font-mono text-xs"
						>
							<span
								className={`w-14 text-center rounded px-1.5 py-0.5 text-[11px] font-semibold ${
									e.method === 'GET'
										? 'bg-success/10 text-success'
										: e.method === 'POST'
											? 'bg-primary/10 text-primary'
											: e.method === 'PATCH'
												? 'bg-warning/10 text-warning'
												: 'bg-danger/10 text-danger'
								}`}
							>
								{e.method}
							</span>
							<span className="text-default-500 truncate">{e.path}</span>
							<span className="text-default-400 hidden sm:block">
								— {e.desc}
							</span>
						</div>
					))}
				</div>
				<Button
					size="sm"
					variant="flat"
					startContent={<HugeiconsIcon icon={Copy01Icon} size={14} />}
					onPress={() => copyToClipboard(`${baseUrl}/api/v1/qrs`)}
					className="self-start"
				>
					Copiar base URL
				</Button>
			</div>

			{/* Modal: crear key */}
			<Modal isOpen={createDisc.isOpen} onClose={createDisc.onClose}>
				<ModalContent>
					<ModalHeader>{t.newKey}</ModalHeader>
					<ModalBody>
						<Input
							label={t.nameLabel}
							placeholder={t.namePlaceholder}
							value={newKeyName}
							onValueChange={setNewKeyName}
						/>
					</ModalBody>
					<ModalFooter>
						<Button variant="flat" onPress={createDisc.onClose}>
							{t.cancel}
						</Button>
						<Button
							color="primary"
							isLoading={isCreating}
							isDisabled={!newKeyName.trim()}
							onPress={handleCreate}
						>
							{t.generate}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			{/* Modal: key generada — mostrar UNA sola vez */}
			<Modal
				isOpen={keyReadyDisc.isOpen}
				onClose={keyReadyDisc.onClose}
				isDismissable={false}
				hideCloseButton
			>
				<ModalContent>
					<ModalHeader>{t.keyReady}</ModalHeader>
					<ModalBody className="flex flex-col gap-3">
						<p className="text-sm text-default-500">{t.keyReadyDesc}</p>
						<div className="flex items-center gap-2 bg-content2 rounded-xl px-3 py-2">
							<code className="flex-1 text-xs font-mono break-all text-foreground">
								{generatedKey}
							</code>
							<Button
								isIconOnly
								size="sm"
								variant="flat"
								onPress={() => copyToClipboard(generatedKey ?? '')}
							>
								<HugeiconsIcon icon={Copy01Icon} size={14} />
							</Button>
						</div>
					</ModalBody>
					<ModalFooter>
						<Button
							color="primary"
							fullWidth
							onPress={() => {
								setGeneratedKey(null)
								keyReadyDisc.onClose()
							}}
						>
							{t.close}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			{/* Modal: confirmar revocación */}
			<Modal isOpen={revokeDisc.isOpen} onClose={revokeDisc.onClose}>
				<ModalContent>
					<ModalHeader className="text-danger">{t.revokeConfirm}</ModalHeader>
					<ModalBody>
						<p className="text-sm text-default-500">{t.revokeDesc}</p>
					</ModalBody>
					<ModalFooter>
						<Button variant="flat" onPress={revokeDisc.onClose}>
							{t.cancel}
						</Button>
						<Button
							color="danger"
							isLoading={isRevoking}
							onPress={handleRevoke}
						>
							{t.revoke}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	)
}
