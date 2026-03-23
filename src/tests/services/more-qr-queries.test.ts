import { vi, describe, it, expect, beforeEach } from 'vitest'
import { createChain, createSupabaseMock } from '../__mocks__/supabase'

vi.mock('@/shared/lib/supabase/server', () => ({ createClient: vi.fn() }))
vi.mock('@/shared/lib/supabase/get-session', () => ({ getSession: vi.fn() }))
vi.mock('@/shared/lib/supabase/admin', () => ({ createAdminClient: vi.fn() }))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

import { createClient } from '@/shared/lib/supabase/server'
import { createAdminClient } from '@/shared/lib/supabase/admin'
import { getSession } from '@/shared/lib/supabase/get-session'
import { searchQrs } from '@/features/qr-codes/services/queries/search-qrs'
import { getTemplates } from '@/features/qr-codes/services/queries/get-templates'
import { getQrBySlug } from '@/features/qr-codes/services/queries/get-qr-by-slug'
import { getFavoriteQrs } from '@/features/qr-codes/services/queries/get-favorite-qrs'
import { getQrsByFolder } from '@/features/qr-codes/services/queries/get-qrs-by-folder'
import { getDashboardStats } from '@/features/analytics/services/queries/get-dashboard-stats'
import { saveScan } from '@/features/tracking/services/save-scan'
import { updateQr } from '@/features/qr-codes/services/mutations/update-qr'
import { completeOnboarding } from '@/features/onboarding/actions/complete-onboarding'

const SESSION_DATA = { user: { id: 'user-123', email: 'test@example.com' } }

// ─── searchQrs ────────────────────────────────────────────────────────────────

describe('searchQrs', () => {
	let mock: ReturnType<typeof createSupabaseMock>

	beforeEach(() => {
		vi.clearAllMocks()
		mock = createSupabaseMock()
		vi.mocked(createClient).mockResolvedValue(mock.client as never)
	})

	it('returns error when unauthenticated', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: null } as never)
		const result = await searchQrs('test')
		expect(result).toEqual({ error: 'No autenticado' })
	})

	it('returns matching QRs with count', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		const fakeQrs = [{ id: 'qr-1', name: 'My Test QR' }]
		mock.fromMock.mockReturnValueOnce(createChain(fakeQrs, null, 1))

		const result = await searchQrs('test')
		expect(result).toEqual({ data: fakeQrs, count: 1 })
	})

	it('returns error on DB failure', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		mock.fromMock.mockReturnValueOnce(createChain(null, { message: 'Search error' }))

		const result = await searchQrs('test')
		expect(result).toEqual({ error: 'Search error' })
	})

	it('returns count 0 when count is null', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		mock.fromMock.mockReturnValueOnce(createChain([], null, null))

		const result = await searchQrs('test')
		expect(result).toEqual({ data: [], count: 0 })
	})
})

// ─── getTemplates ─────────────────────────────────────────────────────────────

describe('getTemplates', () => {
	let mock: ReturnType<typeof createSupabaseMock>

	beforeEach(() => {
		vi.clearAllMocks()
		mock = createSupabaseMock()
		vi.mocked(createClient).mockResolvedValue(mock.client as never)
	})

	it('returns empty array when unauthenticated', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: null } as never)
		const result = await getTemplates()
		expect(result).toEqual({ data: [], error: 'No autenticado' })
	})

	it('returns templates when authenticated', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		const templates = [{ id: 'tmpl-1', name: 'Basic URL' }]
		mock.fromMock.mockReturnValueOnce(createChain(templates))

		const result = await getTemplates()
		expect(result).toEqual({ data: templates, error: null })
	})

	it('returns empty array and null error on no data', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		mock.fromMock.mockReturnValueOnce(createChain(null))

		const result = await getTemplates()
		expect(result).toEqual({ data: [], error: null })
	})

	it('returns error message on DB failure', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		mock.fromMock.mockReturnValueOnce(createChain(null, { message: 'DB error' }))

		const result = await getTemplates()
		expect(result.error).toBe('DB error')
	})
})

// ─── getQrBySlug ──────────────────────────────────────────────────────────────

