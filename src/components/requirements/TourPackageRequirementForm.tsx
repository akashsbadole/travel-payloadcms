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
  Camera,
  DollarSign,
  Heart,
  MapPin,
  MountainSnow,
  Package,
  Star,
  Umbrella,
  Users,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export function TourPackageRequirementForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    destination: '',
    duration: '',
    startDate: '',
    endDate: '',
    adults: 2,
    children: 0,
    infants: 0,
    budgetPerPerson: '',
    travelTheme: 'family',
    inclusions: [] as string[],
    accommodationType: '3-star',
    mealPlan: 'breakfast',
    specialRequests: '',
    flexibleDates: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/requirements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceType: 'tour-package',
          tourPackageDetails: formData,
          additionalNotes: formData.specialRequests,
        }),
      })

      if (response.ok) {
        toast.success('Tour package request submitted!')
        router.push('/dashboard/requirements')
      } else {
        toast.error('Failed to submit request')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const toggleInclusion = (inclusion: string) => {
    setFormData((prev) => ({
      ...prev,
      inclusions: prev.inclusions.includes(inclusion)
        ? prev.inclusions.filter((i) => i !== inclusion)
        : [...prev.inclusions, inclusion],
    }))
  }

  const totalPassengers = formData.adults + formData.children + formData.infants

  const travelThemes = [
    { value: 'honeymoon', label: 'Honeymoon', icon: '💕', description: 'Romantic getaways' },
    { value: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦', description: 'Fun for all ages' },
    { value: 'adventure', label: 'Adventure', icon: '🏔️', description: 'Thrilling experiences' },
    { value: 'religious', label: 'Religious', icon: '🕉️', description: 'Spiritual journeys' },
    { value: 'beach', label: 'Beach', icon: '🏖️', description: 'Sun, sand & sea' },
    {
      value: 'hill-station',
      label: 'Hill Station',
      icon: '⛰️',
      description: 'Cool mountain retreats',
    },
    { value: 'wildlife', label: 'Wildlife', icon: '🦁', description: 'Safari & nature' },
    { value: 'cultural', label: 'Cultural', icon: '🏛️', description: 'Heritage & traditions' },
    { value: 'luxury', label: 'Luxury', icon: '✨', description: 'Premium experiences' },
    { value: 'backpacking', label: 'Backpacking', icon: '🎒', description: 'Budget adventures' },
  ]

  const inclusions = [
    { value: 'flights', label: 'Flights', icon: '✈️' },
    { value: 'hotels', label: 'Hotels', icon: '🏨' },
    { value: 'meals', label: 'Meals', icon: '🍽️' },
    { value: 'sightseeing', label: 'Sightseeing', icon: '🏛️' },
    { value: 'transport', label: 'Transport', icon: '🚌' },
    { value: 'guide', label: 'Tour Guide', icon: '👨‍🏫' },
    { value: 'insurance', label: 'Travel Insurance', icon: '🛡️' },
    { value: 'visa', label: 'Visa Assistance', icon: '📋' },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Create Your Dream Vacation</h1>
        <p className="text-gray-600">Customized tour packages for unforgettable experiences</p>
      </div>

      {/* Main Form */}
      <Card className="travel-form">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Destination Section */}
          <div className="travel-section">
            <div className="travel-section-title">
              <MapPin className="h-5 w-5 text-blue-600" />
              Destination & Duration
            </div>

            <div className="travel-grid travel-grid-2">
              <div className="relative">
                <Input
                  placeholder="Where do you want to go?"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="input-booking pl-10 text-base"
                />
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>

              <div className="travel-field-group">
                <Label className="travel-field-label">Duration</Label>
                <Select
                  value={formData.duration}
                  onValueChange={(value) => setFormData({ ...formData, duration: value })}
                >
                  <SelectTrigger className="select-booking">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2d1n">2 Days / 1 Night</SelectItem>
                    <SelectItem value="3d2n">3 Days / 2 Nights</SelectItem>
                    <SelectItem value="4d3n">4 Days / 3 Nights</SelectItem>
                    <SelectItem value="5d4n">5 Days / 4 Nights</SelectItem>
                    <SelectItem value="6d5n">6 Days / 5 Nights</SelectItem>
                    <SelectItem value="7d6n">7 Days / 6 Nights</SelectItem>
                    <SelectItem value="10d9n">10 Days / 9 Nights</SelectItem>
                    <SelectItem value="custom">Custom Duration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Dates Section */}
          <div className="travel-section">
            <div className="travel-section-title">
              <Calendar className="h-5 w-5 text-blue-600" />
              Travel Dates
            </div>

            <div className="travel-grid travel-grid-2">
              <div className="relative">
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="input-booking text-base"
                />
                <Label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600">
                  Start Date
                </Label>
              </div>

              <div className="relative">
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="input-booking text-base"
                />
                <Label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600">
                  End Date
                </Label>
              </div>
            </div>

            <div className="flex items-center space-x-2 mt-2">
              <Checkbox
                id="flexibleDates"
                checked={formData.flexibleDates}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, flexibleDates: checked as boolean })
                }
              />
              <Label htmlFor="flexibleDates" className="text-sm text-gray-600">
                My dates are flexible (+/- 3 days)
              </Label>
            </div>
          </div>

          {/* Travelers Section */}
          <div className="travel-section">
            <div className="travel-section-title">
              <Users className="h-5 w-5 text-blue-600" />
              Travelers
            </div>

            <div className="travel-grid travel-grid-3">
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
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
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

              <div className="travel-field-group">
                <Label className="travel-field-label">Infants</Label>
                <Select
                  value={formData.infants.toString()}
                  onValueChange={(value) => setFormData({ ...formData, infants: parseInt(value) })}
                >
                  <SelectTrigger className="select-booking">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 1, 2, 3, 4].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? 'Infant' : 'Infants'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Travel Theme Section */}
          <div className="travel-section">
            <div className="travel-section-title">
              <Heart className="h-5 w-5 text-blue-600" />
              Travel Theme
            </div>

            <div className="travel-field-group">
              <Select
                value={formData.travelTheme}
                onValueChange={(value) => setFormData({ ...formData, travelTheme: value })}
              >
                <SelectTrigger className="select-booking">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {travelThemes.map((theme) => (
                    <SelectItem key={theme.value} value={theme.value}>
                      <div className="flex items-center gap-2">
                        <span>{theme.icon}</span>
                        <div>
                          <div className="font-medium">{theme.label}</div>
                          <div className="text-xs text-gray-500">{theme.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="booking-section">
            <div className="booking-section-title">
              <Star className="h-5 w-5 text-blue-600" />
              Preferences & Budget
            </div>

            <div className="booking-grid booking-grid-2">
              <div className="booking-field-group">
                <Label className="booking-field-label">Accommodation</Label>
                <Select
                  value={formData.accommodationType}
                  onValueChange={(value) => setFormData({ ...formData, accommodationType: value })}
                >
                  <SelectTrigger className="select-booking">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="budget">Budget</SelectItem>
                    <SelectItem value="3-star">⭐⭐⭐ 3-Star</SelectItem>
                    <SelectItem value="4-star">⭐⭐⭐⭐ 4-Star</SelectItem>
                    <SelectItem value="5-star">⭐⭐⭐⭐⭐ 5-Star</SelectItem>
                    <SelectItem value="luxury">✨ Luxury</SelectItem>
                    <SelectItem value="heritage">🏛️ Heritage</SelectItem>
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
                    <SelectItem value="room-only">🚫 Room Only</SelectItem>
                    <SelectItem value="breakfast">🍳 Breakfast Only</SelectItem>
                    <SelectItem value="breakfast-dinner">🍳🍽️ Breakfast & Dinner</SelectItem>
                    <SelectItem value="all-meals">🍽️ All Meals</SelectItem>
                    <SelectItem value="all-inclusive">🎉 All Inclusive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="travel-field-group mt-4">
              <Label className="travel-field-label">Budget per Person (optional)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="number"
                  placeholder="Enter your budget"
                  value={formData.budgetPerPerson}
                  onChange={(e) => setFormData({ ...formData, budgetPerPerson: e.target.value })}
                  className="input-booking pl-10"
                />
              </div>
            </div>
          </div>

          {/* Inclusions Section */}
          <div className="travel-section">
            <div className="travel-section-title">
              <Package className="h-5 w-5 text-blue-600" />
              Package Inclusions
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {inclusions.map((inclusion) => (
                <button
                  key={inclusion.value}
                  type="button"
                  onClick={() => toggleInclusion(inclusion.value)}
                  className={cn(
                    'p-3 rounded-lg border-2 transition-colors flex flex-col items-center gap-2',
                    formData.inclusions.includes(inclusion.value)
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300',
                  )}
                >
                  <span className="text-lg">{inclusion.icon}</span>
                  <span className="text-xs font-medium">{inclusion.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Special Requests */}
          <div className="travel-section">
            <div className="travel-section-title">
              <Camera className="h-5 w-5 text-blue-600" />
              Special Requests
            </div>

            <div className="travel-field-group">
              <Label className="travel-field-label">Tell us about your dream vacation</Label>
              <Textarea
                placeholder="Any special requirements, preferences, or occasions we should know about..."
                rows={4}
                value={formData.specialRequests}
                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                className="input-booking resize-none"
              />
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
                  Creating Package...
                </>
              ) : (
                <>
                  <Package className="h-5 w-5" />
                  Create Tour Package
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
              <MountainSnow className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Expert Curated</h3>
              <p className="text-sm text-gray-600 mt-1">Handpicked destinations</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-gray-200">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Umbrella className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Best Price Guarantee</h3>
              <p className="text-sm text-gray-600 mt-1">Lowest price promise</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-gray-200">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Heart className="h-4 w-4 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Personalized Service</h3>
              <p className="text-sm text-gray-600 mt-1">Customized itineraries</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
