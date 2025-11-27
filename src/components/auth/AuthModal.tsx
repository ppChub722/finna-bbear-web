'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useModalStore } from '@/store/useModalStore'
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
                    <DialogDescription>
                        {authView === 'login' ? t('loginDescription') : t('registerDescription')}
                    </DialogDescription>
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
