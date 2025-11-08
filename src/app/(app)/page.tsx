import { LoadingSpinner } from '@/components/LoadingSpinner/index'
import { TravelSearchForm } from '@/components/Search/TravekTripSearchForm'
import { PopularDestinations } from '@/components/destinations/PopularDestinations'
import LuxuryHeroSection from '@/components/hero/LuxuryHeroSection'
import { SpecialOffers } from '@/components/promotions/SpecialOffers'
import { TravelServices } from '@/components/services/TravelServices'
import LuxuryTravelShowcase from '@/components/showcase/LuxuryTravelShowcase'
import { Testimonials } from '@/components/testimonials/Testimonials'
import { TrustIndicators } from '@/components/trust/TrustIndicators'
import type { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'LuxuryTravels - Book Flights, Hotels & Holiday Packages',
  description:
    'Experience extraordinary travel with our curated collection of luxury flights, hotels, and holiday packages. Best price guarantee and 24/7 support.',
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Search */}
      <LuxuryHeroSection />

      {/* Integrated Search Form */}
      <section className="py-12 bg-[#e8e8e4]-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Search Best Deals on Flights, Hotels & More
            </h2>
            <p className="text-lg text-gray-600">
              Compare prices from 500+ airlines and 1M+ hotels worldwide
            </p>
          </div>
          <Suspense fallback={<LoadingSpinner />}>
            <TravelSearchForm />
          </Suspense>
        </div>
      </section>

      {/* Trust Indicators */}
      <TrustIndicators />

      {/* Popular Destinations */}
      <PopularDestinations />

      {/* Travel Services Grid */}
      <TravelServices />

      {/* Luxury Travel Showcase */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <Suspense fallback={<LoadingSpinner />}>
            <LuxuryTravelShowcase />
          </Suspense>
        </div>
      </section>

      {/* Special Offers */}
      <SpecialOffers />

      {/* Testimonials */}
      <Testimonials />

      {/* Newsletter Signup */}
      <section className="py-16 bg-linear-to-r from-travel-blue to-travel-light-blue">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Get Exclusive Travel Deals</h2>
            <p className="text-lg text-blue-100 mb-8">
              Subscribe to our newsletter and be the first to know about special offers, travel
              tips, and exclusive deals.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg border outline-solid focus:ring-2 focus:ring-white"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-[#e8e8e4]-100 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
