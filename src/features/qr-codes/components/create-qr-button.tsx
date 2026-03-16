'use client'

import { Button } from '@heroui/button'
import { Add01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Link from 'next/link'

interface Props {
	label: string
}

const CreateQrButton = ({ label }: Props) => (
	<Button
		as={Link}
		href="/dashboard/qrs/new"
		color="primary"
		startContent={<HugeiconsIcon icon={Add01Icon} size={18} />}
	>
		{label}
	</Button>
)

export default CreateQrButton
