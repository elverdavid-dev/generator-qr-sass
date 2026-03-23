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
	frameText = 'ESCANÉAME',
	logoUrl,
	className,
}: Props) => {
	const containerRef = useRef<HTMLDivElement>(null)
	// biome-ignore lint/suspicious/noExplicitAny: qr-code-styling instance
	const instanceRef = useRef<any>(null)

	const hasFrame = frameStyle && frameStyle !== 'none'

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

	if (hasFrame) {
		const borderWidth = frameStyle === 'bold' ? 8 : 4
		const borderRadius =
			frameStyle === 'rounded' ? '16px' : frameStyle === 'bold' ? '10px' : '4px'

		return (
			<div
				className={className}
				style={{
					display: 'inline-flex',
					flexDirection: 'column',
					alignItems: 'center',
					backgroundColor: frameColor,
					border: `${borderWidth}px solid ${frameColor}`,
					borderRadius,
					padding: '10px 10px 6px',
					gap: '6px',
					flexShrink: 0,
				}}
			>
				<div
					ref={containerRef}
					style={{
						width: size,
						height: size,
						lineHeight: 0,
						fontSize: 0,
						flexShrink: 0,
					}}
				/>
				<span
					style={{
						color: '#ffffff',
						fontSize: '11px',
						fontWeight: 700,
						letterSpacing: '1.5px',
						textTransform: 'uppercase',
						whiteSpace: 'nowrap',
					}}
				>
					{frameText || 'ESCANÉAME'}
				</span>
			</div>
		)
	}

	return (
		<div
			ref={containerRef}
			className={className}
			style={{
				width: size,
				height: size,
				flexShrink: 0,
				lineHeight: 0,
				fontSize: 0,
			}}
		/>
	)
}

export default QrPreview
