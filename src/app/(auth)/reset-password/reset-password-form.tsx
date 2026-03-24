'use client'

import { Button } from '@heroui/react'
import {
	ArrowLeft01Icon,
	Mail01Icon,
	MailSend01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { resetPasswordService } from '@/features/auth/services/reset-password'
import InputEmail from '@/shared/components/input-email'

const schema = z.object({
	email: z.string().email('Ingresa un correo válido'),
})

type FormData = z.infer<typeof schema>

interface Translations {
	title: string
	subtitle: string
	email: string
	submit: string
	loading: string
	backToLogin: string
	successMessage: string
	successDesc: string
}

interface Props {
	translations: Translations
}

const ResetPasswordForm = ({ translations: t }: Props) => {
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
			<div className="w-full max-w-105 bg-content1 border border-divider rounded-2xl p-8 shadow-sm text-center flex flex-col items-center gap-5">
				<div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
					<HugeiconsIcon icon={MailSend01Icon} size={26} className="text-primary" />
				</div>
				<div>
					<h1 className="text-xl font-bold text-foreground tracking-tight">
						{t.successMessage}
					</h1>
					<p className="text-sm text-default-500 mt-2 leading-relaxed max-w-xs mx-auto">
						{t.successDesc}
					</p>
				</div>
				<Link
					href="/login"
					className="inline-flex items-center gap-1.5 text-sm text-primary font-semibold hover:underline"
				>
					<HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
					{t.backToLogin}
				</Link>
			</div>
		)
	}

	return (
		<div className="w-full max-w-105 bg-content1 border border-divider rounded-2xl p-8 shadow-sm">
			<div className="flex items-center gap-3 mb-6">
				<div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
					<HugeiconsIcon icon={Mail01Icon} size={20} className="text-primary" />
				</div>
				<div>
					<h1 className="text-xl font-bold text-foreground tracking-tight">
						{t.title}
					</h1>
					<p className="text-xs text-default-500 mt-0.5">
						{t.subtitle}
					</p>
				</div>
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
				<Button
					size="lg"
					fullWidth
					type="submit"
					color="primary"
					isLoading={isPending}
					className="rounded-xl font-semibold"
				>
					{isPending ? t.loading : t.submit}
				</Button>
			</form>

			<div className="mt-5 text-center">
				<Link
					href="/login"
					className="inline-flex items-center gap-1.5 text-sm text-default-400 hover:text-primary transition-colors"
				>
					<HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
					{t.backToLogin}
				</Link>
			</div>
		</div>
	)
}

export default ResetPasswordForm
