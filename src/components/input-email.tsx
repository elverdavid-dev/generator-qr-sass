import { Input, type InputProps } from '@heroui/react'
import { Mail02Icon } from 'hugeicons-react'
import type { FC } from 'react'

const InputEmail: FC<InputProps> = ({ ...props }) => {
	return (
		<Input
			placeholder="Ingrese su email"
			size="lg"
			variant="bordered"
			label="Email"
			labelPlacement="outside"
			startContent={<Mail02Icon className="text-gray-600 dark:text-gray-400" />}
			{...props}
		/>
	)
}

export default InputEmail
