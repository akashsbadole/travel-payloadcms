'use client'

import { cn } from '@/utilities/cn'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'
import { useState } from 'react'

interface Testimonial {
  id: string
  name: string
  location: string
  avatar: string
  rating: number
  service: string
  title: string
  content: string
  date: string
  verified: boolean
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    location: 'Mumbai, India',
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b332c7ca?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    service: 'Flight Booking',
    title: 'Excellent Flight Booking Experience',
    content:
      'I booked my Dubai trip through LuxuryTravels and the experience was seamless. Got the best price, instant confirmation, and their customer support helped me with seat selection. Will definitely book again!',
    date: '2024-03-15',
    verified: true,
  },
  {
    id: '2',
    name: 'Rahul Verma',
    location: 'Delhi, India',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    service: 'Hotel Booking',
    title: 'Great Hotel Deals in Bali',
    content:
      'Found amazing hotel deals for my Bali honeymoon. The prices were unbeatable and the hotel exceeded our expectations. The booking process was smooth and we got free breakfast included!',
    date: '2024-03-10',
    verified: true,
  },
  {
    id: '3',
    name: 'Anjali Patel',
    location: 'Bangalore, India',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    rating: 4,
    service: 'Holiday Package',
    title: 'Amazing Europe Tour Package',
    content:
      'Our Europe package was well-organized with great hotels and tour guides. The itinerary covered all major attractions. The only suggestion would be to include more free time for exploration.',
    date: '2024-03-05',
    verified: true,
  },
  {
    id: '4',
    name: 'Amit Kumar',
    location: 'Pune, India',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    service: 'Flight + Hotel',
    title: 'Perfect Family Vacation to Maldives',
    content:
      'Booked our Maldives family vacation and everything was perfect. The resort was beautiful, flights were on time, and the kids loved the activities. Best price guarantee really works!',
    date: '2024-02-28',
    verified: true,
  },
  {
    id: '5',
    name: 'Neha Gupta',
    location: 'Chennai, India',
    avatar:
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    service: 'Business Travel',
    title: 'Reliable Business Travel Partner',
    content:
      'As a frequent business traveler, I rely on LuxuryTravels for all my bookings. Their corporate rates are excellent and the 24/7 support is a lifesaver during emergencies.',
    date: '2024-02-20',
    verified: true,
  },
]

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedService, setSelectedService] = useState('all')

  const services = [
    { id: 'all', label: 'All Services' },
    { id: 'Flight Booking', label: 'Flights' },
    { id: 'Hotel Booking', label: 'Hotels' },
    { id: 'Holiday Package', label: 'Packages' },
  ]

  const filteredTestimonials =
    selectedService === 'all'
      ? testimonials
      : testimonials.filter((testimonial) => testimonial.service === selectedService)

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredTestimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + filteredTestimonials.length) % filteredTestimonials.length,
    )
  }

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn('w-4 h-4', i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300')}
      />
    ))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (filteredTestimonials.length === 0) return null

  const currentTestimonial = filteredTestimonials[currentIndex]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue/10 rounded-full mb-4">
            <Quote className="w-5 h-5 text-black" />
            <span className="font-semibold text-black">Customer Stories</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Travelers Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real experiences from real travelers who booked with us. Join thousands of satisfied
            customers worldwide.
          </p>
        </div>

        {/* Service Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => {
                setSelectedService(service.id)
                setCurrentIndex(0)
              }}
              className={cn(
                'px-6 py-2 rounded-full font-medium transition-all',
                selectedService === service.id
                  ? 'bg-blue text-black'
                  : 'bg-[#e8e8e4]-100 text-gray-700 hover:bg-[#e8e8e4]-200',
              )}
            >
              {service.label}
            </button>
          ))}
        </div>

        {/* Testimonial Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Main Testimonial Card */}
            <div className="shadow-lg p-8 md:p-12 border border-gray-100">
              {/* Quote Icon */}
              <div className="w-16 h-4 bg-blue/10 rounded-full flex items-center justify-center">
                <Quote className="w-8 h-8 text-black" />
              </div>

              {/* Content */}
              <blockquote className="text-xl text-center p-5 text-gray-700 leading-relaxed mb-8 font-medium">
                {currentTestimonial.content}
              </blockquote>

              {/* Author Info */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={currentTestimonial.avatar}
                    alt={currentTestimonial.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-lg font-bold text-gray-900">{currentTestimonial.name}</h4>
                      {currentTestimonial.verified && (
                        <div className="w-5 h-5 bg-travel-green rounded-full flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span>{currentTestimonial.location}</span>
                      <span>•</span>
                      <span>{currentTestimonial.service}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {renderStars(currentTestimonial.rating)}
                      <span className="text-sm text-gray-600 ml-1">
                        ({currentTestimonial.rating}.0)
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">{formatDate(currentTestimonial.date)}</div>
                  <div className="text-sm font-medium text-black">{currentTestimonial.title}</div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#e8e8e4]-50 transition-colors border border-gray-200"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#e8e8e4]-50 transition-colors border border-gray-200"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {filteredTestimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={cn(
                  'w-2 h-2 rounded-full transition-all duration-300',
                  currentIndex === index
                    ? 'w-8 bg-blue'
                    : 'bg-[#e8e8e4]-300 hover:bg-[#e8e8e4]-400',
                )}
              />
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-blue-400 rounded-2xl p-8 text-white">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">50,000+</div>
              <div className="text-blue-100">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">4.8/5</div>
              <div className="text-blue-100">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">98%</div>
              <div className="text-blue-100">Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Customer Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
