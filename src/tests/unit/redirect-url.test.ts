import { describe, expect, it } from 'vitest'
import { resolveRedirectUrl } from '@/features/tracking/utils/resolve-redirect-url'

// Use URLs with explicit paths to avoid `new URL()` trailing-slash normalization
const DEFAULT_URL = 'https://example.com/landing'
const IOS_URL = 'https://apps.apple.com/app/myapp'
const ANDROID_URL = 'https://play.google.com/store/apps/myapp'

describe('resolveRedirectUrl — platform routing', () => {
	it('returns default URL for unknown OS', () => {
		const result = resolveRedirectUrl(
			DEFAULT_URL,
			IOS_URL,
			ANDROID_URL,
			'Windows',
		)
		expect(result).toBe(DEFAULT_URL)
	})

	it('returns iOS URL for iOS OS', () => {
		const result = resolveRedirectUrl(DEFAULT_URL, IOS_URL, ANDROID_URL, 'iOS')
		expect(result).toBe(IOS_URL)
	})

	it('returns iOS URL for iPhone OS string', () => {
		const result = resolveRedirectUrl(
			DEFAULT_URL,
			IOS_URL,
			ANDROID_URL,
			'iPhone OS',
		)
		expect(result).toBe(IOS_URL)
	})

	it('returns iOS URL for iPad OS string', () => {
		const result = resolveRedirectUrl(
			DEFAULT_URL,
			IOS_URL,
			ANDROID_URL,
			'iPadOS',
		)
		expect(result).toBe(IOS_URL)
	})

	it('returns Android URL for Android OS', () => {
		const result = resolveRedirectUrl(
			DEFAULT_URL,
			IOS_URL,
			ANDROID_URL,
			'Android',
		)
		expect(result).toBe(ANDROID_URL)
	})

	it('falls back to default when iosUrl is null on iOS', () => {
		const result = resolveRedirectUrl(DEFAULT_URL, null, ANDROID_URL, 'iOS')
		expect(result).toBe(DEFAULT_URL)
	})

	it('falls back to default when androidUrl is null on Android', () => {
		const result = resolveRedirectUrl(DEFAULT_URL, IOS_URL, null, 'Android')
		expect(result).toBe(DEFAULT_URL)
	})
})

describe('resolveRedirectUrl — UTM params', () => {
	it('appends utm_source when provided', () => {
		const result = resolveRedirectUrl(DEFAULT_URL, null, null, 'Windows', {
			utm_source: 'newsletter',
		})
		expect(result).toContain('utm_source=newsletter')
	})

	it('appends multiple UTM params', () => {
		const result = resolveRedirectUrl(DEFAULT_URL, null, null, 'Windows', {
			utm_source: 'newsletter',
			utm_medium: 'email',
			utm_campaign: 'spring_sale',
		})
		const url = new URL(result)
		expect(url.searchParams.get('utm_source')).toBe('newsletter')
		expect(url.searchParams.get('utm_medium')).toBe('email')
		expect(url.searchParams.get('utm_campaign')).toBe('spring_sale')
	})

	it('skips null UTM params', () => {
		const result = resolveRedirectUrl(DEFAULT_URL, null, null, 'Windows', {
			utm_source: null,
			utm_medium: 'email',
		})
		const url = new URL(result)
		expect(url.searchParams.has('utm_source')).toBe(false)
		expect(url.searchParams.get('utm_medium')).toBe('email')
	})

	it('returns invalid URL strings as-is without modification', () => {
		// A string that is not a valid URL at all — new URL() throws, so returned as-is
		const notAUrl = 'just-plain-text'
		const result = resolveRedirectUrl(notAUrl, null, null, 'Windows', {
			utm_source: 'test',
		})
		expect(result).toBe(notAUrl)
	})

	it('works with no UTM params (empty object)', () => {
		const result = resolveRedirectUrl(DEFAULT_URL, null, null, 'Windows')
		expect(result).toBe(DEFAULT_URL)
	})
})
