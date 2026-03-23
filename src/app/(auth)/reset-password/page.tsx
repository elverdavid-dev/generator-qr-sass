'use client'

import { Button } from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { resetPasswordService } from '@/features/auth/services/reset-password'
import InputEmail from '@/shared/components/input-email'

const schema = z.object({
	email: z.string().email('Ingresa un correo válido'),
})

type FormData = z.infer<typeof schema>

const ResetPasswordPage = () => {
	const [sent, setSent] = useState(false)
	const [isPending, startTransition] = useTransition()

	const form = useForm<FormData>({
		resolver: zodResolver(schema),
	})

	const onSubmit = (data: FormData) => {
		startTransition(async () => {
			await resetPasswordService(data.email)
			setSent(true)
		})
	}

	if (sent) {
		return (
			<section className="md:w-115 mx-auto mt-5 p-10 text-center">
				<h1 className="font-bold text-2xl pb-4">
					Revisa tu correo electrónico
				</h1>
				<p className="text-gray-600 dark:text-gray-400 text-sm pb-8">
					Te hemos enviado un enlace para restablecer tu contraseña. Revisa tu
					bandeja de entrada.
				</p>
				<Link
					href="/login"
					className="underline text-primary text-sm font-medium"
				>
					Volver al inicio de sesión
				</Link>
			</section>
		)
	}

	return (
		<section className="md:w-115 mx-auto mt-5 p-10">
			<h1 className="font-bold text-2xl">Restablecer contraseña</h1>
			<h2 className="text-gray-600 dark:text-gray-400 text-sm pb-10">
				Te enviaremos un enlace para restablecer tu contraseña
			</h2>

			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col gap-y-5"
			>
				<InputEmail
					{...form.register('email')}
					label="Correo electrónico"
					isInvalid={!!form.formState.errors.email}
					errorMessage={form.formState.errors.email?.message}
				/>
				<Button
					size="lg"
					fullWidth
					type="submit"
					color="primary"
					isLoading={isPending}
				>
					{isPending ? 'Enviando...' : 'Enviar enlace'}
				</Button>
			</form>

			<div className="py-5">
				<Link
					href="/login"
					className="underline text-primary text-sm font-medium"
				>
					Volver al inicio de sesión
				</Link>
			</div>
		</section>
	)
}

export default ResetPasswordPage
