/**
 * Resolves geographic information (country, region, city) from an IP address
 * using the ipinfo.io API.
 *
 * - Results are cached by Next.js for 24 hours (`next: { revalidate: 86400 }`).
 * - Returns `null` values for all fields on local IPs or when `IPINFO_TOKEN` is missing.
 * - Set `IPINFO_TOKEN` in env vars to enable geolocation in production.
 */
interface GeoLocation {
	country: string | null
	region: string | null
	city: string | null
}

const LOCAL_IPS = ['127.0.0.1', '::1', 'localhost']

export const getGeoLocation = async (ip: string): Promise<GeoLocation> => {
	const empty = { country: null, region: null, city: null }

	if (LOCAL_IPS.some((local) => ip.startsWith(local))) {
		return empty
	}

	try {
		const token = process.env.IPINFO_TOKEN
		const res = await fetch(`https://ipinfo.io/${ip}?token=${token}`, {
			next: { revalidate: 86400 }, // cache 24h
		})

		if (!res.ok) return empty

		const data = await res.json()
		return {
			country: data.country ?? null,
			region: data.region ?? null,
			city: data.city ?? null,
		}
	} catch {
		return empty
	}
}
