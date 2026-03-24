import { ArrowLeft01Icon, MailAtSign01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

const ConfirmEmailPage = async () => {
	const t = await getTranslations('auth.confirmEmail')

	return (
		<div className="w-full max-w-105 bg-content1 border border-divider rounded-2xl p-8 shadow-sm text-center flex flex-col items-center gap-5">
			<div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
				<HugeiconsIcon
					icon={MailAtSign01Icon}
					size={26}
					className="text-primary"
				/>
			</div>

			<div>
				<h1 className="text-xl font-bold text-foreground tracking-tight">
					{t('title')}
				</h1>
				<p className="text-sm text-default-500 mt-2 leading-relaxed max-w-xs mx-auto">
					{t('message')}
				</p>
			</div>

			<Link
				href="/login"
				className="inline-flex items-center gap-1.5 text-sm text-primary font-semibold hover:underline"
			>
				<HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
				{t('backToLogin')}
			</Link>
		</div>
	)
}

export default ConfirmEmailPage
