'use client'

import { Button } from '@/components/ui/button'
import { useModal } from '@/hooks/useModal'
import { useLoading } from '@/hooks/useLoading'
import { useUI } from '@/hooks/useUI'
import { toast } from 'sonner'
import { useThemeStore } from '@/store/useThemeStore'
import { useAuthStore } from '@/store/useAuthStore'
import { getMeAction } from '@/actions/auth'

export function GlobalComponentsView() {
  const { confirm, info, custom } = useModal()
  const { startLoading, stopLoading } = useLoading()
  const { isSidebarOpen, toggleSidebar } = useUI()

  // Use reactive auth state
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore()

  const handleLoading = () => {
    startLoading()
    setTimeout(() => {
      stopLoading()
    }, 2000)
  }

  const handleShowUserData = () => {
    if (isAuthenticated && user) {
      info({
        title: 'Current User Data',
        description: `ID: ${user.id}\nUsername: ${user.username}\nEmail: ${user.email}`,
      })
      toast.success(`Logged in as ${user.username}`)
    } else {
      toast.error('No user logged in')
    }
  }

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Modals</h2>
        <div className="flex flex-wrap gap-4">
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
            Async Confirm (1s)
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              confirm({
                title: 'Quick Action',
                description: 'This will execute immediately without delay.',
                confirmText: 'Execute',
                onConfirm: () => {
                  // Synchronous callback - no await needed
                  toast.success('Action executed instantly!')
                },
              })
            }
          >
            Sync Confirm (Instant)
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              confirm({
                title: 'Slow Operation',
                description: 'This simulates a slow network request (3 seconds).',
                confirmText: 'Start',
                onConfirm: async () => {
                  await new Promise((resolve) => setTimeout(resolve, 3000))
                  toast.success('Slow operation completed!')
                },
              })
            }
          >
            Async Confirm (3s)
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

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Authentication & User Data</h2>

        {/* Real-time Auth Status Card */}
        <div className="bg-muted/50 border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Authentication Status:</span>
            <span className={`text-sm font-semibold ${isAuthenticated ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {authLoading ? 'Loading...' : isAuthenticated ? '✓ Authenticated' : '✗ Not Authenticated'}
            </span>
          </div>

          {isAuthenticated && user && (
            <div className="space-y-2 pt-2 border-t">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">User ID:</span>
                <span className="font-mono">{user.id}</span>

                <span className="text-muted-foreground">Username:</span>
                <span className="font-medium">{user.username}</span>

                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">{user.email}</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={handleShowUserData}
            disabled={!isAuthenticated}
          >
            Show User Data Modal
          </Button>

          <Button
            variant="secondary"
            onClick={() => {
              if (isAuthenticated && user) {
                const userJson = JSON.stringify(user, null, 2)
                navigator.clipboard.writeText(userJson)
                toast.success('User data copied to clipboard!')
              } else {
                toast.error('No user data to copy')
              }
            }}
            disabled={!isAuthenticated}
          >
            Copy User JSON
          </Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">API Testing</h2>

        <div className="flex flex-wrap gap-4">
          <Button
            variant="outline"
            onClick={async () => {
              try {
                const result = await getMeAction()

                if (result.success) {
                  info({
                    title: 'GET /me - Success',
                    description: JSON.stringify(result.data, null, 2),
                  })
                  toast.success('User data fetched successfully!')
                } else {
                  toast.error(result.error || 'Failed to fetch user data')
                }
              } catch (error: any) {
                toast.error(error.message || 'Error fetching user data')
              }
            }}
          >
            Test GET /me
          </Button>
        </div>
      </section>
    </div>
  )
}
