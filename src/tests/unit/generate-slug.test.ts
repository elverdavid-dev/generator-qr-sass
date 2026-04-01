import { describe, expect, it } from 'vitest'
import { generateSlug } from '@/shared/utils/generate-slug'

describe('generateSlug', () => {
	it('returns a lowercase kebab-case string', () => {
		const slug = generateSlug('My QR Code')
		expect(slug).toMatch(/^[a-z0-9-]+$/)
	})

	it('includes a normalized version of the name', () => {
		const slug = generateSlug('landing page')
		expect(slug).toContain('landing-page')
	})

	it('strips special characters from the name', () => {
		const slug = generateSlug('Hello! @World#')
		expect(slug).toMatch(/^[a-z0-9-]+$/)
	})

	it('produces different slugs on repeated calls (unique prefix)', () => {
		const slug1 = generateSlug('same-name')
		const slug2 = generateSlug('same-name')
		// Each call uses nanoid(6) so collision is astronomically unlikely
		expect(slug1).not.toBe(slug2)
	})

	it('handles names with numbers', () => {
		const slug = generateSlug('Campaign 2024')
		expect(slug).toMatch(/^[a-z0-9-]+$/)
		expect(slug).toContain('2024')
	})

	it('handles single-word names', () => {
		const slug = generateSlug('promo')
		expect(slug).toContain('promo')
		expect(slug).toMatch(/^[a-z0-9-]+$/)
	})

	it('trims whitespace from name', () => {
		const slug = generateSlug('  trimmed  ')
		expect(slug).toMatch(/^[a-z0-9-]+$/)
		expect(slug).not.toMatch(/^\s|\s$/)
	})

	it('converts uppercase to lowercase', () => {
		const slug = generateSlug('UPPERCASE')
		expect(slug).toMatch(/^[a-z0-9-]+$/)
		expect(slug).not.toMatch(/[A-Z]/)
	})
})
