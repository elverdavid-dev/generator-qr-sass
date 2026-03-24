import { z } from 'zod'

export interface AuthValidationMessages {
	emailInvalid: string
	passwordMin: string
}

/**
 * Factory that builds the auth schema with localised error messages.
 * Call this inside a component or hook that already has the translated strings.
 */
export const createAuthSchema = (m: AuthValidationMessages) =>
	z.object({
		email: z.string().email({ message: m.emailInvalid }),
		password: z.string().min(6, { message: m.passwordMin }),
	})

/** Fallback schema with English messages used where no locale context is available. */
export const authFormDataSchema = createAuthSchema({
	emailInvalid: 'Please enter a valid email address',
	passwordMin: 'Password must be at least 6 characters',
})

export type AuthFormData = z.infer<typeof authFormDataSchema>
