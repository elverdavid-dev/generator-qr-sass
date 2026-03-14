'use client'

import { Input } from '@heroui/react'
import { Search01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'

const SearchInput = () => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const query = searchParams.get('q')?.toString()

	const handleSearch = useDebouncedCallback((value: string) => {
		const params = new URLSearchParams(searchParams)
		if (value) {
			params.set('q', value)
		} else {
			params.delete('q')
		}
		router.replace(`/dashboard/qrs?${params.toString()}`)
	}, 250)

	return (
		<Input
			placeholder="Buscar QR..."
			variant="bordered"
			autoComplete="off"
			isClearable
			className="w-72"
			startContent={
				<HugeiconsIcon icon={Search01Icon} size={18} className="text-default-400" />
			}
			onClear={() => router.replace('/dashboard/qrs')}
			onChange={(e) => handleSearch(e.target.value)}
			defaultValue={query}
		/>
	)
}

export default SearchInput
