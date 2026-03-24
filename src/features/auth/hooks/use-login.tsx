'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
	type AuthFormData,
	createAuthSchema,
} from '@/features/auth/schema/auth-form-data'
import { loginService } from '@/features/auth/services/login'

interface LoginMessages {
	emailInvalid: string
	passwordMin: string
	loginSuccess: string
}

/**
 * Handles login form state, validation and submission.
 * Pass translated messages from the parent server component.
 */
export const useLogin = (messages?: LoginMessages) => {
	const [isLoading, startTransition] = useTransition()

	const schema = messages
		? createAuthSchema(messages)
		: createAuthSchema({
				emailInvalid: 'Please enter a valid email address',
				passwordMin: 'Password must be at least 6 characters',
			})

	const form = useForm<AuthFormData>({
		resolver: zodResolver(schema),
	})

	const onSubmit = (formData: AuthFormData) => {
		startTransition(async () => {
			const { error } = await loginService(formData)
			if (error) {
				toast.error(error)
				return
			}
			toast.success(messages?.loginSuccess ?? 'Signed in successfully')
			form.reset()
			const next = new URLSearchParams(window.location.search).get('next')
			window.location.href = next ?? '/dashboard/qrs'
		})
	}

	return { form, onSubmit, isLoading }
}
