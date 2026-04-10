import { notFound } from 'next/navigation'
import { createClient } from '@/shared/lib/supabase/server'
import { QrViewContent } from './qr-view-content'

interface Props {
	params: Promise<{ slug: string }>
}

const QrViewPage = async ({ params }: Props) => {
	const { slug } = await params
	const supabase = await createClient()

	const { data: qr } = await supabase
		.from('qrs')
		.select('name, qr_type, data, is_active')
		.or(`slug.eq.${slug},custom_slug.eq.${slug}`)
		.single()

	if (!qr || !qr.is_active) notFound()

	return <QrViewContent name={qr.name} qrType={qr.qr_type} data={qr.data} />
}

export default QrViewPage
