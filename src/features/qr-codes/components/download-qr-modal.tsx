'use client'

import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from '@heroui/react'
import { type FC, useEffect, useRef } from 'react'
import type { QrCode } from '@/shared/types/database.types'
import { getTrackingUrl } from '@/shared/utils/get-tracking-url'

const FORMATS = [
	{ label: 'PNG', ext: 'png' },
	{ label: 'SVG', ext: 'svg' },
	{ label: 'JPEG', ext: 'jpeg' },
	{ label: 'WEBP', ext: 'webp' },
] as const

type Format = (typeof FORMATS)[number]['ext']

interface Props {
	isOpen: boolean
	onOpenChange: VoidFunction
	onClose: VoidFunction
	qr: QrCode
}

function roundRect(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	w: number,
	h: number,
	r: number,
) {
	ctx.beginPath()
	ctx.moveTo(x + r, y)
	ctx.lineTo(x + w - r, y)
	ctx.quadraticCurveTo(x + w, y, x + w, y + r)
	ctx.lineTo(x + w, y + h - r)
	ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
	ctx.lineTo(x + r, y + h)
	ctx.quadraticCurveTo(x, y + h, x, y + h - r)
	ctx.lineTo(x, y + r)
	ctx.quadraticCurveTo(x, y, x + r, y)
	ctx.closePath()
}

const DownloadQrModal: FC<Props> = ({ isOpen, onOpenChange, onClose, qr }) => {
	const containerRef = useRef<HTMLDivElement>(null)
	// biome-ignore lint/suspicious/noExplicitAny: qr-code-styling instance
	const instanceRef = useRef<any>(null)

	const hasFrame = qr.frame_style && qr.frame_style !== 'none'

	const buildGradient = (color1: string, color2: string | null, type: string) => {
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
		if (!isOpen) return

		const gradient = buildGradient(qr.fg_color, qr.dot_color_2, qr.dot_gradient_type ?? 'linear')

		const options = {
			width: 280,
			height: 280,
			data: getTrackingUrl(qr.slug),
			dotsOptions: {
				type: (qr.dot_style ?? 'square') as
					| 'square'
					| 'dots'
					| 'rounded'
					| 'classy'
					| 'classy-rounded'
					| 'extra-rounded',
				color: qr.fg_color,
				gradient,
			},
			cornersSquareOptions: {
				type: (qr.corner_square_style ?? 'square') as 'square' | 'dot' | 'extra-rounded',
				color: qr.fg_color,
			},
			cornersDotOptions: {
				type: (qr.corner_dot_style ?? 'square') as 'square' | 'dot',
				color: qr.fg_color,
			},
			backgroundOptions: { color: qr.bg_color },
			image: qr.logo_url ?? undefined,
			imageOptions: { hideBackgroundDots: true, imageSize: 0.35, margin: 4 },
			qrOptions: { errorCorrectionLevel: 'H' as const },
		}

		requestAnimationFrame(() => {
			if (!containerRef.current) return

			if (!instanceRef.current) {
				import('qr-code-styling').then(({ default: QRCodeStyling }) => {
					instanceRef.current = new QRCodeStyling(options)
					if (containerRef.current) {
						containerRef.current.innerHTML = ''
						instanceRef.current.append(containerRef.current)
					}
				})
			} else {
				instanceRef.current.update(options)
			}
		})
	}, [isOpen, qr])

	const handleDownload = async (ext: Format) => {
		if (!instanceRef.current) return

		if (!hasFrame) {
			instanceRef.current.download({ name: qr.slug, extension: ext })
			return
		}

		// Frame download — composite canvas
		const qrCanvas = containerRef.current?.querySelector('canvas') as HTMLCanvasElement | null
		if (!qrCanvas) return

		const qrSize = 280
		const borderWidth = qr.frame_style === 'bold' ? 12 : 6
		const padding = 12
		const textAreaHeight = 40
		const totalWidth = qrSize + (borderWidth + padding) * 2
		const totalHeight = qrSize + (borderWidth + padding) * 2 + textAreaHeight
		const radius =
			qr.frame_style === 'rounded' ? 20 : qr.frame_style === 'bold' ? 12 : 4

		const canvas = document.createElement('canvas')
		canvas.width = totalWidth
		canvas.height = totalHeight
		const ctx = canvas.getContext('2d')
		if (!ctx) return

		// Frame background
		ctx.fillStyle = qr.frame_color ?? '#000000'
		roundRect(ctx, 0, 0, totalWidth, totalHeight, radius)
		ctx.fill()

		// QR background
		ctx.fillStyle = qr.bg_color ?? '#ffffff'
		ctx.fillRect(borderWidth + padding, borderWidth + padding, qrSize, qrSize)

		// Draw QR
		ctx.drawImage(qrCanvas, borderWidth + padding, borderWidth + padding, qrSize, qrSize)

		// Frame text
		ctx.fillStyle = '#ffffff'
		ctx.font = `bold ${qr.frame_style === 'bold' ? 14 : 12}px sans-serif`
		ctx.textAlign = 'center'
		ctx.textBaseline = 'middle'
		const textY = qrSize + (borderWidth + padding) * 2 + textAreaHeight / 2 - borderWidth / 2
		ctx.fillText(qr.frame_text ?? 'ESCANÉAME', totalWidth / 2, textY)

		// Download
		const mimeType = ext === 'svg' ? 'image/png' : `image/${ext}`
		const fileName = ext === 'svg' ? `${qr.slug}-frame.png` : `${qr.slug}-frame.${ext}`
		canvas.toBlob(
			(blob) => {
				if (!blob) return
				const url = URL.createObjectURL(blob)
				const a = document.createElement('a')
				a.href = url
				a.download = fileName
				document.body.appendChild(a)
				a.click()
				document.body.removeChild(a)
				URL.revokeObjectURL(url)
			},
			mimeType,
			0.95,
		)
	}

	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
			<ModalContent>
				<ModalHeader>Descargar QR — {qr.name}</ModalHeader>
				<ModalBody className="flex items-center justify-center py-6">
					{hasFrame ? (
						<div
							style={{
								display: 'inline-flex',
								flexDirection: 'column',
								alignItems: 'center',
								backgroundColor: qr.frame_color ?? '#000000',
								border: `${qr.frame_style === 'bold' ? 8 : 4}px solid ${qr.frame_color ?? '#000000'}`,
								borderRadius:
									qr.frame_style === 'rounded'
										? '16px'
										: qr.frame_style === 'bold'
											? '10px'
											: '4px',
								padding: '12px 12px 8px',
								gap: '8px',
							}}
						>
							<div
								ref={containerRef}
								style={{ lineHeight: 0, fontSize: 0, width: 280, height: 280 }}
							/>
							<span
								style={{
									color: '#ffffff',
									fontSize: '12px',
									fontWeight: 700,
									letterSpacing: '1.5px',
									textTransform: 'uppercase',
								}}
							>
								{qr.frame_text ?? 'ESCANÉAME'}
							</span>
						</div>
					) : (
						<div
							ref={containerRef}
							className="rounded-xl overflow-hidden"
							style={{ lineHeight: 0, fontSize: 0, width: 280, height: 280 }}
						/>
					)}
				</ModalBody>
				<ModalFooter className="flex-col gap-3">
					<div className="grid grid-cols-4 gap-2 w-full">
						{FORMATS.map(({ label, ext }) => (
							<Button
								key={ext}
								variant="flat"
								color="primary"
								onPress={() => handleDownload(ext)}
							>
								{label}
							</Button>
						))}
					</div>
					<Button variant="light" onPress={onClose} className="w-full">
						Cancelar
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}

export default DownloadQrModal
