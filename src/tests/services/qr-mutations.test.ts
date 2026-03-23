import { vi, describe, it, expect, beforeEach } from 'vitest'
import { createChain, createSupabaseMock } from '../__mocks__/supabase'

vi.mock('@/shared/lib/supabase/admin', () => ({ createAdminClient: vi.fn() }))
vi.mock('@/shared/lib/supabase/server', () => ({ createClient: vi.fn() }))
vi.mock('@/shared/lib/supabase/get-session', () => ({ getSession: vi.fn() }))
vi.mock('@/shared/lib/supabase/upload-image', () => ({ uploadImage: vi.fn() }))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

import { createAdminClient } from '@/shared/lib/supabase/admin'
import { createClient } from '@/shared/lib/supabase/server'
import { getSession } from '@/shared/lib/supabase/get-session'
import { uploadImage } from '@/shared/lib/supabase/upload-image'
import { revalidatePath } from 'next/cache'
import { createQr } from '@/features/qr-codes/services/mutations/create-qr'
import { deleteQr } from '@/features/qr-codes/services/mutations/delete-qr'
import { toggleQrStatus } from '@/features/qr-codes/services/mutations/toggle-qr-status'
import { toggleQrFavorite } from '@/features/qr-codes/services/mutations/toggle-qr-favorite'

const SESSION_DATA = { user: { id: 'user-123', email: 'test@example.com' } }

const BASE_QR_DATA = {
	name: 'Test QR',
	qr_type: 'url',
	data: 'https://example.com',
	bg_color: '#ffffff',
	fg_color: '#000000',
	dot_style: 'square',
	corner_square_style: 'square',
	corner_dot_style: 'square',
	dot_gradient_type: 'linear' as const,
	frame_style: 'none' as const,
	frame_color: '#000000',
	frame_text: 'SCAN ME',
}

// ─── createQr ─────────────────────────────────────────────────────────────────

describe('createQr', () => {
	let mock: ReturnType<typeof createSupabaseMock>

	beforeEach(() => {
		vi.clearAllMocks()
		mock = createSupabaseMock()
		vi.mocked(createAdminClient).mockReturnValue(mock.client as never)
	})

	it('returns error when unauthenticated', async () => {
		vi.mocked(getSession).mockResolvedValue({ error: 'No session' } as never)
		const result = await createQr(BASE_QR_DATA as never)
		expect(result).toEqual({ error: 'No autenticado' })
	})

	it('returns error when free plan limit reached (3 QRs)', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		mock.fromMock
			.mockReturnValueOnce(createChain({ plan: 'free' })) // profiles
			.mockReturnValueOnce(createChain(null, null, 3)) // count = 3 (limit)
		const result = await createQr(BASE_QR_DATA as never)
		expect(result?.error).toContain('límite')
	})

	it('returns error when custom slug is already taken', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		mock.fromMock
			.mockReturnValueOnce(createChain({ plan: 'pro' })) // profiles
			.mockReturnValueOnce(createChain(null, null, 0)) // qr count ok
			.mockReturnValueOnce(createChain(null, null, 1)) // slug already exists
		const result = await createQr({
			...BASE_QR_DATA,
			custom_slug: 'my-slug',
		} as never)
		expect(result?.error).toContain('slug')
	})

	it('creates QR successfully for free plan', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		const newQr = { id: 'qr-new', slug: 'abc123-test-qr', ...BASE_QR_DATA }
		mock.fromMock
			.mockReturnValueOnce(createChain({ plan: 'free' })) // profiles
			.mockReturnValueOnce(createChain(null, null, 0)) // qr count
			.mockReturnValueOnce(createChain(newQr)) // insert
		const result = await createQr(BASE_QR_DATA as never)
		expect(result).toEqual({ data: newQr })
	})

	it('creates QR with logo upload', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		vi.mocked(uploadImage).mockResolvedValue({
			url_image: 'https://example.com/logo.png',
			image_path: 'logos/abc.png',
		} as never)
		const newQr = { id: 'qr-logo', slug: 'abc-test' }
		mock.fromMock
			.mockReturnValueOnce(createChain({ plan: 'pro' }))
			.mockReturnValueOnce(createChain(null, null, 0))
			.mockReturnValueOnce(createChain(newQr))

		const mockFile = new File(['img'], 'logo.png', { type: 'image/png' })
		const result = await createQr({ ...BASE_QR_DATA, logo: mockFile } as never)
		expect(uploadImage).toHaveBeenCalled()
		expect(result).toEqual({ data: newQr })
	})

	it('returns error when DB insert fails', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		mock.fromMock
			.mockReturnValueOnce(createChain({ plan: 'free' }))
			.mockReturnValueOnce(createChain(null, null, 0))
			.mockReturnValueOnce(createChain(null, { message: 'DB error' }))
		const result = await createQr(BASE_QR_DATA as never)
		expect(result).toEqual({ error: 'DB error' })
	})
})

