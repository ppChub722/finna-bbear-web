'use client'

import { useLoading } from '@/hooks/useLoading'
import { Loader2 } from 'lucide-react'

export function GlobalLoader() {
  const { isLoading } = useLoading()

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-background flex flex-col items-center gap-4 rounded-lg p-8 shadow-lg">
        <Loader2 className="text-primary h-12 w-12 animate-spin" />
        <p className="text-muted-foreground text-sm font-medium">Loading...</p>
      </div>
    </div>
  )
}
