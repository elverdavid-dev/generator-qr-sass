'use client'

import {
	Calendar03Icon,
	CancelCircleIcon,
	CheckmarkCircle02Icon,
	Edit02Icon,
	FingerPrintScanIcon,
	Folder01Icon,
	Link01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import type { Folder, QrCode } from '@/shared/types/database.types'
import { formatDate } from '@/shared/utils/format-date'
import { getTrackingUrl } from '@/shared/utils/get-tracking-url'
import QrActions from './qr-actions'
import QrPreview from './qr-preview'

interface Props {
	qrs: QrCode[]
	folders: Folder[]
}

const QrTable = ({ qrs, folders }: Props) => {
	if (qrs.length === 0) {
		return (
			<div className="text-center text-default-400 py-16">
				No se encontraron códigos QR
			</div>
		)
	}

	return (
		<section className="flex flex-col gap-3 mt-3">
			{qrs.map((qr) => (
				<div
					key={qr.id}
					className="flex items-center justify-between gap-6 p-5 bg-content1 rounded-2xl border border-divider shadow-sm"
				>
					{/* QR preview + info */}
					<div className="flex items-center gap-4 min-w-0">
						<QrPreview
							value={getTrackingUrl(qr.slug)}
							size={56}
							fgColor={qr.fg_color}
							bgColor={qr.bg_color}
							dotStyle={qr.dot_style ?? 'square'}
							className="rounded-lg border border-divider shrink-0 overflow-hidden"
						/>
						<div className="min-w-0">
							<span className="text-xs text-primary font-medium">
								{qr.qr_type === 'url' ? 'Sitio web' : qr.qr_type}
							</span>
							<h3 className="font-semibold capitalize truncate max-w-48">
								{qr.name}
							</h3>
							<span className="text-xs text-default-400 flex items-center gap-1">
								<HugeiconsIcon icon={Calendar03Icon} size={12} />
								{formatDate(qr.created_at)}
							</span>
						</div>
					</div>

					{/* Folder + link */}
					<div className="flex-col gap-1 min-w-0 max-md:hidden flex">
						<span className="text-sm text-default-500 flex items-center gap-1">
							<HugeiconsIcon icon={Folder01Icon} size={14} />
							{qr.folders?.name ?? 'Sin carpeta'}
						</span>
						<a
							href={qr.data}
							target="_blank"
							rel="noopener noreferrer"
							className="text-sm text-primary flex items-center gap-1 underline truncate max-w-52"
						>
							<HugeiconsIcon icon={Link01Icon} size={14} />
							{qr.data}
						</a>
						<span className="text-xs text-default-400 flex items-center gap-1">
							<HugeiconsIcon icon={Edit02Icon} size={12} />
							{formatDate(qr.updated_at)}
						</span>
					</div>

					{/* Status */}
					<div className="text-sm shrink-0">
						{qr.is_active ? (
							<span className="text-emerald-500 flex items-center gap-1">
								<HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} />
								Activo
							</span>
						) : (
							<span className="text-danger flex items-center gap-1">
								<HugeiconsIcon icon={CancelCircleIcon} size={16} />
								Inactivo
							</span>
						)}
					</div>

					{/* Scan count */}
					<div className="text-sm text-default-500 flex items-center gap-1 shrink-0">
						<HugeiconsIcon icon={FingerPrintScanIcon} size={16} />
						<span>
							<strong className="text-lg text-primary">{qr.scan_count ?? 0}</strong>{' '}
							escaneos
						</span>
					</div>

					{/* Actions */}
					<QrActions qr={qr} folders={folders} />
				</div>
			))}
		</section>
	)
}

export default QrTable