describe('getQrBySlug', () => {
	let mock: ReturnType<typeof createSupabaseMock>

	beforeEach(() => {
		vi.clearAllMocks()
		mock = createSupabaseMock()
		vi.mocked(createClient).mockResolvedValue(mock.client as never)
	})

	it('returns QR by slug', async () => {
		const fakeQr = { id: 'qr-1', slug: 'my-slug', data: 'https://example.com' }
		mock.fromMock.mockReturnValueOnce(createChain(fakeQr))

		const result = await getQrBySlug('my-slug')
		expect(result).toEqual({ data: fakeQr })
	})

	it('returns error when slug not found', async () => {
		mock.fromMock.mockReturnValueOnce(createChain(null, { message: 'Not found' }))

		const result = await getQrBySlug('nonexistent')
		expect(result).toEqual({ error: 'Not found' })
	})
})

// ─── getFavoriteQrs ───────────────────────────────────────────────────────────

describe('getFavoriteQrs', () => {
	let mock: ReturnType<typeof createSupabaseMock>

	beforeEach(() => {
		vi.clearAllMocks()
		mock = createSupabaseMock()
		vi.mocked(createClient).mockResolvedValue(mock.client as never)
	})

	it('returns error when unauthenticated', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: null } as never)
		const result = await getFavoriteQrs()
		expect(result).toEqual({ error: 'Unauthenticated' })
	})

	it('returns favorite QRs', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		const favQrs = [{ id: 'qr-1', is_favorite: true }]
		mock.fromMock.mockReturnValueOnce(createChain(favQrs))

		const result = await getFavoriteQrs()
		expect(result).toEqual({ data: favQrs })
	})

	it('returns error on DB failure', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		mock.fromMock.mockReturnValueOnce(createChain(null, { message: 'DB error' }))

		const result = await getFavoriteQrs()
		expect(result).toEqual({ error: 'DB error' })
	})
})

// ─── getQrsByFolder ───────────────────────────────────────────────────────────

describe('getQrsByFolder', () => {
	let mock: ReturnType<typeof createSupabaseMock>

	beforeEach(() => {
		vi.clearAllMocks()
		mock = createSupabaseMock()
		vi.mocked(createClient).mockResolvedValue(mock.client as never)
	})

	it('returns error when unauthenticated', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: null } as never)
		const result = await getQrsByFolder('folder-1')
		expect(result).toEqual({ error: 'Unauthenticated' })
	})

	it('returns QRs for a given folder', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		const qrs = [{ id: 'qr-1', folder_id: 'folder-1' }]
		mock.fromMock.mockReturnValueOnce(createChain(qrs, null, 1))

		const result = await getQrsByFolder('folder-1')
		expect(result).toEqual({ data: qrs, count: 1 })
	})

	it('returns error on DB failure', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		mock.fromMock.mockReturnValueOnce(createChain(null, { message: 'DB error' }))

		const result = await getQrsByFolder('folder-1')
		expect(result).toEqual({ error: 'DB error' })
	})
})

// ─── getDashboardStats ────────────────────────────────────────────────────────

describe('getDashboardStats', () => {
	let mock: ReturnType<typeof createSupabaseMock>

	beforeEach(() => {
		vi.clearAllMocks()
		mock = createSupabaseMock()
		vi.mocked(createClient).mockResolvedValue(mock.client as never)
	})

	it('returns error when unauthenticated', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: null } as never)
		const result = await getDashboardStats()
		expect(result).toEqual({ error: 'No autenticado' })
	})

	it('returns dashboard stats with counts', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)

		// 5 concurrent queries: totalQrs, activeQrs, todayScans, monthScans, recentQrs
		mock.fromMock
			.mockReturnValueOnce(createChain(null, null, 10)) // totalQrs
			.mockReturnValueOnce(createChain(null, null, 8))  // activeQrs
			.mockReturnValueOnce(createChain(null, null, 3))  // todayScans
			.mockReturnValueOnce(createChain(null, null, 25)) // monthScans
			.mockReturnValueOnce(createChain([{ id: 'qr-1' }])) // recentQrs

		const result = await getDashboardStats()
		expect(result).toEqual({
			data: {
				totalQrs: 10,
				activeQrs: 8,
				todayScans: 3,
				monthScans: 25,
				recentQrs: [{ id: 'qr-1' }],
			},
		})
	})

	it('defaults null counts to 0', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)

		mock.fromMock
			.mockReturnValueOnce(createChain(null, null, null)) // totalQrs
			.mockReturnValueOnce(createChain(null, null, null)) // activeQrs
			.mockReturnValueOnce(createChain(null, null, null)) // todayScans
			.mockReturnValueOnce(createChain(null, null, null)) // monthScans
			.mockReturnValueOnce(createChain(null))              // recentQrs

		const result = await getDashboardStats()
		expect(result).toEqual({
			data: {
				totalQrs: 0,
				activeQrs: 0,
				todayScans: 0,
				monthScans: 0,
				recentQrs: [],
			},
		})
	})
})

