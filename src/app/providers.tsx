'use client'
import { ProgressProvider } from '@bprogress/next/app'
import { HeroUIProvider } from '@heroui/react'
import { useRouter } from 'next/navigation'
import { ThemeProvider } from 'next-themes'
import type { FC, ReactNode } from 'react'
import { Toaster } from 'sonner'
import { LoaderProvider } from '@/shared/context/loader-context'

interface Props {
	children: ReactNode
}

const Providers: FC<Props> = ({ children }) => {
	const router = useRouter()
	return (
		<ThemeProvider attribute="class" defaultTheme="dark">
			<ProgressProvider
				height="4px"
				options={{ showSpinner: false }}
				shallowRouting
				color="#000"
			/>
			<Toaster
				toastOptions={{
					classNames: {
						toast:
							'dark:!bg-background dark:!text-foreground dark:!border dark:!border-gray-700',
					},
				}}
			/>
			<HeroUIProvider navigate={router.push}>
				<LoaderProvider>{children}</LoaderProvider>
			</HeroUIProvider>
		</ThemeProvider>
	)
}

export default Providers
