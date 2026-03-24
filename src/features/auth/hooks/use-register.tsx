'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
	type AuthFormData,
	createAuthSchema,
} from '@/features/auth/schema/auth-form-data'
import { registerService } from '@/features/auth/services/register'

interface RegisterMessages {
	emailInvalid: string
	passwordMin: string
	registerSuccess: string
}

/**
 * Handles registration form state, validation and submission.
 * Pass translated messages from the parent server component.
 */
export const useRegister = (messages?: RegisterMessages) => {
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
			const { error } = await registerService(formData)
			if (error) {
				toast.error(error)
				return
			}
			toast.success(
				messages?.registerSuccess ??
					'Account created. Check your email to confirm it.',
			)
			form.reset()
			window.location.href = '/confirm-email'
		})
	}

	return { form, onSubmit, isLoading }
}
