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

const DownloadQrModal: FC<Props> = ({ isOpen, onOpenChange, onClose, qr }) => {
	const containerRef = useRef<HTMLDivElement>(null)
	// biome-ignore lint/suspicious/noExplicitAny: qr-code-styling instance
	const instanceRef = useRef<any>(null)

	useEffect(() => {
		if (!isOpen) return

		const options = {
			width: 280,
			height: 280,
			data: getTrackingUrl(qr.slug),
			dotsOptions: {
				type: (qr.dot_style ?? 'square') as 'square' | 'dots' | 'rounded' | 'classy' | 'classy-rounded' | 'extra-rounded',
				color: qr.fg_color,
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

		// requestAnimationFrame ensures the modal DOM is ready before appending
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

	const handleDownload = (ext: Format) => {
		instanceRef.current?.download({ name: qr.slug, extension: ext })
	}

	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
			<ModalContent>
				<ModalHeader>Descargar QR — {qr.name}</ModalHeader>
				<ModalBody className="flex items-center justify-center py-6">
					<div
						ref={containerRef}
						className="rounded-xl overflow-hidden"
						style={{ lineHeight: 0, fontSize: 0, width: 280, height: 280 }}
					/>
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
