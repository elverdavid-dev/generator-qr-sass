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
			.select('qr_id, os, device_type, browser, country, is_unique_scan, created_at')
			.eq('user_id', userId)
			.order('created_at', { ascending: false }),
		supabase
			.from('qrs')
			.select('id, name, scan_count, is_active, qr_type')
			.eq('user_id', userId),
	])

	if (scansResult.error) return { error: scansResult.error.message }
	if (qrsResult.error) return { error: qrsResult.error.message }

	const scans = scansResult.data
	const qrs = qrsResult.data

	const now = new Date()
	const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
	const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
	const startOfMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
	const startOfPrevWeek = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
	const startOfPrevMonth = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

	// Basic counts
	const totalScans = scans.length
	const uniqueScans = scans.filter((s) => s.is_unique_scan).length
	const totalQrs = qrs.length
	const activeQrs = qrs.filter((q) => q.is_active).length
	const inactiveQrs = totalQrs - activeQrs
	const totalScansAllTime = qrs.reduce((sum, q) => sum + (q.scan_count ?? 0), 0)
	const avgScansPerQr = totalQrs > 0 ? Math.round(totalScansAllTime / totalQrs) : 0
	const uniqueRate = totalScansAllTime > 0 ? Math.round((uniqueScans / totalScans) * 100) : 0

	// Time-based counts
	const todayScans = scans.filter((s) => new Date(s.created_at) >= startOfToday).length
	const weekScans = scans.filter((s) => new Date(s.created_at) >= startOfWeek).length
	const monthScans = scans.filter((s) => new Date(s.created_at) >= startOfMonth).length

	// Period comparisons (for % change badges)
	const prevWeekScans = scans.filter((s) => {
		const d = new Date(s.created_at)
		return d >= startOfPrevWeek && d < startOfWeek
	}).length
	const prevMonthScans = scans.filter((s) => {
		const d = new Date(s.created_at)
		return d >= startOfPrevMonth && d < startOfMonth
	}).length

	const weekChange =
		prevWeekScans > 0 ? Math.round(((weekScans - prevWeekScans) / prevWeekScans) * 100) : null
	const monthChange =
		prevMonthScans > 0 ? Math.round(((monthScans - prevMonthScans) / prevMonthScans) * 100) : null

	// Scans per day (last 30 days)
	const scansPerDayMap: Record<string, number> = {}
	for (let i = 29; i >= 0; i--) {
		const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)
		const key = d.toISOString().slice(0, 10)
		scansPerDayMap[key] = 0
	}
	for (const scan of scans) {
		const key = scan.created_at.slice(0, 10)
		if (key in scansPerDayMap) scansPerDayMap[key]++
	}
	const scansPerDay = Object.entries(scansPerDayMap).map(([date, count]) => ({ date, count }))

	// Scans per week (last 12 weeks)
	const scansPerWeekMap: Record<string, number> = {}
	for (let i = 11; i >= 0; i--) {
		const d = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000)
		d.setDate(d.getDate() - d.getDay() + 1)
		const key = d.toISOString().slice(0, 10)
		scansPerWeekMap[key] = 0
	}
	for (const scan of scans) {
		const d = new Date(scan.created_at)
		d.setDate(d.getDate() - d.getDay() + 1)
		const key = d.toISOString().slice(0, 10)
		if (key in scansPerWeekMap) scansPerWeekMap[key]++
	}
	const scansPerWeek = Object.entries(scansPerWeekMap).map(([date, count]) => ({ date, count }))

	// Scans per month (last 12 months)
	const scansPerMonthMap: Record<string, number> = {}
	for (let i = 11; i >= 0; i--) {
		const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
		const key = d.toISOString().slice(0, 7)
		scansPerMonthMap[key] = 0
	}
	for (const scan of scans) {
		const key = scan.created_at.slice(0, 7)
		if (key in scansPerMonthMap) scansPerMonthMap[key]++
	}
	const scansPerMonth = Object.entries(scansPerMonthMap).map(([date, count]) => ({ date, count }))

	// Scans by hour (0–23)
	const byHour = Array<number>(24).fill(0)
	for (const scan of scans) {
		const hour = new Date(scan.created_at).getHours()
		byHour[hour]++
	}

	// Group by OS, device, browser
	const groupBy = (key: 'os' | 'device_type' | 'browser') =>
		scans.reduce<Record<string, number>>((acc, s) => {
			acc[s[key]] = (acc[s[key]] ?? 0) + 1
			return acc
		}, {})

	const byOs = groupBy('os')
	const byDevice = groupBy('device_type')
	const byBrowser = groupBy('browser')

	// Top 10 countries
	const countryMap = scans.reduce<Record<string, number>>((acc, s) => {
		if (s.country) acc[s.country] = (acc[s.country] ?? 0) + 1
		return acc
	}, {})
	const byCountry = Object.entries(countryMap)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 10)
		.reduce<Record<string, number>>((acc, [k, v]) => {
			acc[k] = v
			return acc
		}, {})

	// QR type distribution (from qrs table)
	const byQrType = qrs.reduce<Record<string, number>>((acc, q) => {
		acc[q.qr_type] = (acc[q.qr_type] ?? 0) + 1
		return acc
	}, {})

	// Top 5 QRs by scan count
	const topQrs = [...qrs]
		.sort((a, b) => (b.scan_count ?? 0) - (a.scan_count ?? 0))
		.slice(0, 5)
		.map((q) => ({ name: q.name, scans: q.scan_count ?? 0 }))

	// Recent scans (last 10)
	const qrMap = new Map(qrs.map((q) => [q.id, q.name]))
	const recentScans = scans.slice(0, 10).map((s) => ({
		qrName: qrMap.get(s.qr_id) ?? 'Desconocido',
		os: s.os,
		browser: s.browser,
		device: s.device_type,
		country: s.country,
		isUnique: s.is_unique_scan,
		createdAt: s.created_at,
	}))

	return {
		data: {
			totalQrs,
			activeQrs,
			inactiveQrs,
			totalScans,
			uniqueScans,
			uniqueRate,
			totalScansAllTime,
			todayScans,
			weekScans,
			monthScans,
			avgScansPerQr,
			weekChange,
			monthChange,
			scansPerDay,
			scansPerWeek,
			scansPerMonth,
			byHour,
			byOs,
			byDevice,
			byBrowser,
			byCountry,
			byQrType,
			topQrs,
			recentScans,
		},
	}
}
