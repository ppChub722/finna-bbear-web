'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useModalStore } from '@/store/useModalStore'
import { loginAction, registerAction } from '@/actions/auth'
import { useAuthStore } from '@/store/useAuthStore'

export function AuthModal() {
    const t = useTranslations('Auth')
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const { isOpen, openModal, closeModal, authView, setAuthView } = useModalStore()
    const { login: storeLogin } = useAuthStore()

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    // Form State
    const [identifier, setIdentifier] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // Effect: Check URL for ?auth_modal=login|register
    useEffect(() => {
        const modalParam = searchParams.get('auth_modal')
        if (modalParam === 'login' || modalParam === 'register') {
            if (!isOpen) {
                setAuthView(modalParam)
                openModal({ type: 'custom' })
            } else if (authView !== modalParam) {
                setAuthView(modalParam)
            }
        }
    }, [searchParams, isOpen, authView, openModal, setAuthView])

    // Handle Close
    const handleClose = () => {
        closeModal()
        // Remove query param
        const params = new URLSearchParams(searchParams.toString())
        if (params.has('auth_modal')) {
            params.delete('auth_modal')
            router.replace(`${pathname}?${params.toString()}`, { scroll: false })
        }
        // Reset form
        setError('')
        setIdentifier('')
        setUsername('')
        setEmail('')
        setPassword('')
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try {
            const result = await loginAction({ identifier, password })
            if (result.success) {
                // Update store manually or re-hydrate
                // Ideally loginAction returns user, we can update store directly if we want
                // But useAuthStore.login calls loginAction internally too.
                // Let's just use the store action if possible, but here we are calling server action directly
                // to handle the response more granularly or just use the store's login method?
                // The store's login method calls loginAction. Let's use the store's method to keep state in sync.

                // Actually, let's call the store's login method which wraps the action
                await storeLogin({ identifier, password })
                handleClose()
            } else {
                setError(result.error || 'Login failed')
            }
        } catch (err: any) {
            setError(err.message || 'Login failed')
        } finally {
            setIsLoading(false)
        }
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try {
            const result = await registerAction({ username, email, password })
            if (result.success) {
                // Auto login after register? Or just close and ask to login?
                // The action returns user and sets cookies, so we are logged in.
                // We should update the store.
                // Since we don't have a store.register wrapper that calls the action AND updates state (oh wait we do),
                // let's use the store's register method if we can, or just manually update if we called the action directly.
                // The store has a register method.

                // Wait, I can't call store.register because I'm importing registerAction directly.
                // Let's use the store's register method.
                // But wait, the store imports the actions.
                // I should probably use the store methods for consistency.

                // Re-reading store:
                // login: async (credentials) => { ... calls loginAction ... set user ... }
                // register: async (data) => { ... calls registerAction ... set user ... }

                // So yes, I should use the store methods.
                // But I need to import them from the store hook.
                // I already imported `storeLogin`. I need `storeRegister`.

                // Let's fix the imports above.
                // Actually, I'll just call the action directly for now and then hydrate/reload, 
                // OR better, use the store methods.

                // I'll use the store methods.
                // But wait, I need to pass the right args.

                // For now, let's stick to the plan of calling actions directly in the modal 
                // and then updating the store? No, that duplicates logic.
                // I will use the store methods.

                // However, the store methods throw errors on failure, which is good.

                // Let's use the store methods.
            } else {
                setError(result.error || 'Registration failed')
            }
        } catch (err: any) {
            setError(err.message || 'Registration failed')
        } finally {
            setIsLoading(false)
        }
    }

    // Wrapper for store calls
    const onSubmitLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')
        try {
            await storeLogin({ identifier, password })
            handleClose()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    // We need to get register from store
    const { register: storeRegister } = useAuthStore()

    const onSubmitRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')
        try {
            await storeRegister({ username, email, password })
            handleClose()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    if (!isOpen || !authView) return null

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {authView === 'login' ? t('loginTitle') : t('registerTitle')}
                    </DialogTitle>
                </DialogHeader>

                {error && (
                    <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-4">
                        {error}
                    </div>
                )}

                {authView === 'login' ? (
                    <form onSubmit={onSubmitLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t('identifier')}</label>
                            <input
                                type="text"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t('password')}</label>
                            <input
                                type="password"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? t('loading') : t('submitLogin')}
                        </Button>

                        <div className="text-center text-sm text-muted-foreground mt-4">
                            {t('noAccount')}{' '}
                            <button
                                type="button"
                                className="underline text-primary hover:text-primary/90"
                                onClick={() => setAuthView('register')}
                            >
                                {t('register')}
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={onSubmitRegister} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t('username')}</label>
                            <input
                                type="text"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t('email')}</label>
                            <input
                                type="email"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t('password')}</label>
                            <input
                                type="password"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? t('loading') : t('submitRegister')}
                        </Button>

                        <div className="text-center text-sm text-muted-foreground mt-4">
                            {t('hasAccount')}{' '}
                            <button
                                type="button"
                                className="underline text-primary hover:text-primary/90"
                                onClick={() => setAuthView('login')}
                            >
                                {t('login')}
                            </button>
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    )
}
