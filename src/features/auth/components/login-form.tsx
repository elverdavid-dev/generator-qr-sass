'use client'
import { Button } from '@heroui/react'
import Link from 'next/link'
import { Suspense } from 'react'
import GoogleLoginButton from '@/features/auth/components/google-login-button'
import GooglePlaceholderButton from '@/features/auth/components/google-placeholder-button'
import { useLogin } from '@/features/auth/hooks/use-login'
import InputEmail from '@/shared/components/input-email'
import InputPassword from '@/shared/components/input-password'

interface LoginTranslations {
	title: string
	subtitle: string
	email: string
	forgotPassword: string
	submit: string
	loading: string
	noAccount: string
	signUp: string
	orLoginWith: string
}

interface Props {
	translations: LoginTranslations
}

const LoginForm = ({ translations: t }: Props) => {
	const { form, onSubmit, isLoading } = useLogin()

	return (
		<section className="md:w-[460px] mx-auto mt-5 p-10">
			<h1 className="font-bold text-2xl">{t.title}</h1>
			<h2 className="text-gray-600 dark:text-gray-400 text-sm pb-10">
				{t.subtitle}
			</h2>
			<Suspense fallback={<GooglePlaceholderButton />}>
				<GoogleLoginButton />
			</Suspense>

			<div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 py-3">
				<div className="h-[1px] flex-1 bg-gray-300 dark:bg-gray-700" />
				<span>{t.orLoginWith}</span>
				<div className="h-[1px] flex-1 bg-gray-300 dark:bg-gray-700" />
			</div>

			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col gap-y-5"
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
				<Link
					href="/reset-password"
					className="w-full text-end underline text-sm"
				>
					{t.forgotPassword}
				</Link>
				<Button
					size="lg"
					fullWidth
					type="submit"
					color="primary"
					isLoading={isLoading}
				>
					{isLoading ? t.loading : t.submit}
				</Button>
			</form>
			<div className="py-5">
				<span>{t.noAccount} </span>
				<Link href="/register" className="underline text-primary font-medium">
					{t.signUp}
				</Link>
			</div>
		</section>
	)
}

export default LoginForm
