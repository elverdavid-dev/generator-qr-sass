'use client'

import { Menu01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useSidebarStore } from '@/shared/lib/zustand/sidebar-store'

const MobileMenuButton = () => {
	const { openMobile } = useSidebarStore()

	return (
		<button
			type="button"
			onClick={openMobile}
			className="flex md:hidden items-center justify-center p-2 rounded-lg text-default-500 hover:text-primary hover:bg-primary/5 transition-colors"
		>
			<HugeiconsIcon icon={Menu01Icon} size={22} />
		</button>
	)
}

export default MobileMenuButton
