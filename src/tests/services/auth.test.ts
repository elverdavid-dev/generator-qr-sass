import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createSupabaseMock } from '../__mocks__/supabase'

// --- Module mocks (hoisted before imports) ---
vi.mock('@/shared/lib/supabase/server', () => ({ createClient: vi.fn() }))
vi.mock('next/navigation', () => ({ redirect: vi.fn() }))

import { redirect } from 'next/navigation'
import { loginService } from '@/features/auth/services/login'
import { logoutService } from '@/features/auth/services/logout'
import { registerService } from '@/features/auth/services/register'
import { createClient } from '@/shared/lib/supabase/server'

// ─── Helpers ────────────────────────────────────────────────────────────────

function setupClientMock() {
	const mock = createSupabaseMock()
	vi.mocked(createClient).mockResolvedValue(mock.client as never)
	return mock
}

// ─── loginService ────────────────────────────────────────────────────────────

describe('loginService', () => {
	beforeEach(() => vi.clearAllMocks())

	it('returns data on successful login', async () => {
		const { authMock } = setupClientMock()
		const fakeUser = { id: 'user-1', email: 'test@example.com' }
		authMock.signInWithPassword.mockResolvedValue({
			data: { user: fakeUser, session: {} },
			error: null,
		})

		const result = await loginService({
			email: 'test@example.com',
			password: 'pass123',
		})
		expect(result).toEqual({ data: { user: fakeUser, session: {} } })
	})

	it('returns error message on failed login', async () => {
		const { authMock } = setupClientMock()
		authMock.signInWithPassword.mockResolvedValue({
			data: null,
			error: { message: 'Invalid login credentials' },
		})

		const result = await loginService({
			email: 'bad@example.com',
			password: 'wrong',
		})
		expect(result).toEqual({ error: 'Invalid login credentials' })
	})

	it('calls signInWithPassword with correct credentials', async () => {
		const { authMock } = setupClientMock()
		authMock.signInWithPassword.mockResolvedValue({
			data: { user: {} },
			error: null,
		})

		await loginService({ email: 'user@test.com', password: 'mypassword' })
		expect(authMock.signInWithPassword).toHaveBeenCalledWith({
			email: 'user@test.com',
			password: 'mypassword',
		})
	})
})

// ─── registerService ─────────────────────────────────────────────────────────

describe('registerService', () => {
	beforeEach(() => vi.clearAllMocks())

	it('returns data on successful registration', async () => {
		const { authMock } = setupClientMock()
		authMock.signUp.mockResolvedValue({
			data: { user: { id: 'new-user' } },
			error: null,
		})

		const result = await registerService({
			email: 'new@example.com',
			password: 'secret123',
		})
		expect(result).toEqual({ data: { user: { id: 'new-user' } } })
	})

	it('returns error on registration failure', async () => {
		const { authMock } = setupClientMock()
		authMock.signUp.mockResolvedValue({
			data: null,
			error: { message: 'User already registered' },
		})

		const result = await registerService({
			email: 'existing@example.com',
			password: 'pass',
		})
		expect(result).toEqual({ error: 'User already registered' })
	})

	it('calls signUp with email redirect option', async () => {
		const { authMock } = setupClientMock()
		authMock.signUp.mockResolvedValue({ data: { user: {} }, error: null })

		await registerService({ email: 'test@example.com', password: 'pass123' })

		expect(authMock.signUp).toHaveBeenCalledWith(
			expect.objectContaining({
				email: 'test@example.com',
				password: 'pass123',
				options: expect.objectContaining({
					emailRedirectTo: expect.stringContaining('/api/auth/confirm'),
				}),
			}),
		)
	})
})

// ─── logoutService ───────────────────────────────────────────────────────────

describe('logoutService', () => {
	beforeEach(() => vi.clearAllMocks())

	it('calls signOut', async () => {
		const { authMock } = setupClientMock()
		await logoutService()
		expect(authMock.signOut).toHaveBeenCalled()
	})

	it('redirects to /login after sign out', async () => {
		setupClientMock()
		await logoutService()
		expect(redirect).toHaveBeenCalledWith('/login')
	})
})
