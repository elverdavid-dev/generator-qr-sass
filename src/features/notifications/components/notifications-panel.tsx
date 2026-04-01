'use client'

import {
	Alert01Icon,
	FingerPrintScanIcon,
	Notification01Icon,
	Tick02Icon,
	TrendingUp,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState, useTransition } from 'react'
import type { Notification } from '@/shared/types/database.types'
import {
	markAllAsRead,
	markAsRead,
} from '../services/mutations/mark-notifications'

interface Props {
	initialNotifications: Notification[]
	initialUnread: number
	translations: {
		title: string
		markAllRead: string
		empty: string
		justNow: string
		viewQr: string
	}
}

// biome-ignore lint/suspicious/noExplicitAny: HugeIcons type
const TYPE_ICON: Record<Notification['type'], any> = {
	scan_milestone: FingerPrintScanIcon,
	scan_spike: TrendingUp,
	qr_inactive: Alert01Icon,
	qr_limit_reached: Alert01Icon,
}

const TYPE_COLOR: Record<Notification['type'], string> = {
	scan_milestone: 'text-primary bg-primary/10',
	scan_spike: 'text-emerald-500 bg-emerald-500/10',
	qr_inactive: 'text-amber-500 bg-amber-500/10',
	qr_limit_reached: 'text-danger bg-danger/10',
}

function timeAgo(dateStr: string, justNow: string): string {
	const diff = Date.now() - new Date(dateStr).getTime()
	const mins = Math.floor(diff / 60000)
	if (mins < 1) return justNow
	if (mins < 60) return `${mins}m`
	const hrs = Math.floor(mins / 60)
	if (hrs < 24) return `${hrs}h`
	return `${Math.floor(hrs / 24)}d`
}

const NotificationsPanel = ({
	initialNotifications,
	initialUnread,
	translations: t,
}: Props) => {
	const [open, setOpen] = useState(false)
	const [notifications, setNotifications] = useState(initialNotifications)
	const [unread, setUnread] = useState(initialUnread)
	const [isPending, startTransition] = useTransition()
	const panelRef = useRef<HTMLDivElement>(null)
	const router = useRouter()

	// Close on outside click
	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
				setOpen(false)
			}
		}
		document.addEventListener('mousedown', handler)
		return () => document.removeEventListener('mousedown', handler)
	}, [])

	const handleMarkOne = (id: string) => {
		startTransition(async () => {
			await markAsRead(id)
			setNotifications((prev) =>
				prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
			)
			setUnread((prev) => Math.max(0, prev - 1))
			router.refresh()
		})
	}

	const handleMarkAll = () => {
		startTransition(async () => {
			await markAllAsRead()
			setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
			setUnread(0)
			router.refresh()
		})
	}

	return (
		<div className="relative" ref={panelRef}>
			{/* Bell button */}
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				className="relative flex items-center justify-center w-9 h-9 rounded-xl text-default-500 hover:text-primary hover:bg-primary/5 transition-colors"
			>
				<HugeiconsIcon icon={Notification01Icon} size={20} />
				{unread > 0 && (
					<span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
						{unread > 99 ? '99+' : unread}
					</span>
				)}
			</button>

			{/* Panel */}
			{open && (
				<div className="absolute right-0 top-11 w-80 bg-background border border-divider rounded-2xl shadow-xl z-50 overflow-hidden">
					{/* Header */}
					<div className="flex items-center justify-between px-4 py-3 border-b border-divider">
						<span className="font-semibold text-sm">{t.title}</span>
						{unread > 0 && (
							<button
								type="button"
								onClick={handleMarkAll}
								disabled={isPending}
								className="text-xs text-primary hover:underline flex items-center gap-1"
							>
								<HugeiconsIcon icon={Tick02Icon} size={12} />
								{t.markAllRead}
							</button>
						)}
					</div>

					{/* List */}
					<div className="max-h-80 overflow-y-auto divide-y divide-divider">
						{notifications.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-10 gap-2 text-default-400">
								<HugeiconsIcon
									icon={Notification01Icon}
									size={28}
									className="opacity-30"
								/>
								<p className="text-xs">{t.empty}</p>
							</div>
						) : (
							notifications.map((n) => (
								<div
									key={n.id}
									className={`flex items-start gap-3 px-4 py-3 transition-colors ${!n.is_read ? 'bg-primary/3' : 'hover:bg-default-50'}`}
								>
									<div
										className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${TYPE_COLOR[n.type]}`}
									>
										<HugeiconsIcon icon={TYPE_ICON[n.type]} size={15} />
									</div>
									<div className="min-w-0 flex-1">
										<p className="text-xs font-semibold text-foreground leading-snug">
											{n.title}
										</p>
										<p className="text-xs text-default-500 mt-0.5 leading-snug">
											{n.body}
										</p>
										<div className="flex items-center gap-2 mt-1.5">
											<span className="text-[10px] text-default-400">
												{timeAgo(n.created_at, t.justNow)}
											</span>
											{n.qr_id && (
												<Link
													href={`/dashboard/qrs/${n.qr_id}`}
													onClick={() => setOpen(false)}
													className="text-[10px] text-primary hover:underline"
												>
													{t.viewQr}
												</Link>
											)}
										</div>
									</div>
									{!n.is_read && (
										<button
											type="button"
											onClick={() => handleMarkOne(n.id)}
											className="shrink-0 w-2 h-2 rounded-full bg-primary mt-2 hover:bg-primary/60 transition-colors"
											title="Marcar como leída"
										/>
									)}
								</div>
							))
						)}
					</div>
				</div>
			)}
		</div>
	)
}

export default NotificationsPanel
