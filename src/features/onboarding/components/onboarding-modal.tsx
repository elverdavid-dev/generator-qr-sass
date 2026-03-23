'use client'

import { Button } from '@heroui/button'
import { Modal, ModalBody, ModalContent } from '@heroui/modal'
import {
	ArrowLeft02Icon,
	ArrowRight02Icon,
	CheckmarkCircle02Icon,
	FingerPrintScanIcon,
	QrCodeIcon,
	SparklesIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { completeOnboarding } from '@/features/onboarding/actions/complete-onboarding'

interface Translations {
	step1Title: string
	step1Desc: string
	step2Title: string
	step2Desc: string
	step3Title: string
	step3Desc: string
	step4Title: string
	step4Desc: string
	next: string
	back: string
	skip: string
	getStarted: string
	stepOf: string
}

interface Props {
	translations: Translations
}

const STEPS = [
	{
		icon: SparklesIcon,
		color: 'bg-primary/10 text-primary',
		illustrationBg: 'from-primary/10 to-primary/5',
	},
	{
		icon: QrCodeIcon,
		color: 'bg-violet-500/10 text-violet-500',
		illustrationBg: 'from-violet-500/10 to-violet-500/5',
	},
	{
		icon: FingerPrintScanIcon,
		color: 'bg-emerald-500/10 text-emerald-500',
		illustrationBg: 'from-emerald-500/10 to-emerald-500/5',
	},
	{
		icon: CheckmarkCircle02Icon,
		color: 'bg-amber-500/10 text-amber-500',
		illustrationBg: 'from-amber-500/10 to-amber-500/5',
	},
]

export default function OnboardingModal({ translations: t }: Props) {
	const [step, setStep] = useState(0)
	const [done, setDone] = useState(false)
	const [loading, setLoading] = useState(false)
	const router = useRouter()

	const steps = [
		{ title: t.step1Title, desc: t.step1Desc },
		{ title: t.step2Title, desc: t.step2Desc },
		{ title: t.step3Title, desc: t.step3Desc },
		{ title: t.step4Title, desc: t.step4Desc },
	]

	const current = steps[step]
	const config = STEPS[step]
	const isLast = step === steps.length - 1

	const finish = async (goToNew = false) => {
		setLoading(true)
		await completeOnboarding()
		setDone(true)
		if (goToNew) {
			router.push('/dashboard/qrs/new')
		}
	}

	if (done) return null

	return (
		<Modal
			isOpen
			hideCloseButton
			isDismissable={false}
			size="md"
			classNames={{ base: 'rounded-3xl' }}
		>
			<ModalContent>
				<ModalBody className="p-0 overflow-hidden">
					{/* Illustration area */}
					<div
						className={`bg-gradient-to-br ${config.illustrationBg} flex items-center justify-center py-12`}
					>
						<div
							className={`w-24 h-24 rounded-3xl flex items-center justify-center ${config.color} shadow-lg`}
						>
							<HugeiconsIcon icon={config.icon} size={44} />
						</div>
					</div>

					{/* Content */}
					<div className="px-8 py-7 flex flex-col gap-5">
						{/* Step indicator */}
						<div className="flex items-center justify-between">
							<div className="flex gap-1.5">
								{steps.map((_, i) => (
									<div
										key={i}
										className={`h-1.5 rounded-full transition-all duration-300 ${
											i === step
												? 'w-6 bg-primary'
												: i < step
													? 'w-3 bg-primary/40'
													: 'w-3 bg-default-200'
										}`}
									/>
								))}
							</div>
							<span className="text-xs text-default-400">
								{step + 1} {t.stepOf} {steps.length}
							</span>
						</div>

						{/* Text */}
						<div>
							<h2 className="text-2xl font-bold text-foreground mb-2">
								{current.title}
							</h2>
							<p className="text-default-500 leading-relaxed">{current.desc}</p>
						</div>

						{/* Actions */}
						<div className="flex items-center gap-2 pt-1">
							{step > 0 && (
								<Button
									variant="flat"
									isIconOnly
									onPress={() => setStep((s) => s - 1)}
									isDisabled={loading}
								>
									<HugeiconsIcon icon={ArrowLeft02Icon} size={18} />
								</Button>
							)}

							{step === 0 && (
								<Button
									variant="light"
									size="sm"
									className="text-default-400"
									onPress={() => finish(false)}
									isDisabled={loading}
								>
									{t.skip}
								</Button>
							)}

							<div className="flex-1" />

							{isLast ? (
								<Button
									color="primary"
									radius="full"
									className="px-6 font-semibold"
									endContent={
										<HugeiconsIcon icon={ArrowRight02Icon} size={16} />
									}
									isLoading={loading}
									onPress={() => finish(true)}
								>
									{t.getStarted}
								</Button>
							) : (
								<Button
									color="primary"
									radius="full"
									className="px-6 font-semibold"
									endContent={
										<HugeiconsIcon icon={ArrowRight02Icon} size={16} />
									}
									onPress={() => setStep((s) => s + 1)}
									isDisabled={loading}
								>
									{t.next}
								</Button>
							)}
						</div>
					</div>
				</ModalBody>
			</ModalContent>
		</Modal>
	)
}
