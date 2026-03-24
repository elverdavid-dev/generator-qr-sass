'use client'

import {
	FingerPrintScanIcon,
	GlobalIcon,
	QrCodeIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { motion } from 'framer-motion'

const QrDots = () => {
	const rows = [
		[1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1],
		[1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
		[1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1],
		[1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
		[1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1],
		[1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1],
		[1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
		[0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0],
		[0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1],
		[1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0],
		[0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1],
		[1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0],
		[1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1],
		[1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0],
		[1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1],
		[1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0],
		[1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0],
		[1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1],
	]
	return (
		<div className="p-3 bg-white rounded-xl shadow-sm inline-block">
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(21, 7px)',
					gap: '1px',
				}}
			>
				{rows.map((row, ri) =>
					row.map((cell, ci) => (
						<div
							// biome-ignore lint/suspicious/noArrayIndexKey: static decorative pattern
							key={`${ri}-${ci}`}
							style={{
								width: 7,
								height: 7,
								borderRadius: 1,
								background: cell ? '#18181b' : 'transparent',
							}}
						/>
					)),
				)}
			</div>
		</div>
	)
}

export function HeroCard() {
	return (
		<div className="relative flex justify-center lg:justify-end pt-6 pb-6 lg:pt-0 lg:pb-0">
			{/* Main floating card */}
			<motion.div
				className="relative bg-content1 border border-divider rounded-3xl p-6 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.12)] w-full max-w-[295px]"
				animate={{ y: [0, -10, 0] }}
				transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
			>
				{/* Card header */}
				<div className="flex items-center gap-3 mb-4">
					<div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
						<HugeiconsIcon icon={QrCodeIcon} size={17} className="text-primary" />
					</div>
					<div className="min-w-0">
						<p className="text-sm font-semibold text-foreground truncate">
							mi-sitio-web.com
						</p>
						<p className="text-xs text-default-400">QR Dinámico</p>
					</div>
					<motion.div
						className="ml-auto w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0"
						animate={{ scale: [1, 1.35, 1], opacity: [1, 0.6, 1] }}
						transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
					/>
				</div>

				<div className="flex justify-center mb-4">
					<QrDots />
				</div>

				<div className="grid grid-cols-3 gap-2 text-center">
					<div className="bg-default-100 rounded-xl py-2 px-1">
						<p className="text-sm font-bold text-foreground">1,284</p>
						<p className="text-[10px] text-default-400">Escaneos</p>
					</div>
					<div className="bg-default-100 rounded-xl py-2 px-1">
						<p className="text-sm font-bold text-foreground">38</p>
						<p className="text-[10px] text-default-400">Países</p>
					</div>
					<div className="bg-default-100 rounded-xl py-2 px-1">
						<p className="text-sm font-bold text-foreground">99.9%</p>
						<p className="text-[10px] text-default-400">Uptime</p>
					</div>
				</div>
			</motion.div>

			{/* Floating badge — top right */}
			<motion.div
				className="absolute top-0 right-4 lg:-right-4 bg-content1 border border-divider rounded-2xl px-3 py-2 shadow-md flex items-center gap-2"
				initial={{ opacity: 0, scale: 0.8, y: 10 }}
				animate={{ opacity: 1, scale: 1, y: 0 }}
				transition={{
					delay: 0.5,
					type: 'spring',
					stiffness: 200,
					damping: 20,
				}}
			>
				<div className="w-6 h-6 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0">
					<HugeiconsIcon
						icon={GlobalIcon}
						size={12}
						className="text-emerald-500"
					/>
				</div>
				<div>
					<p className="text-xs font-bold text-foreground">+38 países</p>
					<p className="text-[10px] text-default-400">esta semana</p>
				</div>
			</motion.div>

			{/* Floating badge — bottom left */}
			<motion.div
				className="absolute bottom-0 left-4 lg:-left-4 bg-content1 border border-divider rounded-2xl px-3 py-2 shadow-md flex items-center gap-2"
				initial={{ opacity: 0, scale: 0.8, y: -10 }}
				animate={{ opacity: 1, scale: 1, y: 0 }}
				transition={{
					delay: 0.8,
					type: 'spring',
					stiffness: 200,
					damping: 20,
				}}
			>
				<div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
					<HugeiconsIcon
						icon={FingerPrintScanIcon}
						size={12}
						className="text-primary"
					/>
				</div>
				<div>
					<p className="text-xs font-bold text-foreground">+47 escaneos</p>
					<p className="text-[10px] text-default-400">última hora</p>
				</div>
			</motion.div>
		</div>
	)
}
