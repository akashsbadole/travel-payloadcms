import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

export async function POST(req: NextRequest) {
    try {
        const payload = await getPayload({ config })
        const body = await req.json()

        // Get the authenticated user from cookies
        const token = req.cookies.get('payload-token')?.value

        if (!token) {
            return NextResponse.json(
                { error: 'Unauthorized. Please log in.' },
                { status: 401 }
            )
        }

        // Verify the token and get user
        const { user } = await payload.auth({ headers: req.headers })

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized. Please log in.' },
                { status: 401 }
            )
        }

        // Create the requirement with the authenticated user
        const requirement = await payload.create({
            collection: 'requirements',
            data: {
                ...body,
                user: user.id,
            },
        })

        return NextResponse.json(requirement, { status: 201 })
    } catch (error: any) {
        console.error('Error creating requirement:', error)
        return NextResponse.json(
            {
                error: 'Failed to create requirement',
                message: error.message,
                errors: error.data?.errors || [],
            },
            { status: 500 }
        )
    }
}

export async function GET(req: NextRequest) {
    try {
        const payload = await getPayload({ config })

        // Get the authenticated user
        const { user } = await payload.auth({ headers: req.headers })

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized. Please log in.' },
                { status: 401 }
            )
        }

        // Get requirements for the authenticated user
        const requirements = await payload.find({
            collection: 'requirements',
            where: {
                user: {
                    equals: user.id,
                },
            },
            sort: '-createdAt',
        })

        return NextResponse.json(requirements)
    } catch (error: any) {
        console.error('Error fetching requirements:', error)
        return NextResponse.json(
            {
                error: 'Failed to fetch requirements',
                message: error.message,
            },
            { status: 500 }
        )
    }
}
