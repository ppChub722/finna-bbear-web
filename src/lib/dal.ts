import { cookies } from 'next/headers'

const GO_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export async function fetchGoAPI(path: string, options: RequestInit = {}) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  const res = await fetch(`${GO_API_URL}${path}`, {
    ...options,
    headers,
    // Next.js 15+ caching defaults need careful handling
    cache: options.cache || 'no-store',
  })

  if (!res.ok) {
    throw new Error(`API Error: ${res.statusText}`)
  }

  return res.json()
}
