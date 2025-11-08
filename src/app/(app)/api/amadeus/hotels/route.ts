import { amadeus } from '@/lib/amadeus'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams

        const params = {
            cityCode: searchParams.get('cityCode') || '',
            checkInDate: searchParams.get('checkInDate') || '',
            checkOutDate: searchParams.get('checkOutDate') || '',
            adults: parseInt(searchParams.get('adults') || '1'),
            roomQuantity: searchParams.get('roomQuantity') ? parseInt(searchParams.get('roomQuantity')) : 1,
        }

        const hotels = await amadeus.searchHotels(params)

        return NextResponse.json(hotels)
    } catch (error: any) {
        console.error('Hotel search error:', error)
        return NextResponse.json(
            { error: 'Failed to search hotels', message: error.message },
            { status: 500 }
        )
    }
}
