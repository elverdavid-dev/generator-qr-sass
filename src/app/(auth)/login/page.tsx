import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import LoginForm from '@/features/auth/components/login-form'

export const metadata: Metadata = {
	alternates: { canonical: '/login' },
}

const LoginPage = async () => {
	const t = await getTranslations('auth.login')
	const tv = await getTranslations('auth.validation')

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
				emailInvalid: tv('emailInvalid'),
				passwordMin: tv('passwordMin'),
				loginSuccess: tv('loginSuccess'),
			}}
		/>
	)
}

export default LoginPage
