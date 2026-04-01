import { z } from 'zod'

export interface QrValidationMessages {
	nameRequired: string
	contentRequired: string
	slugPattern: string
	slugMin: string
	slugMax: string
	frameScanMe: string
}

/**
 * Factory that builds the QR form schema with localised error messages.
 * Pass the translated strings from the server page down to the form component.
 */
export const createQrSchema = (m: QrValidationMessages) =>
	z.object({
		name: z.string().min(1, m.nameRequired),
		qr_type: z.string().default('url'),
		data: z.string().min(1, m.contentRequired),
		bg_color: z.string().default('#ffffff'),
		fg_color: z.string().default('#000000'),
		dot_style: z.string().default('square'),
		corner_square_style: z.string().default('square'),
		corner_dot_style: z.string().default('square'),
		// Gradient
		dot_color_2: z.string().optional().nullable(),
		dot_gradient_type: z.enum(['linear', 'radial']).default('linear'),
		// Frame
		frame_style: z
			.enum(['none', 'simple', 'rounded', 'bold', 'corners'])
			.default('none'),
		frame_color: z.string().default('#000000'),
		frame_text: z.string().default(m.frameScanMe),
		// Logo & folder
		folder_id: z.string().nullable().optional(),
		logo: z.instanceof(File).optional(),
		// Protection & limits
		password: z.string().optional().nullable(),
		expires_at: z.string().optional().nullable(),
		max_scans: z.preprocess(
			(val) =>
				val === '' || val === null || val === undefined ? null : Number(val),
			z.number().int().positive().nullable().optional(),
		),
		// Device targeting
		ios_url: z.string().optional().nullable(),
		android_url: z.string().optional().nullable(),
		// UTM parameters (Pro+)
		utm_source: z.string().optional().nullable(),
		utm_medium: z.string().optional().nullable(),
		utm_campaign: z.string().optional().nullable(),
		utm_term: z.string().optional().nullable(),
		utm_content: z.string().optional().nullable(),
		// Smart redirect rules (Pro+)
		schedule_rules: z
			.array(
				z.object({
					days: z.array(z.number().int().min(0).max(6)),
					from: z.string().regex(/^\d{2}:\d{2}$/),
					to: z.string().regex(/^\d{2}:\d{2}$/),
					url: z.string().url(),
				}),
			)
			.nullable()
			.optional(),
		country_rules: z
			.array(
				z.object({
					countries: z.array(z.string().length(2)),
					url: z.string().url(),
				}),
			)
			.nullable()
			.optional(),
		// Custom slug (Pro+)
		custom_slug: z.preprocess(
			(val) => (val === '' || val === undefined ? null : val),
			z
				.string()
				.regex(/^[a-z0-9-]+$/, m.slugPattern)
				.min(3, m.slugMin)
				.max(50, m.slugMax)
				.nullable()
				.optional(),
		),
	})

/** Fallback schema with English messages used where no locale context is available. */
export const qrSchema = createQrSchema({
	nameRequired: 'Name is required',
	contentRequired: 'Content is required',
	slugPattern: 'Lowercase letters, numbers and hyphens only',
	slugMin: 'Minimum 3 characters',
	slugMax: 'Maximum 50 characters',
	frameScanMe: 'SCAN ME',
})

export type QrFormData = z.infer<typeof qrSchema>
