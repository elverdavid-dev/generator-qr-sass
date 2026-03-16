import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { createClient } from '@/shared/lib/supabase/server'
import type { PlanId } from '@/features/billing/config/plans'

// Map Lemon Squeezy variant IDs to plan names
const VARIANT_TO_PLAN: Record<string, PlanId> = {
	[process.env.LEMONSQUEEZY_PRO_VARIANT_ID ?? '']: 'pro',
	[process.env.LEMONSQUEEZY_BUSINESS_VARIANT_ID ?? '']: 'business',
}

function verifySignature(payload: string, signature: string): boolean {
	const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!
	const hmac = crypto.createHmac('sha256', secret)
	const digest = hmac.update(payload).digest('hex')
	return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature))
}

export async function POST(req: Request) {
	const payload = await req.text()
	const headersList = await headers()
	const signature = headersList.get('x-signature')

	if (!signature || !verifySignature(payload, signature)) {
		return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
	}

	const event = JSON.parse(payload)
	const eventName: string = event.meta?.event_name
	const userId: string | undefined = event.meta?.custom_data?.user_id
	const attributes = event.data?.attributes

	if (!userId) {
		return NextResponse.json({ received: true })
	}

	const supabase = await createClient()

	switch (eventName) {
		case 'subscription_created':
		case 'subscription_updated': {
			const variantId = String(attributes?.variant_id ?? '')
			const plan = VARIANT_TO_PLAN[variantId] ?? 'free'
			const subscriptionId = String(event.data?.id ?? '')
			const customerId = String(attributes?.customer_id ?? '')
			const status: string = attributes?.status ?? ''

			// Only activate if subscription is active or on trial
			if (['active', 'on_trial'].includes(status)) {
				await supabase
					.from('profiles')
					.update({
						plan,
						ls_subscription_id: subscriptionId,
						ls_customer_id: String(customerId),
						plan_expires_at: attributes?.renews_at ?? null,
					})
					.eq('id', userId)
			}
			break
		}

		case 'subscription_cancelled':
		case 'subscription_expired': {
			await supabase
				.from('profiles')
				.update({
					plan: 'free',
					ls_subscription_id: null,
					plan_expires_at: null,
				})
				.eq('id', userId)
			break
		}
	}

	return NextResponse.json({ received: true })
}