// ─── deleteQr ─────────────────────────────────────────────────────────────────

describe('deleteQr', () => {
	let mock: ReturnType<typeof createSupabaseMock>

	beforeEach(() => {
		vi.clearAllMocks()
		mock = createSupabaseMock()
		vi.mocked(createAdminClient).mockReturnValue(mock.client as never)
	})

	it('deletes QR and removes logo from storage', async () => {
		mock.fromMock
			.mockReturnValueOnce(createChain({ logo_path: 'logos/abc.png' })) // select logo_path
			.mockReturnValueOnce(createChain(null, null)) // delete
		const result = await deleteQr('qr-123')
		expect(result).toEqual({ success: true })
		expect(mock.storageBucket.remove).toHaveBeenCalledWith(['logos/abc.png'])
	})

	it('deletes QR without logo — no storage call', async () => {
		mock.fromMock
			.mockReturnValueOnce(createChain({ logo_path: null }))
			.mockReturnValueOnce(createChain(null, null))
		const result = await deleteQr('qr-456')
		expect(result).toEqual({ success: true })
		expect(mock.storageBucket.remove).not.toHaveBeenCalled()
	})

	it('returns error when deletion fails', async () => {
		mock.fromMock
			.mockReturnValueOnce(createChain({ logo_path: null }))
			.mockReturnValueOnce(createChain(null, { message: 'Delete failed' }))
		const result = await deleteQr('qr-789')
		expect(result).toEqual({ error: 'Delete failed' })
	})
})

// ─── toggleQrStatus ───────────────────────────────────────────────────────────

describe('toggleQrStatus', () => {
	let mock: ReturnType<typeof createSupabaseMock>

	beforeEach(() => {
		vi.clearAllMocks()
		mock = createSupabaseMock()
		vi.mocked(createAdminClient).mockReturnValue(mock.client as never)
	})

	it('activates a QR successfully', async () => {
		const updated = { id: 'qr-1', is_active: true }
		mock.fromMock.mockReturnValueOnce(createChain(updated))
		const result = await toggleQrStatus('qr-1', true)
		expect(result).toEqual({ data: updated })
	})

	it('deactivates a QR successfully', async () => {
		const updated = { id: 'qr-1', is_active: false }
		mock.fromMock.mockReturnValueOnce(createChain(updated))
		const result = await toggleQrStatus('qr-1', false)
		expect(result).toEqual({ data: updated })
	})

	it('returns error on failure', async () => {
		mock.fromMock.mockReturnValueOnce(createChain(null, { message: 'Update failed' }))
		const result = await toggleQrStatus('qr-1', true)
		expect(result).toEqual({ error: 'Update failed' })
	})
})

// ─── toggleQrFavorite ─────────────────────────────────────────────────────────

describe('toggleQrFavorite', () => {
	let mock: ReturnType<typeof createSupabaseMock>

	beforeEach(() => {
		vi.clearAllMocks()
		mock = createSupabaseMock()
		vi.mocked(createClient).mockResolvedValue(mock.client as never)
	})

	it('returns error when unauthenticated', async () => {
		vi.mocked(getSession).mockResolvedValue({ error: 'No session' } as never)
		const result = await toggleQrFavorite('qr-1', true)
		expect(result).toEqual({ error: 'Unauthenticated' })
	})

	it('adds to favorites successfully', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		mock.fromMock.mockReturnValueOnce(createChain(null, null))
		const result = await toggleQrFavorite('qr-1', true)
		expect(result).toEqual({ success: true })
		expect(revalidatePath).toHaveBeenCalledWith('/dashboard/qrs')
		expect(revalidatePath).toHaveBeenCalledWith('/dashboard/favorites')
	})

	it('removes from favorites successfully', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		mock.fromMock.mockReturnValueOnce(createChain(null, null))
		const result = await toggleQrFavorite('qr-1', false)
		expect(result).toEqual({ success: true })
	})

	it('returns error on DB failure', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		mock.fromMock.mockReturnValueOnce(createChain(null, { message: 'Update error' }))
		const result = await toggleQrFavorite('qr-1', true)
		expect(result).toEqual({ error: 'Update error' })
	})
})
