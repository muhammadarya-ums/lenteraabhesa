// app/api/visitors/route.ts
// Proxy ke counterapi.dev — request dari server, bebas CORS

import { NextRequest, NextResponse } from 'next/server'

const COUNTER_NAMESPACE = 'lenteraabhesa'
const COUNTER_KEY = 'visitors'
const BASE_URL = `https://api.counterapi.dev/v1/${COUNTER_NAMESPACE}/${COUNTER_KEY}`

// GET /api/visitors?action=read   → hanya baca, tidak increment
// GET /api/visitors?action=up     → increment lalu baca
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action') // 'up' | 'read'

  const apiUrl = action === 'up' ? `${BASE_URL}/up` : BASE_URL

  try {
    const res = await fetch(apiUrl, {
      // Tidak cache supaya selalu dapat angka terbaru
      cache: 'no-store',
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: `counterapi error: ${res.status}` },
        { status: res.status }
      )
    }

    const data = await res.json()

    return NextResponse.json({ count: data.count ?? 0 })
  } catch (err) {
    console.error('[API /visitors] Fetch error:', err)
    return NextResponse.json(
      { error: 'Failed to reach counterapi.dev' },
      { status: 500 }
    )
  }
}
