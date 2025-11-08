'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/utilities/cn'
import {
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Play,
  Search,
  Star,
  Users,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface Destination {
  id: number
  name: string
  country: string
  image: string
  price: string
  rating: number
  description: string
  tags: string[]
}

const destinations: Destination[] = [
  {
    id: 1,
    name: 'Maldives Paradise',
    country: 'Maldives',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop',
    price: '₹1,25,000',
    rating: 4.9,
    description: 'Crystal clear waters and overwater bungalows',
    tags: ['Luxury', 'Romance', 'Beach'],
  },
  {
    id: 2,
    name: 'Swiss Alps Adventure',
    country: 'Switzerland',
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1920&h=1080&fit=crop',
    price: '₹2,15,000',
    rating: 4.8,
    description: 'Breathtaking mountain views and world-class skiing',
    tags: ['Adventure', 'Nature', 'Luxury'],
  },
  {
    id: 3,
    name: 'Santorini Sunset',
    country: 'Greece',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1920&h=1080&fit=crop',
    price: '₹95,000',
    rating: 4.7,
    description: 'Iconic blue domes and spectacular sunsets',
    tags: ['Romance', 'Culture', 'Island'],
  },
  {
    id: 4,
    name: 'Dubai Luxury',
    country: 'UAE',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea76d8fb7d0?w=1920&h=1080&fit=crop',
    price: '₹1,45,000',
    rating: 4.8,
    description: 'Ultra-modern city with world-class shopping',
    tags: ['Luxury', 'Shopping', 'City'],
  },
]

export default function LuxuryHeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [searchData, setSearchData] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    travelers: '2',
  })
  const [isLoaded, setIsLoaded] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsLoaded(true)
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % destinations.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % destinations.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + destinations.length) % destinations.length)
  }

  const currentDestination = destinations[currentSlide]

  return (
    <div ref={heroRef} className="relative min-h-screen overflow-hidden bg-black">
      {/* Background with parallax effect */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-out"
          style={{
            backgroundImage: `url(${currentDestination.image})`,
            transform: `scale(1.1) translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/80" />
        <div className="absolute inset-0 bg-linear-to-r from-black/60 via-transparent to-black/60" />
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }, (_, i) => ({
          left: (Math.abs(Math.sin(i * 0.7)) * 100).toFixed(2),
          top: (Math.abs(Math.cos(i * 1.1)) * 100).toFixed(2),
          delay: ((i * 0.25) % 5).toFixed(2),
          duration: (3 + (i % 4)).toFixed(2),
        })).map((particle, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-50 animate-pulse"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        {/* <header className="p-6 md:p-8">
          <div className="flex justify-between items-center">
            <div className="text-white">
              <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">
                LuxuryTravels
              </h1>
              <p className="text-gray-300 text-sm mt-1">Experience the Extraordinary</p>
            </div>
          </div>
        </header> */}

        {/* Main Hero Content */}
        <main className="flex-1 flex items-center justify-center px-6 md:px-8 py-4">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div
                className={cn(
                  'space-y-8 text-white transition-all duration-1000 transform',
                  isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0',
                )}
              >
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">Featured Destination</span>
                  </div>
                  <h2 className="text-5xl md:text-7xl font-bold leading-tight">
                    <span className="bg-linear-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                      {currentDestination.name}
                    </span>
                  </h2>
                  <p className="text-xl text-gray-300 leading-relaxed">
                    {currentDestination.description}
                  </p>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-orange-400" />
                      <span className="text-gray-300">{currentDestination.country}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="text-gray-300">
                        {currentDestination.rating} (2,847 reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {currentDestination.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-linear-to-r from-orange-500/20 to-red-500/20 border border-orange-400/30 rounded-full text-sm font-medium text-orange-300 backdrop-blur-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Starting from</p>
                    <p className="text-4xl font-bold text-white">{currentDestination.price}</p>
                    <p className="text-gray-400 text-sm">per person</p>
                  </div>
                  <div className="flex gap-3 items-end">
                    <Button
                      size="lg"
                      className="bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 px-8"
                    >
                      Explore Now
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/10"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Watch Video
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right Content - Search Form */}
              <div
                className={cn(
                  'transition-all duration-1000 transform',
                  isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0',
                )}
              >
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                  <h3 className="text-2xl font-bold text-white mb-6">Find Your Dream Vacation</h3>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-white text-sm font-medium">Destination</label>
                      <div className="relative">
                        <MapPin className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          placeholder="Where do you want to go?"
                          value={searchData.destination}
                          onChange={(e) =>
                            setSearchData({ ...searchData, destination: e.target.value })
                          }
                          className="pl-12 bg-white/10 border-white/20 text-white placeholder-gray-400 h-12 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-white text-sm font-medium">Check In</label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input
                            type="date"
                            value={searchData.checkIn}
                            onChange={(e) =>
                              setSearchData({ ...searchData, checkIn: e.target.value })
                            }
                            className="pl-12 bg-white/10 border-white/20 text-white h-12 rounded-xl"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-white text-sm font-medium">Check Out</label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input
                            type="date"
                            value={searchData.checkOut}
                            onChange={(e) =>
                              setSearchData({ ...searchData, checkOut: e.target.value })
                            }
                            className="pl-12 bg-white/10 border-white/20 text-white h-12 rounded-xl"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-white text-sm font-medium">Travelers</label>
                      <div className="relative">
                        <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Select
                          value={searchData.travelers}
                          onValueChange={(value) =>
                            setSearchData({ ...searchData, travelers: value })
                          }
                        >
                          <SelectTrigger className="pl-12 left-2 bg-white/10 border-white/20 text-white h-12 rounded-xl">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#e8e8e4]-900 border-white/20 mr-5">
                            <SelectItem value="1">1 Traveler</SelectItem>
                            <SelectItem value="2">2 Travelers</SelectItem>
                            <SelectItem value="3">3 Travelers</SelectItem>
                            <SelectItem value="4">4 Travelers</SelectItem>
                            <SelectItem value="5+">5+ Travelers</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button className="w-full h-14 bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 rounded-xl text-lg font-semibold">
                      <Search className="w-5 h-5 mr-2" />
                      Search Vacations
                    </Button>
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/20">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Popular searches:</span>
                      <div className="flex gap-2">
                        <span className="text-orange-300 hover:text-orange-200 cursor-pointer">
                          Maldives
                        </span>
                        <span className="text-gray-500">•</span>
                        <span className="text-orange-300 hover:text-orange-200 cursor-pointer">
                          Switzerland
                        </span>
                        <span className="text-gray-500">•</span>
                        <span className="text-orange-300 hover:text-orange-200 cursor-pointer">
                          Dubai
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {destinations.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-300',
                currentSlide === index ? 'w-8 bg-white' : 'bg-white/50 hover:bg-white/70',
              )}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 z-20"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 z-20"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}
