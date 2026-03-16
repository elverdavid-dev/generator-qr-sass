'use client'

import { Button } from '@heroui/react'
import { Download04Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useState } from 'react'
import { toast } from 'sonner'

interface Props {
	label: string
	errorLabel: string
	qrId?: string
}

export default function ExportCsvButton({ label, errorLabel, qrId }: Props) {
	const [isLoading, setIsLoading] = useState(false)

	const handleExport = async () => {
		setIsLoading(true)
		try {
			const url = qrId
				? `/api/analytics/export?qrId=${qrId}`
				: '/api/analytics/export'

			const res = await fetch(url)
			if (!res.ok) throw new Error()

			const blob = await res.blob()
			const a = document.createElement('a')
			a.href = URL.createObjectURL(blob)
			a.download = qrId ? `qr-analytics-${qrId}.csv` : 'analytics-export.csv'
			a.click()
			URL.revokeObjectURL(a.href)
		} catch {
			toast.error(errorLabel)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Button
			variant="flat"
			size="sm"
			startContent={<HugeiconsIcon icon={Download04Icon} size={16} />}
			onPress={handleExport}
			isLoading={isLoading}
		>
			{label}
		</Button>
	)
}
