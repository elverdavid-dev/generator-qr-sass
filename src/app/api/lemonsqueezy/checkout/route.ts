import { createCheckout } from '@lemonsqueezy/lemonsqueezy.js'
import { NextResponse } from 'next/server'
import { getProfile } from '@/features/auth/services/queries/get-profile'
import { setupLemonSqueezy } from '@/shared/lib/lemonsqueezy'
import { getSession } from '@/shared/lib/supabase/get-session'

export async function POST(req: Request) {
	const { data: session } = await getSession()
	if (!session?.user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const { variantId } = await req.json()
	if (!variantId) {
		return NextResponse.json({ error: 'Missing variantId' }, { status: 400 })
	}

	setupLemonSqueezy()

	const { data: profile } = await getProfile({ user_id: session.user.id })

	const { data, error } = await createCheckout(
		process.env.LEMONSQUEEZY_STORE_ID!,
		variantId,
		{
			checkoutOptions: {
				embed: false,
				media: true,
				logo: true,
			},
			checkoutData: {
				email: session.user.email ?? undefined,
				custom: {
					user_id: session.user.id,
				},
			},
			productOptions: {
				enabledVariants: [Number(variantId)],
				redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?upgraded=true`,
				receiptButtonText: 'Ir al dashboard',
			},
		},
	)

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 })
	}

	return NextResponse.json({ url: data?.data.attributes.url })
}
