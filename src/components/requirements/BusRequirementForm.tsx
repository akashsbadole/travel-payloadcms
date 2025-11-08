'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
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
  Bus,
  Calendar,
  Clock,
  DollarSign,
  Luggage,
  MapPin,
  Shield,
  Users,
  Wifi,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export function BusRequirementForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [tripType, setTripType] = useState<'oneway' | 'roundtrip'>('oneway')
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    departureDate: '',
    returnDate: '',
    adults: 1,
    children: 0,
    infants: 0,
    busType: 'any',
    departureTime: 'any',
    budget: '',
    seatPreference: 'any',
    additionalNotes: '',
    acBus: false,
    sleeperBus: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/requirements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceType: 'bus',
          busDetails: { ...formData, tripType },
          additionalNotes: formData.additionalNotes,
        }),
      })

      if (response.ok) {
        toast.success('Bus search request submitted!')
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
        <h1 className="text-3xl font-bold text-gray-900">Find Your Perfect Bus</h1>
        <p className="text-gray-600">Search thousands of bus routes across India</p>
      </div>

      {/* Trip Type Selector */}
      <div className="bg-white rounded-lg border border-gray-200 p-1 flex">
        <button
          type="button"
          onClick={() => setTripType('oneway')}
          className={cn(
            'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors',
            tripType === 'oneway' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900',
          )}
        >
          One Way
        </button>
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
          Round Trip
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
                  placeholder="From city or bus stop"
                  value={formData.from}
                  onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                  className="input-booking pl-10 text-base"
                />
                <Bus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
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
                  placeholder="To city or bus stop"
                  value={formData.to}
                  onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                  className="input-booking pl-10 text-base"
                />
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Dates Section */}
          <div className="booking-section">
            <div className="booking-section-title">
              <Calendar className="h-5 w-5 text-blue-600" />
              Travel Dates
            </div>

            <div className="booking-grid booking-grid-2">
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
          </div>

          {/* Passengers Section */}
          <div className="travel-section">
            <div className="travel-section-title">
              <Users className="h-5 w-5 text-blue-600" />
              Passengers
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
          </div>

          {/* Preferences Section */}
          <div className="booking-section">
            <div className="booking-section-title">
              <Clock className="h-5 w-5 text-blue-600" />
              Bus Preferences
            </div>

            <div className="booking-grid booking-grid-2">
              <div className="booking-field-group">
                <Label className="booking-field-label">Bus Type</Label>
                <Select
                  value={formData.busType}
                  onValueChange={(value) => setFormData({ ...formData, busType: value })}
                >
                  <SelectTrigger className="select-booking">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Bus</SelectItem>
                    <SelectItem value="ac-seater">AC Seater</SelectItem>
                    <SelectItem value="ac-sleeper">AC Sleeper</SelectItem>
                    <SelectItem value="non-ac-seater">Non-AC Seater</SelectItem>
                    <SelectItem value="non-ac-sleeper">Non-AC Sleeper</SelectItem>
                    <SelectItem value="volvo">Volvo Multi-Axle</SelectItem>
                    <SelectItem value="luxury">Luxury Bus</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="travel-field-group">
                <Label className="travel-field-label">Departure Time</Label>
                <Select
                  value={formData.departureTime}
                  onValueChange={(value) => setFormData({ ...formData, departureTime: value })}
                >
                  <SelectTrigger className="select-booking">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Time</SelectItem>
                    <SelectItem value="early-morning">Early Morning (5AM-8AM)</SelectItem>
                    <SelectItem value="morning">Morning (8AM-12PM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (12PM-4PM)</SelectItem>
                    <SelectItem value="evening">Evening (4PM-8PM)</SelectItem>
                    <SelectItem value="night">Night (8PM-12AM)</SelectItem>
                    <SelectItem value="late-night">Late Night (12AM-5AM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="travel-grid travel-grid-2 mt-4">
              <div className="travel-field-group">
                <Label className="travel-field-label">Seat Preference</Label>
                <Select
                  value={formData.seatPreference}
                  onValueChange={(value) => setFormData({ ...formData, seatPreference: value })}
                >
                  <SelectTrigger className="select-booking">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">No Preference</SelectItem>
                    <SelectItem value="window">Window Seat</SelectItem>
                    <SelectItem value="aisle">Aisle Seat</SelectItem>
                    <SelectItem value="lower">Lower Berth</SelectItem>
                    <SelectItem value="upper">Upper Berth</SelectItem>
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
            </div>
          </div>

          {/* Amenities Section */}
          <div className="travel-section">
            <div className="travel-section-title">
              <Wifi className="h-5 w-5 text-blue-600" />
              Bus Amenities
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { id: 'acBus', label: 'AC Bus', icon: Shield },
                { id: 'sleeperBus', label: 'Sleeper', icon: Luggage },
              ].map((amenity) => (
                <button
                  key={amenity.id}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      [amenity.id]: !prev[amenity.id as keyof typeof prev],
                    }))
                  }
                  className={cn(
                    'p-3 rounded-lg border-2 transition-colors flex flex-col items-center gap-2',
                    formData[amenity.id as keyof typeof formData]
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300',
                  )}
                >
                  <amenity.icon
                    className={cn(
                      'h-5 w-5',
                      formData[amenity.id as keyof typeof formData]
                        ? 'text-blue-600'
                        : 'text-gray-600',
                    )}
                  />
                  <span className="text-xs font-medium">{amenity.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Additional Notes */}
          <div className="booking-section">
            <div className="booking-section-title">
              <Bus className="h-5 w-5 text-blue-600" />
              Additional Requirements
            </div>

            <div className="booking-field-group">
              <Label className="booking-field-label">Special Requests (optional)</Label>
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
                  Searching Buses...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  Search Buses
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
              <Shield className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Safe & Secure</h3>
              <p className="text-sm text-gray-600 mt-1">Verified bus operators</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-gray-200">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Clock className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Real-time Tracking</h3>
              <p className="text-sm text-gray-600 mt-1">Track your bus live</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-gray-200">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <DollarSign className="h-4 w-4 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Best Prices</h3>
              <p className="text-sm text-gray-600 mt-1">Lowest price guarantee</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
