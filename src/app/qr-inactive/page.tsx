import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

const QrInactivePage = async () => {
	const t = await getTranslations('qrGate.inactive')
	const tc = await getTranslations('common')
	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<div className="text-center max-w-sm flex flex-col items-center gap-4">
				<div className="w-16 h-16 bg-default-100 rounded-2xl flex items-center justify-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="32"
						height="32"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="text-default-400"
					>
						<circle cx="12" cy="12" r="10" />
						<line x1="4.93" x2="19.07" y1="4.93" y2="19.07" />
					</svg>
				</div>
				<div>
					<h1 className="text-2xl font-bold">{t('title')}</h1>
					<p className="text-default-500 text-sm mt-2">{t('description')}</p>
				</div>
				<Link href="/" className="text-sm text-primary underline">
					{tc('backToHome')}
				</Link>
			</div>
		</div>
	)
}
export default QrInactivePage
