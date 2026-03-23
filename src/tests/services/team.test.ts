import { vi, describe, it, expect, beforeEach } from 'vitest'
import { createChain, createSupabaseMock } from '../__mocks__/supabase'

vi.mock('@/shared/lib/supabase/admin', () => ({ createAdminClient: vi.fn() }))
vi.mock('@/shared/lib/supabase/get-session', () => ({ getSession: vi.fn() }))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

import { createAdminClient } from '@/shared/lib/supabase/admin'
import { getSession } from '@/shared/lib/supabase/get-session'
import { revalidatePath } from 'next/cache'
import {
	inviteMember,
	removeMember,
	acceptInvite,
} from '@/features/team/services/team-actions'

const SESSION_DATA = { user: { id: 'owner-123', email: 'owner@example.com' } }

// ─── inviteMember ─────────────────────────────────────────────────────────────

describe('inviteMember', () => {
	let mock: ReturnType<typeof createSupabaseMock>

	beforeEach(() => {
		vi.clearAllMocks()
		mock = createSupabaseMock()
		vi.mocked(createAdminClient).mockReturnValue(mock.client as never)
	})

	it('returns error when unauthenticated', async () => {
		vi.mocked(getSession).mockResolvedValue({ error: 'No session' } as never)
		const result = await inviteMember('someone@example.com')
		expect(result).toEqual({ error: 'No autenticado' })
	})

	it('returns error when plan is not Business', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		mock.fromMock.mockReturnValueOnce(
			createChain({ plan: 'pro', name: 'Owner', email: 'owner@example.com' }),
		)
		const result = await inviteMember('member@example.com')
		expect(result?.error).toContain('Business')
	})

	it('returns error when inviting yourself', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		mock.fromMock.mockReturnValueOnce(
			createChain({ plan: 'business', name: 'Owner', email: 'owner@example.com' }),
		)
		const result = await inviteMember('owner@example.com')
		expect(result?.error).toContain('ti mismo')
	})

	it('returns error when team limit is reached', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		mock.fromMock
			.mockReturnValueOnce(
				createChain({ plan: 'business', name: 'Owner', email: 'owner@example.com' }),
			)
			.mockReturnValueOnce(createChain(null, null, 10)) // 10 active members (limit)
		const result = await inviteMember('new@example.com')
		expect(result?.error).toContain('Límite')
	})

	it('returns error when member already invited', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		mock.fromMock
			.mockReturnValueOnce(
				createChain({ plan: 'business', name: 'Owner', email: 'owner@example.com' }),
			)
			.mockReturnValueOnce(createChain(null, null, 2)) // count < 10
			.mockReturnValueOnce(createChain({ id: 'existing', status: 'pending' })) // already invited
		const result = await inviteMember('member@example.com')
		expect(result?.error).toContain('invitación pendiente')
	})

	it('returns error when member is already active', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		mock.fromMock
			.mockReturnValueOnce(
				createChain({ plan: 'business', name: 'Owner', email: 'owner@example.com' }),
			)
			.mockReturnValueOnce(createChain(null, null, 1))
			.mockReturnValueOnce(createChain({ id: 'existing', status: 'active' }))
		const result = await inviteMember('member@example.com')
		expect(result?.error).toContain('miembro del equipo')
	})

	it('creates invite successfully', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		mock.fromMock
			.mockReturnValueOnce(
				createChain({ plan: 'business', name: 'Owner', email: 'owner@example.com' }),
			)
			.mockReturnValueOnce(createChain(null, null, 0)) // count
			.mockReturnValueOnce(createChain(null, { code: 'PGRST116' })) // not existing (404-like)
			.mockReturnValueOnce(createChain({ id: 'profile-1' })) // member profile lookup
			.mockReturnValueOnce(createChain({ token: 'invite-token-abc' })) // insert invite

		const result = await inviteMember('newmember@example.com')
		expect(result).toHaveProperty('success', true)
		expect(result).toHaveProperty('inviteUrl')
		expect(revalidatePath).toHaveBeenCalledWith('/dashboard/team')
	})
})

