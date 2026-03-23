import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

const QrLimitPage = async () => {
	const t = await getTranslations('qrGate.limit')
	const tc = await getTranslations('common')
	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<div className="text-center max-w-sm flex flex-col items-center gap-4">
				<div className="w-16 h-16 bg-danger/10 rounded-2xl flex items-center justify-center">
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
						className="text-danger"
					>
						<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
						<line x1="12" x2="12" y1="9" y2="13" />
						<line x1="12" x2="12.01" y1="17" y2="17" />
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
export default QrLimitPage
