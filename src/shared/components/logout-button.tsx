'use client'

import { Button } from '@heroui/react'
import { Logout02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useTransition } from 'react'
import { logoutService } from '@/features/auth/services/logout'

const LogoutButton = () => {
	const [isPending, startTransition] = useTransition()

	return (
		<Button
			variant="flat"
			color="danger"
			size="sm"
			isLoading={isPending}
			startContent={
				!isPending && <HugeiconsIcon icon={Logout02Icon} size={16} />
			}
			onPress={() => startTransition(() => logoutService())}
		>
			Salir
		</Button>
	)
}

export default LogoutButton
