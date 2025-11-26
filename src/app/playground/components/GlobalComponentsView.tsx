'use client'

import { Button } from '@/components/ui/button'
import { useModal } from '@/hooks/useModal'
import { useLoading } from '@/hooks/useLoading'
import { useUI } from '@/hooks/useUI'
import { toast } from 'sonner'
import { useThemeStore } from '@/store/useThemeStore'

export function GlobalComponentsView() {
  const { confirm, info, custom } = useModal()
  const { startLoading, stopLoading } = useLoading()
  const { isSidebarOpen, toggleSidebar } = useUI()

  const handleLoading = () => {
    startLoading()
    setTimeout(() => {
      stopLoading()
    }, 2000)
  }

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Modals</h2>
        <div className="flex gap-4">
          <Button
            onClick={() =>
              info({
                title: 'Info Modal',
                description: 'This is an info modal.',
              })
            }
          >
            Open Info Modal
          </Button>
          <Button
            variant="destructive"
            onClick={() =>
              confirm({
                title: 'Delete Item',
                description: 'Are you sure you want to delete this item?',
                danger: true,
                confirmText: 'Delete',
                onConfirm: async () => {
                  await new Promise((resolve) => setTimeout(resolve, 1000))
                  toast.success('Item deleted')
                },
              })
            }
          >
            Open Confirm Modal
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              custom(
                <div className="bg-muted rounded-lg p-4">
                  <h3 className="font-bold">Custom Content</h3>
                  <p>This is a custom modal content.</p>
                </div>,
                { title: 'Custom Modal' }
              )
            }
          >
            Open Custom Modal
          </Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Loader</h2>
        <Button onClick={handleLoading}>Show Global Loader (2s)</Button>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Toasts</h2>
        <div className="flex gap-4">
          <Button onClick={() => toast.success('Success Toast')}>
            Show Success
          </Button>
          <Button
            variant="destructive"
            onClick={() => toast.error('Error Toast')}
          >
            Show Error
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              toast.message('Info Toast', {
                description: 'This is a description',
              })
            }
          >
            Show Info
          </Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">UI State</h2>
        <div className="flex items-center gap-4">
          <Button onClick={toggleSidebar}>
            Toggle Sidebar (Current: {isSidebarOpen ? 'Open' : 'Closed'})
          </Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Theme</h2>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => useThemeStore.getState().setTheme('light')}
          >
            Light
          </Button>
          <Button
            variant="outline"
            onClick={() => useThemeStore.getState().setTheme('dark')}
          >
            Dark
          </Button>
          <Button
            variant="outline"
            onClick={() => useThemeStore.getState().setTheme('system')}
          >
            System
          </Button>
        </div>
      </section>
    </div>
  )
}
