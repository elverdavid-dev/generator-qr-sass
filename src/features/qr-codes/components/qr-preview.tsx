'use client'

import { useEffect, useRef } from 'react'

type DotType = 'square' | 'dots' | 'rounded' | 'classy' | 'classy-rounded' | 'extra-rounded'
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
	logoUrl,
	className,
}: Props) => {
	const containerRef = useRef<HTMLDivElement>(null)
	// biome-ignore lint/suspicious/noExplicitAny: qr-code-styling instance
	const instanceRef = useRef<any>(null)

	useEffect(() => {
		const options = {
			width: size,
			height: size,
			data: value || 'preview',
			dotsOptions: {
				type: dotStyle as DotType,
				color: fgColor,
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
	}, [value, fgColor, bgColor, dotStyle, cornerSquareStyle, cornerDotStyle, logoUrl, size])

	return (
		<div
			ref={containerRef}
			className={className}
			style={{ width: size, height: size, flexShrink: 0, lineHeight: 0, fontSize: 0 }}
		/>
	)
}

export default QrPreview
