import { UAParser } from 'ua-parser-js'
import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/shared/lib/supabase/server'
import { getGeoLocation } from '@/features/tracking/services/get-geo-location'
import { saveScan } from '@/features/tracking/services/save-scan'

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ slug: string }> },
) {
	const { slug } = await params
	const supabase = await createClient()

	const forwardedFor = request.headers.get('x-forwarded-for')
	const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1'

	const userAgent = request.headers.get('user-agent') ?? ''
	const parser = new UAParser(userAgent)
	const browser = parser.getBrowser().name ?? 'Unknown'
	const os = parser.getOS().name ?? 'Unknown'
	const deviceType = parser.getDevice().type ?? 'Desktop'

	// Also check custom_slug
	const { data: qr, error } = await supabase
		.from('qrs')
		.select('id, user_id, data, qr_type, is_active, scan_count, expires_at, max_scans, password, ios_url, android_url, utm_source, utm_medium, utm_campaign, utm_term, utm_content')
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

	if (!isUrlType(qr.qr_type)) {
		return NextResponse.redirect(new URL(`/qr-view/${slug}`, request.url))
	}

	const redirectUrl = resolveRedirectUrl(qr.data, qr.ios_url, qr.android_url, os, {
		utm_source: qr.utm_source,
		utm_medium: qr.utm_medium,
		utm_campaign: qr.utm_campaign,
		utm_term: qr.utm_term,
		utm_content: qr.utm_content,
	})
	return NextResponse.redirect(redirectUrl)
}

const URL_TYPES = new Set(['url', 'payment'])

function isUrlType(qrType: string): boolean {
	return URL_TYPES.has(qrType)
}

interface UtmParams {
	utm_source?: string | null
	utm_medium?: string | null
	utm_campaign?: string | null
	utm_term?: string | null
	utm_content?: string | null
}

function resolveRedirectUrl(
	defaultUrl: string,
	iosUrl: string | null,
	androidUrl: string | null,
	os: string,
	utm: UtmParams = {},
): string {
	const osLower = os.toLowerCase()
	let base = defaultUrl
	if ((osLower.includes('ios') || osLower.includes('iphone') || osLower.includes('ipad')) && iosUrl) {
		base = iosUrl
	} else if (osLower.includes('android') && androidUrl) {
		base = androidUrl
	}

	// Append UTM params only for HTTP URLs
	try {
		const url = new URL(base)
		if (utm.utm_source) url.searchParams.set('utm_source', utm.utm_source)
		if (utm.utm_medium) url.searchParams.set('utm_medium', utm.utm_medium)
		if (utm.utm_campaign) url.searchParams.set('utm_campaign', utm.utm_campaign)
		if (utm.utm_term) url.searchParams.set('utm_term', utm.utm_term)
		if (utm.utm_content) url.searchParams.set('utm_content', utm.utm_content)
		return url.toString()
	} catch {
		return base
	}
}
