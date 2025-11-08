'use client'

import * as React from 'react'
import { cn } from '@/utilities/cn'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'

interface DateRangePickerProps {
  startDate?: string
  endDate?: string
  onStartDateChange?: (date: string) => void
  onEndDateChange?: (date: string) => void
  flexibleDates?: boolean
  onFlexibleDatesChange?: (flexible: boolean) => void
  className?: string
}

export function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  flexibleDates = false,
  onFlexibleDatesChange,
  className,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [currentMonth, setCurrentMonth] = React.useState(new Date())

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const handleDateSelect = (date: Date) => {
    const dateString = date.toISOString().split('T')[0]
    if (!flexibleDates) {
      if (!startDate || (new Date(dateString) < new Date(startDate))) {
        onStartDateChange?.(dateString)
      } else if (!endDate || (new Date(dateString) > new Date(endDate))) {
        onEndDateChange?.(dateString)
      }
    }
  }

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    
    const startingDayOfWeek = firstDay.getDay()
    const days = []
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    
    return days
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const isDateSelected = (date: Date) => {
    const dateString = date.toISOString().split('T')[0]
    return dateString === startDate || dateString === endDate
  }

  const isDateInRange = (date: Date) => {
    if (!startDate || !endDate) return false
    const dateStr = date.toISOString().split('T')[0]
    return dateStr >= startDate && dateStr <= endDate
  }

  return (
    <div className={cn('relative', className)}>
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-foreground mb-2">
            Travel Dates
          </label>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs text-muted-foreground mb-1">
                Departure
              </label>
              <input
                type="date"
                value={startDate || ''}
                onChange={(e) => onStartDateChange?.(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ocean-blue focus:border-ocean-blue outline-none transition-all"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-muted-foreground mb-1">
                Return
              </label>
              <input
                type="date"
                value={endDate || ''}
                onChange={(e) => onEndDateChange?.(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ocean-blue focus:border-ocean-blue outline-none transition-all"
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="flexible-dates"
            checked={flexibleDates}
            onChange={(e) => onFlexibleDatesChange?.(e.target.checked)}
            className="h-4 w-4 text-ocean-blue rounded focus:ring-2 focus:ring-ocean-blue"
          />
          <label htmlFor="flexible-dates" className="text-sm text-foreground cursor-pointer">
            My dates are flexible ±3 days
          </label>
        </div>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 border border-border rounded-lg bg-background hover:bg-muted transition-colors"
      >
        <span className="text-sm font-medium">
          {startDate && endDate 
            ? `${formatDate(new Date(startDate))} - ${formatDate(new Date(endDate))}`
            : 'Select travel dates'
          }
        </span>
        <Calendar className="h-4 w-4 text-muted-foreground" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-2 w-full max-w-md">
          <div className="bg-background border border-border rounded-lg shadow-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handlePreviousMonth}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              <h3 className="text-lg font-semibold text-foreground">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              
              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
              
              {getDaysInMonth().map((date, index) => (
                <button
                  key={index}
                  onClick={() => date && handleDateSelect(date)}
                  className={cn(
                    'p-2 text-sm rounded-lg transition-all',
                    isDateSelected(date) && 'bg-ocean-blue text-white',
                    isDateInRange(date) && 'bg-ocean-blue/20 text-ocean-blue',
                    'hover:bg-ocean-blue/10'
                  )}
                >
                  {date && date.getDate()}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}