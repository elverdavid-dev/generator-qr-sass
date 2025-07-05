export const getTrackingUrl = (qrSlug: string) => {
	const trackingUrl = process.env.NEXT_PUBLIC_TRACKING_URL
	if (!trackingUrl) {
		throw new Error('NEXT_PUBLIC_TRACKING_URL is not defined')
	}
	return `${trackingUrl}/${qrSlug}`
}
