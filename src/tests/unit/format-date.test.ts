import { describe, it, expect } from 'vitest'
import { formatDate } from '@/shared/utils/format-date'

describe('formatDate', () => {
	it('formats a valid ISO date string in Spanish locale', () => {
		// Use a datetime with explicit noon UTC to avoid midnight timezone shift
		const result = formatDate('2024-01-15T12:00:00Z')
		expect(result).toContain('2024')
		expect(result).toContain('15')
	})

	it('includes the year', () => {
		const result = formatDate('2023-12-31')
		expect(result).toContain('2023')
	})

	it('includes the day number', () => {
		const result = formatDate('2024-06-01')
		expect(result).toContain('1')
	})

	it('formats different months correctly', () => {
		const jan = formatDate('2024-01-01')
		const jun = formatDate('2024-06-01')
		const dec = formatDate('2024-12-01')
		// All should produce different strings for different months
		expect(jan).not.toBe(jun)
		expect(jun).not.toBe(dec)
	})

	it('returns a non-empty string', () => {
		const result = formatDate('2024-03-20')
		expect(result.length).toBeGreaterThan(0)
	})

	it('handles ISO datetime strings with time component', () => {
		const result = formatDate('2024-09-05T14:30:00Z')
		expect(result).toContain('2024')
	})
})
