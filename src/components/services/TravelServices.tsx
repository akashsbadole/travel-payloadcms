'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Calendar, Hotel, MapPin, Plane, Shield, Users } from 'lucide-react'

const services = [
  {
    icon: Plane,
    title: 'Flight Booking',
    description: 'Book domestic and international flights with 500+ airlines',
    features: ['Best Price Guarantee', 'Instant Confirmation', 'Free Cancellation'],
    color: 'bg-blue-500',
    link: '/flights',
  },
  {
    icon: Hotel,
    title: 'Hotel Reservations',
    description: 'Choose from 1M+ hotels worldwide at unbeatable prices',
    features: ['Verified Reviews', 'Best Rate Guarantee', 'Free WiFi'],
    color: 'bg-green-500',
    link: '/hotels',
  },
  {
    icon: MapPin,
    title: 'Holiday Packages',
    description: 'Curated tour packages for memorable vacations',
    features: ['All-Inclusive Deals', 'Expert Guides', 'Flexible Itinerary'],
    color: 'bg-purple-500',
    link: '/packages',
  },
  {
    icon: Calendar,
    title: 'Activities & Tours',
    description: 'Book local experiences and guided tours',
    features: ['Skip-the-Line Access', 'Local Experts', 'Best Prices'],
    color: 'bg-orange-500',
    link: '/activities',
  },
  {
    icon: Users,
    title: 'Group Travel',
    description: 'Special deals for group bookings and corporate travel',
    features: ['Group Discounts', 'Dedicated Support', 'Custom Itinerary'],
    color: 'bg-red-500',
    link: '/group-travel',
  },
  {
    icon: Shield,
    title: 'Travel Insurance',
    description: 'Comprehensive coverage for worry-free travel',
    features: ['Medical Coverage', 'Trip Protection', '24/7 Assistance'],
    color: 'bg-indigo-500',
    link: '/insurance',
  },
]

export function TravelServices() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Complete Travel Solutions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From flights to hotels, activities to insurance - we&apos;ve got all your travel needs
            covered under one roof with best price guarantee.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <div
                key={index}
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-travel-blue"
              >
                {/* Icon */}
                <div
                  className={`w-14 h-14 ${service.color} rounded-lg flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-black transition-colors">
                  {service.title}
                </h3>

                <p className="text-gray-600 mb-4 leading-relaxed">{service.description}</p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center gap-2 text-sm text-gray-700"
                    >
                      <div className="w-1.5 h-1.5 bg-travel-green rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  variant="outline"
                  className="w-full group-hover:bg-blue text-black group-hover:text-black group-hover:border-travel-blue transition-all duration-300"
                  onClick={() => console.log(`Navigate to ${service.link}`)}
                >
                  Explore {service.title}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 ">
          <div className="rounded-2xl p-8 text-black">
            <h3 className="text-2xl font-bold mb-4">Need Custom Travel Solutions?</h3>
            <p className="text-black mb-6 max-w-2xl mx-auto">
              Our travel experts can create personalized itineraries tailored to your preferences,
              budget, and travel style.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-black hover:bg-[#e8e8e4]-100 px-8">
                Get Custom Quote
              </Button>
              <Button
                variant="outline"
                className="border-white text-blue hover:bg-white hover:text-black px-8"
              >
                Contact Expert
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
