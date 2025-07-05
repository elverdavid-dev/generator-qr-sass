'use client'

//import { logout } from '@/auth/services/logout'
import {
	Avatar,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownSection,
	DropdownTrigger,
	User,
} from '@heroui/react'
import { Logout02Icon } from 'hugeicons-react'
import type { FC } from 'react'

interface Props {
	avatar_url: string
	full_name: string
}
const ProfileButton: FC<Props> = ({ avatar_url, full_name }) => {
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
					//onPress={() => logout()}
					className="text-danger"
					startContent={<Logout02Icon size={20} />}
				>
					Salir
				</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	)
}

export default ProfileButton
