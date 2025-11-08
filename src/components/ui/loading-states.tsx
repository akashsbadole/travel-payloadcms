'use client'

import { cn } from '@/utilities/cn'
import { Bus, Hotel, Loader2, Package, Plane, Train } from 'lucide-react'
import * as React from 'react'

interface LoadingStateProps {
  type?: 'spinner' | 'skeleton' | 'pulse' | 'bounce'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  text?: string
}

export function LoadingState({
  type = 'spinner',
  size = 'md',
  className,
  text,
}: LoadingStateProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4'
      case 'lg':
        return 'w-8 h-8'
      case 'md':
      default:
        return 'w-6 h-6'
    }
  }

  const renderIcon = () => {
    const iconSize = getSizeClasses()

    switch (type) {
      case 'spinner':
        return <Loader2 className={cn('animate-spin', iconSize)} />
      case 'pulse':
        return <div className={cn('bg-muted rounded-full animate-pulse', iconSize)} />
      case 'bounce':
        return <div className={cn('bg-muted rounded-full animate-bounce', iconSize)} />
      case 'skeleton':
        return <div className={cn('bg-muted rounded animate-pulse', iconSize)} />
      default:
        return <Loader2 className={cn('animate-spin', iconSize)} />
    }
  }

  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      {renderIcon()}
      {text && <span className="text-sm text-muted-foreground animate-pulse">{text}</span>}
    </div>
  )
}

// Travel-specific loading components
export function TravelLoadingState({
  service,
  message,
}: {
  service: 'flight' | 'hotel' | 'bus' | 'train' | 'tour-package'
  message?: string
}) {
  const getIcon = () => {
    switch (service) {
      case 'flight':
        return <Plane className="h-8 w-8" />
      case 'hotel':
        return <Hotel className="h-8 w-8" />
      case 'bus':
        return <Bus className="h-8 w-8" />
      case 'train':
        return <Train className="h-8 w-8" />
      case 'tour-package':
        return <Package className="h-8 w-8" />
      default:
        return <Loader2 className="h-8 w-8" />
    }
  }

  const getDefaultMessage = () => {
    switch (service) {
      case 'flight':
        return 'Searching for the best flights...'
      case 'hotel':
        return 'Finding perfect accommodations...'
      case 'bus':
        return 'Checking bus availability...'
      case 'train':
        return 'Looking for train options...'
      case 'tour-package':
        return 'Crafting your dream vacation...'
      default:
        return 'Loading...'
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="relative">
        <div className="absolute inset-0 bg-ocean-blue/20 rounded-full animate-ping" />
        <div className="relative bg-linear-to-br from-ocean-blue to-sky-blue text-white p-4 rounded-full">
          {getIcon()}
        </div>
      </div>
      <div className="text-center space-y-2">
        <h3 className="font-semibold text-foreground">{message || getDefaultMessage()}</h3>
        <p className="text-sm text-muted-foreground">This may take a few moments...</p>
      </div>
    </div>
  )
}

// Form field loading skeleton
export function FormFieldSkeleton({
  lines = 1,
  showLabel = true,
  className,
}: {
  lines?: number
  showLabel?: boolean
  className?: string
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {showLabel && <div className="h-4 w-24 bg-muted rounded animate-pulse" />}
      <div className="space-y-1">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-10 bg-muted rounded animate-pulse',
              lines > 1 && i === lines - 1 && 'w-3/4',
            )}
          />
        ))}
      </div>
    </div>
  )
}

// Card loading skeleton
export function CardSkeleton({
  lines = 3,
  showAvatar = false,
  className,
}: {
  lines?: number
  showAvatar?: boolean
  className?: string
}) {
  return (
    <div className={cn('p-6 space-y-4', className)}>
      <div className="flex items-start gap-4">
        {showAvatar && <div className="w-12 h-12 bg-muted rounded-full animate-pulse" />}
        <div className="flex-1 space-y-2">
          <div className="h-6 w-3/4 bg-muted rounded animate-pulse" />
          <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
        </div>
      </div>
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn('h-4 bg-muted rounded animate-pulse', i === lines - 1 && 'w-2/3')}
          />
        ))}
      </div>
    </div>
  )
}

// Search results loading
export function SearchResultsLoading({
  count = 5,
  type = 'card',
}: {
  count?: number
  type?: 'card' | 'list' | 'grid'
}) {
  if (type === 'list') {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
            <div className="w-16 h-16 bg-muted rounded animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
            </div>
            <div className="h-8 w-20 bg-muted rounded animate-pulse" />
          </div>
        ))}
      </div>
    )
  }

  if (type === 'grid') {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="aspect-video bg-muted rounded-lg animate-pulse" />
            <div className="space-y-2">
              <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Default card type
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} showAvatar />
      ))}
    </div>
  )
}

// Form submission loading overlay
export function FormSubmissionOverlay({
  isVisible,
  message = 'Submitting your request...',
}: {
  isVisible: boolean
  message?: string
}) {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-background border rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-ocean-blue/20 rounded-full animate-ping" />
            <div className="relative bg-linear-to-br from-ocean-blue to-sky-blue text-white p-4 rounded-full">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          </div>
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-foreground">{message}</h3>
            <p className="text-sm text-muted-foreground">
              Please wait while we process your request...
            </p>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="bg-ocean-blue h-full rounded-full animate-pulse"
              style={{ width: '60%' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Progress loading with steps
export function ProgressLoading({ steps, currentStep }: { steps: string[]; currentStep: number }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-3">
            <div
              className={cn(
                'w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-colors',
                index < currentStep
                  ? 'bg-green-500 border-green-500 text-white'
                  : index === currentStep
                    ? 'bg-ocean-blue border-ocean-blue text-white'
                    : 'bg-background border-border text-muted-foreground',
              )}
            >
              {index < currentStep ? '✓' : index + 1}
            </div>
            <span
              className={cn(
                'text-sm',
                index === currentStep ? 'text-foreground font-medium' : 'text-muted-foreground',
              )}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <div
          className="bg-ocean-blue h-full rounded-full transition-all duration-500"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>
    </div>
  )
}

// Smart loading hook
export function useSmartLoading<T>(
  asyncFn: () => Promise<T>,
  options: {
    minLoadingTime?: number
    maxLoadingTime?: number
    onSuccess?: (data: T) => void
    onError?: (error: Error) => void
  } = {},
) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [data, setData] = React.useState<T | null>(null)
  const [error, setError] = React.useState<Error | null>(null)

  const execute = React.useCallback(async () => {
    setIsLoading(true)
    setError(null)

    const startTime = Date.now()
    const minLoadingTime = options.minLoadingTime || 500

    try {
      const result = await asyncFn()
      const elapsed = Date.now() - startTime

      // Ensure minimum loading time for better UX
      if (elapsed < minLoadingTime) {
        await new Promise((resolve) => setTimeout(resolve, minLoadingTime - elapsed))
      }

      setData(result)
      options.onSuccess?.(result)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      options.onError?.(error)
    } finally {
      setIsLoading(false)
    }
  }, [asyncFn, options])

  return {
    isLoading,
    data,
    error,
    execute,
    reset: () => {
      setData(null)
      setError(null)
      setIsLoading(false)
    },
  }
}
