'use client'

import { Button } from '@heroui/button'
import { Tooltip } from '@heroui/tooltip'
import {
	Crown02Icon,
	Delete02Icon,
	LayoutTable01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { deleteTemplate } from '@/features/qr-codes/services/mutations/template-actions'
import { usePlan } from '@/shared/context/plan-context'
import type { QrTemplate } from '@/shared/types/database.types'
import QrPreview from './qr-preview'

interface TemplateSelectorTranslations {
	title: string
	empty: string
	apply: string
	delete: string
	deleted: string
	upgradeRequired: string
}

interface Props {
	templates: QrTemplate[]
	onApply: (template: QrTemplate) => void
	translations: TemplateSelectorTranslations
}

export default function TemplateSelector({
	templates,
	onApply,
	translations,
}: Props) {
	const { hasFeature } = usePlan()
	const canUse = hasFeature('templates')
	const [isPending, startTransition] = useTransition()
	const [list, setList] = useState<QrTemplate[]>(templates)

	const handleDelete = (id: string) => {
		startTransition(async () => {
			const res = await deleteTemplate(id)
			if (res.error) {
				toast.error(res.error)
				return
			}
			setList((prev) => prev.filter((t) => t.id !== id))
			toast.success(translations.deleted)
		})
	}

	return (
		<div className="mb-6">
			<div className="flex items-center gap-2 mb-3">
				<HugeiconsIcon
					icon={LayoutTable01Icon}
					size={16}
					className="text-default-500"
				/>
				<span className="text-sm font-semibold text-default-700">
					{translations.title}
				</span>
				{!canUse && (
					<span className="flex items-center gap-1 text-xs text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full">
						<HugeiconsIcon icon={Crown02Icon} size={12} />
						Pro
					</span>
				)}
			</div>

			{!canUse ? (
				<div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-default-500">
					{translations.upgradeRequired}
				</div>
			) : list.length === 0 ? (
				<div className="rounded-xl border border-dashed border-divider px-4 py-3 text-sm text-default-400">
					{translations.empty}
				</div>
			) : (
				<div className="flex gap-3 flex-wrap">
					{list.map((t) => (
						<div key={t.id} className="relative group">
							<Tooltip content={t.name}>
								<button
									type="button"
									onClick={() => onApply(t)}
									className="block rounded-xl border-2 border-divider hover:border-primary transition-colors overflow-hidden focus:outline-none focus:border-primary"
								>
									<QrPreview
										value="https://example.com"
										size={56}
										fgColor={t.fg_color}
										bgColor={t.bg_color}
										dotStyle={t.dot_style}
									/>
								</button>
							</Tooltip>
							<button
								type="button"
								onClick={() => handleDelete(t.id)}
								disabled={isPending}
								className="absolute -top-1.5 -right-1.5 hidden group-hover:flex items-center justify-center w-5 h-5 rounded-full bg-danger text-white shadow"
								aria-label={translations.delete}
							>
								<HugeiconsIcon icon={Delete02Icon} size={10} />
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	)
}
