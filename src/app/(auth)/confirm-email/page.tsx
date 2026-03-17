import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

const ConfirmEmailPage = async () => {
	const t = await getTranslations('auth.confirmEmail')

	return (
		<section className="md:w-115 mx-auto mt-5 p-10 text-center">
			<h1 className="font-bold text-2xl pb-4">{t('title')}</h1>
			<p className="text-gray-600 dark:text-gray-400 text-sm pb-8">
				{t('message')}
			</p>
			<Link href="/login" className="underline text-primary text-sm font-medium">
				{t('backToLogin')}
			</Link>
		</section>
	)
}

export default ConfirmEmailPage
