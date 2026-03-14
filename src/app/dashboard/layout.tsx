import NavbarDashboard from '@/shared/components/layout/dashboard/navbar-dashboard'
import Sidebar from '@/shared/components/layout/dashboard/sidebar'
import type { PropsWithChildren } from 'react'

const DashboardLayout = ({ children }: PropsWithChildren) => {
	return (
		<div className="flex h-screen w-screen overflow-hidden">
			<Sidebar />
			<div className="flex flex-col flex-1 min-w-0">
				<NavbarDashboard />
				<main className="flex-1 overflow-y-auto">
					<section className="container mx-auto px-6 py-2">
						{children}
					</section>
				</main>
			</div>
		</div>
	)
}

export default DashboardLayout
