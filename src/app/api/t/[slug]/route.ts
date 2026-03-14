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

	// 1. Get raw IP (use fallback for local dev)
	const forwardedFor = request.headers.get('x-forwarded-for')
	const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1'

	// 2. Parse user agent
	const userAgent = request.headers.get('user-agent') ?? ''
	const parser = new UAParser(userAgent)
	const browser = parser.getBrowser().name ?? 'Unknown'
	const os = parser.getOS().name ?? 'Unknown'
	const deviceType = parser.getDevice().type ?? 'Desktop'

	// 3. Fetch QR by slug
	const { data: qr, error } = await supabase
		.from('qrs')
		.select('id, user_id, data, is_active, scan_count')
		.eq('slug', slug)
		.single()

	if (error || !qr) {
		return NextResponse.redirect(
			new URL('/qr-not-found', request.url),
		)
	}

	if (!qr.is_active) {
		return NextResponse.redirect(
			new URL('/qr-inactive', request.url),
		)
	}

	// 4. Geolocation (non-blocking)
	const geo = await getGeoLocation(ip)

	// 5. Check if unique scan (same IP in last 24h)
	const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
	const { data: previousScan } = await supabase
		.from('qr_scans')
		.select('id')
		.eq('qr_id', qr.id)
		.eq('ip_address', ip)
		.gt('created_at', since)
		.maybeSingle()

	const isUniqueScan = !previousScan

	// 6. Increment scan count
	await supabase
		.from('qrs')
		.update({ scan_count: (qr.scan_count ?? 0) + 1 })
		.eq('id', qr.id)

	// 7. Save scan record
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

	// 8. Redirect to target URL
	return NextResponse.redirect(qr.data)
}
