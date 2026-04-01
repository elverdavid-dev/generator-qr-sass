import { type NextRequest, NextResponse } from 'next/server'
import { UAParser } from 'ua-parser-js'
import { getPlan, type PlanId } from '@/features/billing/config/plans'
import {
	maybeNotifyMilestone,
	maybeNotifyScanSpike,
} from '@/features/notifications/services/create-notification'
import { getGeoLocation } from '@/features/tracking/services/get-geo-location'
import { saveScan } from '@/features/tracking/services/save-scan'
import { resolveRedirectUrl } from '@/features/tracking/utils/resolve-redirect-url'
import { deliverWebhooks } from '@/features/webhooks/services/deliver-webhooks'
import { createRateLimiter } from '@/shared/lib/rate-limit'
import { createAdminClient } from '@/shared/lib/supabase/admin'

/** 120 tracking requests per minute per IP. */
const rateLimiter = createRateLimiter({ limit: 120, windowMs: 60_000 })

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ slug: string }> },
) {
	const { slug } = await params
	const supabase = createAdminClient()

	const forwardedFor = request.headers.get('x-forwarded-for')
	const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1'

	// Rate limit: 120 requests/min per IP
	const { success: allowed } = rateLimiter.check(ip)
	if (!allowed) {
		return new NextResponse('Too Many Requests', { status: 429 })
	}

	const userAgent = request.headers.get('user-agent') ?? ''
	const parser = new UAParser(userAgent)
	const browser = parser.getBrowser().name ?? 'Unknown'
	const os = parser.getOS().name ?? 'Unknown'
	const deviceType = parser.getDevice().type ?? 'Desktop'

	// Also check custom_slug
	const { data: qr, error } = await supabase
		.from('qrs')
		.select(
			'id, user_id, name, data, qr_type, is_active, scan_count, expires_at, max_scans, password, ios_url, android_url, utm_source, utm_medium, utm_campaign, utm_term, utm_content, schedule_rules, country_rules',
		)
		.or(`slug.eq.${slug},custom_slug.eq.${slug}`)
		.single()

	if (error || !qr) {
		return NextResponse.redirect(new URL('/qr-not-found', request.url))
	}

	if (!qr.is_active) {
		return NextResponse.redirect(new URL('/qr-inactive', request.url))
	}

	// Check expiration
	if (qr.expires_at && new Date(qr.expires_at) < new Date()) {
		return NextResponse.redirect(new URL('/qr-expired', request.url))
	}

	// Check scan limit
	if (qr.max_scans !== null && (qr.scan_count ?? 0) >= qr.max_scans) {
		return NextResponse.redirect(new URL('/qr-limit', request.url))
	}

	// Check monthly scan limit for the QR owner's plan
	const { data: ownerProfile } = await supabase
		.from('profiles')
		.select('plan')
		.eq('id', qr.user_id)
		.maybeSingle()

	if (ownerProfile) {
		const plan = getPlan((ownerProfile.plan ?? 'free') as PlanId)
		if (plan.maxScansPerMonth !== -1) {
			const startOfMonth = new Date(
				new Date().getFullYear(),
				new Date().getMonth(),
				1,
			).toISOString()
			const { count: monthlyScans } = await supabase
				.from('qr_scans')
				.select('id', { count: 'exact', head: true })
				.eq('user_id', qr.user_id)
				.gte('created_at', startOfMonth)
			if ((monthlyScans ?? 0) >= plan.maxScansPerMonth) {
				return NextResponse.redirect(new URL('/qr-limit', request.url))
			}
		}
	}

	// Password protected — redirect to gate without tracking
	if (qr.password) {
		return NextResponse.redirect(new URL(`/qr-gate/${slug}`, request.url))
	}

	// Geolocation
	const geo = await getGeoLocation(ip)

	// Check unique scan (same IP in last 24h)
	const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
	const { data: previousScan } = await supabase
		.from('qr_scans')
		.select('id')
		.eq('qr_id', qr.id)
		.eq('ip_address', ip)
		.gt('created_at', since)
		.maybeSingle()

	const isUniqueScan = !previousScan

	await supabase.rpc('increment_scan_count', { qr_id: qr.id })

	await saveScan({
		qr_id: qr.id,
		user_id: qr.user_id,
		ip_address: ip,
		browser,
		os,
		device_type: deviceType,
		is_unique_scan: isUniqueScan,
		...geo,
	})

	// Fire-and-forget notifications
	const newCount = (qr.scan_count ?? 0) + 1
	maybeNotifyMilestone(qr.user_id, qr.id, qr.name, newCount).catch(() => {})

	// Spike detection: count scans in the last hour
	supabase
		.from('qr_scans')
		.select('id', { count: 'exact', head: true })
		.eq('qr_id', qr.id)
		.gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
		.then(({ count }) => {
			if (count)
				maybeNotifyScanSpike(qr.user_id, qr.id, qr.name, count).catch(() => {})
		})

	// Fire-and-forget webhook delivery
	deliverWebhooks(qr.user_id, {
		event: 'qr.scanned',
		qr_id: qr.id,
		qr_name: qr.name,
		slug,
		timestamp: new Date().toISOString(),
		scan: {
			ip,
			browser,
			os,
			device_type: deviceType,
			country: geo.country ?? null,
			region: geo.region ?? null,
			city: geo.city ?? null,
			is_unique: isUniqueScan,
		},
	}).catch(() => {})

	if (!isUrlType(qr.qr_type)) {
		return NextResponse.redirect(new URL(`/qr-view/${slug}`, request.url))
	}

	const redirectUrl = resolveRedirectUrl(
		qr.data,
		qr.ios_url,
		qr.android_url,
		os,
		{
			utm_source: qr.utm_source,
			utm_medium: qr.utm_medium,
			utm_campaign: qr.utm_campaign,
			utm_term: qr.utm_term,
			utm_content: qr.utm_content,
		},
		qr.schedule_rules,
		qr.country_rules,
		geo.country,
	)
	return NextResponse.redirect(redirectUrl)
}

const URL_TYPES = new Set(['url', 'payment'])

function isUrlType(qrType: string): boolean {
	return URL_TYPES.has(qrType)
}
