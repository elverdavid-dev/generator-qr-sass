'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
	type AuthFormData,
	authFormDataSchema,
} from '@/features/auth/schema/auth-form-data'
import { loginService } from '@/features/auth/services/login'

export const useLogin = () => {
	const [isLoading, startTransition] = useTransition()
	//form
	const form = useForm<AuthFormData>({
		resolver: zodResolver(authFormDataSchema),
	})

	const onSubmit = (formData: AuthFormData) => {
		startTransition(async () => {
			const { error } = await loginService(formData)
			if (error) {
				toast.error(error)
				return
			}
			toast.success('Inicio de sesión exitoso')
			form.reset()
			const next = new URLSearchParams(window.location.search).get('next')
			window.location.href = next ?? '/dashboard/qrs'
		})
	}
	return {
		form,
		onSubmit,
		isLoading,
	}
}
