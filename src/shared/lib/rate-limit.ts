/**
 * Lightweight in-memory sliding-window rate limiter.
 *
 * Suitable for single-instance deployments (Vercel serverless functions share
 * nothing between invocations, so this acts as a per-cold-start guard).
 * For multi-instance / production at scale, replace the Map with a Redis store
 * (e.g. Upstash @upstash/ratelimit).
 *
 * @example
 * const limiter = createRateLimiter({ limit: 60, windowMs: 60_000 })
 * const { success } = limiter.check('192.168.1.1')
 * if (!success) return new Response('Too Many Requests', { status: 429 })
 */

interface RateLimitOptions {
	/** Maximum number of requests allowed within the window. */
	limit: number
	/** Rolling window duration in milliseconds. */
	windowMs: number
}

interface RateLimitResult {
	success: boolean
	/** Remaining requests in the current window. */
	remaining: number
}

interface Entry {
	count: number
	resetAt: number
}

export function createRateLimiter({ limit, windowMs }: RateLimitOptions) {
	const store = new Map<string, Entry>()

	/** Remove stale entries to prevent unbounded memory growth. */
	function prune() {
		const now = Date.now()
		for (const [key, entry] of store) {
			if (now > entry.resetAt) store.delete(key)
		}
	}

	function check(key: string): RateLimitResult {
		const now = Date.now()
		const entry = store.get(key)

		if (!entry || now > entry.resetAt) {
			store.set(key, { count: 1, resetAt: now + windowMs })
			return { success: true, remaining: limit - 1 }
		}

		entry.count++

		if (entry.count > limit) {
			return { success: false, remaining: 0 }
		}

		// Prune periodically (every ~100 unique IPs checked)
		if (store.size % 100 === 0) prune()

		return { success: true, remaining: limit - entry.count }
	}

	return { check }
}
