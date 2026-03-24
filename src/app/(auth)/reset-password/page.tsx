import { getTranslations } from 'next-intl/server'
import ResetPasswordForm from './reset-password-form'

const ResetPasswordPage = async () => {
	const t = await getTranslations('auth.resetPassword')

	return (
		<ResetPasswordForm
			translations={{
				title: t('title'),
				subtitle: t('subtitle'),
				email: t('email'),
				submit: t('submit'),
				loading: t('loading'),
				backToLogin: t('backToLogin'),
				successMessage: t('successMessage'),
				successDesc: t('successDesc'),
			}}
		/>
	)
}

export default ResetPasswordPage
