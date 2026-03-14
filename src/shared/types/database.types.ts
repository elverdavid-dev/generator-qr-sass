export interface Profile {
	id: string
	email: string
	name: string | null
	surname: string | null
	phone: string | null
	avatar_url: string | null
	role: 'admin' | 'user'
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
	logo_url: string | null
	logo_path: string | null
	scan_count: number
	is_active: boolean
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
