'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/cn'
import {
  Calendar,
  ChevronRight,
  Crown,
  Diamond,
  Gem,
  Heart,
  MapPin,
  MountainSnow,
  Play,
  Ship,
  Sparkles,
  Star,
  Users,
} from 'lucide-react'
import { useRef, useState } from 'react'

interface LuxuryExperience {
  id: string
  title: string
  category: string
  location: string
  price: string
  originalPrice?: string
  rating: number
  reviews: number
  image: string
  video?: string
  description: string
  highlights: string[]
  duration: string
  groupSize: string
  exclusive: boolean
  featured: boolean
  icon: any
}

const luxuryExperiences: LuxuryExperience[] = [
  {
    id: '1',
    title: 'Private Maldives Island Escape',
    category: 'Island Paradise',
    location: 'Maldives',
    price: '₹4,50,000',
    originalPrice: '₹6,00,000',
    rating: 4.9,
    reviews: 127,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    video: 'https://example.com/maldives-video',
    description:
      'Experience unparalleled luxury in your own private island paradise with overwater villas and personal butler service.',
    highlights: ['Private Island', 'Personal Butler', 'Yacht Transfer', 'Spa & Wellness'],
    duration: '7 Days / 6 Nights',
    groupSize: '2-4 Guests',
    exclusive: true,
    featured: true,
    icon: Gem,
  },
  {
    id: '2',
    title: 'Swiss Alps Helicopter Skiing',
    category: 'Adventure Luxury',
    location: 'Switzerland',
    price: '₹8,75,000',
    rating: 4.8,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&h=600&fit=crop',
    description:
      'Exclusive helicopter access to pristine alpine slopes with world-class instructors and luxury chalet accommodation.',
    highlights: ['Helicopter Access', 'Expert Guides', 'Luxury Chalet', 'Gourmet Dining'],
    duration: '5 Days / 4 Nights',
    groupSize: '4-6 Guests',
    exclusive: true,
    featured: false,
    icon: MountainSnow,
  },
  {
    id: '3',
    title: 'African Safari Luxury Lodge',
    category: 'Wildlife Experience',
    location: 'Kenya',
    price: '₹5,25,000',
    rating: 4.9,
    reviews: 203,
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&h=600&fit=crop',
    description:
      'Witness the great migration from exclusive luxury lodges with private game drives and bush dining experiences.',
    highlights: ['Private Game Drives', 'Bush Dining', 'Expert Guides', 'Luxury Lodge'],
    duration: '6 Days / 5 Nights',
    groupSize: '2-8 Guests',
    exclusive: true,
    featured: false,
    icon: Crown,
  },
  {
    id: '4',
    title: 'Mediterranean Yacht Cruise',
    category: 'Nautical Luxury',
    location: 'Greek Islands',
    price: '₹12,50,000',
    rating: 5.0,
    reviews: 45,
    image: 'https://images.unsplash.com/photo-1540202404-1b927e27f0e3?w=800&h=600&fit=crop',
    description:
      'Cruise the Mediterranean in a private luxury yacht with personalized itineraries and gourmet cuisine.',
    highlights: ['Private Yacht', 'Personal Chef', 'Custom Itinerary', 'Water Sports'],
    duration: '10 Days / 9 Nights',
    groupSize: '2-10 Guests',
    exclusive: true,
    featured: true,
    icon: Ship,
  },
  {
    id: '5',
    title: 'Japanese Cultural Immersion',
    category: 'Cultural Luxury',
    location: 'Japan',
    price: '₹6,75,000',
    rating: 4.8,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop',
    description:
      'Experience authentic Japanese culture with private temple visits, tea ceremonies, and ryokan stays.',
    highlights: ['Private Temple Tours', 'Tea Ceremonies', 'Ryokan Stays', 'Michelin Dining'],
    duration: '8 Days / 7 Nights',
    groupSize: '2-6 Guests',
    exclusive: true,
    featured: false,
    icon: Diamond,
  },
  {
    id: '6',
    title: 'Northern Lights Luxury Camp',
    category: 'Natural Wonder',
    location: 'Iceland',
    price: '₹4,25,000',
    rating: 4.7,
    reviews: 98,
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&h=600&fit=crop',
    description:
      'Witness the aurora borealis from luxury glass igloos with private hot springs and expert guides.',
    highlights: ['Glass Igloos', 'Private Hot Springs', 'Aurora Photography', 'Glacier Tours'],
    duration: '4 Days / 3 Nights',
    groupSize: '2-4 Guests',
    exclusive: true,
    featured: false,
    icon: Sparkles,
  },
]

const categories = [
  { name: 'All Experiences', icon: Diamond, count: luxuryExperiences.length },
  { name: 'Island Paradise', icon: Ship, count: 1 },
  { name: 'Adventure Luxury', icon: MountainSnow, count: 1 },
  { name: 'Wildlife Experience', icon: Heart, count: 1 },
  { name: 'Nautical Luxury', icon: Ship, count: 1 },
  { name: 'Cultural Luxury', icon: Crown, count: 1 },
  { name: 'Natural Wonder', icon: Sparkles, count: 1 },
]

