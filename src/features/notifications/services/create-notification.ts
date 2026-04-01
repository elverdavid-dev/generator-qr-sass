import { createAdminClient } from '@/shared/lib/supabase/admin'

type NotificationType = 'scan_milestone' | 'scan_spike' | 'qr_inactive' | 'qr_limit_reached'

interface CreateNotificationInput {
	user_id: string
	qr_id?: string
	type: NotificationType
	title: string
	body: string
}

export const createNotification = async (input: CreateNotificationInput) => {
	const supabase = createAdminClient()
	const { error } = await supabase.from('notifications').insert({
		user_id: input.user_id,
		qr_id: input.qr_id ?? null,
		type: input.type,
		title: input.title,
		body: input.body,
	})
	return { error }
}

// Milestones that trigger a notification
const SCAN_MILESTONES = [10, 50, 100, 500, 1000, 5000, 10000]

export const maybeNotifyMilestone = async (
	userId: string,
	qrId: string,
	qrName: string,
	newScanCount: number,
) => {
	if (!SCAN_MILESTONES.includes(newScanCount)) return

	await createNotification({
		user_id: userId,
		qr_id: qrId,
		type: 'scan_milestone',
		title: `🎉 ${newScanCount} escaneos`,
		body: `Tu QR "${qrName}" alcanzó ${newScanCount} escaneos.`,
	})
}

export const maybeNotifyScanSpike = async (
	userId: string,
	qrId: string,
	qrName: string,
	scansLastHour: number,
) => {
	// Spike = more than 20 scans in the last hour
	if (scansLastHour < 20) return

	await createNotification({
		user_id: userId,
		qr_id: qrId,
		type: 'scan_spike',
		title: '📈 Spike de escaneos',
		body: `Tu QR "${qrName}" recibió ${scansLastHour} escaneos en la última hora.`,
	})
}
