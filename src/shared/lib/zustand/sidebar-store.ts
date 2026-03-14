import { create } from 'zustand'

interface SidebarStore {
	isOpen: boolean
	toggleSidebar: VoidFunction
}

export const useSidebarStore = create<SidebarStore>((set) => ({
	isOpen: true,
	toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
}))
