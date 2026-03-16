import { notFound } from 'next/navigation'
import { createClient } from '@/shared/lib/supabase/server'
import PasswordGateForm from './password-gate-form'

interface Props {
	params: Promise<{ slug: string }>
}

const QrGatePage = async ({ params }: Props) => {
	const { slug } = await params
	const supabase = await createClient()

	const { data: qr } = await supabase
		.from('qrs')
		.select('name, slug, is_active')
		.eq('slug', slug)
		.single()

	if (!qr || !qr.is_active) notFound()

	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<div className="w-full max-w-sm bg-content1 border border-divider rounded-2xl p-8 shadow-md flex flex-col items-center gap-6">
				<div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="28"
						height="28"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="text-primary"
					>
						<rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
						<path d="M7 11V7a5 5 0 0 1 10 0v4" />
					</svg>
				</div>
				<div className="text-center">
					<h1 className="text-xl font-bold">QR protegido</h1>
					<p className="text-default-500 text-sm mt-1">
						<span className="font-medium text-default-700">{qr.name}</span> requiere una contraseña para acceder.
					</p>
				</div>
				<PasswordGateForm slug={slug} />
			</div>
		</div>
	)
}

export default QrGatePage
