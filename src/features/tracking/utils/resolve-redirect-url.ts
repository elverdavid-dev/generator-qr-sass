interface UtmParams {
	utm_source?: string | null
	utm_medium?: string | null
	utm_campaign?: string | null
	utm_term?: string | null
	utm_content?: string | null
}

export function resolveRedirectUrl(
	defaultUrl: string,
	iosUrl: string | null,
	androidUrl: string | null,
	os: string,
	utm: UtmParams = {},
): string {
	const osLower = os.toLowerCase()
	let base = defaultUrl
	if (
		(osLower.includes('ios') ||
			osLower.includes('iphone') ||
			osLower.includes('ipad')) &&
		iosUrl
	) {
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
