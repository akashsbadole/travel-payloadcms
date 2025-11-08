'use client'

import { cn } from '@/utilities/cn'
import { Baby, Minus, Plus, Users } from 'lucide-react'
import * as React from 'react'

interface PassengerCategory {
  type: 'adults' | 'children' | 'infants'
  label: string
  description: string
  icon: React.ReactNode
  min: number
  max?: number
  ageRange?: string
}

interface PassengerSelectorProps {
  adults: number
  children: number
  infants: number
  onPassengersChange?: (passengers: { adults: number; children: number; infants: number }) => void
  maxPassengers?: number
  className?: string
}

const passengerCategories: PassengerCategory[] = [
  {
    type: 'adults',
    label: 'Adults',
    description: '12+ years',
    icon: <Users className="h-4 w-4" />,
    min: 1,
    max: 9,
    ageRange: '12+ years',
  },
  {
    type: 'children',
    label: 'Children',
    description: '2-11 years',
    icon: <Users className="h-4 w-4" />,
    min: 0,
    max: 8,
    ageRange: '2-11 years',
  },
  {
    type: 'infants',
    label: 'Infants',
    description: 'Under 2 years',
    icon: <Baby className="h-4 w-4" />,
    min: 0,
    max: 4,
    ageRange: 'Under 2 years',
  },
]

export function PassengerSelector({
  adults,
  children,
  infants,
  onPassengersChange,
  maxPassengers = 15,
  className,
}: PassengerSelectorProps) {
  const totalPassengers = adults + children + infants

  const updatePassengerCount = (type: 'adults' | 'children' | 'infants', delta: number) => {
    const newCounts = { adults, children, infants }
    newCounts[type] = Math.max(
      passengerCategories.find((cat) => cat.type === type)?.min || 0,
      newCounts[type] + delta,
      passengerCategories.find((cat) => cat.type === type)?.max || 999,
    )

    // Check total passenger limit
    const newTotal = newCounts.adults + newCounts.children + newCounts.infants
    if (newTotal <= (maxPassengers || 999)) {
      onPassengersChange?.(newCounts)
    }
  }

  const getPassengerCount = (type: 'adults' | 'children' | 'infants') => {
    switch (type) {
      case 'adults':
        return adults
      case 'children':
        return children
      case 'infants':
        return infants
      default:
        return 0
    }
  }

  const getTotalPrice = () => {
    // This would be calculated based on actual pricing logic
    const adultPrice = adults * 1000 // Base price for adults
    const childPrice = children * 800 // Discounted price for children
    const infantPrice = infants * 500 // Further discounted for infants
    return adultPrice + childPrice + infantPrice
  }

  return (
    <div className={cn('space-y-6', className)}>
      <div className="bg-ocean-blue/10 rounded-lg p-6 border border-ocean-blue/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Users className="h-5 w-5" />
            Select Passengers
          </h3>
          <div className="text-sm text-muted-foreground">
            {totalPassengers} {totalPassengers === 1 ? 'Passenger' : 'Passengers'} • Max{' '}
            {maxPassengers}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {passengerCategories.map((category) => {
            const count = getPassengerCount(category.type)
            const categoryInfo = passengerCategories.find((cat) => cat.type === category.type)

            return (
              <div key={category.type} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-background rounded-lg border border-border">
                      {categoryInfo?.icon}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{category.label}</div>
                      <div className="text-xs text-muted-foreground">{category.description}</div>
                      {category.ageRange && (
                        <div className="text-xs text-muted-foreground">{category.ageRange}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updatePassengerCount(category.type, -1)}
                      disabled={count <= (categoryInfo?.min || 0)}
                      className="w-8 h-8 rounded-lg border border-border bg-background hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="h-4 w-4" />
                    </button>

                    <div className="w-12 text-center font-medium text-foreground">{count}</div>

                    <button
                      onClick={() => updatePassengerCount(category.type, 1)}
                      disabled={count >= (categoryInfo?.max || 999)}
                      className="w-8 h-8 rounded-lg border border-border bg-background hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {category.type === 'adults' && (
                  <div className="mt-2 p-3 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground">
                      <strong>Tip:</strong> Children under 12 can travel for free on select routes.
                      Infants under 2 travel for 10% of adult fare.
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-6 p-4 bg-linear-to-r from-ocean-blue/10 to-sunset-orange/10 rounded-lg border border-ocean-blue/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Estimated Total</div>
              <div className="text-2xl font-bold text-foreground">
                ₹{getTotalPrice().toLocaleString()}
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-muted-foreground mb-1">Price per person</div>
              <div className="text-lg font-semibold text-foreground">
                {totalPassengers > 0
                  ? `₹${Math.round(getTotalPrice() / totalPassengers).toLocaleString()}`
                  : '---'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
