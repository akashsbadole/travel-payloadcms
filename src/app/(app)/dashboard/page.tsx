import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import { Calendar, FileText, MessageSquare, Plus } from 'lucide-react'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
    const payload = await getPayloadHMR({ config: configPromise })
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')

    if (!token) {
        redirect('/login')
    }

    // Create headers with cookie
    const headers = new Headers()
    headers.set('cookie', `payload-token=${token.value}`)

    const { user } = await payload.auth({ headers })

    if (!user) {
        redirect('/login')
    }

    // Fetch user's requirements
    const requirements = await payload.find({
        collection: 'requirements',
        where: { user: { equals: user.id } },
        limit: 5,
        sort: '-createdAt',
    })

    // Fetch user's bookings
    const bookings = await payload.find({
        collection: 'bookings',
        where: { user: { equals: user.id } },
        limit: 5,
        sort: '-createdAt',
    })

    // Count quotes received
    const quotesCount = await payload.count({
        collection: 'quotes',
        where: {
            requirement: {
                in: requirements.docs.map((r) => r.id),
            },
        },
    })

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Welcome back, {user.name || 'Traveler'}!</h1>
                    <p className="text-gray-600">Manage your travel requirements and bookings</p>
                </div>
                <Link href="/requirements/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Requirement
                    </Button>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="mb-8 grid gap-6 md:grid-cols-3">
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Active Requirements</p>
                            <p className="text-3xl font-bold">{requirements.totalDocs}</p>
                        </div>
                        <div className="rounded-full bg-blue-100 p-3">
                            <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Quotes Received</p>
                            <p className="text-3xl font-bold">{quotesCount.totalDocs}</p>
                        </div>
                        <div className="rounded-full bg-green-100 p-3">
                            <MessageSquare className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Bookings</p>
                            <p className="text-3xl font-bold">{bookings.totalDocs}</p>
                        </div>
                        <div className="rounded-full bg-purple-100 p-3">
                            <Calendar className="h-6 w-6 text-purple-600" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Recent Requirements */}
            <div className="mb-8">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Recent Requirements</h2>
                    <Link href="/dashboard/requirements">
                        <Button variant="outline">View All</Button>
                    </Link>
                </div>

                {requirements.docs.length > 0 ? (
                    <div className="space-y-4">
                        {requirements.docs.map((req: any) => (
                            <Card key={req.id} className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold capitalize">{req.serviceType.replace('-', ' ')}</h3>
                                        <p className="text-sm text-gray-600">
                                            Status: <span className="capitalize">{req.status}</span>
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Created: {new Date(req.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <Link href={`/dashboard/requirements/${req.id}`}>
                                        <Button variant="outline">View Details</Button>
                                    </Link>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="p-12 text-center">
                        <FileText className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                        <h3 className="mb-2 text-lg font-semibold">No requirements yet</h3>
                        <p className="mb-4 text-gray-600">Start by submitting your first travel requirement</p>
                        <Link href="/requirements/new">
                            <Button>Submit Requirement</Button>
                        </Link>
                    </Card>
                )}
            </div>

            {/* Recent Bookings */}
            {bookings.docs.length > 0 && (
                <div>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Recent Bookings</h2>
                        <Link href="/dashboard/bookings">
                            <Button variant="outline">View All</Button>
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {bookings.docs.map((booking: any) => (
                            <Card key={booking.id} className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold">Booking #{booking.bookingId}</h3>
                                        <p className="text-sm text-gray-600">
                                            Status: <span className="capitalize">{booking.bookingStatus}</span>
                                        </p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            ₹{booking.totalAmount.toLocaleString()}
                                        </p>
                                    </div>
                                    <Link href={`/dashboard/bookings/${booking.id}`}>
                                        <Button variant="outline">View Details</Button>
                                    </Link>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
