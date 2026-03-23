'use client'
import { Button } from '@heroui/button'
import { Link } from '@heroui/link'
import { Analytics02Icon, ArrowLeft02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

export function ViewAnalyticsButton({
	slug,
	label,
}: {
	slug: string
	label: string
}) {
	return (
		<Button
			as={Link}
			href={`/dashboard/qrs/${slug}/analytics`}
			color="primary"
			variant="flat"
			startContent={<HugeiconsIcon icon={Analytics02Icon} size={16} />}
			className="shrink-0"
		>
			{label}
		</Button>
	)
}

export function BackToQrButton({
	slug,
	label,
}: {
	slug: string
	label: string
}) {
	return (
		<Button
			as={Link}
			href={`/dashboard/qrs/${slug}`}
			variant="flat"
			startContent={<HugeiconsIcon icon={ArrowLeft02Icon} size={16} />}
			className="shrink-0"
		>
			{label}
		</Button>
	)
}
