import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
	transpilePackages: [
		'@heroui/react',
		'@heroui/theme',
		'@heroui/system',
		'@react-aria/ssr',
		'@react-aria/utils',
		'@react-aria/interactions',
		'@react-stately/utils',
	],
	turbopack: {
		resolveAlias: {
			'next-intl/config': './src/i18n/request.ts',
		},
	},
	images: {
		remotePatterns: [
			{ protocol: 'https', hostname: 'flagcdn.com' },
		],
	},
}

export default withNextIntl(nextConfig)
