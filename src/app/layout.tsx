import type { Metadata } from 'next'
import '@/app/globals.css'
import { getLocale } from 'next-intl/server'
import Providers from '@/app/providers'
import '@fontsource-variable/manrope'

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

const META = {
	es: {
		title: 'QR Generator — Crea y rastrea códigos QR profesionales',
		description:
			'Genera, personaliza y rastrea códigos QR dinámicos en segundos. Analytics en tiempo real, redirecciones condicionales y diseños impresionantes.',
		ogLocale: 'es_ES' as const,
	},
	en: {
		title: 'QR Generator — Create and track professional QR codes',
		description:
			'Generate, customize and track dynamic QR codes in seconds. Real-time analytics, conditional redirects and stunning designs.',
		ogLocale: 'en_US' as const,
	},
}

/**
 * Root metadata is generated dynamically so the default title and description
 * match the user's active locale (es / en).
 */
export async function generateMetadata(): Promise<Metadata> {
	const locale = await getLocale()
	const m = META[locale as keyof typeof META] ?? META.en

	return {
		metadataBase: new URL(siteUrl),
		title: {
			template: '%s | QR Generator',
			default: m.title,
		},
		description: m.description,
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
			locale: m.ogLocale,
			alternateLocale: locale === 'es' ? ['en_US'] : ['es_ES'],
			siteName: 'QR Generator',
			url: siteUrl,
			title: m.title,
			description: m.description,
			images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'QR Generator' }],
		},
		twitter: {
			card: 'summary_large_image',
			title: m.title,
			description: m.description,
			images: ['/og-image.png'],
		},
		keywords: [
			'QR code generator',
			'generador de códigos QR',
			'dynamic QR code',
			'QR dinámico',
			'QR analytics',
			'QR personalizado',
			'QR con logo',
		],
	}
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
