interface UtmParams {
	utm_source?: string | null
	utm_medium?: string | null
	utm_campaign?: string | null
	utm_term?: string | null
	utm_content?: string | null
}

export interface ScheduleRule {
	days: number[] // 0=Sun … 6=Sat
	from: string   // "HH:MM"
	to: string     // "HH:MM"
	url: string
}

export interface CountryRule {
	countries: string[] // ISO-2 codes e.g. ["MX","CO"]
	url: string
}

function timeToMinutes(hhmm: string): number {
	const [h, m] = hhmm.split(':').map(Number)
	return h * 60 + m
}

function matchSchedule(rules: ScheduleRule[]): string | null {
	const now = new Date()
	const day = now.getDay()
	const current = now.getHours() * 60 + now.getMinutes()

	for (const rule of rules) {
		if (!rule.days.includes(day)) continue
		const from = timeToMinutes(rule.from)
		const to = timeToMinutes(rule.to)
		// Support overnight ranges e.g. 22:00 → 06:00
		if (from <= to ? current >= from && current < to : current >= from || current < to) {
			return rule.url
		}
	}
	return null
}

function matchCountry(rules: CountryRule[], country: string): string | null {
	for (const rule of rules) {
		if (rule.countries.map((c) => c.toUpperCase()).includes(country.toUpperCase())) {
			return rule.url
		}
	}
	return null
}

function appendUtm(url: string, utm: UtmParams): string {
	try {
		const u = new URL(url)
		if (utm.utm_source) u.searchParams.set('utm_source', utm.utm_source)
		if (utm.utm_medium) u.searchParams.set('utm_medium', utm.utm_medium)
		if (utm.utm_campaign) u.searchParams.set('utm_campaign', utm.utm_campaign)
		if (utm.utm_term) u.searchParams.set('utm_term', utm.utm_term)
		if (utm.utm_content) u.searchParams.set('utm_content', utm.utm_content)
		return u.toString()
	} catch {
		return url
	}
}

export function resolveRedirectUrl(
	defaultUrl: string,
	iosUrl: string | null,
	androidUrl: string | null,
	os: string,
	utm: UtmParams = {},
	scheduleRules?: ScheduleRule[] | null,
	countryRules?: CountryRule[] | null,
	country?: string | null,
): string {
	// 1. Schedule rules (highest priority)
	if (scheduleRules?.length) {
		const match = matchSchedule(scheduleRules)
		if (match) return appendUtm(match, utm)
	}

	// 2. Country rules
	if (countryRules?.length && country) {
		const match = matchCountry(countryRules, country)
		if (match) return appendUtm(match, utm)
	}

	// 3. Device targeting (iOS / Android)
	const osLower = os.toLowerCase()
	let base = defaultUrl
	if (
		(osLower.includes('ios') || osLower.includes('iphone') || osLower.includes('ipad')) &&
		iosUrl
	) {
		base = iosUrl
	} else if (osLower.includes('android') && androidUrl) {
		base = androidUrl
	}

	return appendUtm(base, utm)
}
