import type { Metadata } from 'next'
import '@/app/globals.css'
import Providers from '@/app/providers'
import { generateMetadata } from '@/shared/utils/generate-metadata'
import { getLocale } from 'next-intl/server'
import '@fontsource-variable/manrope'

export const metadata: Metadata = generateMetadata({
	title: 'QR Generator',
	description: 'QR Generator',
})

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
