import type { PropsWithChildren } from 'react'
import HeaderAuth from '@/features/auth/components/header-auth'

const layout = ({ children }: PropsWithChildren) => {
	return (
		<main>
			<HeaderAuth />
			<section className="container mx-auto">{children}</section>
		</main>
	)
}

export default layout
