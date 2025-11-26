import { useLoadingStore } from '@/store/useLoadingStore'

export function useLoading() {
  const count = useLoadingStore((state) => state.count)
  const startLoading = useLoadingStore((state) => state.startLoading)
  const stopLoading = useLoadingStore((state) => state.stopLoading)

  const isLoading = count > 0

  return {
    isLoading,
    startLoading,
    stopLoading,
  }
}
