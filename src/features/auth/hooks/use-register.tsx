'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
	type AuthFormData,
	authFormDataSchema,
} from '@/features/auth/schema/auth-form-data'
import { registerService } from '@/features/auth/services/register'

export const useRegister = () => {
	const [isLoading, startTransition] = useTransition()

	const form = useForm<AuthFormData>({
		resolver: zodResolver(authFormDataSchema),
	})

	const onSubmit = (formData: AuthFormData) => {
		startTransition(async () => {
			const { error } = await registerService(formData)
			if (error) {
				toast.error(error)
				return
			}
			toast.success('Cuenta creada. Revisa tu correo para confirmarla.')
			form.reset()
			window.location.href = '/confirm-email'
		})
	}

	return { form, onSubmit, isLoading }
}
