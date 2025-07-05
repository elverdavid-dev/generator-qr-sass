'use client'

import { Input, type InputProps } from '@heroui/react'
import {
	SquareLockPasswordIcon,
	ViewIcon,
	ViewOffSlashIcon,
} from 'hugeicons-react'
import { type FC, useState } from 'react'

const InputPassword: FC<InputProps> = ({ ...props }) => {
	const [showPassword, setShowPassword] = useState(false)
	return (
		<Input
			type={showPassword ? 'text' : 'password'}
			size={props.size ?? 'lg'}
			labelPlacement={props.labelPlacement ?? 'outside'}
			placeholder={props.placeholder ?? 'Ingrese su contraseña'}
			variant={props.variant ?? 'bordered'}
			label={props.label ?? 'Contraseña'}
			startContent={
				<SquareLockPasswordIcon className="text-gray-600 dark:text-gray-400" />
			}
			{...props}
			endContent={
				<button type="button" onClick={() => setShowPassword(!showPassword)}>
					{showPassword ? (
						<ViewIcon className="text-gray-600 dark:text-gray-400" />
					) : (
						<ViewOffSlashIcon className="text-gray-600 dark:text-gray-400" />
					)}
				</button>
			}
		/>
	)
}

export default InputPassword
