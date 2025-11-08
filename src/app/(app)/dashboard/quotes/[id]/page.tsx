import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import {
  Calendar,
  CheckCircle,
  Clock,
  Download,
  FileText,
  Heart,
  Star,
  XCircle,
} from 'lucide-react'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

export default async function QuoteDetailsPage({ params }: { params: { id: string } }) {
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

  // Fetch quote with full details
  const quote = await payload.findByID({
    collection: 'quotes',
    id: params.id,
    depth: 3,
  })

  if (!quote) {
    notFound()
  }

  const requirement = typeof quote.requirement === 'object' ? quote.requirement : null
  const agent = typeof quote.agent === 'object' ? quote.agent : null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href={`/dashboard/requirements/${requirement?.id}`}>
          <Button variant="ghost">← Back to Requirement</Button>
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Quote Header */}
          <Card className="mb-6 p-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold">Quote Details</h1>
                <p className="text-sm text-gray-600">Quote #{quote.quoteNumber || quote.id}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Agent Info */}
            <div className="mb-6 flex items-center gap-4 rounded-lg bg-[#e8e8e4]-50 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">
                {agent?.companyName?.charAt(0) || 'A'}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{agent?.companyName || 'Travel Agent'}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>
                    {agent?.averageRating || 4.8} ({agent?.totalReviews || 0} reviews)
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Response Time</div>
                <div className="font-semibold">{quote.responseTime || 2} hours</div>
              </div>
            </div>

            {/* Pricing */}
            <div className="mb-6">
              <h2 className="mb-4 text-xl font-bold">Pricing Details</h2>
              <div className="space-y-3 rounded-lg bg-blue-50 p-4">
                {quote.priceBreakdown && quote.priceBreakdown.length > 0 ? (
                  quote.priceBreakdown.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-gray-700">{item.item}</span>
                      <span className="font-semibold">₹{item.amount.toLocaleString()}</span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Base Price</span>
                      <span className="font-semibold">
                        ₹{quote.pricing.basePrice.toLocaleString()}
                      </span>
                    </div>
                    {quote.pricing.taxes && quote.pricing.taxes > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-700">Taxes & Fees</span>
                        <span className="font-semibold">
                          ₹{quote.pricing.taxes.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {quote.pricing.discount && quote.pricing.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span className="font-semibold">
                          -₹{quote.pricing.discount.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </>
                )}
                <div className="border-t border-blue-200 pt-3">
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">Total Price</span>
                    <span className="font-bold text-blue-600">
                      ₹{quote.pricing.totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Highlights */}
            {quote.highlights && quote.highlights.length > 0 && (
              <div className="mb-6">
                <h2 className="mb-4 text-xl font-bold">Highlights</h2>
                <div className="grid gap-3 md:grid-cols-2">
                  {quote.highlights.map((item: any, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="mt-1 h-5 w-5 text-green-500" />
                      <span className="text-gray-700">{item.highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inclusions */}
            {quote.inclusions && quote.inclusions.length > 0 && (
              <div className="mb-6">
                <h2 className="mb-4 text-xl font-bold">Inclusions</h2>
                <div className="space-y-2">
                  {quote.inclusions.map((item: any, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="mt-1 h-4 w-4 text-green-500" />
                      <div>
                        <div className="font-medium">{item.item}</div>
                        {item.description && (
                          <div className="text-sm text-gray-600">{item.description}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Exclusions */}
            {quote.exclusions && quote.exclusions.length > 0 && (
              <div className="mb-6">
                <h2 className="mb-4 text-xl font-bold">Exclusions</h2>
                <div className="space-y-2">
                  {quote.exclusions.map((item: any, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <XCircle className="mt-1 h-4 w-4 text-red-500" />
                      <div>
                        <div className="font-medium">{item.item}</div>
                        {item.description && (
                          <div className="text-sm text-gray-600">{item.description}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Detailed Itinerary */}
            {quote.detailedItinerary && (
              <div className="mb-6">
                <h2 className="mb-4 text-xl font-bold">Detailed Itinerary</h2>
                <div className="prose max-w-none rounded-lg bg-[#e8e8e4]-50 p-4">
                  {/* Rich text content would be rendered here */}
                  <p className="text-gray-700">Detailed day-by-day itinerary...</p>
                </div>
              </div>
            )}

            {/* Special Offers */}
            {quote.specialOffers && (
              <div className="mb-6 rounded-lg bg-yellow-50 p-4">
                <h3 className="mb-2 font-semibold text-yellow-900">Special Offers</h3>
                <p className="text-yellow-800">{quote.specialOffers}</p>
              </div>
            )}
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button className="flex-1 bg-green-600 hover:bg-green-700">
              <CheckCircle className="mr-2 h-5 w-5" />
              Accept Quote
            </Button>
            <Button variant="outline" className="flex-1">
              <XCircle className="mr-2 h-5 w-5" />
              Reject Quote
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Validity */}
          <Card className="p-6">
            <h3 className="mb-4 font-semibold">Quote Validity</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Calendar className="mt-1 h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-600">Valid Until</div>
                  <div className="font-semibold">
                    {quote.validity?.validUntil
                      ? new Date(quote.validity.validUntil).toLocaleDateString()
                      : 'N/A'}
                  </div>
                </div>
              </div>
              {quote.validity?.bookingDeadline && (
                <div className="flex items-start gap-3">
                  <Clock className="mt-1 h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Booking Deadline</div>
                    <div className="font-semibold">
                      {new Date(quote.validity.bookingDeadline).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Payment Terms */}
          {quote.paymentTerms?.advancePayment && (
            <Card className="p-6">
              <h3 className="mb-4 font-semibold">Payment Terms</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Advance Payment</span>
                  <span className="font-semibold">{quote.paymentTerms.advancePayment}%</span>
                </div>
                <div className="text-sm text-gray-600">
                  ₹
                  {(
                    (quote.pricing.totalPrice * quote.paymentTerms.advancePayment) /
                    100
                  ).toLocaleString()}{' '}
                  to be paid upfront
                </div>
              </div>
            </Card>
          )}

          {/* Documents */}
          {quote.documents && quote.documents.length > 0 && (
            <Card className="p-6">
              <h3 className="mb-4 font-semibold">Documents</h3>
              <div className="space-y-2">
                {quote.documents.map((doc: any, index: number) => (
                  <Button key={index} variant="outline" className="w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    Document {index + 1}
                  </Button>
                ))}
              </div>
            </Card>
          )}

          {/* Contact Agent */}
          <Card className="bg-blue-50 p-6">
            <h3 className="mb-2 font-semibold text-blue-900">Have Questions?</h3>
            <p className="mb-4 text-sm text-blue-700">Contact the agent for any clarifications</p>
            <Button variant="outline" className="w-full">
              Message Agent
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
