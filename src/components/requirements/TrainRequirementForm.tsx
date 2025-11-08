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
import { Calendar, Clock, DollarSign, MapPin, Shield, Train, Users, Wifi } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export function TrainRequirementForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    journeyDate: '',
    adults: 1,
    children: 0,
    infants: 0,
    class: 'all',
    quota: 'general',
    preference: 'any',
    budget: '',
    berthPreference: 'any',
    additionalNotes: '',
    tatkalBooking: false,
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
          serviceType: 'train',
          trainDetails: formData,
          additionalNotes: formData.additionalNotes,
        }),
      })

      if (response.ok) {
        toast.success('Train search request submitted!')
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
        <h1 className="text-3xl font-bold text-gray-900">Find Your Perfect Train</h1>
        <p className="text-gray-600">Search Indian Railways for confirmed tickets</p>
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
                  placeholder="From station or city"
                  value={formData.from}
                  onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                  className="input-booking pl-10 text-base"
                />
                <Train className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
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
                  placeholder="To station or city"
                  value={formData.to}
                  onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                  className="input-booking pl-10 text-base"
                />
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Date Section */}
          <div className="booking-section">
            <div className="booking-section-title">
              <Calendar className="h-5 w-5 text-blue-600" />
              Journey Date
            </div>

            <div className="relative">
              <Input
                type="date"
                value={formData.journeyDate}
                onChange={(e) => setFormData({ ...formData, journeyDate: e.target.value })}
                className="input-booking text-base"
              />
              <Label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600">
                Travel Date
              </Label>
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
                    {[1, 2, 3, 4, 5, 6].map((num) => (
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

          {/* Class & Preferences Section */}
          <div className="booking-section">
            <div className="booking-section-title">
              <Train className="h-5 w-5 text-blue-600" />
              Class & Preferences
            </div>

            <div className="booking-grid booking-grid-2">
              <div className="booking-field-group">
                <Label className="booking-field-label">Travel Class</Label>
                <Select
                  value={formData.class}
                  onValueChange={(value) => setFormData({ ...formData, class: value })}
                >
                  <SelectTrigger className="select-booking">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    <SelectItem value="1ac">1AC - First Class AC</SelectItem>
                    <SelectItem value="2ac">2AC - Second Class AC</SelectItem>
                    <SelectItem value="3ac">3AC - Third Class AC</SelectItem>
                    <SelectItem value="cc">CC - AC Chair Car</SelectItem>
                    <SelectItem value="ec">EC - Executive Chair Car</SelectItem>
                    <SelectItem value="sl">SL - Sleeper Class</SelectItem>
                    <SelectItem value="2s">2S - Second Seating</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="travel-field-group">
                <Label className="travel-field-label">Booking Quota</Label>
                <Select
                  value={formData.quota}
                  onValueChange={(value) => setFormData({ ...formData, quota: value })}
                >
                  <SelectTrigger className="select-booking">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="tatkal">Tatkal</SelectItem>
                    <SelectItem value="premium-tatkal">Premium Tatkal</SelectItem>
                    <SelectItem value="ladies">Ladies</SelectItem>
                    <SelectItem value="senior-citizen">Senior Citizen</SelectItem>
                    <SelectItem value="divyang">Divyang</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="travel-grid travel-grid-2 mt-4">
              <div className="travel-field-group">
                <Label className="travel-field-label">Train Preference</Label>
                <Select
                  value={formData.preference}
                  onValueChange={(value) => setFormData({ ...formData, preference: value })}
                >
                  <SelectTrigger className="select-booking">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">No Preference</SelectItem>
                    <SelectItem value="fastest">Fastest Train</SelectItem>
                    <SelectItem value="cheapest">Cheapest Fare</SelectItem>
                    <SelectItem value="premium">Premium Trains</SelectItem>
                    <SelectItem value="sleeper">Sleeper Preferred</SelectItem>
                    <SelectItem value="day-train">Day Journey</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="travel-field-group">
                <Label className="travel-field-label">Berth Preference</Label>
                <Select
                  value={formData.berthPreference}
                  onValueChange={(value) => setFormData({ ...formData, berthPreference: value })}
                >
                  <SelectTrigger className="select-booking">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">No Preference</SelectItem>
                    <SelectItem value="lower">Lower Berth</SelectItem>
                    <SelectItem value="middle">Middle Berth</SelectItem>
                    <SelectItem value="upper">Upper Berth</SelectItem>
                    <SelectItem value="side-lower">Side Lower</SelectItem>
                    <SelectItem value="side-upper">Side Upper</SelectItem>
                    <SelectItem value="window">Window Seat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Special Requirements */}
          <div className="booking-section">
            <div className="booking-section-title">
              <Shield className="h-5 w-5 text-blue-600" />
              Special Requirements
            </div>

            <div className="space-y-4">
              <div className="booking-field-group">
                <Label className="booking-field-label">Budget (optional)</Label>
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
                    id="tatkalBooking"
                    checked={formData.tatkalBooking}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, tatkalBooking: checked as boolean })
                    }
                  />
                  <Label htmlFor="tatkalBooking" className="text-sm text-gray-600">
                    Consider Tatkal booking (additional charges apply)
                  </Label>
                </div>
              </div>

              <div className="travel-field-group">
                <Label className="travel-field-label">Special Requests</Label>
                <Textarea
                  placeholder="Any special requirements or preferences..."
                  rows={3}
                  value={formData.additionalNotes}
                  onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                  className="input-booking resize-none"
                />
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
                  Searching Trains...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  Search Trains
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
              <h3 className="font-semibold text-gray-900">IRCTC Authorized</h3>
              <p className="text-sm text-gray-600 mt-1">Official booking partner</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-gray-200">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Clock className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Live Status</h3>
              <p className="text-sm text-gray-600 mt-1">Real-time train status</p>
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
              <p className="text-sm text-gray-600 mt-1">Up to 4 hours before</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
