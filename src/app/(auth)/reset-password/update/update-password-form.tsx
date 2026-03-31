'use client'

import { Button } from '@heroui/react'
import { ArrowLeft01Icon, LockPasswordIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { updatePassword } from '@/features/auth/services/mutations/update-password'
import InputPassword from '@/shared/components/input-password'

interface Translations {
	title: string
	subtitle: string
	password: string
	confirm: string
	submit: string
	loading: string
	success: string
	mismatch: string
	passwordMin: string
	backToLogin: string
}

interface Props {
	translations: Translations
}

const UpdatePasswordForm = ({ translations: t }: Props) => {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()

	const schema = z
		.object({
			password: z.string().min(6, t.passwordMin),
			confirm: z.string().min(6, t.passwordMin),
		})
		.refine((data) => data.password === data.confirm, {
			message: t.mismatch,
			path: ['confirm'],
		})

	type FormData = z.infer<typeof schema>

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
	})

	const onSubmit = (data: FormData) => {
		startTransition(async () => {
			const result = await updatePassword(data.password)
			if (result.error) {
				toast.error(result.error)
				return
			}
			toast.success(t.success)
			router.push('/dashboard')
		})
	}

	return (
		<div className="w-full max-w-105 bg-content1 border border-divider rounded-2xl p-8 shadow-sm">
			<div className="flex items-center gap-3 mb-6">
				<div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
					<HugeiconsIcon
						icon={LockPasswordIcon}
						size={20}
						className="text-primary"
					/>
				</div>
				<div>
					<h1 className="text-xl font-bold text-foreground tracking-tight">
						{t.title}
					</h1>
					<p className="text-xs text-default-500 mt-0.5">{t.subtitle}</p>
				</div>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
				<InputPassword
					{...register('password')}
					label={t.password}
					isInvalid={!!errors.password}
					errorMessage={errors.password?.message}
				/>
				<InputPassword
					{...register('confirm')}
					label={t.confirm}
					isInvalid={!!errors.confirm}
					errorMessage={errors.confirm?.message}
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

export default UpdatePasswordForm
