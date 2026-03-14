'use server'
import { createClient } from '@/shared/lib/supabase/server'
import { getSession } from '@/shared/lib/supabase/get-session'

export const getAnalytics = async () => {
	const { data: session } = await getSession()
	if (!session?.user) return { error: 'No autenticado' }

	const supabase = await createClient()
	const userId = session.user.id

	const [scansResult, qrsResult] = await Promise.all([
		supabase
			.from('qr_scans')
			.select('os, device_type, browser, is_unique_scan, created_at')
			.eq('user_id', userId)
			.order('created_at', { ascending: false }),
		supabase
			.from('qrs')
			.select('id, scan_count')
			.eq('user_id', userId),
	])

	if (scansResult.error) return { error: scansResult.error.message }
	if (qrsResult.error) return { error: qrsResult.error.message }

	const scans = scansResult.data
	const qrs = qrsResult.data

	const totalScans = scans.length
	const uniqueScans = scans.filter((s) => s.is_unique_scan).length
	const totalQrs = qrs.length

	// Group by OS
	const byOs = scans.reduce<Record<string, number>>((acc, s) => {
		acc[s.os] = (acc[s.os] ?? 0) + 1
		return acc
	}, {})

	// Group by device
	const byDevice = scans.reduce<Record<string, number>>((acc, s) => {
		acc[s.device_type] = (acc[s.device_type] ?? 0) + 1
		return acc
	}, {})

	// Group by browser
	const byBrowser = scans.reduce<Record<string, number>>((acc, s) => {
		acc[s.browser] = (acc[s.browser] ?? 0) + 1
		return acc
	}, {})

	return {
		data: {
			totalScans,
			uniqueScans,
			totalQrs,
			byOs,
			byDevice,
			byBrowser,
		},
	}
}
