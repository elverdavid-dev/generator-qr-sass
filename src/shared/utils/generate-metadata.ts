import type { Metadata } from 'next'

interface Props {
	title: string
	description?: string
	canonicalUrl?: string
	ogImg?: string
	noIndex?: boolean
}

const siteName = 'QR Generator'
const descriptionDefault =
	'Genera, personaliza y rastrea códigos QR dinámicos en segundos. Analytics en tiempo real, redirecciones condicionales y diseños impresionantes.'

export const generateMetadata = ({
	title,
	description,
	ogImg,
	canonicalUrl,
	noIndex = false,
}: Props): Metadata => {
	const desc = description ?? descriptionDefault
	const image = ogImg ?? '/og-image.png'

	return {
		title,
		description: desc,
		...(canonicalUrl && { alternates: { canonical: canonicalUrl } }),
		robots: noIndex
			? { index: false, follow: false }
			: {
					index: true,
					follow: true,
					googleBot: {
						index: true,
						follow: true,
						'max-image-preview': 'large',
					},
				},
		openGraph: {
			title: `${title} | ${siteName}`,
			description: desc,
			siteName,
			images: [{ url: image, width: 1200, height: 630, alt: title }],
			locale: 'es_ES',
			type: 'website',
			...(canonicalUrl && { url: canonicalUrl }),
		},
		twitter: {
			card: 'summary_large_image',
			title: `${title} | ${siteName}`,
			description: desc,
			images: [image],
		},
	}
}
