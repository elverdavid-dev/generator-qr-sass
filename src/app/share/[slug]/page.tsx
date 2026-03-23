import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/shared/lib/supabase/server'
import { getTrackingUrl } from '@/shared/utils/get-tracking-url'
import ShareQrClient from './share-qr-client'

interface Props {
	params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params
	const supabase = await createClient()
	const { data: qr } = await supabase
		.from('qrs')
		.select('name')
		.or(`slug.eq.${slug},custom_slug.eq.${slug}`)
		.single()

	return {
		title: qr?.name ? `${qr.name} — QR Code` : 'QR Code compartido',
		description: 'Escanea o descarga este código QR',
	}
}

export default async function ShareQrPage({ params }: Props) {
	const { slug } = await params
	const supabase = await createClient()

	const { data: qr } = await supabase
		.from('qrs')
		.select(
			'id, name, slug, custom_slug, fg_color, bg_color, dot_style, is_active',
		)
		.or(`slug.eq.${slug},custom_slug.eq.${slug}`)
		.single()

	if (!qr || !qr.is_active) notFound()

	const trackingUrl = getTrackingUrl(qr.custom_slug ?? qr.slug)

	return (
		<ShareQrClient
			qr={{
				name: qr.name,
				slug: qr.custom_slug ?? qr.slug,
				fg_color: qr.fg_color,
				bg_color: qr.bg_color,
				dot_style: qr.dot_style,
				trackingUrl,
			}}
		/>
	)
}
