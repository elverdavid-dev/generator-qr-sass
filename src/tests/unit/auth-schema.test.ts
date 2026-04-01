import { describe, expect, it } from 'vitest'
import { authFormDataSchema } from '@/features/auth/schema/auth-form-data'

describe('authFormDataSchema', () => {
	it('accepts valid email and password', () => {
		const result = authFormDataSchema.safeParse({
			email: 'user@example.com',
			password: 'secret123',
		})
		expect(result.success).toBe(true)
	})

	it('rejects invalid email format', () => {
		const result = authFormDataSchema.safeParse({
			email: 'not-an-email',
			password: 'secret123',
		})
		expect(result.success).toBe(false)
		if (!result.success) {
			const flat = result.error.flatten()
			expect(flat.fieldErrors.email?.[0]).toContain('válido')
		}
	})

	it('rejects password shorter than 6 characters', () => {
		const result = authFormDataSchema.safeParse({
			email: 'user@example.com',
			password: '123',
		})
		expect(result.success).toBe(false)
		if (!result.success) {
			const flat = result.error.flatten()
			expect(flat.fieldErrors.password?.[0]).toContain('6')
		}
	})

	it('accepts password with exactly 6 characters', () => {
		const result = authFormDataSchema.safeParse({
			email: 'user@example.com',
			password: 'abc123',
		})
		expect(result.success).toBe(true)
	})

	it('rejects missing email', () => {
		const result = authFormDataSchema.safeParse({
			password: 'secret123',
		})
		expect(result.success).toBe(false)
	})

	it('rejects missing password', () => {
		const result = authFormDataSchema.safeParse({
			email: 'user@example.com',
		})
		expect(result.success).toBe(false)
	})

	it('rejects empty strings', () => {
		const result = authFormDataSchema.safeParse({
			email: '',
			password: '',
		})
		expect(result.success).toBe(false)
	})
})
