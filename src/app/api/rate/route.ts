    import type { NextRequest } from 'next/server'
    import { NextResponse } from 'next/server'

    // Simple in-memory cache
    const cache = new Map()

    const cryptoIdMap: Record<string, string> = {
    //crypto
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'LTC': 'litecoin',
    'XRP': 'ripple',
    'ADA': 'cardano',
    'DOGE': 'dogecoin',
    'SOL': 'solana',
    'USD': 'usd',
    'EUR': 'eur',
    'BNB': 'binancecoin',
    'DOT': 'polkadot',
    'AVAX': 'avalanche-2',
    'MATIC': 'matic-network',
    'SHIB': 'shiba-inu',
    'TRX': 'tron',
    'LINK': 'chainlink',
    'UNI': 'uniswap',
    'XLM': 'stellar',
    'ATOM': 'cosmos',
    'ETC': 'ethereum-classic',
    'FIL': 'filecoin',
    'VET': 'vechain',
    'ALGO': 'algorand',
    'ICP': 'internet-computer',
    'MANA': 'decentraland',
    'THETA': 'theta-token',
    'XMR': 'monero',
    'EOS': 'eos',
    'AAVE': 'aave',
    'AXS': 'axie-infinity',
    'XTZ': 'tezos',
    'NEO': 'neo',
    'MIOTA': 'iota',
    'FTM': 'fantom',
    'KSM': 'kusama',
    'CAKE': 'pancakeswap-token',
    'HBAR': 'hedera-hashgraph',
    'FLOW': 'flow',
    'SAND': 'the-sandbox',
    'ONE': 'harmony',
    'ENJ': 'enjincoin',
    'GRT': 'the-graph',
    'DASH': 'dash',
    'CHZ': 'chiliz',
    'XEC': 'ecash',
    'ZEC': 'zcash',
    'EGLD': 'elrond-erd-2',
    'BAT': 'basic-attention-token',
    'NEAR': 'near',
    'HNT': 'helium',
    'WAVES': 'waves',
    'DCR': 'decred',
    'COMP': 'compound-governance-token',
    'MKR': 'maker',
    'ZIL': 'zilliqa',
    'QTUM': 'qtum',
    
    //fiat
    'JPY': 'jpy',
    'GBP': 'gbp',
    'AUD': 'aud',
    'CAD': 'cad',
    'CNY': 'cny',
    'INR': 'inr',
    'SGD': 'sgd',
    'CHF': 'chf',
    'KRW': 'krw',
    'BRL': 'brl'
    }

    const isFiat = (currency: string):boolean => {
        return ['USD', 'EUR'].includes(currency.toUpperCase())
    }

    export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const from = searchParams.get('from')?.toUpperCase()
    const to = searchParams.get('to')?.toUpperCase()

    if (!from || !to) {
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    if (!cryptoIdMap[from] || !cryptoIdMap[to]) {
        return NextResponse.json({ error: 'Unsupported currency' }, { status: 400 })
      }

    const cacheKey = `${from}-${to}`
    
    // Check cache first
    if (cache.has(cacheKey)) {
        return NextResponse.json(cache.get(cacheKey))
    }

    try {

        let rate: number

        //convert from crypto to crypto
        if(!isFiat(from) && !isFiat(to)){
            const fromRes = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIdMap[from]}&vs_currencies=usd`)
            const fromData = await fromRes.json()

            const toRes = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIdMap[to]}&vs_currencies=usd`)
            const toData = await toRes.json()

            if(!fromData[cryptoIdMap[from]] || !toData[cryptoIdMap[to]]){
                return NextResponse.json({error: "Invalid crypto pair"}, {status: 400})
            }

            const fromUsdRate = fromData[cryptoIdMap[from]].usd
            const toUsdRate = toData[cryptoIdMap[to]].usd

            rate = fromUsdRate / toUsdRate

        } 
        
        //convert from fiat to crypto
        else if(isFiat(from) && !isFiat(to)){
            const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIdMap[to]}&vs_currencies=${cryptoIdMap[from].toLowerCase()}`)
            const data = await res.json()

            if(!data[cryptoIdMap[to]]){
                return NextResponse.json({error: "Invalid crypto pair"}, {status: 400})
            }

            rate = 1 / data[cryptoIdMap[to]][cryptoIdMap[from].toLowerCase()]
        }

        //convert from crypto to fiat
        else if(!isFiat(from) && isFiat(to)){
            const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIdMap[from].toLowerCase()}&vs_currencies=${cryptoIdMap[to]}`)
            const data = await res.json()

            if(!data[cryptoIdMap[from]]){
                return NextResponse.json({error: "Invalid crypto pair"}, {status: 400})
            }

            rate = data[cryptoIdMap[from]][cryptoIdMap[to].toLowerCase()]
        }



        else {
            return NextResponse.json({ error: 'Fiat-to-fiat conversion not supported' }, { status: 400 })
          }
        
        const result = {    
            from, 
            to, 
            rate,
            timestamp: Date.now() }
        
        // Cache for 1 minute
        cache.set(cacheKey, result)
        setTimeout(() => cache.delete(cacheKey), 60000)

        return NextResponse.json(result)
    } catch (error) {
        console.error('API Error:', error)
        return NextResponse.json({ error: 'Failed to fetch rate' }, { status: 500 })
    }
    }