import { z } from 'zod'

export const authFormDataSchema = z.object({
	email: z.string().email({ message: 'El correo debe ser válido' }),
	password: z
		.string()
		.min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
})

export type AuthFormData = z.infer<typeof authFormDataSchema>
