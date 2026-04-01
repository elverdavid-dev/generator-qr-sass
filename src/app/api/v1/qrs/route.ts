import { nanoid } from 'nanoid'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import type { PlanId } from '@/features/billing/config/plans'
import { canCreateQr, hasFeature } from '@/features/billing/config/plans'
import { authenticateApiKey } from '@/shared/lib/api-key-auth'
import { createAdminClient } from '@/shared/lib/supabase/admin'

const PAGE_SIZE = 20

// GET /api/v1/qrs
export async function GET(request: NextRequest) {
	const auth = await authenticateApiKey(request)
	if (!auth) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const { searchParams } = new URL(request.url)
	const page = Math.max(1, Number(searchParams.get('page') ?? 1))
	const from = (page - 1) * PAGE_SIZE
	const to = from + PAGE_SIZE - 1

	const supabase = createAdminClient()
	const { data, error, count } = await supabase
		.from('qrs')
		.select(
			'id, name, slug, custom_slug, qr_type, data, is_active, scan_count, created_at, updated_at',
			{ count: 'exact' },
		)
		.eq('user_id', auth.userId)
		.order('created_at', { ascending: false })
		.range(from, to)

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 })
	}

	return NextResponse.json({
		data,
		meta: {
			total: count ?? 0,
			page,
			page_size: PAGE_SIZE,
			total_pages: Math.ceil((count ?? 0) / PAGE_SIZE),
		},
	})
}

// POST /api/v1/qrs
export async function POST(request: NextRequest) {
	const auth = await authenticateApiKey(request)
	if (!auth) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	let body: Record<string, unknown>
	try {
		body = await request.json()
	} catch {
		return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
	}

	const {
		name,
		qr_type,
		data: qrData,
		custom_slug,
	} = body as {
		name?: string
		qr_type?: string
		data?: string
		custom_slug?: string
	}

	if (!name || !qr_type || !qrData) {
		return NextResponse.json(
			{ error: 'Fields name, qr_type and data are required' },
			{ status: 422 },
		)
	}

	const supabase = createAdminClient()

	// Verificar plan
	const { data: profile } = await supabase
		.from('profiles')
		.select('plan')
		.eq('id', auth.userId)
		.single()

	const plan = (profile?.plan ?? 'free') as PlanId

	const { count } = await supabase
		.from('qrs')
		.select('id', { count: 'exact', head: true })
		.eq('user_id', auth.userId)

	if (!canCreateQr(plan, count ?? 0)) {
		return NextResponse.json(
			{ error: 'QR limit reached for your plan' },
			{ status: 403 },
		)
	}

	// Slug
	let slug = nanoid(8)
	if (custom_slug && hasFeature(plan, 'customSlug')) {
		const { count: slugCount } = await supabase
			.from('qrs')
			.select('id', { count: 'exact', head: true })
			.eq('custom_slug', custom_slug)

		if ((slugCount ?? 0) > 0) {
			return NextResponse.json(
				{ error: 'custom_slug already in use' },
				{ status: 409 },
			)
		}
		slug = custom_slug as string
	}

	const { data: qr, error } = await supabase
		.from('qrs')
		.insert({
			user_id: auth.userId,
			name: name as string,
			qr_type: qr_type as string,
			data: qrData as string,
			slug,
			custom_slug: hasFeature(plan, 'customSlug')
				? (custom_slug ?? null)
				: null,
			bg_color: '#FFFFFF',
			fg_color: '#000000',
			dot_style: 'square',
			corner_square_style: 'square',
			corner_dot_style: 'square',
			dot_gradient_type: 'linear',
			frame_style: 'none',
			frame_color: '#000000',
			frame_text: 'SCAN ME',
		})
		.select(
			'id, name, slug, custom_slug, qr_type, data, is_active, scan_count, created_at',
		)
		.single()

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 })
	}

	return NextResponse.json({ data: qr }, { status: 201 })
}
