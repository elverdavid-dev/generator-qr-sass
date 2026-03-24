import { getTranslations } from 'next-intl/server'
import RegisterForm from '@/features/auth/components/register-form'

const RegisterPage = async () => {
	const t = await getTranslations('auth.register')
	const tv = await getTranslations('auth.validation')

	return (
		<RegisterForm
			translations={{
				title: t('title'),
				subtitle: t('subtitle'),
				email: t('email'),
				submit: t('submit'),
				loading: t('loading'),
				hasAccount: t('hasAccount'),
				signIn: t('signIn'),
				orRegisterWith: t('orRegisterWith'),
				emailInvalid: tv('emailInvalid'),
				passwordMin: tv('passwordMin'),
				registerSuccess: tv('registerSuccess'),
			}}
		/>
	)
}

export default RegisterPage
