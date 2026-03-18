import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { authenticateApiKey } from '@/shared/lib/api-key-auth'
import { createAdminClient } from '@/shared/lib/supabase/admin'

// GET /api/v1/qrs/[id]
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const auth = await authenticateApiKey(request)
	if (!auth) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const { id } = await params
	const supabase = createAdminClient()

	const { data, error } = await supabase
		.from('qrs')
		.select('id, name, slug, custom_slug, qr_type, data, is_active, scan_count, bg_color, fg_color, dot_style, frame_style, created_at, updated_at')
		.eq('id', id)
		.eq('user_id', auth.userId)
		.single()

	if (error || !data) {
		return NextResponse.json({ error: 'QR not found' }, { status: 404 })
	}

	return NextResponse.json({ data })
}

// PATCH /api/v1/qrs/[id]
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

	const { id } = await params
	const supabase = createAdminClient()

	// Verificar que el QR pertenece al usuario
	const { data: existing } = await supabase
		.from('qrs')
		.select('id')
		.eq('id', id)
		.eq('user_id', auth.userId)
		.single()

	if (!existing) {
		return NextResponse.json({ error: 'QR not found' }, { status: 404 })
	}

	const allowedFields = ['name', 'data', 'is_active', 'bg_color', 'fg_color', 'dot_style', 'frame_style', 'frame_color', 'frame_text']
	const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }

	for (const field of allowedFields) {
		if (field in body) updates[field] = body[field]
	}

	const { data, error } = await supabase
		.from('qrs')
		.update(updates)
		.eq('id', id)
		.select('id, name, slug, custom_slug, qr_type, data, is_active, scan_count, created_at, updated_at')
		.single()

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 })
	}

	return NextResponse.json({ data })
}

// DELETE /api/v1/qrs/[id]
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const auth = await authenticateApiKey(request)
	if (!auth) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const { id } = await params
	const supabase = createAdminClient()

	const { error } = await supabase
		.from('qrs')
		.delete()
		.eq('id', id)
		.eq('user_id', auth.userId)

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 })
	}

	return new NextResponse(null, { status: 204 })
}
