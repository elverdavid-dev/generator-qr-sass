'use client'

import { Input, type InputProps } from '@heroui/react'
import {
	SquareLockPasswordIcon,
	ViewIcon,
	ViewOffSlashIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { type FC, useState } from 'react'

const InputPassword: FC<InputProps> = ({ ...props }) => {
	const [showPassword, setShowPassword] = useState(false)
	return (
		<Input
			type={showPassword ? 'text' : 'password'}
			size={props.size ?? 'lg'}
			labelPlacement={props.labelPlacement ?? 'outside'}
			placeholder={props.placeholder ?? 'Ingrese su contraseña'}
			variant={props.variant ?? 'bordered'}
			label={props.label ?? 'Contraseña'}
			startContent={
				<HugeiconsIcon
					icon={SquareLockPasswordIcon}
					className="text-gray-600 dark:text-gray-400"
				/>
			}
			{...props}
			endContent={
				<button type="button" onClick={() => setShowPassword(!showPassword)}>
					{showPassword ? (
						<HugeiconsIcon
							icon={ViewIcon}
							className="text-gray-600 dark:text-gray-400"
						/>
					) : (
						<HugeiconsIcon
							icon={ViewOffSlashIcon}
							className="text-gray-600 dark:text-gray-400"
						/>
					)}
				</button>
			}
		/>
	)
}

export default InputPassword
