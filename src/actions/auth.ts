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
        console.log('Login response data:', data)

        // Backend returns: { success, message, data: { token, user } }
        const { token, user } = data.data
        const accessToken = token
        const refreshToken = null // Backend doesn't provide refresh token yet

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
        console.log('Register response data:', data)

        // Backend returns: { success, message, data: { token, user } }
        const { token, user } = data.data
        const accessToken = token
        const refreshToken = null // Backend doesn't provide refresh token yet

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

export async function getMeAction() {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get('accessToken')?.value

        if (!accessToken) {
            return { success: false, error: 'No access token found' }
        }

        const res = await fetch(`${API_URL}/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        })

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}))
            return { success: false, error: errorData.message || 'Failed to fetch user data' }
        }

        const data = await res.json()
        console.log('Get Me response data:', data)

        return { success: true, data }
    } catch (error) {
        console.error('Get Me Action Error:', error)
        return { success: false, error: 'Network error or server unavailable' }
    }
}
