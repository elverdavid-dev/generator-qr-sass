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
				primary: {
					DEFAULT: '#465fff',
					foreground: '#d1d5dc',
				},
			},
		},
		dark: {
			colors: {
				background: {
					//DEFAULT: '#010409',
					DEFAULT: '#030712',
					foreground: '#d1d5dc',
				},
				primary: {
					DEFAULT: '#465fff',
					foreground: '#d1d5dc',
				},
			},
		},
	},
})
