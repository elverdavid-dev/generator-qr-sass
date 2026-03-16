import { getTranslations } from 'next-intl/server'
import LoginForm from '@/features/auth/components/login-form'

const LoginPage = async () => {
	const t = await getTranslations('auth.login')

	return (
		<LoginForm
			translations={{
				title: t('title'),
				subtitle: t('subtitle'),
				email: t('email'),
				forgotPassword: t('forgotPassword'),
				submit: t('submit'),
				loading: t('loading'),
				noAccount: t('noAccount'),
				signUp: t('signUp'),
				orLoginWith: t('orLoginWith'),
			}}
		/>
	)
}

export default LoginPage
