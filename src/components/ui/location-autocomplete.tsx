'use client'

import * as React from 'react'
import { cn } from '@/utilities/cn'
import { Input } from './input'
import { MapPin, Plane, Train, Bus, Hotel } from 'lucide-react'

interface Location {
  id: string
  name: string
  code?: string
  country?: string
  region?: string
  type: 'airport' | 'city' | 'station' | 'hotel'
  popular?: boolean
}

interface LocationAutocompleteProps {
  value?: string
  onLocationSelect?: (location: Location) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  locationType?: 'airport' | 'city' | 'station' | 'hotel' | 'all'
  allowCustomLocation?: boolean
}

// Mock data - in a real app, this would come from an API
const mockLocations: Location[] = [
  // Airports
  { id: '1', name: 'Indira Gandhi International Airport', code: 'DEL', country: 'India', type: 'airport', popular: true },
  { id: '2', name: 'Chhatrapati Shivaji Maharaj International Airport', code: 'BOM', country: 'India', type: 'airport', popular: true },
  { id: '3', name: 'Kempegowda International Airport', code: 'BLR', country: 'India', type: 'airport', popular: true },
  { id: '4', name: 'Dubai International Airport', code: 'DXB', country: 'UAE', type: 'airport', popular: true },
  { id: '5', name: 'Singapore Changi Airport', code: 'SIN', country: 'Singapore', type: 'airport', popular: true },
  { id: '6', name: 'Heathrow Airport', code: 'LHR', country: 'UK', type: 'airport' },
  { id: '7', name: 'John F. Kennedy International Airport', code: 'JFK', country: 'USA', type: 'airport' },
  
  // Cities
  { id: '8', name: 'New Delhi', country: 'India', type: 'city', popular: true },
  { id: '9', name: 'Mumbai', country: 'India', type: 'city', popular: true },
  { id: '10', name: 'Bangalore', country: 'India', type: 'city', popular: true },
  { id: '11', name: 'Goa', country: 'India', type: 'city', popular: true },
  { id: '12', name: 'Jaipur', country: 'India', type: 'city', popular: true },
  { id: '13', name: 'Kerala', region: 'India', type: 'city', popular: true },
  { id: '14', name: 'Paris', country: 'France', type: 'city' },
  { id: '15', name: 'Tokyo', country: 'Japan', type: 'city' },
  
  // Train Stations
  { id: '16', name: 'New Delhi Railway Station', country: 'India', type: 'station', popular: true },
  { id: '17', name: 'Mumbai Central Railway Station', country: 'India', type: 'station', popular: true },
  { id: '18', name: 'Bangalore City Railway Station', country: 'India', type: 'station' },
  
  // Hotels
  { id: '19', name: 'Taj Mahal Palace, Mumbai', country: 'India', type: 'hotel', popular: true },
  { id: '20', name: 'The Leela Palace, New Delhi', country: 'India', type: 'hotel', popular: true },
  { id: '21', name: 'Umaid Bhawan Palace, Jodhpur', country: 'India', type: 'hotel' },
]

const getLocationIcon = (type: Location['type']) => {
  switch (type) {
    case 'airport': return <Plane className="h-4 w-4" />
    case 'station': return <Train className="h-4 w-4" />
    case 'hotel': return <Hotel className="h-4 w-4" />
    case 'city': return <MapPin className="h-4 w-4" />
    default: return <MapPin className="h-4 w-4" />
  }
}

const getLocationTypeLabel = (type: Location['type']) => {
  switch (type) {
    case 'airport': return 'Airport'
    case 'station': return 'Station'
    case 'hotel': return 'Hotel'
    case 'city': return 'City'
    default: return 'Location'
  }
}

export function LocationAutocomplete({
  value,
  onLocationSelect,
  placeholder = "Enter city or airport",
  className,
  disabled = false,
  locationType = 'all',
  allowCustomLocation = true,
}: LocationAutocompleteProps) {
  const [inputValue, setInputValue] = React.useState(value || '')
  const [isOpen, setIsOpen] = React.useState(false)
  const [filteredLocations, setFilteredLocations] = React.useState<Location[]>([])
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1)
  
  const inputRef = React.useRef<HTMLInputElement>(null)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  // Filter locations based on input and type
  React.useEffect(() => {
    if (!inputValue.trim()) {
      // Show popular destinations when input is empty
      const popular = mockLocations.filter(loc => 
        loc.popular && (locationType === 'all' || loc.type === locationType)
      )
      setFilteredLocations(popular.slice(0, 6))
      return
    }

    const filtered = mockLocations.filter(loc => {
      const matchesType = locationType === 'all' || loc.type === locationType
      const matchesSearch = loc.name.toLowerCase().includes(inputValue.toLowerCase()) ||
                           loc.code?.toLowerCase().includes(inputValue.toLowerCase()) ||
                           loc.country?.toLowerCase().includes(inputValue.toLowerCase())
      return matchesType && matchesSearch
    })

    setFilteredLocations(filtered.slice(0, 8))
  }, [inputValue, locationType])

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setHighlightedIndex(prev => 
            prev < filteredLocations.length - 1 ? prev + 1 : prev
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1)
          break
        case 'Enter':
          e.preventDefault()
          if (highlightedIndex >= 0 && filteredLocations[highlightedIndex]) {
            handleLocationSelect(filteredLocations[highlightedIndex])
          }
          break
        case 'Escape':
          setIsOpen(false)
          inputRef.current?.focus()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, highlightedIndex, filteredLocations])

  // Handle click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLocationSelect = (location: Location) => {
    setInputValue(location.name)
    setIsOpen(false)
    onLocationSelect?.(location)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    setIsOpen(true)
    setHighlightedIndex(-1)
  }

  const handleInputFocus = () => {
    setIsOpen(true)
  }

  const handleCustomLocation = () => {
    if (allowCustomLocation && inputValue.trim()) {
      const customLocation: Location = {
        id: `custom-${Date.now()}`,
        name: inputValue.trim(),
        type: 'city',
      }
      handleLocationSelect(customLocation)
    }
  }

  return (
    <div className={cn('relative', className)}>
      <div className="relative">
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          disabled={disabled}
          className="pr-10"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {isOpen && !disabled && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-background border border-border rounded-lg shadow-lg max-h-80 overflow-y-auto"
        >
          {filteredLocations.length > 0 ? (
            <>
              {inputValue.trim() === '' && (
                <div className="px-4 py-2 text-xs font-medium text-muted-foreground bg-muted/50">
                  Popular Destinations
                </div>
              )}
              
              {filteredLocations.map((location, index) => (
                <div
                  key={location.id}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors',
                    'hover:bg-muted/50',
                    highlightedIndex === index && 'bg-muted/50',
                    index === 0 && inputValue.trim() === '' && 'border-t border-border'
                  )}
                  onClick={() => handleLocationSelect(location)}
                >
                  <div className="flex-shrink-0 text-muted-foreground">
                    {getLocationIcon(location.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground truncate">
                      {location.name}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {location.code && (
                        <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                          {location.code}
                        </span>
                      )}
                      {location.country && (
                        <span>{location.country}</span>
                      )}
                      <span className="text-xs">•</span>
                      <span className="text-xs">{getLocationTypeLabel(location.type)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="px-4 py-8 text-center">
              <MapPin className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
              <div className="text-sm text-muted-foreground mb-2">
                No locations found
              </div>
              {allowCustomLocation && inputValue.trim() && (
                <button
                  onClick={handleCustomLocation}
                  className="text-sm text-ocean-blue hover:text-ocean-blue/80 transition-colors"
                >
                  Use "{inputValue.trim()}" as custom location
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}