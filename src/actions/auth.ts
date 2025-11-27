'use server'

import { cookies } from 'next/headers'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'

export async function loginAction(formData: any) {
    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                identifier: formData.identifier,
                password: formData.password,
            }),
        })

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}))
            return { success: false, error: errorData.message || 'Login failed' }
        }

        const data = await res.json()
        const { accessToken, refreshToken, user } = data

        const cookieStore = await cookies()

        cookieStore.set('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            sameSite: 'lax',
        })

        if (refreshToken) {
            cookieStore.set('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                sameSite: 'lax',
            })
        }

        cookieStore.set('userData', JSON.stringify(user), {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            sameSite: 'lax',
        })

        return { success: true, user }
    } catch (error) {
        console.error('Login Action Error:', error)
        return { success: false, error: 'Network error or server unavailable' }
    }
}

export async function registerAction(formData: any) {
    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: formData.username,
                email: formData.email,
                password: formData.password,
            }),
        })

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}))
            return { success: false, error: errorData.message || 'Registration failed' }
        }

        const data = await res.json()
        const { accessToken, refreshToken, user } = data

        const cookieStore = await cookies()

        cookieStore.set('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            sameSite: 'lax',
        })

        if (refreshToken) {
            cookieStore.set('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                sameSite: 'lax',
            })
        }

        cookieStore.set('userData', JSON.stringify(user), {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            sameSite: 'lax',
        })

        return { success: true, user }
    } catch (error) {
        console.error('Register Action Error:', error)
        return { success: false, error: 'Network error or server unavailable' }
    }
}

export async function logoutAction() {
    const cookieStore = await cookies()
    cookieStore.delete('accessToken')
    cookieStore.delete('refreshToken')
    cookieStore.delete('userData')
    return { success: true }
}
