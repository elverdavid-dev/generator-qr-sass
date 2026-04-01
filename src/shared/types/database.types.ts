export interface Profile {
	id: string
	email: string
	name: string | null
	surname: string | null
	phone: string | null
	avatar_url: string | null
	role: 'admin' | 'user'
	plan: 'free' | 'pro' | 'business'
	ls_customer_id: string | null
	ls_subscription_id: string | null
	plan_expires_at: string | null
	billing_interval: 'monthly' | 'annual' | null
	onboarding_completed: boolean
	created_at: string
}

export interface QrCode {
	id: string
	user_id: string
	folder_id: string | null
	name: string
	slug: string
	qr_type: string
	data: string
	bg_color: string
	fg_color: string
	dot_style: string
	corner_square_style: string
	corner_dot_style: string
	dot_color_2: string | null
	dot_gradient_type: string
	frame_style: string
	frame_color: string
	frame_text: string
	logo_url: string | null
	logo_path: string | null
	scan_count: number
	is_active: boolean
	is_favorite: boolean
	expires_at: string | null
	max_scans: number | null
	password: string | null
	ios_url: string | null
	android_url: string | null
	custom_slug: string | null
	utm_source: string | null
	utm_medium: string | null
	utm_campaign: string | null
	utm_term: string | null
	utm_content: string | null
	created_at: string
	updated_at: string
	// joined
	folders?: { name: string } | null
}

export interface Folder {
	id: string
	user_id: string
	name: string
	slug: string
	created_at: string
	// computed from join
	qr_count?: number
}

export interface QrTemplate {
	id: string
	user_id: string
	name: string
	fg_color: string
	bg_color: string
	dot_style: string
	corner_square_style: string
	corner_dot_style: string
	dot_color_2: string | null
	dot_gradient_type: string
	frame_style: string
	frame_color: string
	frame_text: string
	logo_url: string | null
	created_at: string
}

export interface Webhook {
	id: string
	user_id: string
	name: string
	url: string
	secret: string | null
	is_active: boolean
	created_at: string
}

export interface QrScan {
	id: string
	qr_id: string
	user_id: string
	ip_address: string
	os: string
	device_type: string
	browser: string
	country: string | null
	region: string | null
	city: string | null
	is_unique_scan: boolean
	created_at: string
}
