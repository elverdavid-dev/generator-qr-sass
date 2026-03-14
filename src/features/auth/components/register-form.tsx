'use client'
import { Button } from '@heroui/react'
import Link from 'next/link'
import { Suspense } from 'react'
import InputEmail from '@/shared/components/input-email'
import InputPassword from '@/shared/components/input-password'
import GoogleLoginButton from '@/features/auth/components/google-login-button'
import GooglePlaceholderButton from '@/features/auth/components/google-placeholder-button'
import { useRegister } from '@/features/auth/hooks/use-register'

const RegisterForm = () => {
	const { form, onSubmit, isLoading } = useRegister()

	return (
		<section className="md:w-[460px] mx-auto mt-5 p-10">
			<h1 className="font-bold text-2xl">Crear cuenta</h1>
			<h2 className="text-gray-600 dark:text-gray-400 text-sm pb-10">
				Ingrese sus datos para registrarse
			</h2>

			<Suspense fallback={<GooglePlaceholderButton />}>
				<GoogleLoginButton />
			</Suspense>

			<div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 py-3">
				<div className="h-[1px] flex-1 bg-gray-300 dark:bg-gray-700" />
				<span>O registrarse con</span>
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
				<Button
					size="lg"
					fullWidth
					type="submit"
					color="primary"
					isLoading={isLoading}
				>
					{isLoading ? 'Cargando...' : 'Crear cuenta'}
				</Button>
			</form>

			<div className="py-5">
				<span>¿Ya tienes una cuenta? </span>
				<Link href="/login" className="underline text-primary font-medium">
					Inicia sesión
				</Link>
			</div>
		</section>
	)
}

export default RegisterForm
