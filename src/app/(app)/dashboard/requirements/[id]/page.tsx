import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import {
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  MapPin,
  MessageSquare,
  Star,
  Users,
  XCircle,
} from 'lucide-react'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

export default async function RequirementDetailsPage({ params }: { params: { id: string } }) {
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

  // Fetch requirement
  const requirement = await payload.findByID({
    collection: 'requirements',
    id: params.id,
  })

  if (!requirement || requirement.user !== user.id) {
    notFound()
  }

  // Fetch quotes for this requirement
  const quotes = await payload.find({
    collection: 'quotes',
    where: {
      requirement: {
        equals: params.id,
      },
    },
    depth: 2,
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="ghost">← Back to Dashboard</Button>
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Requirement Details */}
        <div className="lg:col-span-2">
          <Card className="mb-6 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold capitalize">
                  {requirement.serviceType.replace('-', ' ')} Requirement
                </h1>
                <p className="text-sm text-gray-600">
                  Submitted on {new Date(requirement.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-600 capitalize">
                {requirement.status}
              </div>
            </div>

            {/* Service-specific details */}
            {requirement.serviceType === 'tour-package' && requirement.tourPackageDetails && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-1 h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Destinations</div>
                      <div className="font-semibold">
                        {requirement.tourPackageDetails.destinations}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="mt-1 h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Duration</div>
                      <div className="font-semibold">{requirement.tourPackageDetails.duration}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="mt-1 h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Travel Date</div>
                      <div className="font-semibold">
                        {new Date(requirement.tourPackageDetails.travelDates).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="mt-1 h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Travelers</div>
                      <div className="font-semibold">
                        {requirement.tourPackageDetails.numberOfTravelers} people
                      </div>
                    </div>
                  </div>
                </div>

                {requirement.tourPackageDetails.budgetPerPerson && (
                  <div className="rounded-lg bg-blue-50 p-4">
                    <div className="text-sm text-gray-600">Budget per Person</div>
                    <div className="text-2xl font-bold text-blue-600">
                      ₹{requirement.tourPackageDetails.budgetPerPerson.toLocaleString()}
                    </div>
                  </div>
                )}

                {requirement.tourPackageDetails.inclusions &&
                  requirement.tourPackageDetails.inclusions.length > 0 && (
                    <div>
                      <div className="mb-2 text-sm font-semibold">Inclusions</div>
                      <div className="flex flex-wrap gap-2">
                        {requirement.tourPackageDetails.inclusions.map((inc: string) => (
                          <span
                            key={inc}
                            className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700 capitalize"
                          >
                            {inc}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            )}

            {requirement.additionalNotes && (
              <div className="mt-4 rounded-lg bg-[#e8e8e4]-50 p-4">
                <div className="mb-2 text-sm font-semibold">Additional Notes</div>
                <p className="text-gray-700">{requirement.additionalNotes}</p>
              </div>
            )}
          </Card>

          {/* Quotes Section */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Quotes Received ({quotes.totalDocs})</h2>
            </div>

            {quotes.totalDocs > 0 ? (
              <div className="space-y-4">
                {quotes.docs.map((quote: any) => (
                  <Card key={quote.id} className="p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">
                          {typeof quote.agent === 'object'
                            ? quote.agent.companyName
                            : 'Travel Agent'}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>4.8 (120 reviews)</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Total Price</div>
                        <div className="text-2xl font-bold text-blue-600">
                          ₹{quote.totalPrice.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {quote.inclusions && (
                      <div className="mb-4">
                        <div className="mb-2 text-sm font-semibold">Inclusions</div>
                        <div className="flex flex-wrap gap-2">
                          {quote.inclusions.map((inc: string, idx: number) => (
                            <span
                              key={idx}
                              className="flex items-center gap-1 text-sm text-gray-600"
                            >
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              {inc}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Link href={`/dashboard/quotes/${quote.id}`} className="flex-1">
                        <Button className="w-full" variant="outline">
                          <FileText className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                      </Link>
                      <Button className="flex-1 bg-green-600 hover:bg-green-700">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Accept Quote
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <FileText className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <h3 className="mb-2 text-lg font-semibold">No quotes yet</h3>
                <p className="mb-4 text-gray-600">
                  Our verified agents are reviewing your requirement. You'll receive quotes within
                  24-48 hours.
                </p>
                <Link href="/ai-assistant">
                  <Button variant="outline">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Chat with AI Assistant
                  </Button>
                </Link>
              </Card>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="mb-4 font-semibold">Quick Actions</h3>
            <div className="space-y-3">
              <Link href={`/messages/${requirement.id}`}>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Message Agents
                </Button>
              </Link>
              <Link href="/ai-assistant">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Get AI Suggestions
                </Button>
              </Link>
              <Button
                variant="outline"
                className="w-full justify-start text-red-600 hover:text-red-700"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Cancel Requirement
              </Button>
            </div>
          </Card>

          <Card className="bg-blue-50 p-6">
            <h3 className="mb-2 font-semibold text-blue-900">Need Help?</h3>
            <p className="mb-4 text-sm text-blue-700">
              Our customer support team is available 24/7 to assist you.
            </p>
            <Button variant="outline" className="w-full">
              Contact Support
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
