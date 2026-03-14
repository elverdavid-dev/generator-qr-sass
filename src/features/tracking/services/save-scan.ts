import { createClient } from '@/shared/lib/supabase/server'
import type { QrScan } from '@/shared/types/database.types'

type NewScan = Omit<QrScan, 'id' | 'created_at'>

export const saveScan = async (scan: NewScan) => {
	const supabase = await createClient()
	const { error } = await supabase.from('qr_scans').insert(scan)
	if (error) {
		console.error('Error saving scan:', error.message)
	}
}
