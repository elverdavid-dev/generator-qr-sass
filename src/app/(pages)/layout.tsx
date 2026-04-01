import Link from 'next/link'
import type { PropsWithChildren } from 'react'
import Header from '@/shared/components/layout/header'

const Layout = ({ children }: PropsWithChildren) => {
	return (
		<>
			<Header />
			<main id="main-content" role="main" className="overflow-x-hidden">
				{children}
			</main>
			<footer aria-label="Pie de página" className="border-t border-default-200 mt-20">
				<div className="container mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-default-400">
					<span>© {new Date().getFullYear()} QR Generator. Todos los derechos reservados.</span>
					<nav aria-label="Enlaces legales" className="flex gap-6">
						<Link href="/terms" className="hover:text-default-600 transition-colors">
							Términos de Servicio
						</Link>
						<Link href="/privacy" className="hover:text-default-600 transition-colors">
							Política de Privacidad
						</Link>
					</nav>
				</div>
			</footer>
		</>
	)
}

export default Layout
