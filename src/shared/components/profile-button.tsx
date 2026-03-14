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
import { Logout02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useTransition, type FC } from 'react'
import { logoutService } from '@/features/auth/services/logout'

interface Props {
	avatar_url: string
	full_name: string
}

const ProfileButton: FC<Props> = ({ avatar_url, full_name }) => {
	const [isPending, startTransition] = useTransition()

	const handleLogout = () => {
		startTransition(() => logoutService())
	}

	return (
		<Dropdown>
			<DropdownTrigger>
				<Avatar size="sm" as={'button'} src={avatar_url} />
			</DropdownTrigger>
			<DropdownMenu aria-label="Profile Actions" variant="flat">
				<DropdownItem
					key="profile"
					className="h-14 gap-2 cursor-default"
					isReadOnly
				>
					<User
						avatarProps={{ src: avatar_url }}
						name={full_name}
						description="Mi Cuenta"
					/>
				</DropdownItem>

				<DropdownSection showDivider>
					<DropdownItem key="dashboard" href="/dashboard/qrs">
						Dashboard
					</DropdownItem>
				</DropdownSection>
				<DropdownItem
					key="logout"
					color="danger"
					className="text-danger"
					startContent={<HugeiconsIcon icon={Logout02Icon} size={20} />}
					onPress={handleLogout}
					isDisabled={isPending}
				>
					{isPending ? 'Cerrando...' : 'Salir'}
				</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	)
}

export default ProfileButton
