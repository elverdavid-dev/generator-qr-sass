'use client'

import { motion } from 'framer-motion'
import type { PropsWithChildren } from 'react'

interface Props extends PropsWithChildren {
	delay?: number
	className?: string
	direction?: 'up' | 'left' | 'right'
}

export function ScrollReveal({
	children,
	delay = 0,
	className,
	direction = 'up',
}: Props) {
	const initial =
		direction === 'up'
			? { opacity: 0, y: 28 }
			: direction === 'left'
				? { opacity: 0, x: -28 }
				: { opacity: 0, x: 28 }

	const animate =
		direction === 'up'
			? { opacity: 1, y: 0 }
			: { opacity: 1, x: 0 }

	return (
		<motion.div
			className={className}
			initial={initial}
			whileInView={animate}
			viewport={{ once: true, margin: '-60px' }}
			transition={{
				duration: 0.55,
				delay,
				ease: [0.16, 1, 0.3, 1],
			}}
		>
			{children}
		</motion.div>
	)
}
