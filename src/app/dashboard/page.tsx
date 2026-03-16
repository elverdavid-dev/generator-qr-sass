import {
	QrCodeIcon,
	FingerPrintScanIcon,
	Clock01Icon,
	CheckmarkCircle02Icon,
	Calendar03Icon,
	Add01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getLocale, getTranslations } from 'next-intl/server'
import { getSession } from '@/shared/lib/supabase/get-session'
import { getProfile } from '@/features/auth/services/queries/get-profile'
import { getDashboardStats } from '@/features/analytics/services/queries/get-dashboard-stats'
import { getTrackingUrl } from '@/shared/utils/get-tracking-url'
import { formatDate } from '@/shared/utils/format-date'
import QrPreview from '@/features/qr-codes/components/qr-preview'
import type { QrCode } from '@/shared/types/database.types'

const StatCard = ({
	icon,
	label,
	value,
	sub,
	iconBg,
	iconColor,
}: {
	// biome-ignore lint/suspicious/noExplicitAny: HugeIcons type
	icon: any
	label: string
	value: number
	sub?: string
	iconBg: string
	iconColor: string
}) => (
	<div className="bg-content1 border border-divider rounded-2xl p-5 shadow-sm flex flex-col gap-3">
		<div className={`w-9 h-9 flex items-center justify-center ${iconBg} rounded-xl`}>
			<HugeiconsIcon icon={icon} size={18} className={iconColor} />
		</div>
		<div>
			<p className="text-[1.75rem] font-bold leading-none tabular-nums">{value.toLocaleString(locale)}</p>
			<p className="text-sm text-default-400 mt-1">{label}</p>
			{sub && <p className="text-xs text-default-300 mt-0.5">{sub}</p>}
		</div>
	</div>
)

const DashboardPage = async () => {
	const [t, locale] = await Promise.all([getTranslations('dashboard'), getLocale()])
	const { data: session } = await getSession()
	if (!session?.user) redirect('/login')

	const [profileResult, statsResult] = await Promise.all([
		getProfile({ user_id: session.user.id }),
		getDashboardStats(),
	])

	const profile = profileResult.data
	const stats = statsResult.data

	const firstName = profile?.name?.split(' ')[0] ?? profile?.email?.split('@')[0] ?? t('user')
	const hour = new Date().getHours()
	const greeting = hour < 12 ? t('greeting.morning') : hour < 18 ? t('greeting.afternoon') : t('greeting.evening')

	return (
		<div className="pb-12">
			<div className="py-6 flex items-center justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold">
						{greeting}, {firstName} 👋
					</h1>
					<p className="text-default-500 mt-1 capitalize">
						{new Date().toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' })}
					</p>
				</div>
				<Link
					href="/dashboard/qrs/new"
					className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors shrink-0"
				>
					<HugeiconsIcon icon={Add01Icon} size={16} />
					{t('createQr')}
				</Link>
			</div>

			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				<StatCard
					icon={QrCodeIcon}
					label={t('stats.totalQrs')}
					value={stats?.totalQrs ?? 0}
					sub={`${stats?.activeQrs ?? 0} ${t('stats.active')}`}
					iconBg="bg-blue-50 dark:bg-blue-950/40"
					iconColor="text-blue-600 dark:text-blue-400"
				/>
				<StatCard
					icon={CheckmarkCircle02Icon}
					label={t('stats.activeQrs')}
					value={stats?.activeQrs ?? 0}
					iconBg="bg-emerald-50 dark:bg-emerald-950/40"
					iconColor="text-emerald-600 dark:text-emerald-400"
				/>
				<StatCard
					icon={Clock01Icon}
					label={t('stats.todayScans')}
					value={stats?.todayScans ?? 0}
					iconBg="bg-violet-50 dark:bg-violet-950/40"
					iconColor="text-violet-600 dark:text-violet-400"
				/>
				<StatCard
					icon={FingerPrintScanIcon}
					label={t('stats.monthScans')}
					value={stats?.monthScans ?? 0}
					iconBg="bg-amber-50 dark:bg-amber-950/40"
					iconColor="text-amber-600 dark:text-amber-400"
				/>
			</div>

			<div className="mt-8">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-lg font-semibold">{t('recentQrs')}</h2>
					<Link href="/dashboard/qrs" className="text-sm text-primary hover:underline">
						{t('viewAll')}
					</Link>
				</div>

				{!stats?.recentQrs?.length ? (
					<div className="bg-content1 border border-divider rounded-2xl p-10 flex flex-col items-center gap-3 text-default-400">
						<HugeiconsIcon icon={QrCodeIcon} size={32} className="opacity-30" />
						<p className="text-sm font-medium">{t('noQrs')}</p>
						<Link href="/dashboard/qrs/new" className="text-xs text-primary hover:underline">
							{t('createFirst')}
						</Link>
					</div>
				) : (
					<div className="flex flex-col gap-3">
						{(stats.recentQrs as QrCode[]).map((qr) => (
							<Link
								key={qr.id}
								href={`/dashboard/qrs/${qr.slug}`}
								className="flex items-center gap-4 p-4 bg-content1 border border-divider rounded-2xl shadow-sm hover:border-primary/40 hover:bg-primary/5 transition-colors"
							>
								<QrPreview
									value={getTrackingUrl(qr.slug)}
									size={48}
									fgColor={qr.fg_color}
									bgColor={qr.bg_color}
									dotStyle={qr.dot_style ?? 'square'}
									className="rounded-lg border border-divider shrink-0 overflow-hidden"
								/>
								<div className="min-w-0 flex-1">
									<p className="font-semibold capitalize truncate">{qr.name}</p>
									<p className="text-xs text-default-400 truncate">{qr.data}</p>
								</div>
								<div className="text-right shrink-0">
									<p className="text-sm font-bold text-primary">{qr.scan_count ?? 0}</p>
									<p className="text-xs text-default-400">{t('scans')}</p>
								</div>
								<div className="text-right shrink-0 hidden md:flex flex-col items-end gap-0.5">
									<span className="text-xs text-default-400 flex items-center gap-1">
										<HugeiconsIcon icon={Calendar03Icon} size={12} />
										{formatDate(qr.created_at)}
									</span>
									<span className={`text-xs font-medium ${qr.is_active ? 'text-emerald-500' : 'text-danger'}`}>
										{qr.is_active ? t('active') : t('inactive')}
									</span>
								</div>
							</Link>
						))}
					</div>
				)}
			</div>
		</div>
	)
}

export default DashboardPage
