import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createChain, createSupabaseMock } from '../__mocks__/supabase'

vi.mock('@/shared/lib/supabase/admin', () => ({ createAdminClient: vi.fn() }))
vi.mock('@/shared/lib/supabase/server', () => ({ createClient: vi.fn() }))
vi.mock('@/shared/lib/supabase/get-session', () => ({ getSession: vi.fn() }))

import { createFolder } from '@/features/folders/services/mutations/create-folder'
import { deleteFolder } from '@/features/folders/services/mutations/delete-folder'
import { getFolders } from '@/features/folders/services/queries/get-folders'
import { createAdminClient } from '@/shared/lib/supabase/admin'
import { getSession } from '@/shared/lib/supabase/get-session'
import { createClient } from '@/shared/lib/supabase/server'

const SESSION_DATA = { user: { id: 'user-123', email: 'test@example.com' } }

// ─── createFolder ─────────────────────────────────────────────────────────────

describe('createFolder', () => {
	let mock: ReturnType<typeof createSupabaseMock>

	beforeEach(() => {
		vi.clearAllMocks()
		mock = createSupabaseMock()
		vi.mocked(createAdminClient).mockReturnValue(mock.client as never)
	})

	it('returns error when unauthenticated', async () => {
		vi.mocked(getSession).mockResolvedValue({ error: 'No session' } as never)
		const result = await createFolder('My Folder')
		expect(result).toEqual({ error: 'No autenticado' })
	})

	it('creates folder and returns data', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		const newFolder = {
			id: 'folder-1',
			name: 'My Folder',
			slug: 'abc123-my-folder',
		}
		mock.fromMock.mockReturnValueOnce(createChain(newFolder))

		const result = await createFolder('My Folder')
		expect(result).toEqual({ data: newFolder })
	})

	it('returns error on DB failure', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		mock.fromMock.mockReturnValueOnce(
			createChain(null, { message: 'Duplicate folder' }),
		)

		const result = await createFolder('Existing')
		expect(result).toEqual({ error: 'Duplicate folder' })
	})

	it('inserts with user_id from session', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		const chain = createChain({ id: 'f-1', name: 'Test' })
		mock.fromMock.mockReturnValueOnce(chain)

		await createFolder('Test')
		expect(chain.insert).toHaveBeenCalledWith(
			expect.objectContaining({ user_id: 'user-123' }),
		)
	})
})

// ─── deleteFolder ─────────────────────────────────────────────────────────────

describe('deleteFolder', () => {
	let mock: ReturnType<typeof createSupabaseMock>

	beforeEach(() => {
		vi.clearAllMocks()
		mock = createSupabaseMock()
		vi.mocked(createAdminClient).mockReturnValue(mock.client as never)
	})

	it('deletes folder successfully', async () => {
		mock.fromMock.mockReturnValueOnce(createChain(null, null))
		const result = await deleteFolder('folder-1')
		expect(result).toEqual({ success: true })
	})

	it('returns error on DB failure', async () => {
		mock.fromMock.mockReturnValueOnce(
			createChain(null, { message: 'Delete failed' }),
		)
		const result = await deleteFolder('folder-1')
		expect(result).toEqual({ error: 'Delete failed' })
	})
})

// ─── getFolders ───────────────────────────────────────────────────────────────

describe('getFolders', () => {
	let mock: ReturnType<typeof createSupabaseMock>

	beforeEach(() => {
		vi.clearAllMocks()
		mock = createSupabaseMock()
		vi.mocked(createClient).mockResolvedValue(mock.client as never)
	})

	it('returns error when unauthenticated', async () => {
		vi.mocked(getSession).mockResolvedValue({ error: 'No session' } as never)
		const result = await getFolders()
		expect(result).toEqual({ error: 'No autenticado' })
	})

	it('returns flattened folders with qr_count', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		const rawFolders = [
			{
				id: 'f-1',
				name: 'Folder 1',
				slug: 'folder-1',
				created_at: '2024-01-01',
				qrs: [{ count: 5 }],
			},
			{
				id: 'f-2',
				name: 'Folder 2',
				slug: 'folder-2',
				created_at: '2024-01-02',
				qrs: [{ count: 0 }],
			},
		]
		mock.fromMock.mockReturnValueOnce(createChain(rawFolders))

		const result = await getFolders()
		expect(result).toEqual({
			data: [
				expect.objectContaining({ id: 'f-1', qr_count: 5 }),
				expect.objectContaining({ id: 'f-2', qr_count: 0 }),
			],
		})
	})

	it('returns error on DB failure', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		mock.fromMock.mockReturnValueOnce(
			createChain(null, { message: 'Fetch failed' }),
		)

		const result = await getFolders()
		expect(result).toEqual({ error: 'Fetch failed' })
	})
})
