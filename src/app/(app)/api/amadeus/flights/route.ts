import { amadeus } from '@/lib/amadeus'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams

        const params = {
            origin: searchParams.get('origin') || '',
            destination: searchParams.get('destination') || '',
            departureDate: searchParams.get('departureDate') || '',
            returnDate: searchParams.get('returnDate') || undefined,
            adults: parseInt(searchParams.get('adults') || '1'),
            children: searchParams.get('children') ? parseInt(searchParams.get('children')) : undefined,
            infants: searchParams.get('infants') ? parseInt(searchParams.get('infants')) : undefined,
            travelClass: searchParams.get('travelClass') as any || 'ECONOMY',
            max: 20,
        }

        const flights = await amadeus.searchFlights(params)

        return NextResponse.json(flights)
    } catch (error: any) {
        console.error('Flight search error:', error)
        return NextResponse.json(
            { error: 'Failed to search flights', message: error.message },
            { status: 500 }
        )
    }
}
