'use client'

import type { FC, ReactNode } from 'react'
import { createContext, useCallback, useContext, useState } from 'react'
import FullScreenLoader from '@/shared/components/full-screen-loader'

interface LoaderContextValue {
	showLoader: (message?: string) => void
	hideLoader: () => void
}

const LoaderContext = createContext<LoaderContextValue | null>(null)

export const LoaderProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const [isVisible, setIsVisible] = useState(false)
	const [message, setMessage] = useState<string | undefined>()

	const showLoader = useCallback((msg?: string) => {
		setMessage(msg)
		setIsVisible(true)
	}, [])

	const hideLoader = useCallback(() => {
		setIsVisible(false)
		setMessage(undefined)
	}, [])

	return (
		<LoaderContext.Provider value={{ showLoader, hideLoader }}>
			{children}
			<FullScreenLoader isVisible={isVisible} message={message} />
		</LoaderContext.Provider>
	)
}

export function useLoader(): LoaderContextValue {
	const ctx = useContext(LoaderContext)
	if (!ctx) throw new Error('useLoader must be used inside LoaderProvider')
	return ctx
}