// ─── saveScan ─────────────────────────────────────────────────────────────────

describe('saveScan', () => {
	let mock: ReturnType<typeof createSupabaseMock>

	beforeEach(() => {
		vi.clearAllMocks()
		mock = createSupabaseMock()
		vi.mocked(createClient).mockResolvedValue(mock.client as never)
	})

	it('inserts scan without throwing on success', async () => {
		mock.fromMock.mockReturnValueOnce(createChain(null, null))

		const scan = {
			qr_id: 'qr-1',
			user_id: 'user-123',
			ip: '1.2.3.4',
			user_agent: 'Mozilla/5.0',
			country: 'US',
			city: 'New York',
			device: 'desktop',
			browser: 'Chrome',
			os: 'Windows',
			referer: null,
			lat: null,
			lng: null,
		}
		await expect(saveScan(scan as never)).resolves.toBeUndefined()
	})

	it('logs error on DB failure without throwing', async () => {
		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
		mock.fromMock.mockReturnValueOnce(createChain(null, { message: 'Insert failed' }))

		await saveScan({ qr_id: 'qr-1', user_id: 'user-1' } as never)
		expect(consoleSpy).toHaveBeenCalledWith('Error saving scan:', 'Insert failed')
		consoleSpy.mockRestore()
	})
})

// ─── updateQr ─────────────────────────────────────────────────────────────────

describe('updateQr', () => {
	let mock: ReturnType<typeof createSupabaseMock>

	beforeEach(() => {
		vi.clearAllMocks()
		mock = createSupabaseMock()
		vi.mocked(createAdminClient).mockReturnValue(mock.client as never)
	})

	it('updates QR without logo', async () => {
		const updatedQr = { id: 'qr-1', name: 'Updated QR' }
		mock.fromMock.mockReturnValueOnce(createChain(updatedQr))

		const result = await updateQr('qr-1', { name: 'Updated QR' } as never)
		expect(result).toEqual({ data: updatedQr })
	})

	it('returns error on DB failure', async () => {
		mock.fromMock.mockReturnValueOnce(createChain(null, { message: 'Update failed' }))

		const result = await updateQr('qr-1', { name: 'Test' } as never)
		expect(result).toEqual({ error: 'Update failed' })
	})
})

// ─── completeOnboarding ───────────────────────────────────────────────────────

describe('completeOnboarding', () => {
	let mock: ReturnType<typeof createSupabaseMock>

	beforeEach(() => {
		vi.clearAllMocks()
		mock = createSupabaseMock()
		vi.mocked(createAdminClient).mockReturnValue(mock.client as never)
	})

	it('returns error when unauthenticated', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: null } as never)
		const result = await completeOnboarding()
		expect(result).toEqual({ error: 'No autenticado' })
	})

	it('returns success on completion', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		mock.fromMock.mockReturnValueOnce(createChain(null, null))

		const result = await completeOnboarding()
		expect(result).toEqual({ success: true })
	})

	it('returns error on DB failure', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		mock.fromMock.mockReturnValueOnce(createChain(null, { message: 'Update failed' }))

		const result = await completeOnboarding()
		expect(result).toEqual({ error: 'Update failed' })
	})
})
