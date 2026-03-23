import { vi } from 'vitest'

/**
 * Creates a chainable Supabase query builder mock.
 * - All builder methods (select, eq, order, …) return `this`
 * - `.single()` / `.maybeSingle()` resolve to `{ data, error }`
 * - Awaiting the chain directly (for count queries) resolves to `{ data, error, count }`
 */
export function createChain(
	data: unknown = null,
	error: unknown = null,
	count: number | null = null,
) {
	const resolved = { data, error, count }
	const chain: Record<string, unknown> = {
		select: vi.fn().mockReturnThis(),
		insert: vi.fn().mockReturnThis(),
		update: vi.fn().mockReturnThis(),
		delete: vi.fn().mockReturnThis(),
		upsert: vi.fn().mockReturnThis(),
		eq: vi.fn().mockReturnThis(),
		neq: vi.fn().mockReturnThis(),
		ilike: vi.fn().mockReturnThis(),
		like: vi.fn().mockReturnThis(),
		or: vi.fn().mockReturnThis(),
		gt: vi.fn().mockReturnThis(),
		gte: vi.fn().mockReturnThis(),
		lt: vi.fn().mockReturnThis(),
		in: vi.fn().mockReturnThis(),
		order: vi.fn().mockReturnThis(),
		range: vi.fn().mockReturnThis(),
		limit: vi.fn().mockReturnThis(),
		head: vi.fn().mockReturnThis(),
		// Resolves the final awaited value (used for count queries)
		then: (resolve: (v: unknown) => unknown, reject?: (e: unknown) => unknown) =>
			Promise.resolve(resolved).then(resolve, reject),
		// Terminal methods
		single: vi.fn().mockResolvedValue({ data, error }),
		maybeSingle: vi.fn().mockResolvedValue({ data, error }),
	}
	return chain
}

export interface SupabaseMock {
	client: {
		from: ReturnType<typeof vi.fn>
		rpc: ReturnType<typeof vi.fn>
		auth: {
			signInWithPassword: ReturnType<typeof vi.fn>
			signUp: ReturnType<typeof vi.fn>
			signOut: ReturnType<typeof vi.fn>
			getUser: ReturnType<typeof vi.fn>
			admin: {
				inviteUserByEmail: ReturnType<typeof vi.fn>
			}
		}
		storage: {
			from: ReturnType<typeof vi.fn>
		}
	}
	fromMock: ReturnType<typeof vi.fn>
	rpcMock: ReturnType<typeof vi.fn>
	authMock: {
		signInWithPassword: ReturnType<typeof vi.fn>
		signUp: ReturnType<typeof vi.fn>
		signOut: ReturnType<typeof vi.fn>
		getUser: ReturnType<typeof vi.fn>
		admin: { inviteUserByEmail: ReturnType<typeof vi.fn> }
	}
	storageBucket: {
		remove: ReturnType<typeof vi.fn>
		upload: ReturnType<typeof vi.fn>
		getPublicUrl: ReturnType<typeof vi.fn>
	}
}

/**
 * Creates a full Supabase client mock.
 * Use `fromMock` to control per-call return values:
 *   fromMock.mockReturnValueOnce(createChain({ plan: 'pro' }))
 */
export function createSupabaseMock(): SupabaseMock {
	const fromMock = vi.fn()
	const rpcMock = vi.fn().mockResolvedValue({ data: null, error: null })

	const storageBucket = {
		remove: vi.fn().mockResolvedValue({ data: null, error: null }),
		upload: vi.fn().mockResolvedValue({ data: { path: 'logos/test.png' }, error: null }),
		getPublicUrl: vi.fn().mockReturnValue({
			data: { publicUrl: 'https://example.com/test.png' },
		}),
	}

	const authMock = {
		signInWithPassword: vi.fn().mockResolvedValue({ data: null, error: null }),
		signUp: vi.fn().mockResolvedValue({ data: null, error: null }),
		signOut: vi.fn().mockResolvedValue({ error: null }),
		getUser: vi.fn().mockResolvedValue({ data: null, error: null }),
		admin: {
			inviteUserByEmail: vi.fn().mockResolvedValue({ data: null, error: null }),
		},
	}

	const client = {
		from: fromMock,
		rpc: rpcMock,
		auth: authMock,
		storage: {
			from: vi.fn().mockReturnValue(storageBucket),
		},
	}

	return { client, fromMock, rpcMock, authMock, storageBucket }
}
