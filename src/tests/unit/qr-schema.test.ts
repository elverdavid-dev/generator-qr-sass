import { describe, expect, it } from 'vitest'
import { qrSchema } from '@/features/qr-codes/schemas/qr-schema'

const BASE_VALID = {
	name: 'My QR',
	data: 'https://example.com',
}

describe('qrSchema — required fields', () => {
	it('accepts minimal valid input', () => {
		const result = qrSchema.safeParse(BASE_VALID)
		expect(result.success).toBe(true)
	})

	it('rejects missing name', () => {
		const result = qrSchema.safeParse({ data: 'https://example.com' })
		expect(result.success).toBe(false)
	})

	it('rejects empty name', () => {
		const result = qrSchema.safeParse({ ...BASE_VALID, name: '' })
		expect(result.success).toBe(false)
	})

	it('rejects missing data', () => {
		const result = qrSchema.safeParse({ name: 'QR' })
		expect(result.success).toBe(false)
	})

	it('rejects empty data', () => {
		const result = qrSchema.safeParse({ ...BASE_VALID, data: '' })
		expect(result.success).toBe(false)
	})
})

describe('qrSchema — default values', () => {
	it('defaults qr_type to url', () => {
		const result = qrSchema.safeParse(BASE_VALID)
		expect(result.success && result.data.qr_type).toBe('url')
	})

	it('defaults bg_color to #ffffff', () => {
		const result = qrSchema.safeParse(BASE_VALID)
		expect(result.success && result.data.bg_color).toBe('#ffffff')
	})

	it('defaults fg_color to #000000', () => {
		const result = qrSchema.safeParse(BASE_VALID)
		expect(result.success && result.data.fg_color).toBe('#000000')
	})

	it('defaults frame_style to none', () => {
		const result = qrSchema.safeParse(BASE_VALID)
		expect(result.success && result.data.frame_style).toBe('none')
	})

	it('defaults dot_gradient_type to linear', () => {
		const result = qrSchema.safeParse(BASE_VALID)
		expect(result.success && result.data.dot_gradient_type).toBe('linear')
	})
})

describe('qrSchema — frame_style enum', () => {
	it.each([
		'none',
		'simple',
		'rounded',
		'bold',
	])('accepts frame_style "%s"', (style) => {
		const result = qrSchema.safeParse({ ...BASE_VALID, frame_style: style })
		expect(result.success).toBe(true)
	})

	it('rejects invalid frame_style', () => {
		const result = qrSchema.safeParse({ ...BASE_VALID, frame_style: 'fancy' })
		expect(result.success).toBe(false)
	})
})

describe('qrSchema — custom_slug validation', () => {
	it('accepts valid custom_slug', () => {
		const result = qrSchema.safeParse({
			...BASE_VALID,
			custom_slug: 'my-slug-123',
		})
		expect(result.success).toBe(true)
	})

	it('rejects slug shorter than 3 characters', () => {
		const result = qrSchema.safeParse({ ...BASE_VALID, custom_slug: 'ab' })
		expect(result.success).toBe(false)
	})

	it('rejects slug longer than 50 characters', () => {
		const result = qrSchema.safeParse({
			...BASE_VALID,
			custom_slug: 'a'.repeat(51),
		})
		expect(result.success).toBe(false)
	})

	it('rejects slug with uppercase letters', () => {
		const result = qrSchema.safeParse({ ...BASE_VALID, custom_slug: 'MySlug' })
		expect(result.success).toBe(false)
	})

	it('rejects slug with spaces', () => {
		const result = qrSchema.safeParse({ ...BASE_VALID, custom_slug: 'my slug' })
		expect(result.success).toBe(false)
	})

	it('rejects slug with special characters', () => {
		const result = qrSchema.safeParse({
			...BASE_VALID,
			custom_slug: 'my@slug!',
		})
		expect(result.success).toBe(false)
	})

	it('converts empty string custom_slug to null', () => {
		const result = qrSchema.safeParse({ ...BASE_VALID, custom_slug: '' })
		expect(result.success).toBe(true)
		if (result.success) expect(result.data.custom_slug).toBeNull()
	})

	it('accepts null custom_slug', () => {
		const result = qrSchema.safeParse({ ...BASE_VALID, custom_slug: null })
		expect(result.success).toBe(true)
	})
})

describe('qrSchema — max_scans preprocessing', () => {
	it('converts numeric string to number', () => {
		const result = qrSchema.safeParse({ ...BASE_VALID, max_scans: '100' })
		expect(result.success).toBe(true)
		if (result.success) expect(result.data.max_scans).toBe(100)
	})

	it('converts empty string to null', () => {
		const result = qrSchema.safeParse({ ...BASE_VALID, max_scans: '' })
		expect(result.success).toBe(true)
		if (result.success) expect(result.data.max_scans).toBeNull()
	})

	it('converts null to null', () => {
		const result = qrSchema.safeParse({ ...BASE_VALID, max_scans: null })
		expect(result.success).toBe(true)
		if (result.success) expect(result.data.max_scans).toBeNull()
	})

	it('rejects negative max_scans', () => {
		const result = qrSchema.safeParse({ ...BASE_VALID, max_scans: -5 })
		expect(result.success).toBe(false)
	})

	it('rejects zero max_scans', () => {
		const result = qrSchema.safeParse({ ...BASE_VALID, max_scans: 0 })
		expect(result.success).toBe(false)
	})
})

describe('qrSchema — optional fields', () => {
	it('accepts password field', () => {
		const result = qrSchema.safeParse({ ...BASE_VALID, password: 'secret123' })
		expect(result.success).toBe(true)
	})

	it('accepts expires_at field', () => {
		const result = qrSchema.safeParse({
			...BASE_VALID,
			expires_at: '2025-12-31',
		})
		expect(result.success).toBe(true)
	})

	it('accepts ios_url and android_url', () => {
		const result = qrSchema.safeParse({
			...BASE_VALID,
			ios_url: 'https://apps.apple.com/app',
			android_url: 'https://play.google.com/app',
		})
		expect(result.success).toBe(true)
	})

	it('accepts all UTM parameters', () => {
		const result = qrSchema.safeParse({
			...BASE_VALID,
			utm_source: 'newsletter',
			utm_medium: 'email',
			utm_campaign: 'spring_sale',
			utm_term: 'qr',
			utm_content: 'button',
		})
		expect(result.success).toBe(true)
	})
})
