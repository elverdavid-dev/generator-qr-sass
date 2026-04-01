import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createChain, createSupabaseMock } from '../__mocks__/supabase'

vi.mock('@/shared/lib/supabase/server', () => ({ createClient: vi.fn() }))
vi.mock('@/shared/lib/supabase/get-session', () => ({ getSession: vi.fn() }))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

import { revalidatePath } from 'next/cache'
import {
	createWebhook,
	deleteWebhook,
	toggleWebhook,
} from '@/features/webhooks/services/mutations/webhook-actions'
import { getWebhooks } from '@/features/webhooks/services/queries/get-webhooks'
import { getSession } from '@/shared/lib/supabase/get-session'
import { createClient } from '@/shared/lib/supabase/server'

const SESSION_DATA = { user: { id: 'user-123', email: 'test@example.com' } }

// ─── createWebhook ─────────────────────────────────────────────────────────────

describe('createWebhook', () => {
	let mock: ReturnType<typeof createSupabaseMock>

	beforeEach(() => {
		vi.clearAllMocks()
		mock = createSupabaseMock()
		vi.mocked(createClient).mockResolvedValue(mock.client as never)
	})

	it('returns error when unauthenticated', async () => {
		vi.mocked(getSession).mockResolvedValue({ error: 'No session' } as never)
		const result = await createWebhook({
			name: 'My Hook',
			url: 'https://example.com/hook',
		})
		expect(result).toEqual({ error: 'No autenticado' })
	})

	it('returns error when plan is not Business', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		mock.fromMock.mockReturnValueOnce(createChain({ plan: 'pro' })) // profile with pro plan
		const result = await createWebhook({
			name: 'My Hook',
			url: 'https://example.com/hook',
		})
		expect(result?.error).toContain('Business')
	})

	it('returns error when plan is free', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		mock.fromMock.mockReturnValueOnce(createChain({ plan: 'free' }))
		const result = await createWebhook({
			name: 'My Hook',
			url: 'https://example.com/hook',
		})
		expect(result?.error).toContain('Business')
	})

	it('creates webhook successfully for Business plan', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		mock.fromMock
			.mockReturnValueOnce(createChain({ plan: 'business' })) // profile
			.mockReturnValueOnce(createChain(null, null)) // insert
		const result = await createWebhook({
			name: 'My Hook',
			url: 'https://example.com/hook',
			secret: 'my-secret',
		})
		expect(result).toEqual({ success: true })
		expect(revalidatePath).toHaveBeenCalledWith('/dashboard/webhooks')
	})

	it('returns error on DB insert failure', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		mock.fromMock
			.mockReturnValueOnce(createChain({ plan: 'business' }))
			.mockReturnValueOnce(createChain(null, { message: 'Insert failed' }))
		const result = await createWebhook({
			name: 'Hook',
			url: 'https://example.com',
		})
		expect(result).toEqual({ error: 'Insert failed' })
	})
})

// ─── deleteWebhook ─────────────────────────────────────────────────────────────

describe('deleteWebhook', () => {
	let mock: ReturnType<typeof createSupabaseMock>

	beforeEach(() => {
		vi.clearAllMocks()
		mock = createSupabaseMock()
		vi.mocked(createClient).mockResolvedValue(mock.client as never)
	})

	it('returns error when unauthenticated', async () => {
		vi.mocked(getSession).mockResolvedValue({ error: 'No session' } as never)
		const result = await deleteWebhook('hook-1')
		expect(result).toEqual({ error: 'No autenticado' })
	})

	it('deletes webhook successfully', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		mock.fromMock.mockReturnValueOnce(createChain(null, null))
		const result = await deleteWebhook('hook-1')
		expect(result).toEqual({ success: true })
		expect(revalidatePath).toHaveBeenCalledWith('/dashboard/webhooks')
	})

	it('returns error on DB failure', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		mock.fromMock.mockReturnValueOnce(
			createChain(null, { message: 'Delete failed' }),
		)
		const result = await deleteWebhook('hook-1')
		expect(result).toEqual({ error: 'Delete failed' })
	})
})

// ─── toggleWebhook ─────────────────────────────────────────────────────────────

describe('toggleWebhook', () => {
	let mock: ReturnType<typeof createSupabaseMock>

	beforeEach(() => {
		vi.clearAllMocks()
		mock = createSupabaseMock()
		vi.mocked(createClient).mockResolvedValue(mock.client as never)
	})

	it('returns error when unauthenticated', async () => {
		vi.mocked(getSession).mockResolvedValue({ error: 'No session' } as never)
		const result = await toggleWebhook('hook-1', true)
		expect(result).toEqual({ error: 'No autenticado' })
	})

	it('activates webhook', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		mock.fromMock.mockReturnValueOnce(createChain(null, null))
		const result = await toggleWebhook('hook-1', true)
		expect(result).toEqual({ success: true })
	})

	it('deactivates webhook', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		mock.fromMock.mockReturnValueOnce(createChain(null, null))
		const result = await toggleWebhook('hook-1', false)
		expect(result).toEqual({ success: true })
	})

	it('returns error on failure', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		mock.fromMock.mockReturnValueOnce(
			createChain(null, { message: 'Update failed' }),
		)
		const result = await toggleWebhook('hook-1', true)
		expect(result).toEqual({ error: 'Update failed' })
	})
})

// ─── getWebhooks ──────────────────────────────────────────────────────────────

describe('getWebhooks', () => {
	let mock: ReturnType<typeof createSupabaseMock>

	beforeEach(() => {
		vi.clearAllMocks()
		mock = createSupabaseMock()
		vi.mocked(createClient).mockResolvedValue(mock.client as never)
	})

	it('returns error when unauthenticated', async () => {
		vi.mocked(getSession).mockResolvedValue({ error: 'No session' } as never)
		const result = await getWebhooks()
		expect(result).toEqual({ data: null, error: 'No autenticado' })
	})

	it('returns webhooks list', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		const hooks = [
			{ id: 'h-1', url: 'https://example.com/1', is_active: true },
			{ id: 'h-2', url: 'https://example.com/2', is_active: false },
		]
		mock.fromMock.mockReturnValueOnce(createChain(hooks))
		const result = await getWebhooks()
		expect(result).toEqual({ data: hooks, error: null })
	})

	it('returns error on DB failure', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		mock.fromMock.mockReturnValueOnce(
			createChain(null, { message: 'Fetch failed' }),
		)
		const result = await getWebhooks()
		expect(result).toEqual({ data: null, error: 'Fetch failed' })
	})
})
