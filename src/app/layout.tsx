import type { Metadata } from 'next'
import '@/app/globals.css'
import { getLocale } from 'next-intl/server'
import Providers from '@/app/providers'
import '@fontsource-variable/manrope'

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: {
		template: '%s | QR Generator',
		default: 'QR Generator — Crea y rastrea códigos QR profesionales',
	},
	description:
		'Genera, personaliza y rastrea códigos QR dinámicos en segundos. Analytics en tiempo real, redirecciones condicionales y diseños impresionantes.',
	applicationName: 'QR Generator',
	authors: [{ name: 'QR Generator' }],
	creator: 'QR Generator',
	publisher: 'QR Generator',
	robots: {
		index: true,
		follow: true,
		googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
	},
	openGraph: {
		type: 'website',
		locale: 'es_ES',
		alternateLocale: ['en_US'],
		siteName: 'QR Generator',
		url: siteUrl,
		title: 'QR Generator — Crea y rastrea códigos QR profesionales',
		description:
			'Genera, personaliza y rastrea códigos QR dinámicos en segundos. Analytics en tiempo real, redirecciones condicionales y diseños impresionantes.',
		images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'QR Generator' }],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'QR Generator — Crea y rastrea códigos QR profesionales',
		description:
			'Genera, personaliza y rastrea códigos QR dinámicos en segundos. Analytics en tiempo real, redirecciones condicionales.',
		images: ['/og-image.png'],
	},
	keywords: [
		'QR code generator',
		'generador de códigos QR',
		'QR dinámico',
		'dynamic QR code',
		'QR analytics',
		'crear código QR',
		'QR personalizado',
		'QR con logo',
		'rastrear QR',
	],
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const locale = await getLocale()

	return (
		<html lang={locale} suppressHydrationWarning>
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
