'use client'

import { Spinner } from '@heroui/spinner'
import { AnimatePresence, motion } from 'framer-motion'
import type { FC } from 'react'

interface Props {
	isVisible: boolean
	message?: string
}

const FullScreenLoader: FC<Props> = ({ isVisible, message }) => {
	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					key="full-screen-loader"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.2 }}
					className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm"
				>
					<motion.div
						initial={{ scale: 0.9, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.9, opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="flex flex-col items-center gap-4 bg-content1 border border-divider rounded-2xl px-10 py-8 shadow-xl"
					>
						<Spinner size="lg" color="primary" />
						{message && (
							<p className="text-sm text-default-500 font-medium">{message}</p>
						)}
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}

export default FullScreenLoader