export default function LuxuryTravelShowcase() {
  const [selectedCategory, setSelectedCategory] = useState('All Experiences')
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set())
  const [playingVideo, setPlayingVideo] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const filteredExperiences =
    selectedCategory === 'All Experiences'
      ? luxuryExperiences
      : luxuryExperiences.filter((exp) => exp.category === selectedCategory)

  const handleLike = (id: string) => {
    setLikedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const handlePlayVideo = (id: string) => {
    setPlayingVideo(playingVideo === id ? null : id)
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-linear-to-r from-purple-900 via-purple-800 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-purple-400/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-pink-400/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <Crown className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-medium">Exclusive Luxury Collection</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold">
              <span className="bg-linear-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent">
                Extraordinary
              </span>
              <br />
              <span className="text-4xl md:text-6xl">Luxury Experiences</span>
            </h1>

            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover handpicked luxury journeys that redefine travel excellence. From private
              islands to exclusive wildlife encounters, experience the world&apos;s most
              extraordinary destinations.
            </p>

            <div className="flex flex-wrap justify-center gap-6 pt-8">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="font-semibold">4.8+ Average Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="font-semibold">500+ Satisfied Clients</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span className="font-semibold">100% Exclusive</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {categories.map((category) => {
              const IconComponent = category.icon
              return (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300',
                    selectedCategory === category.name
                      ? 'bg-linear-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                      : 'bg-[#e8e8e4]-100 text-gray-700 hover:bg-[#e8e8e4]-200',
                  )}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="font-medium">{category.name}</span>
                  <span className="text-sm opacity-70">({category.count})</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Featured Experiences */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Experiences</h2>
            <p className="text-gray-600 mt-2">
              Handpicked luxury journeys for the discerning traveler
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-[#e8e8e4]-50 transition-colors"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-[#e8e8e4]-50 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4">
          {filteredExperiences.map((experience) => {
            const IconComponent = experience.icon
            const isLiked = likedItems.has(experience.id)
            const isHovered = hoveredCard === experience.id
            const isPlaying = playingVideo === experience.id

            return (
              <div
                key={experience.id}
                className="flex-none w-96 group"
                onMouseEnter={() => setHoveredCard(experience.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  {/* Image/Video Section */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={experience.image}
                      alt={experience.title}
                      className={cn(
                        'w-full h-full object-cover transition-all duration-700',
                        isHovered ? 'scale-110' : 'scale-100',
                      )}
                    />

                    {/* Overlay */}
                    <div
                      className={cn(
                        'absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-300',
                        isHovered ? 'opacity-100' : 'opacity-60',
                      )}
                    />

                    {/* Video Play Button */}
                    {experience.video && isHovered && (
                      <button
                        onClick={() => handlePlayVideo(experience.id)}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-300 hover:scale-110">
                          <Play className="w-6 h-6 text-gray-900 ml-1" />
                        </div>
                      </button>
                    )}

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      {experience.exclusive && (
                        <div className="bg-linear-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          <Crown className="w-3 h-3" />
                          Exclusive
                        </div>
                      )}
                      {experience.featured && (
                        <div className="bg-linear-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          Featured
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        onClick={() => handleLike(experience.id)}
                        className={cn(
                          'w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300',
                          isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500',
                        )}
                      >
                        <Heart className={cn('w-5 h-5', isLiked && 'fill-current')} />
                      </button>
                    </div>

                    {/* Category Icon */}
                    <div className="absolute bottom-4 left-4">
                      <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                            {experience.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{experience.location}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-semibold">{experience.rating}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          ({experience.reviews} reviews)
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                      {experience.description}
                    </p>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{experience.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{experience.groupSize}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {experience.highlights.slice(0, 3).map((highlight, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium"
                        >
                          {highlight}
                        </span>
                      ))}
                      {experience.highlights.length > 3 && (
                        <span className="px-3 py-1 bg-[#e8e8e4]-100 text-gray-600 rounded-full text-xs font-medium">
                          +{experience.highlights.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-baseline gap-3">
                        <span className="text-2xl font-bold text-gray-900">{experience.price}</span>
                        {experience.originalPrice && (
                          <span className="text-lg text-gray-400 line-through">
                            {experience.originalPrice}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">per person</p>
                    </div>

                    <Button className="w-full bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0">
                      Explore Experience
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Trust Section */}
      <div className="bg-linear-to-r from-purple-900 to-indigo-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-8">
            <h2 className="text-3xl font-bold">Why Choose Our Luxury Experiences?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto">
                  <Crown className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-xl font-semibold">Exclusive Access</h3>
                <p className="text-gray-300">
                  Private access to destinations and experiences not available to the general public
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold">Personalized Service</h3>
                <p className="text-gray-300">
                  Dedicated concierge service available 24/7 throughout your journey
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto">
                  <Diamond className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold">Unforgettable Moments</h3>
                <p className="text-gray-300">
                  Carefully curated experiences that create lifelong memories
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Using MountainSnow from lucide-react instead of custom Mountain component
