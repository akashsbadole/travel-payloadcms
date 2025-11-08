import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import { Calendar, Download, MessageSquare, Search, Star } from 'lucide-react'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function MyBookingsPage() {
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

  // Fetch user's bookings
  const bookings = await payload.find({
    collection: 'bookings',
    where: { user: { equals: user.id } },
    sort: '-createdAt',
    depth: 2,
  })

  // Separate bookings by status
  const upcomingBookings = bookings.docs.filter(
    (b: any) =>
      ['confirmed', 'pending'].includes(b.bookingStatus) && new Date(b.travelDate) > new Date(),
  )
  const pastBookings = bookings.docs.filter(
    (b: any) => b.bookingStatus === 'completed' || new Date(b.travelDate) < new Date(),
  )
  const cancelledBookings = bookings.docs.filter((b: any) => b.bookingStatus === 'cancelled')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">My Bookings</h1>
        <p className="text-gray-600">Manage and track all your travel bookings</p>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6 p-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input placeholder="Search bookings..." className="pl-10" />
          </div>
          <Button variant="outline">Filter</Button>
        </div>
      </Card>

      {/* Tabs */}
      <div className="mb-6 flex gap-4 border-b">
        <button className="border-b-2 border-blue-600 px-4 py-2 font-semibold text-blue-600">
          Upcoming ({upcomingBookings.length})
        </button>
        <button className="px-4 py-2 text-gray-600 hover:text-gray-900">
          Past ({pastBookings.length})
        </button>
        <button className="px-4 py-2 text-gray-600 hover:text-gray-900">
          Cancelled ({cancelledBookings.length})
        </button>
      </div>

      {/* Bookings List */}
      {upcomingBookings.length > 0 ? (
        <div className="space-y-4">
          {upcomingBookings.map((booking: any) => (
            <Card key={booking.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700 capitalize">
                      {booking.bookingStatus}
                    </span>
                    <span className="text-sm text-gray-600">Booking ID: {booking.bookingId}</span>
                  </div>

                  <h3 className="mb-2 text-xl font-semibold">
                    {typeof booking.requirement === 'object'
                      ? booking.requirement.serviceType.replace('-', ' ').toUpperCase()
                      : 'Travel Booking'}
                  </h3>

                  <div className="mb-4 flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Travel Date: {new Date(booking.travelDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      <span>
                        {typeof booking.agent === 'object'
                          ? booking.agent.companyName
                          : 'Travel Agent'}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-gray-600">Total Amount</div>
                    <div className="text-2xl font-bold text-blue-600">
                      ₹{booking.totalAmount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      Paid: ₹{booking.paidAmount.toLocaleString()}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link href={`/dashboard/bookings/${booking.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download Voucher
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Contact Agent
                    </Button>
                  </div>
                </div>

                <div className="ml-4 h-24 w-24 rounded-lg bg-linear-to-br from-blue-500 to-purple-500" />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Calendar className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-semibold">No upcoming bookings</h3>
          <p className="mb-4 text-gray-600">Start planning your next adventure!</p>
          <Link href="/packages">
            <Button>Browse Packages</Button>
          </Link>
        </Card>
      )}
    </div>
  )
}
