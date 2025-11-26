import { useUIStore } from '@/store/useUIStore'

export function useUI() {
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen)
  const toggleSidebar = useUIStore((state) => state.toggleSidebar)
  const setSidebarOpen = useUIStore((state) => state.setSidebarOpen)

  return {
    isSidebarOpen,
    toggleSidebar,
    setSidebarOpen,
  }
}
