import { describe, it, expect, vi } from 'vitest'
import { hashApiKey, generateApiKey } from '@/shared/lib/api-key-auth'

// authenticateApiKey uses createAdminClient — mock it to avoid env var requirement
vi.mock('@/shared/lib/supabase/admin', () => ({
	createAdminClient: vi.fn(),
}))

describe('hashApiKey', () => {
	it('returns a 64-char hex string (SHA-256)', () => {
		const hash = hashApiKey('test-key')
		expect(hash).toHaveLength(64)
		expect(hash).toMatch(/^[a-f0-9]+$/)
	})

	it('is deterministic — same input gives same hash', () => {
		const key = 'qrg_abc123'
		expect(hashApiKey(key)).toBe(hashApiKey(key))
	})

	it('produces different hashes for different keys', () => {
		expect(hashApiKey('key-a')).not.toBe(hashApiKey('key-b'))
	})

	it('is sensitive to single character differences', () => {
		expect(hashApiKey('qrg_abc123')).not.toBe(hashApiKey('qrg_abc124'))
	})
})

describe('generateApiKey', () => {
	it('starts with the qrg_ prefix', () => {
		const key = generateApiKey()
		expect(key.startsWith('qrg_')).toBe(true)
	})

	it('has 36 characters total (qrg_ + 32 random)', () => {
		const key = generateApiKey()
		expect(key).toHaveLength(36)
	})

	it('only uses lowercase alphanumeric characters after prefix', () => {
		const key = generateApiKey()
		const suffix = key.slice(4) // remove 'qrg_'
		expect(suffix).toMatch(/^[a-z0-9]+$/)
	})

	it('generates unique keys each call', () => {
		const keys = new Set(Array.from({ length: 20 }, () => generateApiKey()))
		expect(keys.size).toBe(20)
	})
})
