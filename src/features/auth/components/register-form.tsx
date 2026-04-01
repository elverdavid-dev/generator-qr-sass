'use client'
import { Button } from '@heroui/react'
import Link from 'next/link'
import { Suspense } from 'react'
import GoogleLoginButton from '@/features/auth/components/google-login-button'
import GooglePlaceholderButton from '@/features/auth/components/google-placeholder-button'
import { useRegister } from '@/features/auth/hooks/use-register'
import InputEmail from '@/shared/components/input-email'
import InputPassword from '@/shared/components/input-password'

interface RegisterTranslations {
	title: string
	subtitle: string
	email: string
	submit: string
	loading: string
	hasAccount: string
	signIn: string
	orRegisterWith: string
	// Validation & toast messages
	emailInvalid: string
	passwordMin: string
	registerSuccess: string
}

interface Props {
	translations: RegisterTranslations
}

const RegisterForm = ({ translations: t }: Props) => {
	const { form, onSubmit, isLoading } = useRegister({
		emailInvalid: t.emailInvalid,
		passwordMin: t.passwordMin,
		registerSuccess: t.registerSuccess,
	})

	return (
		<div className="w-full max-w-105 bg-content1 border border-divider rounded-2xl p-8 shadow-sm">
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-foreground tracking-tight">
					{t.title}
				</h1>
				<p className="text-sm text-default-500 mt-1">{t.subtitle}</p>
			</div>

			<Suspense fallback={<GooglePlaceholderButton />}>
				<GoogleLoginButton />
			</Suspense>

			<div className="flex items-center gap-3 text-xs text-default-400 py-4">
				<div className="h-px flex-1 bg-divider" />
				<span>{t.orRegisterWith}</span>
				<div className="h-px flex-1 bg-divider" />
			</div>

			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col gap-4"
			>
				<InputEmail
					{...form.register('email')}
					label={t.email}
					isInvalid={!!form.formState.errors.email}
					errorMessage={form.formState.errors.email?.message}
				/>
				<InputPassword
					{...form.register('password')}
					isInvalid={!!form.formState.errors.password}
					errorMessage={form.formState.errors.password?.message}
				/>
				<Button
					size="lg"
					fullWidth
					type="submit"
					color="primary"
					isLoading={isLoading}
					className="mt-1 rounded-xl font-semibold"
				>
					{isLoading ? t.loading : t.submit}
				</Button>
			</form>

			<p className="text-sm text-default-500 text-center mt-6">
				{t.hasAccount}{' '}
				<Link
					href="/login"
					className="text-primary font-semibold hover:underline"
				>
					{t.signIn}
				</Link>
			</p>
		</div>
	)
}

export default RegisterForm
