'use client'
import { Button } from '@heroui/react'
import Link from 'next/link'
import { Suspense } from 'react'
import InputEmail from '@/components/input-email'
import InputPassword from '@/components/input-password'
import GoogleLoginButton from '@/features/auth/components/google-login-button'
import GooglePlaceholderButton from '@/features/auth/components/google-placeholder-button'
import { useLogin } from '@/features/auth/hooks/use-login'

const LoginForm = () => {
	const { form, onSubmit, isLoading } = useLogin()
	return (
		<section className="md:w-[460px] mx-auto mt-5 p-10">
			<h1 className="font-bold text-2xl">Iniciar sesión</h1>
			<h2 className="text-gray-600 dark:text-gray-400 text-sm pb-10">
				Ingrese sus datos para iniciar sesión
			</h2>
			<Suspense fallback={<GooglePlaceholderButton />}>
				<GoogleLoginButton />
			</Suspense>

			{/* Divider  */}
			<div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 py-3">
				<div className="h-[1px] flex-1 bg-gray-300 dark:bg-gray-700" />
				<span>O iniciar sesión con</span>
				<div className="h-[1px] flex-1 bg-gray-300 dark:bg-gray-700" />
			</div>

			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col gap-y-5"
			>
				<InputEmail
					{...form.register('email')}
					label="Correo"
					isInvalid={!!form.formState.errors.email}
					errorMessage={form.formState.errors.email?.message}
				/>
				<InputPassword
					{...form.register('password')}
					isInvalid={!!form.formState.errors.password}
					errorMessage={form.formState.errors.password?.message}
				/>
				<Link
					href={'/reset-password'}
					className="w-full text-end underline text-sm"
				>
					¿Olvidaste tu contraseña?
				</Link>
				<Button
					size="lg"
					fullWidth
					type="submit"
					color="primary"
					isLoading={isLoading}
				>
					{isLoading ? 'Cargando...' : 'Iniciar sesión'}
				</Button>
			</form>
			<div className="py-5">
				<span>¿No tienes una cuenta? </span>
				<Link href="/register" className="underline text-primary font-medium">
					Regístrate
				</Link>
			</div>
		</section>
	)
}

export default LoginForm
