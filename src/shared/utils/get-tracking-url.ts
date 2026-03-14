export const getTrackingUrl = (qrSlug: string) => {
	const base =
		process.env.NEXT_PUBLIC_TRACKING_URL ??
		`${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/api/t`
	return `${base}/${qrSlug}`
}
