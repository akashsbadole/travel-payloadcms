import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
    CheckCircle,
    Download,
    Home,
    Mail,
    MessageSquare,
    Share2
} from 'lucide-react'
import Link from 'next/link'

export default function BookingSuccessPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="mx-auto max-w-2xl text-center">
                {/* Success Icon */}
                <div className="mb-6 flex justify-center">
                    <div className="rounded-full bg-green-100 p-6">
                        <CheckCircle className="h-16 w-16 text-green-600" />
                    </div>
                </div>

                {/* Success Message */}
                <h1 className="mb-4 text-3xl font-bold text-gray-900">
                    Booking Confirmed!
                </h1>
                <p className="mb-8 text-lg text-gray-600">
                    Your booking has been successfully confirmed. We've sent a confirmation email with all the details.
                </p>

                {/* Booking Details Card */}
                <Card className="mb-8 p-6 text-left">
                    <h2 className="mb-4 text-xl font-bold">Booking Details</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Booking ID</span>
                            <span className="font-semibold">BK-2024-001234</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Booking Date</span>
                            <span className="font-semibold">{new Date().toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Total Amount</span>
                            <span className="font-semibold text-green-600">₹55,000</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Payment Status</span>
                            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                                Paid
                            </span>
                        </div>
                    </div>
                </Card>

                {/* Action Buttons */}
                <div className="mb-8 grid gap-4 md:grid-cols-2">
                    <Button variant="outline" className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        Download Invoice
                    </Button>
                    <Button variant="outline" className="w-full">
                        <Share2 className="mr-2 h-4 w-4" />
                        Share Booking
                    </Button>
                </div>

                {/* What's Next */}
                <Card className="mb-8 bg-blue-50 p-6 text-left">
                    <h3 className="mb-4 font-semibold text-blue-900">What's Next?</h3>
                    <div className="space-y-3 text-sm text-blue-800">
                        <div className="flex items-start gap-2">
                            <Mail className="mt-1 h-4 w-4" />
                            <span>Check your email for booking confirmation and vouchers</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <MessageSquare className="mt-1 h-4 w-4" />
                            <span>The travel agent will contact you with further details</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <CheckCircle className="mt-1 h-4 w-4" />
                            <span>You can track your booking status in your dashboard</span>
                        </div>
                    </div>
                </Card>

                {/* Navigation Buttons */}
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                    <Link href="/dashboard">
                        <Button size="lg" className="w-full sm:w-auto">
                            <Home className="mr-2 h-5 w-5" />
                            Go to Dashboard
                        </Button>
                    </Link>
                    <Link href="/dashboard/bookings">
                        <Button variant="outline" size="lg" className="w-full sm:w-auto">
                            View My Bookings
                        </Button>
                    </Link>
                </div>

                {/* Support */}
                <div className="mt-12 text-sm text-gray-600">
                    <p>Need help? Contact our support team at</p>
                    <a href="mailto:support@travelhub.com" className="font-semibold text-blue-600 hover:underline">
                        support@travelhub.com
                    </a>
                    <span> or call </span>
                    <a href="tel:+911234567890" className="font-semibold text-blue-600 hover:underline">
                        +91 123 456 7890
                    </a>
                </div>
            </div>
        </div>
    )
}
