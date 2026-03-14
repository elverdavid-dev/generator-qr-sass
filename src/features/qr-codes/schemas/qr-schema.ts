import { z } from 'zod'

export const qrSchema = z.object({
	name: z.string().min(1, 'El nombre es requerido'),
	qr_type: z.string().default('url'),
	data: z.string().min(1, 'El contenido es requerido'),
	bg_color: z.string().default('#ffffff'),
	fg_color: z.string().default('#000000'),
	dot_style: z.string().default('square'),
	corner_square_style: z.string().default('square'),
	corner_dot_style: z.string().default('square'),
	folder_id: z.string().nullable().optional(),
	logo: z.instanceof(File).optional(),
})

export type QrFormData = z.infer<typeof qrSchema>