// ─── removeMember ─────────────────────────────────────────────────────────────

describe('removeMember', () => {
	let mock: ReturnType<typeof createSupabaseMock>

	beforeEach(() => {
		vi.clearAllMocks()
		mock = createSupabaseMock()
		vi.mocked(createAdminClient).mockReturnValue(mock.client as never)
	})

	it('returns error when unauthenticated', async () => {
		vi.mocked(getSession).mockResolvedValue({ error: 'No session' } as never)
		const result = await removeMember('member-1')
		expect(result).toEqual({ error: 'No autenticado' })
	})

	it('removes member successfully', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		mock.fromMock.mockReturnValueOnce(createChain(null, null))
		const result = await removeMember('member-1')
		expect(result).toEqual({ success: true })
		expect(revalidatePath).toHaveBeenCalledWith('/dashboard/team')
	})

	it('returns error on DB failure', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		mock.fromMock.mockReturnValueOnce(createChain(null, { message: 'Delete failed' }))
		const result = await removeMember('member-1')
		expect(result).toEqual({ error: 'Delete failed' })
	})
})

// ─── acceptInvite ─────────────────────────────────────────────────────────────

describe('acceptInvite', () => {
	let mock: ReturnType<typeof createSupabaseMock>

	beforeEach(() => {
		vi.clearAllMocks()
		mock = createSupabaseMock()
		vi.mocked(createAdminClient).mockReturnValue(mock.client as never)
	})

	it('returns error when unauthenticated', async () => {
		vi.mocked(getSession).mockResolvedValue({ error: 'No session' } as never)
		const result = await acceptInvite('some-token')
		expect(result).toEqual({ error: 'No autenticado' })
	})

	it('returns error when invite token is invalid', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		mock.fromMock.mockReturnValueOnce(
			createChain(null, { message: 'Not found' }),
		)
		const result = await acceptInvite('invalid-token')
		expect(result?.error).toContain('válida')
	})

	it('returns error when invite is already accepted', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		mock.fromMock.mockReturnValueOnce(
			createChain({
				id: 'inv-1',
				owner_id: 'owner-123',
				email: 'owner@example.com',
				status: 'active',
			}),
		)
		const result = await acceptInvite('already-used-token')
		expect(result?.error).toContain('aceptada')
	})

	it('returns error when logged-in user email does not match invite email', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		// Invite is for a different email than the logged-in user
		mock.fromMock.mockReturnValueOnce(
			createChain({
				id: 'inv-1',
				owner_id: 'owner-abc',
				email: 'different@example.com', // ← different from owner@example.com
				status: 'pending',
			}),
		)
		const result = await acceptInvite('valid-token')
		expect(result?.error).toContain('otro usuario')
	})

	it('accepts invite successfully', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		mock.fromMock
			.mockReturnValueOnce(
				createChain({
					id: 'inv-1',
					owner_id: 'owner-999',
					email: 'owner@example.com', // matches session user email
					status: 'pending',
				}),
			)
			.mockReturnValueOnce(createChain(null, null)) // update
		const result = await acceptInvite('valid-token')
		expect(result).toEqual({ success: true, ownerId: 'owner-999' })
	})

	it('returns error when DB update fails', async () => {
		vi.mocked(getSession).mockResolvedValue({ data: SESSION_DATA } as never)
		mock.fromMock
			.mockReturnValueOnce(
				createChain({
					id: 'inv-1',
					owner_id: 'owner-999',
					email: 'owner@example.com',
					status: 'pending',
				}),
			)
			.mockReturnValueOnce(createChain(null, { message: 'Update failed' }))
		const result = await acceptInvite('valid-token')
		expect(result).toEqual({ error: 'Update failed' })
	})
})
