'use client'

import { useEffect, useRef } from 'react'

type DotType =
	| 'square'
	| 'dots'
	| 'rounded'
	| 'classy'
	| 'classy-rounded'
	| 'extra-rounded'
type CornerSquareType = 'square' | 'dot' | 'extra-rounded'
type CornerDotType = 'square' | 'dot'

interface Props {
	value: string
	size?: number
	fgColor?: string
	bgColor?: string
	dotStyle?: string
	cornerSquareStyle?: string
	cornerDotStyle?: string
	dotColor2?: string | null
	dotGradientType?: string
	frameStyle?: string
	frameColor?: string
	frameText?: string
	logoUrl?: string | null
	className?: string
}

const buildGradient = (
	color1: string,
	color2: string | null | undefined,
	type: string,
) => {
	if (!color2) return undefined
	return {
		type: type as 'linear' | 'radial',
		rotation: 0,
		colorStops: [
			{ offset: 0, color: color1 },
			{ offset: 1, color: color2 },
		],
	}
}

const QrPreview = ({
	value,
	size = 200,
	fgColor = '#000000',
	bgColor = '#ffffff',
	dotStyle = 'square',
	cornerSquareStyle = 'square',
	cornerDotStyle = 'square',
	dotColor2,
	dotGradientType = 'linear',
	frameStyle = 'none',
	frameColor = '#000000',
	frameText = 'SCAN ME',
	logoUrl,
	className,
}: Props) => {
	const containerRef = useRef<HTMLDivElement>(null)
	// biome-ignore lint/suspicious/noExplicitAny: qr-code-styling instance
	const instanceRef = useRef<any>(null)

	const hasFrame = frameStyle && frameStyle !== 'none'

	useEffect(() => {
		const gradient = buildGradient(fgColor, dotColor2, dotGradientType)

		const options = {
			width: size,
			height: size,
			data: value || 'preview',
			dotsOptions: {
				type: dotStyle as DotType,
				color: fgColor,
				gradient,
			},
			cornersSquareOptions: {
				type: cornerSquareStyle as CornerSquareType,
				color: fgColor,
			},
			cornersDotOptions: {
				type: cornerDotStyle as CornerDotType,
				color: fgColor,
			},
			backgroundOptions: { color: bgColor },
			image: logoUrl ?? undefined,
			imageOptions: {
				hideBackgroundDots: true,
				imageSize: 0.35,
				margin: 4,
			},
			qrOptions: { errorCorrectionLevel: 'M' as const },
		}

		if (!instanceRef.current) {
			import('qr-code-styling').then(({ default: QRCodeStyling }) => {
				instanceRef.current = new QRCodeStyling(options)
				requestAnimationFrame(() => {
					if (containerRef.current) {
						containerRef.current.innerHTML = ''
						instanceRef.current.append(containerRef.current)
					}
				})
			})
		} else {
			instanceRef.current.update(options)
		}
	}, [
		value,
		fgColor,
		bgColor,
		dotStyle,
		cornerSquareStyle,
		cornerDotStyle,
		dotColor2,
		dotGradientType,
		logoUrl,
		size,
	])

	// Canvas wrapper — constrains the qr-code-styling canvas to exactly size×size
	const canvasWrapper = (
		<div
			style={{
				width: size,
				height: size,
				overflow: 'hidden',
				flexShrink: 0,
				display: 'block',
				lineHeight: 0,
				fontSize: 0,
			}}
		>
			<div ref={containerRef} style={{ lineHeight: 0, fontSize: 0 }} />
		</div>
	)

	if (hasFrame) {
		const label = frameText || 'SCAN ME'

		// ── Corner brackets ────────────────────────────────────────────────
		if (frameStyle === 'corners') {
			const pad = 10
			const bLen = 18
			const bW = 3
			const total = size + pad * 2

			return (
				<div
					className={className}
					style={{
						display: 'inline-flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: 8,
					}}
				>
					<div style={{ position: 'relative', padding: pad, display: 'inline-block' }}>
						{canvasWrapper}
						<svg
							aria-hidden="true"
						style={{
								position: 'absolute',
								inset: 0,
								width: total,
								height: total,
								pointerEvents: 'none',
							}}
							fill="none"
						>
							{/* Top-left */}
							<path
								d={`M ${pad} ${pad + bLen} L ${pad} ${pad} L ${pad + bLen} ${pad}`}
								stroke={frameColor}
								strokeWidth={bW}
								strokeLinecap="round"
							/>
							{/* Top-right */}
							<path
								d={`M ${total - pad - bLen} ${pad} L ${total - pad} ${pad} L ${total - pad} ${pad + bLen}`}
								stroke={frameColor}
								strokeWidth={bW}
								strokeLinecap="round"
							/>
							{/* Bottom-left */}
							<path
								d={`M ${pad} ${total - pad - bLen} L ${pad} ${total - pad} L ${pad + bLen} ${total - pad}`}
								stroke={frameColor}
								strokeWidth={bW}
								strokeLinecap="round"
							/>
							{/* Bottom-right */}
							<path
								d={`M ${total - pad - bLen} ${total - pad} L ${total - pad} ${total - pad} L ${total - pad} ${total - pad - bLen}`}
								stroke={frameColor}
								strokeWidth={bW}
								strokeLinecap="round"
							/>
						</svg>
					</div>
					<div
						style={{
							backgroundColor: frameColor,
							color: '#ffffff',
							fontSize: 10,
							fontWeight: 700,
							letterSpacing: '2px',
							textTransform: 'uppercase',
							padding: '4px 14px',
							borderRadius: 6,
						}}
					>
						{label}
					</div>
				</div>
			)
		}

		// ── Box frames (simple / rounded / bold) ──────────────────────────
		const isBold = frameStyle === 'bold'
		const isRounded = frameStyle === 'rounded'
		const borderW = isBold ? 6 : 3
		const outerRadius = isRounded ? 20 : isBold ? 12 : 6
		const innerRadius = isRounded ? 14 : isBold ? 8 : 2

		return (
			<div
				className={className}
				style={{
					display: 'inline-flex',
					flexDirection: 'column',
					alignItems: 'center',
					backgroundColor: frameColor,
					borderRadius: outerRadius,
					padding: borderW,
					gap: 0,
				}}
			>
				{/* QR area — white background, rounded inner */}
				<div
					style={{
						width: size,
						height: size,
						borderRadius: innerRadius,
						overflow: 'hidden',
						backgroundColor: bgColor,
						lineHeight: 0,
						fontSize: 0,
						flexShrink: 0,
					}}
				>
					{canvasWrapper}
				</div>
				{/* Label strip */}
				<div
					style={{
						width: '100%',
						textAlign: 'center',
						color: '#ffffff',
						fontSize: 11,
						fontWeight: 700,
						letterSpacing: '2px',
						textTransform: 'uppercase',
						padding: isBold ? '8px 0 6px' : '6px 0 4px',
					}}
				>
					{label}
				</div>
			</div>
		)
	}

	return (
		<div
			className={className}
			style={{
				width: size,
				height: size,
				flexShrink: 0,
				lineHeight: 0,
				fontSize: 0,
				overflow: 'hidden',
			}}
		>
			<div ref={containerRef} style={{ lineHeight: 0, fontSize: 0 }} />
		</div>
	)
}

export default QrPreview
