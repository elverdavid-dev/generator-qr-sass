import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
	plugins: [react(), tsconfigPaths()],
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./src/tests/setup.ts'],
		include: ['src/tests/**/*.test.{ts,tsx}'],
		pool: 'vmForks',
		isolate: false,
		coverage: {
			provider: 'v8',
			include: ['src/features/**', 'src/shared/**', 'src/app/api/**'],
			exclude: ['**/*.test.*', '**/node_modules/**'],
		},
	},
})
