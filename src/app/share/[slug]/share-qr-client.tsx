'use client'

import { Button } from '@heroui/button'
import { Tooltip } from '@heroui/tooltip'
import {
	CheckmarkCircle02Icon,
	Copy01Icon,
	Download04Icon,
	QrCodeIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useState } from 'react'
import { toast } from 'sonner'
import QrPreview from '@/features/qr-codes/components/qr-preview'
import Logo from '@/shared/components/logo'

interface QrData {
	name: string
	slug: string
	fg_color: string
	bg_color: string
	dot_style: string
	trackingUrl: string
}

interface ShareTranslations {
	createFree: string
	title: string
	scanToVisit: string
	downloadPng: string
	copied: string
	copyLink: string
	createdWith: string
	createYours: string
	linkCopied: string
}

export default function ShareQrClient({
	qr,
	translations: t,
}: {
	qr: QrData
	translations: ShareTranslations
}) {
	const [copied, setCopied] = useState(false)
	const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

	const handleCopyLink = async () => {
		await navigator.clipboard.writeText(shareUrl)
		setCopied(true)
		toast.success(t.linkCopied)
		setTimeout(() => setCopied(false), 2000)
	}

	const handleDownload = () => {
		const canvas = document.querySelector('canvas')
		if (!canvas) return
		const url = canvas.toDataURL('image/png')
		const a = document.createElement('a')
		a.href = url
		a.download = `${qr.slug}.png`
		a.click()
	}

	return (
		<div className="min-h-screen bg-background flex flex-col">
			{/* Header */}
			<header className="border-b border-divider px-6 py-3 flex items-center justify-between">
				<Logo />
				<Button
					as="a"
					href="/register"
					size="sm"
					color="primary"
					variant="flat"
				>
					{t.createFree}
				</Button>
			</header>

			{/* Main */}
			<main className="flex-1 flex items-center justify-center px-4 py-12">
				<div className="w-full max-w-sm flex flex-col items-center gap-6">
					{/* QR Card */}
					<div className="w-full bg-content1 border border-divider rounded-3xl p-8 flex flex-col items-center gap-5 shadow-lg">
						<div className="flex items-center gap-2 text-default-500">
							<HugeiconsIcon icon={QrCodeIcon} size={16} />
							<span className="text-sm font-medium">{t.title}</span>
						</div>

						<QrPreview
							value={qr.trackingUrl}
							size={220}
							fgColor={qr.fg_color}
							bgColor={qr.bg_color}
							dotStyle={qr.dot_style ?? 'square'}
							className="rounded-2xl overflow-hidden border border-divider shadow-sm"
						/>

						<div className="text-center">
							<h1 className="text-xl font-bold capitalize">{qr.name}</h1>
							<p className="text-sm text-default-400 mt-0.5">{t.scanToVisit}</p>
						</div>

						<div className="flex gap-2 w-full">
							<Button
								className="flex-1"
								variant="flat"
								color="primary"
								startContent={<HugeiconsIcon icon={Download04Icon} size={16} />}
								onPress={handleDownload}
							>
								{t.downloadPng}
							</Button>
							<Tooltip content={copied ? t.copied : t.copyLink}>
								<Button isIconOnly variant="flat" onPress={handleCopyLink}>
									<HugeiconsIcon
										icon={copied ? CheckmarkCircle02Icon : Copy01Icon}
										size={18}
										className={copied ? 'text-emerald-500' : ''}
									/>
								</Button>
							</Tooltip>
						</div>
					</div>

					{/* CTA */}
					<p className="text-xs text-default-400 text-center">
						{t.createdWith}{' '}
						<a href="/" className="text-primary hover:underline font-medium">
							QR Generator
						</a>{' '}
						— {t.createYours}
					</p>
				</div>
			</main>
		</div>
	)
}
