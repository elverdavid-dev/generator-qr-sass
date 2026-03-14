import { z } from 'zod'

export const folderSchema = z.object({
	name: z.string().min(1, 'El nombre es requerido'),
})

export type FolderFormData = z.infer<typeof folderSchema>
