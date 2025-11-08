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
import { Calendar, Clock, DollarSign, Info, MapPin, Plane, Search, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export function FlightRequirementForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [tripType, setTripType] = useState<'roundtrip' | 'oneway' | 'multicity'>('roundtrip')
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    departureDate: '',
    returnDate: '',
    adults: 1,
    children: 0,
    infants: 0,
    cabinClass: 'economy',
    tripPreference: 'cheapest',
    budget: '',
    additionalNotes: '',
    flexibleDates: false,
    directFlightsOnly: false,
    includeNearbyAirports: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/requirements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceType: 'flight',
          flightDetails: { ...formData, tripType },
          additionalNotes: formData.additionalNotes,
        }),
      })

      if (response.ok) {
        toast.success('Flight search request submitted!')
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

  const totalPassengers = formData.adults + formData.children + formData.infants

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Find Your Perfect Flight</h1>
        <p className="text-gray-600">Search millions of flights to find the best deals</p>
      </div>

      {/* Trip Type Selector */}
      <div className="bg-white rounded-lg border border-gray-200 p-1 flex">
        <button
          type="button"
          onClick={() => setTripType('roundtrip')}
          className={cn(
            'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors',
            tripType === 'roundtrip'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900',
          )}
        >
          Round trip
        </button>
        <button
          type="button"
          onClick={() => setTripType('oneway')}
          className={cn(
            'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors',
            tripType === 'oneway' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900',
          )}
        >
          One way
        </button>
        <button
          type="button"
          onClick={() => setTripType('multicity')}
          className={cn(
            'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors',
            tripType === 'multicity'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900',
          )}
        >
          Multi-city
        </button>
      </div>

      {/* Main Form */}
      <Card className="booking-form">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Route Section */}
          <div className="booking-section">
            <div className="booking-section-title">
              <MapPin className="h-5 w-5 text-blue-600" />
              Route
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Input
                  placeholder="From where?"
                  value={formData.from}
                  onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                  className="input-booking pl-10 text-base"
                />
                <Plane className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 rotate-45" />
              </div>

              <button
                type="button"
                className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border-2 border-gray-300 rounded-full p-2 hover:border-blue-600 transition-colors"
                onClick={() => setFormData((prev) => ({ ...prev, from: prev.to, to: prev.from }))}
              >
                <svg
                  className="h-4 w-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                  />
                </svg>
              </button>

              <div className="relative">
                <Input
                  placeholder="To where?"
                  value={formData.to}
                  onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                  className="input-booking pl-10 text-base"
                />
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
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
                  value={formData.departureDate}
                  onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                  className="input-booking text-base"
                />
                <Label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600">
                  Departure
                </Label>
              </div>

              {tripType === 'roundtrip' && (
                <div className="relative">
                  <Input
                    type="date"
                    value={formData.returnDate}
                    onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                    className="input-booking text-base"
                  />
                  <Label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600">
                    Return
                  </Label>
                </div>
              )}
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

          {/* Passengers Section */}
          <div className="travel-section">
            <div className="travel-section-title">
              <Users className="h-5 w-5 text-blue-600" />
              Passengers & Class
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
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
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

            <div className="mt-4">
              <Label className="travel-field-label">Cabin Class</Label>
              <Select
                value={formData.cabinClass}
                onValueChange={(value) => setFormData({ ...formData, cabinClass: value })}
              >
                <SelectTrigger className="select-booking">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="economy">Economy</SelectItem>
                  <SelectItem value="premium-economy">Premium Economy</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="first">First Class</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="booking-section">
            <div className="booking-section-title">
              <Clock className="h-5 w-5 text-blue-600" />
              Preferences
            </div>

            <div className="space-y-4">
              <div className="booking-field-group">
                <Label className="booking-field-label">Trip Preference</Label>
                <Select
                  value={formData.tripPreference}
                  onValueChange={(value) => setFormData({ ...formData, tripPreference: value })}
                >
                  <SelectTrigger className="select-booking">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cheapest">Cheapest</SelectItem>
                    <SelectItem value="fastest">Fastest</SelectItem>
                    <SelectItem value="best-value">Best Value</SelectItem>
                    <SelectItem value="most-comfortable">Most Comfortable</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="travel-field-group">
                <Label className="travel-field-label">Budget (optional)</Label>
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

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="directFlightsOnly"
                    checked={formData.directFlightsOnly}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, directFlightsOnly: checked as boolean })
                    }
                  />
                  <Label htmlFor="directFlightsOnly" className="text-sm text-gray-600">
                    Direct flights only
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeNearbyAirports"
                    checked={formData.includeNearbyAirports}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, includeNearbyAirports: checked as boolean })
                    }
                  />
                  <Label htmlFor="includeNearbyAirports" className="text-sm text-gray-600">
                    Include nearby airports
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="travel-section">
            <div className="travel-section-title">
              <Info className="h-5 w-5 text-blue-600" />
              Additional Information
            </div>

            <div className="travel-field-group">
              <Label className="travel-field-label">Special Requirements (optional)</Label>
              <Textarea
                placeholder="Any special requirements or preferences..."
                rows={3}
                value={formData.additionalNotes}
                onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
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
                  Searching Flights...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  Search Flights
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
              <DollarSign className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Best Price Guarantee</h3>
              <p className="text-sm text-gray-600 mt-1">
                Find a lower price? We&apos;ll refund the difference
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-gray-200">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Plane className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Flexible Booking</h3>
              <p className="text-sm text-gray-600 mt-1">Free cancellation on most flights</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-gray-200">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Users className="h-4 w-4 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">24/7 Support</h3>
              <p className="text-sm text-gray-600 mt-1">Travel assistance whenever you need it</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
