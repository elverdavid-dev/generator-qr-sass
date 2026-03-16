'use client'

import { Avatar } from '@heroui/avatar'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { UserEdit01Icon, Camera01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useRef, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { updateProfile } from '@/features/auth/services/mutations/update-profile'
import type { Profile } from '@/shared/types/database.types'

interface ProfileFormTranslations {
	email: string
	name: string
	namePlaceholder: string
	surname: string
	surnamePlaceholder: string
	phone: string
	phonePlaceholder: string
	changePhoto: string
	save: string
	successMessage: string
}

interface Props {
	profile: Profile
	translations: ProfileFormTranslations
}

export default function ProfileForm({ profile, translations }: Props) {
	const [isPending, startTransition] = useTransition()
	const [avatarPreview, setAvatarPreview] = useState<string>(profile.avatar_url ?? '')
	const [avatarFile, setAvatarFile] = useState<File | null>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return
		setAvatarFile(file)
		setAvatarPreview(URL.createObjectURL(file))
	}

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const form = new FormData(e.currentTarget)

		startTransition(async () => {
			const result = await updateProfile({
				name: form.get('name') as string,
				surname: form.get('surname') as string,
				phone: form.get('phone') as string,
				avatar: avatarFile,
			})

			if (result.error) {
				toast.error(result.error)
			} else {
				toast.success(translations.successMessage)
				setAvatarFile(null)
			}
		})
	}

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-6">
			{/* Avatar */}
			<div className="flex flex-col items-center gap-3">
				<div className="relative">
					<Avatar
						src={avatarPreview}
						name={profile.name ?? profile.email}
						className="w-24 h-24 text-2xl"
					/>
					<button
						type="button"
						onClick={() => fileInputRef.current?.click()}
						className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors shadow"
					>
						<HugeiconsIcon icon={Camera01Icon} size={14} />
					</button>
					<input
						ref={fileInputRef}
						type="file"
						accept="image/*"
						className="hidden"
						onChange={handleAvatarChange}
					/>
				</div>
				<p className="text-xs text-default-400">{translations.changePhoto}</p>
			</div>

			{/* Email (read only) */}
			<Input
				label={translations.email}
				value={profile.email}
				isReadOnly
				variant="bordered"
				classNames={{ input: 'text-default-400' }}
			/>

			{/* Name fields */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<Input
					name="name"
					label={translations.name}
					defaultValue={profile.name ?? ''}
					variant="bordered"
					placeholder={translations.namePlaceholder}
				/>
				<Input
					name="surname"
					label={translations.surname}
					defaultValue={profile.surname ?? ''}
					variant="bordered"
					placeholder={translations.surnamePlaceholder}
				/>
			</div>

			<Input
				name="phone"
				label={translations.phone}
				defaultValue={profile.phone ?? ''}
				variant="bordered"
				placeholder={translations.phonePlaceholder}
				type="tel"
			/>

			<Button
				type="submit"
				color="primary"
				isLoading={isPending}
				startContent={!isPending && <HugeiconsIcon icon={UserEdit01Icon} size={16} />}
				className="self-end"
			>
				{translations.save}
			</Button>
		</form>
	)
}
