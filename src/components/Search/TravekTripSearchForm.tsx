'use client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/utilities/cn'
import {
  ArrowRight,
  ArrowRightLeft,
  Bus,
  Calendar,
  Hotel,
  MapPin,
  Plane,
  Search,
  Train,
  Users,
} from 'lucide-react'
import { useState } from 'react'

type SearchType = 'flights' | 'hotels' | 'holidays' | 'buses' | 'trains'

interface SearchFormData {
  tripType: 'oneway' | 'roundtrip' | 'multicity'
  from: string
  to: string
  departureDate: string
  returnDate: string
  adults: number
  children: number
  infants: number
  travelClass: string
}

export function TravelSearchForm() {
  const [activeTab, setActiveTab] = useState<SearchType>('flights')
  const [formData, setFormData] = useState<SearchFormData>({
    tripType: 'oneway',
    from: '',
    to: '',
    departureDate: '',
    returnDate: '',
    adults: 1,
    children: 0,
    infants: 0,
    travelClass: 'economy',
  })

  const tabs = [
    { id: 'flights', label: 'Flights', icon: Plane },
    { id: 'hotels', label: 'Hotels', icon: Hotel },
    { id: 'holidays', label: 'Holidays', icon: MapPin },
    { id: 'buses', label: 'Buses', icon: Bus },
    { id: 'trains', label: 'Trains', icon: Train },
  ]

  const tripTypes = [
    { value: 'oneway', label: 'One Way' },
    { value: 'roundtrip', label: 'Round Trip' },
    { value: 'multicity', label: 'Multi City' },
  ]

  const travelClasses = {
    flights: [
      { value: 'economy', label: 'Economy' },
      { value: 'premium', label: 'Premium Economy' },
      { value: 'business', label: 'Business' },
      { value: 'first', label: 'First Class' },
    ],
    hotels: [
      { value: 'budget', label: 'Budget' },
      { value: 'standard', label: 'Standard' },
      { value: 'deluxe', label: 'Deluxe' },
      { value: 'luxury', label: 'Luxury' },
    ],
    buses: [
      { value: 'sleeper', label: 'Sleeper' },
      { value: 'semi-sleeper', label: 'Semi Sleeper' },
      { value: 'ac', label: 'AC Seater' },
      { value: 'volvo', label: 'Volvo' },
    ],
    trains: [
      { value: '1a', label: '1st AC' },
      { value: '2a', label: '2nd AC' },
      { value: '3a', label: '3rd AC' },
      { value: 'sl', label: 'Sleeper' },
    ],
  }

  const handleSwapLocations = () => {
    setFormData((prev) => ({
      ...prev,
      from: prev.to,
      to: prev.from,
    }))
  }

  const handleSearch = () => {
    console.log('Searching with data:', { activeTab, ...formData })
    // Implement search logic
  }

  const updateFormData = (field: keyof SearchFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="bg-linear-to-r from-travel-blue to-travel-light-blue py-8">
      <div className="container mx-auto px-4">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as SearchType)}
                className={cn(
                  'flex items-center gap-2 px-6 py-3 rounded-t-lg font-medium transition-all',
                  activeTab === tab.id
                    ? 'bg-[#e8e8e4] text-black shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30',
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Search Form */}
        <Card className="travel-form shadow-xl">
          <div className="p-6">
            {/* Trip Type Selection - Flights */}
            {activeTab === 'flights' && (
              <div className="mb-6">
                <div className="flex gap-4">
                  {tripTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => updateFormData('tripType', type.value)}
                      className={cn(
                        'px-4 py-2 rounded-md font-medium transition-all',
                        formData.tripType === type.value
                          ? 'bg-blue text-white'
                          : 'bg-[#e8e8e4]-100 text-gray-700 hover:bg-[#e8e8e4]-200',
                      )}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* From/To Fields */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray mb-2">From</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.from}
                    onChange={(e) => updateFormData('from', e.target.value)}
                    placeholder="Enter city or airport"
                    className="input-travel pl-10"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray mb-2">To</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.to}
                    onChange={(e) => updateFormData('to', e.target.value)}
                    placeholder="Enter city or airport"
                    className="input-travel pl-10"
                  />
                  <button
                    onClick={handleSwapLocations}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-black hover:text-travel-dark-blue"
                  >
                    <ArrowRightLeft className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Departure Date */}
              <div>
                <label className="block text-sm font-medium text-gray mb-2">Departure Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    value={formData.departureDate}
                    onChange={(e) => updateFormData('departureDate', e.target.value)}
                    className="input-travel pl-10"
                  />
                </div>
              </div>

              {/* Return Date / Other Fields */}
              {activeTab === 'flights' && formData.tripType !== 'oneway' ? (
                <div>
                  <label className="block text-sm font-medium text-gray mb-2">Return Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      value={formData.returnDate}
                      onChange={(e) => updateFormData('returnDate', e.target.value)}
                      className="input-travel pl-10"
                    />
                  </div>
                </div>
              ) : activeTab === 'hotels' ? (
                <div>
                  <label className="block text-sm font-medium text-gray mb-2">Check-out Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      value={formData.returnDate}
                      onChange={(e) => updateFormData('returnDate', e.target.value)}
                      className="input-travel pl-10"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray mb-2">Travel Class</label>
                  <select
                    value={formData.travelClass}
                    onChange={(e) => updateFormData('travelClass', e.target.value)}
                    className="select-travel"
                  >
                    {(travelClasses[activeTab as keyof typeof travelClasses] || []).map((cls) => (
                      <option key={cls.value} value={cls.value}>
                        {cls.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Passengers & Class Row */}
            <div className="grid gap-4 md:grid-cols-2 mt-4">
              {/* Passengers */}
              <div>
                <label className="block text-sm font-medium text-gray mb-2">
                  Travellers & Class
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    readOnly
                    value={`${formData.adults + formData.children + formData.infants} Traveller(s), ${travelClasses[activeTab as keyof typeof travelClasses]?.find((c) => c.value === formData.travelClass)?.label || 'Economy'}`}
                    onClick={() =>
                      (document.getElementById('passenger-modal') as HTMLDialogElement)?.showModal()
                    }
                    className="input-travel pl-10 cursor-pointer"
                  />
                </div>
              </div>

              {/* Additional Options */}
              <div className="flex items-end gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-black focus:ring-travel-blue"
                  />
                  <span className="text-sm text-gray">Direct Flights Only</span>
                </label>
                {activeTab === 'flights' && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-black focus:ring-travel-blue"
                    />
                    <span className="text-sm text-gray">Include Nearby Airports</span>
                  </label>
                )}
              </div>
            </div>

            {/* Search Button */}
            <div className="mt-6">
              <Button
                onClick={handleSearch}
                className="w-full btn-travel-primary text-lg py-4 font-semibold"
              >
                <Search className="mr-2 h-5 w-5" />
                Search {tabs.find((t) => t.id === activeTab)?.label}
              </Button>
            </div>

            {/* Special Offers */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-600">Special Offers:</span>
                <button className="text-travel-orange font-semibold hover:text-travel-dark-orange">
                  Bank Offers
                </button>
                <button className="text-travel-orange font-semibold hover:text-travel-dark-orange">
                  Student Discount
                </button>
                <button className="text-travel-orange font-semibold hover:text-travel-dark-orange">
                  Senior Citizen
                </button>
              </div>
              <button className="text-black text-sm font-medium hover:text-travel-dark-blue">
                Fare Calendar <ArrowRight className="inline h-4 w-4" />
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
