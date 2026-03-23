'use server'
import { getSession } from '@/shared/lib/supabase/get-session'
import { createClient } from '@/shared/lib/supabase/server'

export const getQrAnalytics = async (qrId: string) => {
	const { data: session } = await getSession()
	if (!session?.user) return { error: 'No autenticado' }

	const supabase = await createClient()

	const { data: scans, error } = await supabase
		.from('qr_scans')
		.select('os, device_type, browser, country, is_unique_scan, created_at')
		.eq('qr_id', qrId)
		.eq('user_id', session.user.id)
		.order('created_at', { ascending: false })

	if (error) return { error: error.message }

	const now = new Date()
	const startOfToday = new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate(),
	)
	const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
	const startOfMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
	const startOfPrevWeek = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
	const startOfPrevMonth = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

	const totalScans = scans.length
	const uniqueScans = scans.filter((s) => s.is_unique_scan).length
	const uniqueRate =
		totalScans > 0 ? Math.round((uniqueScans / totalScans) * 100) : 0

	const todayScans = scans.filter(
		(s) => new Date(s.created_at) >= startOfToday,
	).length
	const weekScans = scans.filter(
		(s) => new Date(s.created_at) >= startOfWeek,
	).length
	const monthScans = scans.filter(
		(s) => new Date(s.created_at) >= startOfMonth,
	).length

	const prevWeekScans = scans.filter((s) => {
		const d = new Date(s.created_at)
		return d >= startOfPrevWeek && d < startOfWeek
	}).length
	const prevMonthScans = scans.filter((s) => {
		const d = new Date(s.created_at)
		return d >= startOfPrevMonth && d < startOfMonth
	}).length

	const weekChange =
		prevWeekScans > 0
			? Math.round(((weekScans - prevWeekScans) / prevWeekScans) * 100)
			: null
	const monthChange =
		prevMonthScans > 0
			? Math.round(((monthScans - prevMonthScans) / prevMonthScans) * 100)
			: null

	// Scans per day (last 30 days)
	const scansPerDayMap: Record<string, number> = {}
	for (let i = 29; i >= 0; i--) {
		const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)
		scansPerDayMap[d.toISOString().slice(0, 10)] = 0
	}
	for (const scan of scans) {
		const key = scan.created_at.slice(0, 10)
		if (key in scansPerDayMap) scansPerDayMap[key]++
	}
	const scansPerDay = Object.entries(scansPerDayMap).map(([date, count]) => ({
		date,
		count,
	}))

	// Scans per week (last 12 weeks)
	const scansPerWeekMap: Record<string, number> = {}
	for (let i = 11; i >= 0; i--) {
		const d = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000)
		d.setDate(d.getDate() - d.getDay() + 1)
		scansPerWeekMap[d.toISOString().slice(0, 10)] = 0
	}
	for (const scan of scans) {
		const d = new Date(scan.created_at)
		d.setDate(d.getDate() - d.getDay() + 1)
		const key = d.toISOString().slice(0, 10)
		if (key in scansPerWeekMap) scansPerWeekMap[key]++
	}
	const scansPerWeek = Object.entries(scansPerWeekMap).map(([date, count]) => ({
		date,
		count,
	}))

	// Scans per month (last 12 months)
	const scansPerMonthMap: Record<string, number> = {}
	for (let i = 11; i >= 0; i--) {
		const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
		scansPerMonthMap[d.toISOString().slice(0, 7)] = 0
	}
	for (const scan of scans) {
		const key = scan.created_at.slice(0, 7)
		if (key in scansPerMonthMap) scansPerMonthMap[key]++
	}
	const scansPerMonth = Object.entries(scansPerMonthMap).map(
		([date, count]) => ({ date, count }),
	)

	// By hour
	const byHour = Array<number>(24).fill(0)
	for (const scan of scans) {
		byHour[new Date(scan.created_at).getHours()]++
	}

	// Group by field
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

	// Recent scans (last 10)
	const recentScans = scans.slice(0, 10).map((s) => ({
		os: s.os,
		browser: s.browser,
		device: s.device_type,
		country: s.country,
		isUnique: s.is_unique_scan,
		createdAt: s.created_at,
	}))

	return {
		data: {
			totalScans,
			uniqueScans,
			uniqueRate,
			todayScans,
			weekScans,
			monthScans,
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
			recentScans,
		},
	}
}
