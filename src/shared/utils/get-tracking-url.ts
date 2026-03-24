/**
 * Builds the full tracking/redirect URL for a given QR slug.
 *
 * By default resolves to `{NEXT_PUBLIC_BASE_URL}/api/t/{slug}`.
 * Set `NEXT_PUBLIC_TRACKING_URL` to use a custom domain
 * (e.g. `https://go.yourdomain.com`) — useful for branded short links.
 *
 * @param qrSlug - The QR code slug or custom slug.
 * @returns The full tracking URL that gets encoded into the QR image.
 */
export const getTrackingUrl = (qrSlug: string) => {
	const base =
		process.env.NEXT_PUBLIC_TRACKING_URL ??
		`${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/api/t`
	return `${base}/${qrSlug}`
}
