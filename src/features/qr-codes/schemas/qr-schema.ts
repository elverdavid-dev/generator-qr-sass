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
	// Gradient
	dot_color_2: z.string().optional().nullable(),
	dot_gradient_type: z.enum(['linear', 'radial']).default('linear'),
	// Frame
	frame_style: z.enum(['none', 'simple', 'rounded', 'bold']).default('none'),
	frame_color: z.string().default('#000000'),
	frame_text: z.string().default('ESCANÉAME'),
	// Logo & folder
	folder_id: z.string().nullable().optional(),
	logo: z.instanceof(File).optional(),
	// Protection & limits
	password: z.string().optional().nullable(),
	expires_at: z.string().optional().nullable(),
	max_scans: z.preprocess(
		(val) => (val === '' || val === null || val === undefined ? null : Number(val)),
		z.number().int().positive().nullable().optional(),
	),
	// Device targeting
	ios_url: z.string().optional().nullable(),
	android_url: z.string().optional().nullable(),
})

export type QrFormData = z.infer<typeof qrSchema>
