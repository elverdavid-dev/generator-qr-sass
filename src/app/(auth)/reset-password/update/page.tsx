import { getTranslations } from 'next-intl/server'
import UpdatePasswordForm from './update-password-form'

const UpdatePasswordPage = async () => {
	const t = await getTranslations('auth.updatePassword')

	return (
		<UpdatePasswordForm
			translations={{
				title: t('title'),
				subtitle: t('subtitle'),
				password: t('password'),
				confirm: t('confirm'),
				submit: t('submit'),
				loading: t('loading'),
				success: t('success'),
				mismatch: t('mismatch'),
				passwordMin: t('passwordMin'),
				backToLogin: t('backToLogin'),
			}}
		/>
	)
}

export default UpdatePasswordPage
