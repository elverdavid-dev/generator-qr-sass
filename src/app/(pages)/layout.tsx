import type { PropsWithChildren } from 'react'
import Header from '@/shared/components/layout/header'

const Layout = ({ children }: PropsWithChildren) => {
	return (
		<main>
			<Header />
			<section className="container mx-auto">{children}</section>
		</main>
	)
}

export default Layout
