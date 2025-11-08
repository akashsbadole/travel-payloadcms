'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/cn'
import { ArrowRight, Heart, MapPin, Star } from 'lucide-react'
import { useState } from 'react'

interface Destination {
  id: string
  name: string
  country: string
  image: string
  price: string
  rating: number
  reviews: number
  description: string
  category: string
}

const destinations: Destination[] = [
  {
    id: '1',
    name: 'Dubai',
    country: 'United Arab Emirates',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea76d8fb7d0?w=400&h=300&fit=crop',
    price: '₹25,000',
    rating: 4.8,
    reviews: 2847,
    description: 'Experience luxury and adventure in the city of gold',
    category: 'City Break',
  },
  {
    id: '2',
    name: 'Maldives',
    country: 'Indian Ocean',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    price: '₹45,000',
    rating: 4.9,
    reviews: 1923,
    description: 'Paradise islands with crystal clear waters',
    category: 'Beach',
  },
  {
    id: '3',
    name: 'Switzerland',
    country: 'Europe',
    image: 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=400&h=300&fit=crop',
    price: '₹65,000',
    rating: 4.9,
    reviews: 3102,
    description: 'Breathtaking Alps and charming villages',
    category: 'Mountain',
  },
  {
    id: '4',
    name: 'Bali',
    country: 'Indonesia',
    image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop',
    price: '₹20,000',
    rating: 4.7,
    reviews: 2456,
    description: 'Tropical paradise with rich cultural heritage',
    category: 'Beach',
  },
  {
    id: '5',
    name: 'Paris',
    country: 'France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop',
    price: '₹35,000',
    rating: 4.8,
    reviews: 3821,
    description: 'The city of love and timeless elegance',
    category: 'City Break',
  },
  {
    id: '6',
    name: 'Singapore',
    country: 'Singapore',
    image: 'https://images.unsplash.com/photo-1518684079503-9bae28db53d7?w=400&h=300&fit=crop',
    price: '₹28,000',
    rating: 4.7,
    reviews: 1928,
    description: 'Modern city-state with gardens and skyscrapers',
    category: 'City Break',
  },
]

const categories = ['All', 'Beach', 'Mountain', 'City Break', 'Adventure', 'Cultural']

export function PopularDestinations() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [likedDestinations, setLikedDestinations] = useState<Set<string>>(new Set())

  const filteredDestinations =
    selectedCategory === 'All'
      ? destinations
      : destinations.filter((dest) => dest.category === selectedCategory)

  const toggleLike = (id: string) => {
    setLikedDestinations((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  return (
    <section className="py-16 bg-[#e8e8e4]-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Popular Destinations
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our handpicked destinations around the world. From tropical beaches to mountain
            adventures, find your perfect getaway.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-10 bg-[#e8e8e4]">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                'px-6 py-2 rounded-full font-medium transition-all',
                selectedCategory === category
                  ? ' text-black'
                  : 'bg-[#e8e8e4] text-gray hover:bg-[#e8e8e4]-100 border border-gray-200',
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Destinations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {filteredDestinations.map((destination) => (
            <div
              key={destination.id}
              className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
                    {destination.category}
                  </span>
                </div>

                {/* Like Button */}
                <button
                  onClick={() => toggleLike(destination.id)}
                  className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-all hover:scale-110"
                >
                  <Heart
                    className={cn(
                      'w-4 h-4 transition-colors',
                      likedDestinations.has(destination.id)
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-600',
                    )}
                  />
                </button>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-black transition-colors">
                      {destination.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{destination.country}</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{destination.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-semibold text-sm">{destination.rating}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      ({destination.reviews.toLocaleString()})
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-travel-green">
                      From {destination.price}
                    </div>
                    <div className="text-xs text-gray-500">per person</div>
                  </div>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-blue/95 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button className="bg-black text-black hover:bg-black">
                  Explore Destination
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button className="btn-travel-primary px-8">
            View All Destinations
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  )
}
