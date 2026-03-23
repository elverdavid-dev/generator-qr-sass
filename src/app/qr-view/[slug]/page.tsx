import { notFound } from 'next/navigation'
import { createClient } from '@/shared/lib/supabase/server'

interface Props {
	params: Promise<{ slug: string }>
}

const LABELS: Record<string, string> = {
	text: 'Mensaje',
	email: 'Correo electrónico',
	phone: 'Teléfono',
	wifi: 'Red WiFi',
	vcard: 'Contacto',
	location: 'Ubicación',
	event: 'Evento',
}

const QrViewPage = async ({ params }: Props) => {
	const { slug } = await params
	const supabase = await createClient()

	const { data: qr } = await supabase
		.from('qrs')
		.select('name, qr_type, data, is_active')
		.eq('slug', slug)
		.single()

	if (!qr || !qr.is_active) notFound()

	const label = LABELS[qr.qr_type] ?? 'Contenido'

	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<div className="w-full max-w-sm bg-content1 border border-divider rounded-2xl p-8 shadow-md flex flex-col gap-5">
				<div className="flex flex-col gap-1">
					<span className="text-xs text-default-400 uppercase tracking-wide">
						{label}
					</span>
					<h1 className="text-xl font-bold capitalize">{qr.name}</h1>
				</div>

				<div className="bg-content2 rounded-xl p-4">
					{qr.qr_type === 'email' ? (
						<a
							href={`mailto:${qr.data}`}
							className="text-primary underline break-all text-sm"
						>
							{qr.data}
						</a>
					) : qr.qr_type === 'phone' ? (
						<a
							href={`tel:${qr.data}`}
							className="text-primary underline text-sm"
						>
							{qr.data}
						</a>
					) : qr.qr_type === 'location' ? (
						<a
							href={`https://maps.google.com/?q=${encodeURIComponent(qr.data)}`}
							target="_blank"
							rel="noopener noreferrer"
							className="text-primary underline text-sm"
						>
							Ver en mapa
						</a>
					) : (
						<pre className="text-sm text-default-700 whitespace-pre-wrap break-all font-sans">
							{qr.data}
						</pre>
					)}
				</div>
			</div>
		</div>
	)
}

export default QrViewPage
