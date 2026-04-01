import { create } from 'zustand'

interface SidebarStore {
	isOpen: boolean
	toggleSidebar: VoidFunction
	isMobileOpen: boolean
	openMobile: VoidFunction
	closeMobile: VoidFunction
}

export const useSidebarStore = create<SidebarStore>((set) => ({
	isOpen: true,
	toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
	isMobileOpen: false,
	openMobile: () => set({ isMobileOpen: true }),
	closeMobile: () => set({ isMobileOpen: false }),
}))
