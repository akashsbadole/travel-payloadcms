import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import {
    Calendar,
    DollarSign,
    FileText,
    Plus,
    TrendingUp
} from 'lucide-react'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function AgentDashboardPage() {
    const payload = await getPayloadHMR({ config: configPromise })
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')

    if (!token) {
        redirect('/login')
    }

    const headers = new Headers()
    headers.set('cookie', `payload-token=${token.value}`)

    const { user } = await payload.auth({ headers })

    if (!user) {
        redirect('/login')
    }

    // Check if user is an agent
    const agent = await payload.find({
        collection: 'agents',
        where: {
            user: {
                equals: user.id,
            },
        },
        limit: 1,
    })

    if (agent.totalDocs === 0) {
        redirect('/agent/register')
    }

    const agentData = agent.docs[0]

    // Fetch agent's quotes
    const quotes = await payload.find({
        collection: 'quotes',
        where: {
            agent: {
                equals: agentData.id,
            },
        },
        limit: 10,
        sort: '-createdAt',
    })

    // Fetch agent's bookings
    const bookings = await payload.find({
        collection: 'bookings',
        where: {
            agent: {
                equals: agentData.id,
            },
        },
        limit: 10,
        sort: '-createdAt',
    })

    // Fetch recent requirements
    const requirements = await payload.find({
        collection: 'requirements',
        where: {
            status: {
                in: ['submitted', 'in-review'],
            },
        },
        limit: 10,
        sort: '-createdAt',
    })

    // Calculate stats
    const pendingQuotes = quotes.docs.filter((q: any) => q.status === 'sent').length
    const activeLeads = requirements.totalDocs
    const totalRevenue = agentData.totalEarnings || 0

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Agent Dashboard</h1>
                    <p className="text-gray-600">Welcome back, {agentData.companyName}!</p>
                </div>
                <Link href="/admin/collections/quote-templates">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Quote
                    </Button>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="mb-8 grid gap-6 md:grid-cols-4">
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Pending Quotes</p>
                            <p className="text-3xl font-bold">{pendingQuotes}</p>
                        </div>
                        <div className="rounded-full bg-blue-100 p-3">
                            <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Active Leads</p>
                            <p className="text-3xl font-bold">{activeLeads}</p>
                        </div>
                        <div className="rounded-full bg-green-100 p-3">
                            <TrendingUp className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Revenue</p>
                            <p className="text-3xl font-bold">₹{totalRevenue.toLocaleString()}</p>
                        </div>
                        <div className="rounded-full bg-purple-100 p-3">
                            <DollarSign className="h-6 w-6 text-purple-600" />
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Bookings</p>
                            <p className="text-3xl font-bold">{bookings.totalDocs}</p>
                        </div>
                        <div className="rounded-full bg-orange-100 p-3">
                            <Calendar className="h-6 w-6 text-orange-600" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="mb-8 grid gap-6 md:grid-cols-3">
                <Link href="/admin/collections/requirements">
                    <Card className="group cursor-pointer p-6 transition-all hover:shadow-lg">
                        <FileText className="mb-3 h-8 w-8 text-blue-600" />
                        <h3 className="mb-2 font-semibold">Browse Requirements</h3>
                        <p className="text-sm text-gray-600">View and respond to customer requirements</p>
                    </Card>
                </Link>

                <Link href="/admin/collections/quotes">
                    <Card className="group cursor-pointer p-6 transition-all hover:shadow-lg">
                        <FileText className="mb-3 h-8 w-8 text-green-600" />
                        <h3 className="mb-2 font-semibold">My Quotes</h3>
                        <p className="text-sm text-gray-600">Manage your submitted quotes</p>
                    </Card>
                </Link>

                <Link href="/admin/collections/quote-templates">
                    <Card className="group cursor-pointer p-6 transition-all hover:shadow-lg">
                        <FileText className="mb-3 h-8 w-8 text-purple-600" />
                        <h3 className="mb-2 font-semibold">Quote Templates</h3>
                        <p className="text-sm text-gray-600">Create and manage quote templates</p>
                    </Card>
                </Link>
            </div>

            {/* Recent Requirements */}
            <div className="mb-8">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Recent Requirements</h2>
                    <Link href="/admin/collections/requirements">
                        <Button variant="outline">View All</Button>
                    </Link>
                </div>

                {requirements.docs.length > 0 ? (
                    <div className="space-y-4">
                        {requirements.docs.slice(0, 5).map((req: any) => (
                            <Card key={req.id} className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold capitalize">
                                            {req.serviceType.replace('-', ' ')}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Status: <span className="capitalize">{req.status}</span>
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Posted: {new Date(req.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <Link href={`/admin/collections/quotes/create?requirement=${req.id}`}>
                                        <Button>Create Quote</Button>
                                    </Link>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="p-12 text-center">
                        <FileText className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                        <h3 className="mb-2 text-lg font-semibold">No requirements available</h3>
                        <p className="text-gray-600">Check back later for new customer requirements</p>
                    </Card>
                )}
            </div>

            {/* Earnings Overview */}
            <div className="grid gap-8 md:grid-cols-2">
                <Card className="p-6">
                    <h2 className="mb-4 text-xl font-bold">Earnings Overview</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Total Earnings</span>
                            <span className="font-semibold">₹{agentData.totalEarnings?.toLocaleString() || 0}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Pending Payout</span>
                            <span className="font-semibold text-orange-600">
                                ₹{agentData.pendingPayout?.toLocaleString() || 0}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Paid Out</span>
                            <span className="font-semibold text-green-600">
                                ₹{agentData.paidOut?.toLocaleString() || 0}
                            </span>
                        </div>
                    </div>
                    <Link href="/admin/collections/payouts/create">
                        <Button className="mt-6 w-full">Request Payout</Button>
                    </Link>
                </Card>

                <Card className="p-6">
                    <h2 className="mb-4 text-xl font-bold">Performance</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Average Rating</span>
                            <span className="flex items-center gap-1 font-semibold">
                                <span>{agentData.averageRating?.toFixed(1) || '0.0'}</span>
                                <span className="text-yellow-500">★</span>
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Total Reviews</span>
                            <span className="font-semibold">{agentData.totalReviews || 0}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Total Bookings</span>
                            <span className="font-semibold">{agentData.totalBookings || 0}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Quotes Submitted</span>
                            <span className="font-semibold">{quotes.totalDocs}</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
