import Link from 'next/link'

const QrNotFoundPage = () => (
	<div className="min-h-screen flex items-center justify-center p-4">
		<div className="text-center max-w-sm flex flex-col items-center gap-4">
			<div className="w-16 h-16 bg-default-100 rounded-2xl flex items-center justify-center">
				<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-default-400">
					<path d="M3 7V5a2 2 0 0 1 2-2h2" />
					<path d="M17 3h2a2 2 0 0 1 2 2v2" />
					<path d="M21 17v2a2 2 0 0 1-2 2h-2" />
					<path d="M7 21H5a2 2 0 0 1-2-2v-2" />
					<circle cx="12" cy="12" r="3" />
					<path d="m18 18-3-3" />
				</svg>
			</div>
			<div>
				<h1 className="text-2xl font-bold">QR no encontrado</h1>
				<p className="text-default-500 text-sm mt-2">
					Este código QR no existe o ha sido eliminado.
				</p>
			</div>
			<Link href="/" className="text-sm text-primary underline">
				Volver al inicio
			</Link>
		</div>
	</div>
)

export default QrNotFoundPage
