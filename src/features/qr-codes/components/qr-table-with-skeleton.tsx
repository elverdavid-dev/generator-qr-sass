'use client'

import { Skeleton } from 'boneyard-js/react'
import type { ReactNode } from 'react'

const QrSkeletonFallback = () => (
	<div className="flex flex-col gap-3 mt-3">
		{Array.from({ length: 5 }).map((_, i) => (
			// biome-ignore lint/suspicious/noArrayIndexKey: skeleton items
			<div
				key={i}
				className="h-20 bg-default-100 rounded-2xl animate-pulse"
			/>
		))}
	</div>
)

/** Wrap the real QrTable so boneyard can capture its DOM during `npx boneyard-js build` */
export function QrTableWithSkeleton({ children }: { children: ReactNode }) {
	return (
		<Skeleton
			name="qr-table"
			loading={false}
			animate="shimmer"
			transition
			darkColor="rgba(255,255,255,0.07)"
		>
			{children}
		</Skeleton>
	)
}

/** Shown while QrTable data is streaming — uses boneyard bones once generated */
export function QrTableSkeletonFallback() {
	return (
		<Skeleton
			name="qr-table"
			loading={true}
			animate="shimmer"
			fallback={<QrSkeletonFallback />}
			darkColor="rgba(255,255,255,0.07)"
		>
			<></>
		</Skeleton>
	)
}
