import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

export async function POST(req: NextRequest) {
    try {
        const payload = await getPayload({ config })
        const body = await req.json()

        // Get authenticated user
        const { user } = await payload.auth({ headers: req.headers })

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { quoteId, travelers, emergencyContact, specialRequests, paymentMethod } = body

        // Fetch quote details
        const quote = await payload.findByID({
            collection: 'quotes',
            id: quoteId,
            depth: 2,
        })

        if (!quote) {
            return NextResponse.json(
                { error: 'Quote not found' },
                { status: 404 }
            )
        }

        // Generate booking ID
        const bookingId = `BK-${Date.now()}-${Math.random().toString(36).substring(2, 11).toUpperCase()}`

        // Calculate commissions
        const totalAmount = quote.pricing.totalPrice
        const agentCommission = totalAmount * 0.02 // 2%
        const customerCommission = totalAmount * 0.01 // 1%
        const platformCommission = agentCommission + customerCommission
        const agentPayout = totalAmount - agentCommission

        // Create booking
        const booking = await payload.create({
            collection: 'bookings',
            data: {
                bookingId,
                requirement: typeof quote.requirement === 'object' ? quote.requirement.id : quote.requirement,
                quote: quoteId,
                user: user.id,
                agent: typeof quote.agent === 'object' ? quote.agent.id : quote.agent,
                travelerDetails: travelers,
                emergencyContact,
                specialRequests,
                paymentStatus: 'pending',
                bookingStatus: 'pending',
                totalAmount,
                paidAmount: 0,
                agentCommission,
                customerCommission,
                platformCommission,
                agentPayout,
                bookingDate: new Date().toISOString(),
                travelDate: new Date().toISOString(), // Should come from requirement
            },
        })

        // Create payment order based on payment method
        let paymentOrder

        if (paymentMethod === 'paypal') {
            // PayPal integration
            paymentOrder = await createPayPalOrder(totalAmount, bookingId)
        } else if (paymentMethod === 'razorpay') {
            // Razorpay integration
            paymentOrder = await createRazorpayOrder(totalAmount, bookingId)
        } else if (paymentMethod === 'stripe') {
            // Stripe integration
            paymentOrder = await createStripePaymentIntent(totalAmount, bookingId)
        }

        return NextResponse.json({
            success: true,
            booking,
            paymentOrder,
        })
    } catch (error: any) {
        console.error('Payment order creation error:', error)
        return NextResponse.json(
            { error: 'Failed to create payment order', message: error.message },
            { status: 500 }
        )
    }
}

// PayPal Integration
async function createPayPalOrder(amount: number, bookingId: string) {
    const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID
    const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET
    const PAYPAL_API_URL = process.env.PAYPAL_MODE === 'live'
        ? 'https://api-m.paypal.com'
        : 'https://api-m.sandbox.paypal.com'

    // Get access token
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64')
    const tokenResponse = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
    })

    const { access_token } = await tokenResponse.json()

    // Create order
    const orderResponse = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            intent: 'CAPTURE',
            purchase_units: [{
                reference_id: bookingId,
                amount: {
                    currency_code: 'INR',
                    value: amount.toFixed(2),
                },
            }],
            application_context: {
                return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/booking/success`,
                cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/booking/cancel`,
            },
        }),
    })

    return orderResponse.json()
}

// Razorpay Integration
async function createRazorpayOrder(amount: number, bookingId: string) {
    const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID
    const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET

    const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64')

    const response = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            amount: amount * 100, // Convert to paise
            currency: 'INR',
            receipt: bookingId,
            notes: {
                bookingId,
            },
        }),
    })

    return response.json()
}

// Stripe Integration
async function createStripePaymentIntent(amount: number, bookingId: string) {
    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY

    const response = await fetch('https://api.stripe.com/v1/payment_intents', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            amount: (amount * 100).toString(), // Convert to cents
            currency: 'inr',
            'metadata[bookingId]': bookingId,
        }),
    })

    return response.json()
}
