'use client'

import { Award, Clock, Hotel, MapPin, Plane, Shield } from 'lucide-react'

const trustStats = [
  {
    icon: Plane,
    value: '500+',
    label: 'Airlines',
    description: 'Global airline partners',
  },
  {
    icon: Hotel,
    value: '1M+',
    label: 'Hotels',
    description: 'Worldwide accommodations',
  },
  {
    icon: MapPin,
    value: '150+',
    label: 'Countries',
    description: 'Global destinations',
  },
  {
    icon: Shield,
    value: '100%',
    label: 'Secure',
    description: 'Safe transactions',
  },
  {
    icon: Award,
    value: '4.8/5',
    label: 'Rating',
    description: 'Customer satisfaction',
  },
  {
    icon: Clock,
    value: '24/7',
    label: 'Support',
    description: 'Always here to help',
  },
]

export function TrustIndicators() {
  return (
    <section className="py-12 bg-white border-y border-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {trustStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-blue/10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue/20 transition-colors">
                  <Icon className="w-8 h-8 text-black" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm font-semibold text-gray-900 mb-1">{stat.label}</div>
                <div className="text-xs text-gray-600">{stat.description}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
