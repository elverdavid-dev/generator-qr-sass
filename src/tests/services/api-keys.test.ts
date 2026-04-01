import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createChain, createSupabaseMock } from '../__mocks__/supabase'

vi.mock('@/shared/lib/supabase/admin', () => ({ createAdminClient: vi.fn() }))
vi.mock('@/shared/lib/supabase/get-session', () => ({ getSession: vi.fn() }))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

import { revalidatePath } from 'next/cache'
import {
	createApiKey,
	getApiKeys,
	revokeApiKey,
} from '@/features/api-keys/services/api-key-actions'
import { createAdminClient } from '@/shared/lib/supabase/admin'
import { getSession } from '@/shared/lib/supabase/get-session'

const SESSION_DATA = { user: { id: 'user-123', email: 'test@example.com' } }

// ─── createApiKey ─────────────────────────────────────────────────────────────

describe('createApiKey', () => {
	let mock: ReturnType<typeof createSupabaseMock>

	beforeEach(() => {
		vi.clearAllMocks()
		mock = createSupabaseMock()
		vi.mocked(createAdminClient).mockReturnValue(mock.client as never)
	})

	it('returns error when unauthenticated', async () => {
		vi.mocked(getSession).mockResolvedValue({ error: 'No session' } as never)
		const result = await createApiKey('My Key')
		expect(result).toEqual({ error: 'No autenticado' })
	})

	it('returns error when plan is not Business', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		mock.fromMock.mockReturnValueOnce(createChain({ plan: 'pro' }))
		const result = await createApiKey('My Key')
		expect(result?.error).toContain('Business')
	})

	it('returns error when plan is free', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		mock.fromMock.mockReturnValueOnce(createChain({ plan: 'free' }))
		const result = await createApiKey('My Key')
		expect(result?.error).toContain('Business')
	})

	it('creates API key and returns raw key once', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		mock.fromMock
			.mockReturnValueOnce(createChain({ plan: 'business' })) // profile
			.mockReturnValueOnce(createChain({ id: 'key-1' })) // insert
		const result = await createApiKey('My Key')
		expect(result).toHaveProperty('key')
		expect(result).toHaveProperty('id', 'key-1')
		// Key must start with qrg_
		expect((result as { key: string }).key).toMatch(/^qrg_/)
		expect(revalidatePath).toHaveBeenCalledWith('/dashboard/api')
	})

	it('returns error on DB insert failure', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		mock.fromMock
			.mockReturnValueOnce(createChain({ plan: 'business' }))
			.mockReturnValueOnce(createChain(null, { message: 'Insert failed' }))
		const result = await createApiKey('My Key')
		expect(result).toHaveProperty('error')
	})
})

// ─── revokeApiKey ─────────────────────────────────────────────────────────────

describe('revokeApiKey', () => {
	let mock: ReturnType<typeof createSupabaseMock>

	beforeEach(() => {
		vi.clearAllMocks()
		mock = createSupabaseMock()
		vi.mocked(createAdminClient).mockReturnValue(mock.client as never)
	})

	it('returns error when unauthenticated', async () => {
		vi.mocked(getSession).mockResolvedValue({ error: 'No session' } as never)
		const result = await revokeApiKey('key-1')
		expect(result).toEqual({ error: 'No autenticado' })
	})

	it('revokes API key successfully', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		mock.fromMock.mockReturnValueOnce(createChain(null, null))
		const result = await revokeApiKey('key-1')
		expect(result).toEqual({ success: true })
		expect(revalidatePath).toHaveBeenCalledWith('/dashboard/api')
	})

	it('returns error on DB failure', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		mock.fromMock.mockReturnValueOnce(
			createChain(null, { message: 'Delete failed' }),
		)
		const result = await revokeApiKey('key-1')
		expect(result).toEqual({ error: 'Delete failed' })
	})
})

// ─── getApiKeys ───────────────────────────────────────────────────────────────

describe('getApiKeys', () => {
	let mock: ReturnType<typeof createSupabaseMock>

	beforeEach(() => {
		vi.clearAllMocks()
		mock = createSupabaseMock()
		vi.mocked(createAdminClient).mockReturnValue(mock.client as never)
	})

	it('returns error when unauthenticated', async () => {
		vi.mocked(getSession).mockResolvedValue({ error: 'No session' } as never)
		const result = await getApiKeys()
		expect(result).toEqual({ error: 'No autenticado' })
	})

	it('returns list of API keys', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		const keys = [
			{ id: 'k-1', name: 'Key 1', key_prefix: 'qrg_abcdef', is_active: true },
			{ id: 'k-2', name: 'Key 2', key_prefix: 'qrg_ghijkl', is_active: false },
		]
		mock.fromMock.mockReturnValueOnce(createChain(keys))
		const result = await getApiKeys()
		expect(result).toEqual({ data: keys })
	})

	it('returns error on DB failure', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		mock.fromMock.mockReturnValueOnce(
			createChain(null, { message: 'Fetch failed' }),
		)
		const result = await getApiKeys()
		expect(result).toEqual({ error: 'Fetch failed' })
	})
})
