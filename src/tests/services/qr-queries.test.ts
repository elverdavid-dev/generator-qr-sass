import { vi, describe, it, expect, beforeEach } from 'vitest'
import { createChain, createSupabaseMock } from '../__mocks__/supabase'

vi.mock('@/shared/lib/supabase/server', () => ({ createClient: vi.fn() }))
vi.mock('@/shared/lib/supabase/get-session', () => ({ getSession: vi.fn() }))

import { createClient } from '@/shared/lib/supabase/server'
import { getSession } from '@/shared/lib/supabase/get-session'
import { getQrs } from '@/features/qr-codes/services/queries/get-qrs'
import { getQrById } from '@/features/qr-codes/services/queries/get-qr-by-id'

const SESSION_DATA = { user: { id: 'user-123', email: 'test@example.com' } }

// ─── getQrs ───────────────────────────────────────────────────────────────────

describe('getQrs', () => {
	let mock: ReturnType<typeof createSupabaseMock>

	beforeEach(() => {
		vi.clearAllMocks()
		mock = createSupabaseMock()
		vi.mocked(createClient).mockResolvedValue(mock.client as never)
	})

	it('returns error when unauthenticated', async () => {
		vi.mocked(getSession).mockResolvedValue({ error: 'No session' } as never)
		const result = await getQrs()
		expect(result).toEqual({ error: 'No autenticado' })
	})

	it('returns paginated QR list with count', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		const fakeQrs = [
			{ id: 'qr-1', name: 'QR 1', slug: 'abc-qr-1' },
			{ id: 'qr-2', name: 'QR 2', slug: 'def-qr-2' },
		]
		mock.fromMock.mockReturnValueOnce(createChain(fakeQrs, null, 2))

		const result = await getQrs(1)
		expect(result).toEqual({ data: fakeQrs, count: 2 })
	})

	it('returns error on DB failure', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		mock.fromMock.mockReturnValueOnce(createChain(null, { message: 'DB error' }))

		const result = await getQrs()
		expect(result).toEqual({ error: 'DB error' })
	})

	it('returns count 0 when count is null', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		mock.fromMock.mockReturnValueOnce(createChain([], null, null))

		const result = await getQrs()
		expect(result).toEqual({ data: [], count: 0 })
	})

	it('defaults to page 1 when not specified', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		mock.fromMock.mockReturnValueOnce(createChain([], null, 0))
		await getQrs()
		// Verify range was called (page 1 = from 0)
		const chain = mock.fromMock.mock.results[0].value
		expect(chain.range).toHaveBeenCalledWith(0, expect.any(Number))
	})
})

// ─── getQrById ────────────────────────────────────────────────────────────────

describe('getQrById', () => {
	let mock: ReturnType<typeof createSupabaseMock>

	beforeEach(() => {
		vi.clearAllMocks()
		mock = createSupabaseMock()
		vi.mocked(createClient).mockResolvedValue(mock.client as never)
	})

	it('returns QR data by ID', async () => {
		const fakeQr = { id: 'qr-123', name: 'Test QR', slug: 'test-slug' }
		mock.fromMock.mockReturnValueOnce(createChain(fakeQr))

		const result = await getQrById('qr-123')
		expect(result).toEqual({ data: fakeQr })
	})

	it('returns error when QR not found', async () => {
		mock.fromMock.mockReturnValueOnce(createChain(null, { message: 'Row not found' }))

		const result = await getQrById('nonexistent-id')
		expect(result).toEqual({ error: 'Row not found' })
	})
})
