import { NextResponse } from 'next/server'
import { getSubscription, listSubscriptions } from '@lemonsqueezy/lemonsqueezy.js'
import { setupLemonSqueezy } from '@/shared/lib/lemonsqueezy'
import { getSession } from '@/shared/lib/supabase/get-session'
import { getProfile } from '@/features/auth/services/queries/get-profile'
import { createClient } from '@/shared/lib/supabase/server'

export async function POST() {
	const { data: session } = await getSession()
	if (!session?.user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const { data: profile } = await getProfile({ user_id: session.user.id })

	setupLemonSqueezy()

	let subscriptionId = profile?.ls_subscription_id

	// If no subscription ID stored, look it up by email in LS
	if (!subscriptionId) {
		const { data: subs, error } = await listSubscriptions({
			filter: { storeId: process.env.LEMONSQUEEZY_STORE_ID },
		})

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 })
		}

		const match = subs?.data.find(
			(sub) => sub.attributes.user_email === session.user.email,
		)

		if (!match) {
			return NextResponse.json({ error: 'No active subscription' }, { status: 400 })
		}

		subscriptionId = String(match.id)

		// Save it for future calls
		const supabase = await createClient()
		await supabase
			.from('profiles')
			.update({
				ls_subscription_id: subscriptionId,
				ls_customer_id: String(match.attributes.customer_id),
				plan_expires_at: match.attributes.renews_at ?? null,
			})
			.eq('id', session.user.id)
	}

	const { data, error } = await getSubscription(subscriptionId)

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 })
	}

	const portalUrl = data?.data.attributes.urls?.customer_portal

	if (!portalUrl) {
		return NextResponse.json({ error: 'Portal URL not available' }, { status: 500 })
	}

	return NextResponse.json({ url: portalUrl })
}
