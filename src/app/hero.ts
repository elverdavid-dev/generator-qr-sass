// hero.ts
import { heroui } from '@heroui/react'
export default heroui({
	themes: {
		light: {
			colors: {
				background: {
					DEFAULT: '#f9fafb',
					foreground: '#1e2939',
				},
				content1: {
					DEFAULT: '#ffffff',
					foreground: '#1e2939',
				},
				divider: {
					DEFAULT: '#e9ecef',
				},
				primary: {
					DEFAULT: '#465fff',
					foreground: '#ffffff',
				},
			},
		},
		dark: {
			colors: {
				background: {
					DEFAULT: '#0d1117',
					foreground: '#e2e8f0',
				},
				content1: {
					DEFAULT: '#161b22',
					foreground: '#e2e8f0',
				},
				content2: {
					DEFAULT: '#1c2128',
					foreground: '#cdd9e5',
				},
				divider: {
					DEFAULT: '#2d333b',
				},
				default: {
					50: '#0d1117',
					100: '#161b22',
					200: '#1c2128',
					300: '#7a8899',
					400: '#8d9db0',
					500: '#a2b0bf',
					600: '#b8c4cf',
					700: '#cdd9e5',
					800: '#dde7ef',
					900: '#eef3f8',
					foreground: '#e2e8f0',
					DEFAULT: '#8d9db0',
				},
				primary: {
					DEFAULT: '#7c8dff',
					foreground: '#ffffff',
				},
			},
		},
	},
})
