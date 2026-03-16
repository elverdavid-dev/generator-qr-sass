'use client'
import { Button } from '@heroui/button'
import { Link } from '@heroui/link'
import { HugeiconsIcon } from '@hugeicons/react'
import { Analytics02Icon, ArrowLeft02Icon } from '@hugeicons/core-free-icons'

export function ViewAnalyticsButton({ slug }: { slug: string }) {
	return (
		<Button
			as={Link}
			href={`/dashboard/qrs/${slug}/analytics`}
			color="primary"
			variant="flat"
			startContent={<HugeiconsIcon icon={Analytics02Icon} size={16} />}
			className="shrink-0"
		>
			Ver analíticas
		</Button>
	)
}

export function BackToQrButton({ slug }: { slug: string }) {
	return (
		<Button
			as={Link}
			href={`/dashboard/qrs/${slug}`}
			variant="flat"
			startContent={<HugeiconsIcon icon={ArrowLeft02Icon} size={16} />}
			className="shrink-0"
		>
			Volver
		</Button>
	)
}
