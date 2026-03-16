import { NextResponse } from 'next/server'
import { getSession } from '@/shared/lib/supabase/get-session'
import { createClient } from '@/shared/lib/supabase/server'

export async function GET(request: Request) {
	const { data: session } = await getSession()
	if (!session?.user) {
		return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
	}

	const { searchParams } = new URL(request.url)
	const qrId = searchParams.get('qrId')

	const supabase = await createClient()

	let query = supabase
		.from('qr_scans')
		.select('created_at, os, device_type, browser, country, region, city, is_unique_scan, qrs(name)')
		.eq('user_id', session.user.id)
		.order('created_at', { ascending: false })

	if (qrId) {
		query = query.eq('qr_id', qrId)
	}

	const { data: scans, error } = await query

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 })
	}

	const headers = ['Date', 'QR Name', 'Country', 'Region', 'City', 'OS', 'Browser', 'Device', 'Unique']
	const rows = (scans ?? []).map((s) => {
		const qrName = (s.qrs as { name: string } | null)?.name ?? ''
		return [
			new Date(s.created_at).toISOString(),
			`"${qrName.replace(/"/g, '""')}"`,
			s.country ?? '',
			s.region ?? '',
			s.city ?? '',
			s.os ?? '',
			s.browser ?? '',
			s.device_type ?? '',
			s.is_unique_scan ? '1' : '0',
		].join(',')
	})

	const csv = [headers.join(','), ...rows].join('\n')
	const filename = qrId ? `qr-analytics-${qrId}.csv` : 'analytics-export.csv'

	return new Response(csv, {
		headers: {
			'Content-Type': 'text/csv; charset=utf-8',
			'Content-Disposition': `attachment; filename="${filename}"`,
		},
	})
}
