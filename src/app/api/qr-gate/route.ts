import { type NextRequest, NextResponse } from 'next/server'
import { UAParser } from 'ua-parser-js'
import { getGeoLocation } from '@/features/tracking/services/get-geo-location'
import { saveScan } from '@/features/tracking/services/save-scan'
import { createAdminClient } from '@/shared/lib/supabase/admin'

export async function POST(request: NextRequest) {
	const { slug, password } = await request.json()

	if (!slug || !password) {
		return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
	}

	const supabase = createAdminClient()

	const { data: qr } = await supabase
		.from('qrs')
		.select(
			'id, user_id, data, qr_type, is_active, scan_count, expires_at, max_scans, password, ios_url, android_url',
		)
		.eq('slug', slug)
		.single()

	if (!qr || !qr.is_active) {
		return NextResponse.json({ error: 'QR no disponible' }, { status: 404 })
	}

	if (qr.expires_at && new Date(qr.expires_at) < new Date()) {
		return NextResponse.json({ error: 'Este QR ha expirado' }, { status: 410 })
	}

	if (qr.max_scans !== null && (qr.scan_count ?? 0) >= qr.max_scans) {
		return NextResponse.json(
			{ error: 'Este QR ha alcanzado su límite de escaneos' },
			{ status: 429 },
		)
	}

	if (qr.password !== password) {
		return NextResponse.json(
			{ error: 'Contraseña incorrecta' },
			{ status: 401 },
		)
	}

	// Tracking
	const forwardedFor = request.headers.get('x-forwarded-for')
	const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1'

	const userAgent = request.headers.get('user-agent') ?? ''
	const parser = new UAParser(userAgent)
	const browser = parser.getBrowser().name ?? 'Unknown'
	const os = parser.getOS().name ?? 'Unknown'
	const deviceType = parser.getDevice().type ?? 'Desktop'

	const geo = await getGeoLocation(ip)

	const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
	const { data: previousScan } = await supabase
		.from('qr_scans')
		.select('id')
		.eq('qr_id', qr.id)
		.eq('ip_address', ip)
		.gt('created_at', since)
		.maybeSingle()

	await supabase.rpc('increment_scan_count', { qr_id: qr.id })

	await saveScan({
		qr_id: qr.id,
		user_id: qr.user_id,
		ip_address: ip,
		browser,
		os,
		device_type: deviceType,
		is_unique_scan: !previousScan,
		...geo,
	})

	const urlTypes = new Set(['url', 'payment'])
	let redirectUrl: string

	if (!urlTypes.has(qr.qr_type)) {
		redirectUrl = `/qr-view/${slug}`
	} else {
		const osLower = os.toLowerCase()
		if (
			(osLower.includes('ios') ||
				osLower.includes('iphone') ||
				osLower.includes('ipad')) &&
			qr.ios_url
		) {
			redirectUrl = qr.ios_url
		} else if (osLower.includes('android') && qr.android_url) {
			redirectUrl = qr.android_url
		} else {
			redirectUrl = qr.data
		}
	}

	return NextResponse.json({ redirectUrl })
}
