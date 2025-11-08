'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/utilities/cn'
import {
  Calendar,
  Car,
  Coffee,
  DollarSign,
  Dumbbell,
  Hotel,
  MapPin,
  Search,
  Star,
  Users,
  Wifi,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export function HotelRequirementForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    rooms: 1,
    adults: 2,
    children: 0,
    propertyType: 'all',
    priceRange: 'all',
    rating: 'all',
    amenities: [] as string[],
    mealPlan: 'room-only',
    budget: '',
    specialRequests: '',
    freeCancellation: false,
    breakfastIncluded: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/requirements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceType: 'hotel',
          hotelDetails: formData,
          additionalNotes: formData.specialRequests,
        }),
      })

      if (response.ok) {
        toast.success('Hotel search request submitted!')
        router.push('/dashboard/requirements')
      } else {
        toast.error('Failed to submit request')
      }
    } catch (_error) {
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const toggleAmenity = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }))
  }

  const totalGuests = formData.adults + formData.children

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Find Your Perfect Hotel</h1>
        <p className="text-gray-600">Discover amazing places to stay around the world</p>
      </div>

      {/* Main Form */}
      <Card className="travel-form">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Destination Section */}
          <div className="travel-section">
            <div className="travel-section-title">
              <MapPin className="h-5 w-5 text-blue-600" />
              Destination
            </div>

            <div className="relative">
              <Input
                placeholder="City, hotel, or destination"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                className="input-booking pl-10 text-base"
              />
              <Hotel className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Dates Section */}
          <div className="booking-section">
            <div className="booking-section-title">
              <Calendar className="h-5 w-5 text-blue-600" />
              Stay Dates
            </div>

            <div className="booking-grid booking-grid-2">
              <div className="relative">
                <Input
                  type="date"
                  value={formData.checkIn}
                  onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                  className="input-booking text-base"
                />
                <Label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600">
                  Check-in
                </Label>
              </div>

              <div className="relative">
                <Input
                  type="date"
                  value={formData.checkOut}
                  onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                  className="input-booking text-base"
                />
                <Label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600">
                  Check-out
                </Label>
              </div>
            </div>
          </div>

          {/* Rooms & Guests Section */}
          <div className="travel-section">
            <div className="travel-section-title">
              <Users className="h-5 w-5 text-blue-600" />
              Rooms & Guests
            </div>

            <div className="travel-grid travel-grid-3">
              <div className="travel-field-group">
                <Label className="travel-field-label">Rooms</Label>
                <Select
                  value={formData.rooms.toString()}
                  onValueChange={(value) => setFormData({ ...formData, rooms: parseInt(value) })}
                >
                  <SelectTrigger className="select-booking">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? 'Room' : 'Rooms'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="travel-field-group">
                <Label className="travel-field-label">Adults</Label>
                <Select
                  value={formData.adults.toString()}
                  onValueChange={(value) => setFormData({ ...formData, adults: parseInt(value) })}
                >
                  <SelectTrigger className="select-booking">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? 'Adult' : 'Adults'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="travel-field-group">
                <Label className="travel-field-label">Children</Label>
                <Select
                  value={formData.children.toString()}
                  onValueChange={(value) => setFormData({ ...formData, children: parseInt(value) })}
                >
                  <SelectTrigger className="select-booking">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? 'Child' : 'Children'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="booking-section">
            <div className="booking-section-title">
              <Star className="h-5 w-5 text-blue-600" />
              Preferences
            </div>

            <div className="booking-grid booking-grid-2">
              <div className="booking-field-group">
                <Label className="booking-field-label">Property Type</Label>
                <Select
                  value={formData.propertyType}
                  onValueChange={(value) => setFormData({ ...formData, propertyType: value })}
                >
                  <SelectTrigger className="select-booking">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Properties</SelectItem>
                    <SelectItem value="hotel">Hotels</SelectItem>
                    <SelectItem value="apartment">Apartments</SelectItem>
                    <SelectItem value="resort">Resorts</SelectItem>
                    <SelectItem value="villa">Villas</SelectItem>
                    <SelectItem value="hostel">Hostels</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="travel-field-group">
                <Label className="travel-field-label">Price Range</Label>
                <Select
                  value={formData.priceRange}
                  onValueChange={(value) => setFormData({ ...formData, priceRange: value })}
                >
                  <SelectTrigger className="select-booking">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="budget">Budget ($0-$50)</SelectItem>
                    <SelectItem value="mid-range">Mid-range ($50-$100)</SelectItem>
                    <SelectItem value="luxury">Luxury ($100+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="travel-grid travel-grid-2 mt-4">
              <div className="travel-field-group">
                <Label className="travel-field-label">Minimum Rating</Label>
                <Select
                  value={formData.rating}
                  onValueChange={(value) => setFormData({ ...formData, rating: value })}
                >
                  <SelectTrigger className="select-booking">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="3">3+ Stars</SelectItem>
                    <SelectItem value="4">4+ Stars</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="travel-field-group">
                <Label className="travel-field-label">Meal Plan</Label>
                <Select
                  value={formData.mealPlan}
                  onValueChange={(value) => setFormData({ ...formData, mealPlan: value })}
                >
                  <SelectTrigger className="select-booking">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="room-only">Room Only</SelectItem>
                    <SelectItem value="breakfast">Breakfast Included</SelectItem>
                    <SelectItem value="half-board">Half Board</SelectItem>
                    <SelectItem value="full-board">Full Board</SelectItem>
                    <SelectItem value="all-inclusive">All Inclusive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Amenities Section */}
          <div className="booking-section">
            <div className="booking-section-title">
              <Coffee className="h-5 w-5 text-blue-600" />
              Popular Amenities
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { id: 'wifi', label: 'Free WiFi', icon: Wifi },
                { id: 'parking', label: 'Free Parking', icon: Car },
                { id: 'breakfast', label: 'Free Breakfast', icon: Coffee },
                { id: 'gym', label: 'Fitness Center', icon: Dumbbell },
              ].map((amenity) => (
                <button
                  key={amenity.id}
                  type="button"
                  onClick={() => toggleAmenity(amenity.id)}
                  className={cn(
                    'p-3 rounded-lg border-2 transition-colors flex flex-col items-center gap-2',
                    formData.amenities.includes(amenity.id)
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300',
                  )}
                >
                  <amenity.icon
                    className={cn(
                      'h-5 w-5',
                      formData.amenities.includes(amenity.id) ? 'text-blue-600' : 'text-gray-600',
                    )}
                  />
                  <span className="text-xs font-medium">{amenity.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Special Requirements */}
          <div className="booking-section">
            <div className="booking-section-title">
              <DollarSign className="h-5 w-5 text-blue-600" />
              Special Requirements
            </div>

            <div className="space-y-4">
              <div className="booking-field-group">
                <Label className="booking-field-label">Budget per Night (optional)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="number"
                    placeholder="Enter your budget"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="input-booking pl-10"
                  />
                </div>
              </div>

              <div className="travel-field-group">
                <Label className="travel-field-label">Special Requests</Label>
                <Textarea
                  placeholder="Any special requirements or preferences..."
                  rows={3}
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                  className="input-booking resize-none"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="freeCancellation"
                    checked={formData.freeCancellation}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, freeCancellation: checked as boolean })
                    }
                  />
                  <Label htmlFor="freeCancellation" className="text-sm text-gray-600">
                    Free cancellation only
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="breakfastIncluded"
                    checked={formData.breakfastIncluded}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, breakfastIncluded: checked as boolean })
                    }
                  />
                  <Label htmlFor="breakfastIncluded" className="text-sm text-gray-600">
                    Breakfast must be included
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button
              type="submit"
              disabled={loading}
              className="btn-travel-primary flex-1 text-lg py-4"
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Searching Hotels...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  Search Hotels
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="btn-travel-secondary"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>

      {/* Info Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-4 border-gray-200">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Star className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Best Price Guarantee</h3>
              <p className="text-sm text-gray-600 mt-1">Find a lower price? We&apos;ll match it</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-gray-200">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Hotel className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Verified Reviews</h3>
              <p className="text-sm text-gray-600 mt-1">Real guest reviews & photos</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-gray-200">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Wifi className="h-4 w-4 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Free Cancellation</h3>
              <p className="text-sm text-gray-600 mt-1">On most hotels & apartments</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
