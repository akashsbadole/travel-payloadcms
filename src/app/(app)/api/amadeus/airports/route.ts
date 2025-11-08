import { amadeus } from '@/lib/amadeus'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams
        const keyword = searchParams.get('keyword') || ''

        if (!keyword || keyword.length < 2) {
            return NextResponse.json({ data: [] })
        }

        const airports = await amadeus.searchAirports(keyword)

        return NextResponse.json(airports)
    } catch (error: any) {
        console.error('Airport search error:', error)
        return NextResponse.json(
            { error: 'Failed to search airports', message: error.message },
            { status: 500 }
        )
    }
}
