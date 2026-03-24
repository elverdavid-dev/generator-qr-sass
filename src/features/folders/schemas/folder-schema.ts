import { z } from 'zod'

export interface FolderValidationMessages {
	nameRequired: string
}

export const createFolderSchema = (m: FolderValidationMessages) =>
	z.object({
		name: z.string().min(1, m.nameRequired),
	})

/** Fallback schema with English messages. */
export const folderSchema = createFolderSchema({
	nameRequired: 'Name is required',
})

export type FolderFormData = z.infer<typeof folderSchema>
