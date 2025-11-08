'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/cn'
import { Clock, Hotel, MapPin, Plane, Tag, TrendingUp } from 'lucide-react'
import { useState } from 'react'

interface Offer {
  id: string
  title: string
  description: string
  discount: string
  validUntil: string
  category: 'flights' | 'hotels' | 'packages'
  icon: any
  bgColor: string
  textColor: string
  conditions: string[]
}

const offers: Offer[] = [
  {
    id: '1',
    title: 'Summer Sale',
    description: 'Get up to 30% off on domestic flights',
    discount: '30% OFF',
    validUntil: '2024-06-30',
    category: 'flights',
    icon: Plane,
    bgColor: 'bg-blue-500',
    textColor: 'text-white',
    conditions: ['Minimum booking ₹5,000', 'Valid for travel till Aug 2024', 'Non-refundable'],
  },
  {
    id: '2',
    title: 'Hotel Weekend Special',
    description: 'Book 2 nights, get 1 night free',
    discount: 'FREE NIGHT',
    validUntil: '2024-05-31',
    category: 'hotels',
    icon: Hotel,
    bgColor: 'bg-green-500',
    textColor: 'text-white',
    conditions: ['Weekend stays only', 'Selected hotels', 'Breakfast included'],
  },
  {
    id: '3',
    title: 'Early Bird Dubai',
    description: 'Save ₹5,000 on Dubai packages',
    discount: '₹5,000 OFF',
    validUntil: '2024-07-15',
    category: 'packages',
    icon: MapPin,
    bgColor: 'bg-purple-500',
    textColor: 'text-white',
    conditions: ['Book 30 days in advance', 'Minimum 4 nights stay', 'Includes flights'],
  },
  {
    id: '4',
    title: 'Monsoon Bonanza',
    description: 'Flat 25% off on hill station packages',
    discount: '25% OFF',
    validUntil: '2024-08-31',
    category: 'packages',
    icon: MapPin,
    bgColor: 'bg-orange-500',
    textColor: 'text-white',
    conditions: ['Valid for monsoon season', 'Selected destinations', 'Includes meals'],
  },
]

const categories = [
  { id: 'all', label: 'All Offers' },
  { id: 'flights', label: 'Flights' },
  { id: 'hotels', label: 'Hotels' },
  { id: 'packages', label: 'Packages' },
]

export function SpecialOffers() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedOffer, setExpandedOffer] = useState<string | null>(null)

  const filteredOffers =
    selectedCategory === 'all'
      ? offers
      : offers.filter((offer) => offer.category === selectedCategory)

  const toggleExpanded = (offerId: string) => {
    setExpandedOffer((prev) => (prev === offerId ? null : offerId))
  }

  const getDaysLeft = (validUntil: string) => {
    const today = new Date()
    const expiry = new Date(validUntil)
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-full mb-4">
            <Tag className="w-4 h-4" />
            <span className="font-semibold">Limited Time Offers</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Exclusive Travel Deals
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Grab these amazing deals before they&apos;re gone. Special discounts on flights, hotels,
            and holiday packages.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                'px-6 py-2 rounded-full font-medium transition-all',
                selectedCategory === category.id
                  ? 'bg-blue text-white'
                  : 'bg-white text-gray-700 hover:bg-[#e8e8e4]-100 border border-gray-200',
              )}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Offers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 mb-10">
          {filteredOffers.map((offer) => {
            const Icon = offer.icon
            const daysLeft = getDaysLeft(offer.validUntil)
            const isExpanded = expandedOffer === offer.id

            return (
              <div
                key={offer.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                {/* Header */}
                <div className={`${offer.bgColor} ${offer.textColor} p-6 relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12" />
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8" />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{offer.discount}</div>
                        <div className="text-sm opacity-90">SAVINGS</div>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
                    <p className="opacity-90 leading-relaxed">{offer.description}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Urgency Indicator */}
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium text-gray-700">
                      {daysLeft > 0 ? `${daysLeft} days left` : 'Expires today'}
                    </span>
                    <div className="flex-1 bg-[#e8e8e4]-200 rounded-full h-2">
                      <div
                        className={cn(
                          'h-2 rounded-full transition-all duration-300',
                          daysLeft > 7
                            ? 'bg-green-500'
                            : daysLeft > 3
                              ? 'bg-yellow-500'
                              : 'bg-red-500',
                        )}
                        style={{ width: `${Math.max(10, (daysLeft / 30) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Conditions */}
                  <div className="space-y-2 mb-6">
                    {offer.conditions
                      .slice(0, isExpanded ? undefined : 2)
                      .map((condition, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-blue rounded-full mt-1.5 flex-shrink-0" />
                          <span>{condition}</span>
                        </div>
                      ))}
                    {offer.conditions.length > 2 && (
                      <button
                        onClick={() => toggleExpanded(offer.id)}
                        className="text-sm text-black font-medium hover:text-travel-dark-blue"
                      >
                        {isExpanded
                          ? 'Show less'
                          : `Show ${offer.conditions.length - 2} more conditions`}
                      </button>
                    )}
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex gap-3">
                    <Button className="flex-1 btn-travel-primary">Book Now</Button>
                    <Button
                      variant="outline"
                      className="px-4 text-gray-700"
                      onClick={() => console.log('View offer details:', offer.id)}
                    >
                      Details
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom Section */}
        <div className="text-center bg-blue-400">
          <div className="bg-blue/10 rounded-xl p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-3">
              <TrendingUp className="w-6 h-6 text-black" />
              <h3 className="text-xl font-bold text-gray-900">Don&apos;t Miss Out!</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Subscribe to our newsletter and get exclusive offers delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:border-travel-blue focus:ring-1 focus:ring-travel-blue"
              />
              <Button className="btn-travel-primary">Subscribe</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
