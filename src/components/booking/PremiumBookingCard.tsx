'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/cn'
import {
  Award,
  Calendar,
  Car,
  ChevronRight,
  Clock,
  Coffee,
  Dumbbell,
  Heart,
  MapPin,
  Plane,
  Play,
  Share2,
  Shield,
  Star,
  TrendingUp,
  Users,
  Wifi,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface PremiumBookingCardProps {
  id: string
  title: string
  location: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  images: string[]
  duration: string
  availability: string
  inclusions: string[]
  tags: string[]
  discount?: number
  featured?: boolean
  luxury?: boolean
  onBook?: () => void
  onViewDetails?: () => void
}

const amenityIcons: Record<string, any> = {
  wifi: Wifi,
  transport: Car,
  meals: Coffee,
  fitness: Dumbbell,
  flights: Plane,
  insurance: Shield,
}

export default function PremiumBookingCard({
  id,
  title,
  location,
  price,
  originalPrice,
  rating,
  reviews,
  images,
  duration,
  availability,
  inclusions,
  tags,
  discount,
  featured = false,
  luxury = false,
  onBook,
  onViewDetails,
}: PremiumBookingCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isHovered || images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [isHovered, images.length])

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsLiked(!isLiked)
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: `Check out ${title}`,
        text: `Amazing trip to ${location}`,
        url: window.location.href,
      })
    }
  }

  const savings = originalPrice ? originalPrice - price : 0
  const savingsPercentage = originalPrice ? Math.round((savings / originalPrice) * 100) : 0

  return (
    <div
      ref={cardRef}
      className={cn(
        'group relative bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-500 cursor-pointer',
        'hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1',
        featured && 'ring-2 ring-orange-500 ring-offset-2',
        luxury && 'bg-linear-to-br from-gray-50 to-gray-100',
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onViewDetails}
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-4 left-4 z-20">
          <div className="bg-linear-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <Award className="w-3 h-3" />
            Featured
          </div>
        </div>
      )}

      {/* Luxury Badge */}
      {luxury && (
        <div className="absolute top-4 right-4 z-20">
          <div className="bg-linear-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />
            Luxury
          </div>
        </div>
      )}

      {/* Discount Badge */}
      {discount && (
        <div className="absolute top-4 left-4 z-20">
          <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            {discount}% OFF
          </div>
        </div>
      )}

      {/* Image Gallery */}
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${title} - Image ${index + 1}`}
              className={cn(
                'absolute inset-0 w-full h-full object-cover transition-all duration-700',
                currentImageIndex === index ? 'opacity-100 scale-100' : 'opacity-0 scale-110',
              )}
            />
          ))}
        </div>

        {/* Image Overlay */}
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300',
            isHovered ? 'opacity-100' : 'opacity-70',
          )}
        />

        {/* Video Play Button */}
        {isHovered && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsPlaying(true)
              }}
              className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-300 hover:scale-110"
            >
              <Play className="w-6 h-6 text-gray-900 ml-1" />
            </button>
          </div>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs">
            {currentImageIndex + 1}/{images.length}
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <button
            onClick={handleLike}
            className={cn(
              'w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300',
              isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500',
            )}
          >
            <Heart className={cn('w-5 h-5', isLiked && 'fill-current')} />
          </button>
          <button
            onClick={handleShare}
            className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-blue-500 transition-all duration-300"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">
                {title}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{location}</span>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="font-semibold text-gray-900">{rating}</span>
            </div>
            <span className="text-sm text-gray-500">({reviews.toLocaleString()} reviews)</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-[#e8e8e4]-100 text-gray-700 rounded-full text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Trip Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="w-4 h-4" />
            <span>{availability}</span>
          </div>
        </div>

        {/* Inclusions */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-900">What&apos;s Included</p>
          <div className="flex flex-wrap gap-3">
            {inclusions.slice(0, 4).map((inclusion, index) => {
              const IconComponent = amenityIcons[inclusion.toLowerCase()] || Coffee
              return (
                <div key={index} className="flex items-center gap-1 text-sm text-gray-600">
                  <IconComponent className="w-4 h-4 text-green-500" />
                  <span>{inclusion}</span>
                </div>
              )
            })}
            {inclusions.length > 4 && (
              <span className="text-sm text-gray-500">+{inclusions.length - 4} more</span>
            )}
          </div>
        </div>

        {/* Price Section */}
        <div className="space-y-2">
          <div className="flex items-baseline gap-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">₹{price.toLocaleString()}</span>
              <span className="text-sm text-gray-500">per person</span>
            </div>
            {originalPrice && (
              <div className="flex items-center gap-2">
                <span className="text-lg text-gray-400 line-through">
                  ₹{originalPrice.toLocaleString()}
                </span>
                {savingsPercentage > 0 && (
                  <span className="text-sm font-semibold text-green-600">
                    Save {savingsPercentage}%
                  </span>
                )}
              </div>
            )}
          </div>

          {savings > 0 && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>You save ₹{savings.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={(e) => {
              e.stopPropagation()
              onBook?.()
            }}
            className="flex-1 bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0"
          >
            Book Now
          </Button>
          <Button
            variant="outline"
            onClick={(e) => {
              e.stopPropagation()
              onViewDetails?.()
            }}
            className="flex-1 border-gray-300 hover:bg-[#e8e8e4]-50"
          >
            View Details
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <Shield className="w-3 h-3" />
            <span>Secure Booking</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Instant Confirmation</span>
          </div>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-t from-orange-500/10 to-transparent pointer-events-none transition-opacity duration-300',
          isHovered ? 'opacity-100' : 'opacity-0',
        )}
      />
    </div>
  )
}
