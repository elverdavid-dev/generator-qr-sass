'use client'

import { useState } from 'react'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/modal'
import { Chip } from '@heroui/chip'
import { Avatar } from '@heroui/avatar'
import { useDisclosure } from '@heroui/use-disclosure'
import { Select, SelectItem } from '@heroui/select'
import {
	Add01Icon,
	Delete02Icon,
	UserGroupIcon,
	Mail01Icon,
	Copy01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { toast } from 'sonner'
import { inviteMember, removeMember } from '@/features/team/services/team-actions'

interface TeamMember {
	id: string
	email: string
	role: string
	status: string
	invited_at: string
	joined_at: string | null
	profiles: { name: string | null; avatar_url: string | null } | null
}

interface Props {
	initialMembers: TeamMember[]
	maxMembers: number
	translations: {
		title: string
		subtitle: string
		invite: string
		noMembers: string
		noMembersDesc: string
		emailLabel: string
		roleLabel: string
		roleMember: string
		roleAdmin: string
		sendInvite: string
		sending: string
		cancel: string
		remove: string
		removeConfirm: string
		removeDesc: string
		pending: string
		active: string
		admin: string
		member: string
		joined: string
		invited: string
		never: string
		inviteSent: string
		inviteLink: string
		copyLink: string
		copied: string
		slotsUsed: string
	}
}

export default function TeamManager({ initialMembers, maxMembers, translations: t }: Props) {
	const [members, setMembers] = useState<TeamMember[]>(initialMembers)
	const [email, setEmail] = useState('')
	const [role, setRole] = useState<'member' | 'admin'>('member')
	const [removeId, setRemoveId] = useState<string | null>(null)
	const [isSending, setIsSending] = useState(false)
	const [isRemoving, setIsRemoving] = useState(false)
	const [inviteLink, setInviteLink] = useState<string | null>(null)

	const inviteDisc = useDisclosure()
	const removeDisc = useDisclosure()
	const linkDisc = useDisclosure()

	const activeCount = members.filter(m => m.status === 'active').length

	const handleInvite = async () => {
		if (!email.trim()) return
		setIsSending(true)
		const result = await inviteMember(email.trim(), role)
		setIsSending(false)

		if ('error' in result) {
			toast.error(result.error)
			return
		}

		toast.success(t.inviteSent)
		setMembers(prev => [{
			id: crypto.randomUUID(),
			email: email.trim(),
			role,
			status: 'pending',
			invited_at: new Date().toISOString(),
			joined_at: null,
			profiles: null,
		}, ...prev])

		if (result.inviteUrl) {
			setInviteLink(result.inviteUrl)
			inviteDisc.onClose()
			linkDisc.onOpen()
		} else {
			inviteDisc.onClose()
		}
		setEmail('')
	}

	const handleRemove = async () => {
		if (!removeId) return
		setIsRemoving(true)
		const result = await removeMember(removeId)
		setIsRemoving(false)

		if ('error' in result) {
			toast.error(result.error)
			return
		}

		setMembers(prev => prev.filter(m => m.id !== removeId))
		removeDisc.onClose()
		toast.success(t.remove)
	}

	const copyLink = () => {
		if (!inviteLink) return
		navigator.clipboard.writeText(inviteLink)
		toast.success(t.copied)
	}

	const formatDate = (date: string | null) => {
		if (!date) return t.never
		return new Intl.DateTimeFormat('es', { dateStyle: 'medium' }).format(new Date(date))
	}

	return (
		<div className="flex flex-col gap-6">
			{/* Header */}
			<div className="flex items-start justify-between">
				<div>
					<h1 className="text-2xl font-bold">{t.title}</h1>
					<p className="text-default-500 text-sm mt-1">{t.subtitle}</p>
				</div>
				<div className="flex flex-col items-end gap-1">
					<Button
						color="primary"
						startContent={<HugeiconsIcon icon={Add01Icon} size={16} />}
						onPress={inviteDisc.onOpen}
						isDisabled={activeCount >= maxMembers}
					>
						{t.invite}
					</Button>
					<span className="text-xs text-default-400">
						{activeCount}/{maxMembers} {t.slotsUsed}
					</span>
				</div>
			</div>

			{/* Members list */}
			{members.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-16 gap-3 border border-dashed border-divider rounded-xl">
					<div className="w-14 h-14 bg-default-100 rounded-2xl flex items-center justify-center">
						<HugeiconsIcon icon={UserGroupIcon} size={26} className="text-default-400" />
					</div>
					<p className="font-semibold text-default-600">{t.noMembers}</p>
					<p className="text-sm text-default-400">{t.noMembersDesc}</p>
				</div>
			) : (
				<div className="flex flex-col gap-2">
					{members.map(m => (
						<div
							key={m.id}
							className="flex items-center gap-4 p-4 border border-divider rounded-xl bg-content1"
						>
							<Avatar
								name={m.profiles?.name ?? m.email}
								src={m.profiles?.avatar_url ?? undefined}
								size="sm"
							/>
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2 flex-wrap">
									<span className="font-medium text-sm truncate">
										{m.profiles?.name ?? m.email}
									</span>
									<Chip
										size="sm"
										variant="flat"
										color={m.status === 'active' ? 'success' : 'warning'}
									>
										{m.status === 'active' ? t.active : t.pending}
									</Chip>
									<Chip size="sm" variant="flat" color="default">
										{m.role === 'admin' ? t.admin : t.member}
									</Chip>
								</div>
								<p className="text-xs text-default-400 mt-0.5">
									{m.profiles?.name ? m.email : ''}
									{m.status === 'active'
										? ` · ${t.joined}: ${formatDate(m.joined_at)}`
										: ` · ${t.invited}: ${formatDate(m.invited_at)}`}
								</p>
							</div>
							<Button
								isIconOnly
								variant="light"
								color="danger"
								size="sm"
								onPress={() => {
									setRemoveId(m.id)
									removeDisc.onOpen()
								}}
							>
								<HugeiconsIcon icon={Delete02Icon} size={16} />
							</Button>
						</div>
					))}
				</div>
			)}

			{/* Modal: invitar */}
			<Modal isOpen={inviteDisc.isOpen} onClose={inviteDisc.onClose}>
				<ModalContent>
					<ModalHeader className="flex items-center gap-2">
						<HugeiconsIcon icon={Mail01Icon} size={18} />
						{t.invite}
					</ModalHeader>
					<ModalBody className="flex flex-col gap-3">
						<Input
							label={t.emailLabel}
							placeholder="nombre@empresa.com"
							type="email"
							value={email}
							onValueChange={setEmail}
						/>
						<Select
							label={t.roleLabel}
							selectedKeys={[role]}
							onSelectionChange={keys => setRole(Array.from(keys)[0] as 'member' | 'admin')}
						>
							<SelectItem key="member">{t.roleMember}</SelectItem>
							<SelectItem key="admin">{t.roleAdmin}</SelectItem>
						</Select>
					</ModalBody>
					<ModalFooter>
						<Button variant="flat" onPress={inviteDisc.onClose}>{t.cancel}</Button>
						<Button
							color="primary"
							isLoading={isSending}
							isDisabled={!email.trim()}
							onPress={handleInvite}
						>
							{t.sendInvite}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			{/* Modal: link de invitación */}
			<Modal isOpen={linkDisc.isOpen} onClose={linkDisc.onClose}>
				<ModalContent>
					<ModalHeader>{t.inviteLink}</ModalHeader>
					<ModalBody className="flex flex-col gap-3">
						<p className="text-sm text-default-500">{t.inviteSent}</p>
						<div className="flex items-center gap-2 bg-content2 rounded-xl px-3 py-2">
							<code className="flex-1 text-xs font-mono break-all text-foreground">{inviteLink}</code>
							<Button isIconOnly size="sm" variant="flat" onPress={copyLink}>
								<HugeiconsIcon icon={Copy01Icon} size={14} />
							</Button>
						</div>
					</ModalBody>
					<ModalFooter>
						<Button color="primary" fullWidth onPress={linkDisc.onClose}>{t.cancel}</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			{/* Modal: confirmar eliminar */}
			<Modal isOpen={removeDisc.isOpen} onClose={removeDisc.onClose}>
				<ModalContent>
					<ModalHeader className="text-danger">{t.removeConfirm}</ModalHeader>
					<ModalBody>
						<p className="text-sm text-default-500">{t.removeDesc}</p>
					</ModalBody>
					<ModalFooter>
						<Button variant="flat" onPress={removeDisc.onClose}>{t.cancel}</Button>
						<Button color="danger" isLoading={isRemoving} onPress={handleRemove}>
							{t.remove}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	)
}
