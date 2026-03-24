'use client'

import { Button, useDisclosure } from '@heroui/react'
import {
	Add01Icon,
	Calendar03Icon,
	Folder01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import dynamic from 'next/dynamic'
import type { FC } from 'react'
import type { Folder } from '@/shared/types/database.types'
import { formatDate } from '@/shared/utils/format-date'
import FolderActions from './folder-actions'

const CreateFolderModal = dynamic(() => import('./create-folder-modal'))

interface FoldersSectionTranslations {
	title: string
	newFolder: string
	editFolder: string
	noFolders: string
	name: string
	namePlaceholder: string
	nameRequired: string
	cancel: string
	save: string
	create: string
	created: string
	updated: string
	actions: string
	viewContents: string
	editName: string
	delete: string
	deleteTitle: string
	deleteMessage: string
	deleted: string
}

interface Props {
	folders: Folder[]
	translations: FoldersSectionTranslations
}

const FoldersSection: FC<Props> = ({ folders, translations }) => {
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()

	const modalTranslations = {
		editFolder: translations.editFolder,
		newFolder: translations.newFolder,
		name: translations.name,
		namePlaceholder: translations.namePlaceholder,
		nameRequired: translations.nameRequired,
		cancel: translations.cancel,
		save: translations.save,
		create: translations.create,
		created: translations.created,
		updated: translations.updated,
	}

	return (
		<section className="mt-6">
			<div className="flex items-center justify-between mb-3">
				<div className="flex items-center gap-2">
					<h2 className="font-semibold text-default-700">
						{translations.title}
					</h2>
					<span className="text-xs text-default-400 bg-default-100 px-2 py-0.5 rounded-full">
						{folders.length}
					</span>
				</div>
				<Button
					size="sm"
					variant="flat"
					startContent={<HugeiconsIcon icon={Add01Icon} size={16} />}
					onPress={onOpen}
				>
					{translations.newFolder}
				</Button>
			</div>

			{folders.length === 0 ? (
				<p className="text-sm text-default-400 py-4">
					{translations.noFolders}
				</p>
			) : (
				<div className="flex items-start gap-3 overflow-x-auto pb-2 scrollbar-hide">
					{folders.map((folder) => (
						<div
							key={folder.id}
							className="flex flex-col gap-2 bg-content1 border border-divider rounded-2xl p-4 w-56 flex-shrink-0 shadow-sm"
						>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<span className="bg-primary/10 rounded-xl p-2">
										<HugeiconsIcon
											icon={Folder01Icon}
											size={18}
											className="text-primary"
										/>
									</span>
									<span className="text-sm font-medium text-default-500">
										{folder.qr_count ?? 0} QRs
									</span>
								</div>
								<FolderActions folder={folder} translations={translations} />
							</div>
							<p className="font-semibold capitalize truncate mt-1">
								{folder.name}
							</p>
							<span className="text-xs text-default-400 flex items-center gap-1">
								<HugeiconsIcon icon={Calendar03Icon} size={12} />
								{formatDate(folder.created_at)}
							</span>
						</div>
					))}
				</div>
			)}

			<CreateFolderModal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				onClose={onClose}
				translations={modalTranslations}
			/>
		</section>
	)
}

export default FoldersSection
