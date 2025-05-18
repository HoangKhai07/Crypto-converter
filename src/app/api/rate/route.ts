    import type { NextRequest } from 'next/server'
    import { NextResponse } from 'next/server'

    // Simple in-memory cache
    const cache = new Map()

    export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const from = searchParams.get('from')?.toLowerCase()
    const to = searchParams.get('to')?.toLowerCase()

    if (!from || !to) {
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    const cacheKey = `${from}-${to}`
    
    // Check cache first
    if (cache.has(cacheKey)) {
        return NextResponse.json(cache.get(cacheKey))
    }

    try {
        // Using CoinGecko Public API
        const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${from}&vs_currencies=${to}`)
        const data = await res.json()
        
        if (!data[from] || !data[from][to]) {
        return NextResponse.json({ error: 'Invalid crypto pair' }, { status: 400 })
        }

        const rate = data[from][to]
        const result = { from, to, rate, timestamp: Date.now() }
        
        // Cache for 1 minute
        cache.set(cacheKey, result)
        setTimeout(() => cache.delete(cacheKey), 60000)

        return NextResponse.json(result)
    } catch (error) {
        console.error('API Error:', error)
        return NextResponse.json({ error: 'Failed to fetch rate' }, { status: 500 })
    }
    }