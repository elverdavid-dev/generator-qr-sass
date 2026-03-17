'use client'

import {
	Avatar,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownSection,
	DropdownTrigger,
	User,
} from '@heroui/react'
import {
	Logout02Icon,
	UserCircleIcon,
	Invoice03Icon,
	StarIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useTransition, type FC } from 'react'
import { logoutService } from '@/features/auth/services/logout'

interface Translations {
	myAccount: string
	profile: string
	billing: string
	pricing: string
	logout: string
	loggingOut: string
}

interface Props {
	avatar_url: string
	full_name: string
	email?: string
	translations: Translations
}

const ProfileButton: FC<Props> = ({ avatar_url, full_name, email, translations }) => {
	const [isPending, startTransition] = useTransition()

	const handleLogout = () => {
		startTransition(() => logoutService())
	}

	return (
		<Dropdown placement="bottom-end">
			<DropdownTrigger>
				<Avatar size="sm" as="button" src={avatar_url} className="cursor-pointer" />
			</DropdownTrigger>
			<DropdownMenu aria-label="Profile Actions" variant="flat">
				<DropdownItem key="user-info" className="h-14 gap-2 cursor-default" isReadOnly>
					<User
						avatarProps={{ src: avatar_url, size: 'sm' }}
						name={full_name}
						description={email}
					/>
				</DropdownItem>

				<DropdownSection showDivider>
					<DropdownItem
						key="profile"
						href="/dashboard/profile"
						startContent={<HugeiconsIcon icon={UserCircleIcon} size={18} />}
					>
						{translations.profile}
					</DropdownItem>
					<DropdownItem
						key="billing"
						href="/dashboard/billing"
						startContent={<HugeiconsIcon icon={Invoice03Icon} size={18} />}
					>
						{translations.billing}
					</DropdownItem>
					<DropdownItem
						key="pricing"
						href="/pricing"
						startContent={<HugeiconsIcon icon={StarIcon} size={18} />}
						className="text-primary"
					>
						{translations.pricing}
					</DropdownItem>
				</DropdownSection>

				<DropdownItem
					key="logout"
					color="danger"
					className="text-danger"
					startContent={<HugeiconsIcon icon={Logout02Icon} size={18} />}
					onPress={handleLogout}
					isDisabled={isPending}
				>
					{isPending ? translations.loggingOut : translations.logout}
				</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	)
}

export default ProfileButton
