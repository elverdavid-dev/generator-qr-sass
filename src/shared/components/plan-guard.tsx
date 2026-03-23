'use client'

import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from '@heroui/react'
import { Crown02Icon, LockIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Link from 'next/link'
import { type ReactNode, useState } from 'react'
import {
	getRequiredPlanForFeature,
	PLANS,
	type PlanFeatures,
} from '@/features/billing/config/plans'
import { usePlan } from '@/shared/context/plan-context'

interface Props {
	feature: keyof PlanFeatures
	children: ReactNode
	/* Muestra el children bloqueado (con overlay) en lugar de ocultarlo */
	showLocked?: boolean
}

const PLAN_LABELS: Record<string, string> = { pro: 'Pro', business: 'Business' }

export default function PlanGuard({
	feature,
	children,
	showLocked = false,
}: Props) {
	const { hasFeature } = usePlan()
	const [open, setOpen] = useState(false)

	if (hasFeature(feature)) return <>{children}</>

	const requiredPlan = getRequiredPlanForFeature(feature)
	const planConfig = PLANS[requiredPlan]

	if (!showLocked) return null

	return (
		<>
			{/* Children bloqueados con overlay */}
			<div
				className="relative cursor-pointer select-none"
				onClick={() => setOpen(true)}
				onKeyDown={(e) => e.key === 'Enter' && setOpen(true)}
			>
				<div className="pointer-events-none opacity-40">{children}</div>
				<div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/60 backdrop-blur-[2px] rounded-2xl">
					<div className="bg-content2 border border-divider rounded-xl px-4 py-2 flex items-center gap-2 shadow-md">
						<HugeiconsIcon icon={LockIcon} size={16} className="text-primary" />
						<span className="text-sm font-semibold">
							Requiere plan {PLAN_LABELS[requiredPlan]}
						</span>
					</div>
				</div>
			</div>

			<UpgradeModal
				open={open}
				onClose={() => setOpen(false)}
				requiredPlan={requiredPlan as 'pro' | 'business'}
				planPrice={planConfig.price}
			/>
		</>
	)
}

/* Botón que abre el modal de upgrade directamente */
export function UpgradeButton({
	feature,
	label,
	size = 'sm',
}: {
	feature: keyof PlanFeatures
	label: string
	size?: 'sm' | 'md' | 'lg'
}) {
	const { hasFeature } = usePlan()
	const [open, setOpen] = useState(false)

	if (hasFeature(feature)) return null

	const requiredPlan = getRequiredPlanForFeature(feature)
	const planConfig = PLANS[requiredPlan]

	return (
		<>
			<Button
				size={size}
				variant="flat"
				color="primary"
				startContent={<HugeiconsIcon icon={Crown02Icon} size={16} />}
				onPress={() => setOpen(true)}
			>
				{label}
			</Button>
			<UpgradeModal
				open={open}
				onClose={() => setOpen(false)}
				requiredPlan={requiredPlan as 'pro' | 'business'}
				planPrice={planConfig.price}
			/>
		</>
	)
}

function UpgradeModal({
	open,
	onClose,
	requiredPlan,
	planPrice,
}: {
	open: boolean
	onClose: () => void
	requiredPlan: 'pro' | 'business'
	planPrice: number
}) {
	return (
		<Modal isOpen={open} onClose={onClose} placement="center" size="sm">
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">
					<div className="flex items-center gap-2">
						<div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
							<HugeiconsIcon
								icon={Crown02Icon}
								size={18}
								className="text-primary"
							/>
						</div>
						<span>Función exclusiva</span>
					</div>
				</ModalHeader>
				<ModalBody>
					<p className="text-default-500 text-sm">
						Esta función está disponible en el plan{' '}
						<span className="font-semibold text-foreground">
							{PLAN_LABELS[requiredPlan]}
						</span>
						. Actualiza tu plan para desbloquearla.
					</p>
					<div className="mt-2 bg-primary/5 border border-primary/20 rounded-xl p-4">
						<p className="text-sm font-semibold text-primary">
							Plan {PLAN_LABELS[requiredPlan]} — ${planPrice}/mes
						</p>
						<ul className="mt-2 space-y-1">
							{PLANS[requiredPlan].features.slice(0, 4).map((f) => (
								<li
									key={f}
									className="text-xs text-default-500 flex items-center gap-1.5"
								>
									<span className="text-primary">✓</span> {f}
								</li>
							))}
						</ul>
					</div>
				</ModalBody>
				<ModalFooter>
					<Button variant="flat" onPress={onClose} size="sm">
						Ahora no
					</Button>
					<Button
						as={Link}
						href="/pricing"
						color="primary"
						size="sm"
						onPress={onClose}
					>
						Ver planes
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}
