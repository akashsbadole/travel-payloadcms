'use client'

import * as React from 'react'
import { cn } from '@/utilities/cn'
import { Check, Clock, AlertCircle, Loader2 } from 'lucide-react'

interface ProgressStep {
  id: string
  title: string
  description?: string
  status: 'pending' | 'current' | 'completed' | 'error'
  icon?: React.ReactNode
}

interface FormProgressProps {
  steps: ProgressStep[]
  currentStep?: number
  showLabels?: boolean
  orientation?: 'horizontal' | 'vertical'
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function FormProgress({
  steps,
  currentStep,
  showLabels = true,
  orientation = 'horizontal',
  className,
  size = 'md',
}: FormProgressProps) {
  const [activeStep, setActiveStep] = React.useState(currentStep || 0)

  React.useEffect(() => {
    if (currentStep !== undefined) {
      setActiveStep(currentStep)
    }
  }, [currentStep])

  const getStepIcon = (status: ProgressStep['status'], customIcon?: React.ReactNode) => {
    if (customIcon) {
      return customIcon
    }

    switch (status) {
      case 'completed':
        return <Check className="h-4 w-4" />
      case 'current':
        return <Loader2 className="h-4 w-4 animate-spin" />
      case 'error':
        return <AlertCircle className="h-4 w-4" />
      case 'pending':
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStepColor = (status: ProgressStep['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 border-green-500 text-white'
      case 'current':
        return 'bg-ocean-blue border-ocean-blue text-white'
      case 'error':
        return 'bg-red-500 border-red-500 text-white'
      case 'pending':
      default:
        return 'bg-background border-border text-muted-foreground'
    }
  }

  const getConnectorColor = (index: number) => {
    const currentStatus = steps[index]?.status
    const nextStatus = steps[index + 1]?.status

    if (currentStatus === 'completed' && nextStatus !== 'pending') {
      return 'bg-green-500'
    } else if (currentStatus === 'completed') {
      return 'bg-green-500'
    } else if (currentStatus === 'current' || currentStatus === 'error') {
      return 'bg-ocean-blue'
    } else {
      return 'bg-border'
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          step: 'w-6 h-6 text-xs',
          connector: 'h-0.5',
          label: 'text-xs'
        }
      case 'lg':
        return {
          step: 'w-12 h-12 text-base',
          connector: 'h-1',
          label: 'text-sm'
        }
      case 'md':
      default:
        return {
          step: 'w-8 h-8 text-sm',
          connector: 'h-0.5',
          label: 'text-xs'
        }
    }
  }

  const sizeClasses = getSizeClasses()

  if (orientation === 'vertical') {
    return (
      <div className={cn('space-y-4', className)}>
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex items-center justify-center rounded-full border-2 font-medium transition-all duration-300',
                  getStepColor(step.status),
                  sizeClasses.step
                )}
              >
                {getStepIcon(step.status, step.icon)}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'w-0.5 flex-1 mt-2 transition-colors duration-300',
                    getConnectorColor(index)
                  )}
                />
              )}
            </div>
            
            {showLabels && (
              <div className="flex-1 min-w-0">
                <div className={cn(
                  'font-medium text-foreground',
                  step.status === 'current' && 'text-ocean-blue',
                  step.status === 'completed' && 'text-green-600',
                  step.status === 'error' && 'text-red-600',
                  sizeClasses.label
                )}>
                  {step.title}
                </div>
                {step.description && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {step.description}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex items-center justify-center rounded-full border-2 font-medium transition-all duration-300',
                  getStepColor(step.status),
                  sizeClasses.step
                )}
              >
                {getStepIcon(step.status, step.icon)}
              </div>
              
              {showLabels && (
                <div className="mt-2 text-center max-w-20">
                  <div className={cn(
                    'font-medium text-foreground',
                    step.status === 'current' && 'text-ocean-blue',
                    step.status === 'completed' && 'text-green-600',
                    step.status === 'error' && 'text-red-600',
                    sizeClasses.label
                  )}>
                    {step.title}
                  </div>
                  {step.description && size === 'lg' && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {step.description}
                    </div>
                  )}
                </div>
              )}
            </div>

            {index < steps.length - 1 && (
              <div className="flex-1 mx-2">
                <div
                  className={cn(
                    'w-full transition-colors duration-300',
                    getConnectorColor(index),
                    sizeClasses.connector
                  )}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

// Predefined progress steps for different form types
export const FLIGHT_FORM_STEPS: ProgressStep[] = [
  {
    id: 'route',
    title: 'Route',
    description: 'Select departure and arrival',
    status: 'pending'
  },
  {
    id: 'dates',
    title: 'Dates',
    description: 'Choose travel dates',
    status: 'pending'
  },
  {
    id: 'passengers',
    title: 'Passengers',
    description: 'Add traveler details',
    status: 'pending'
  },
  {
    id: 'preferences',
    title: 'Preferences',
    description: 'Set travel preferences',
    status: 'pending'
  },
  {
    id: 'review',
    title: 'Review',
    description: 'Confirm details',
    status: 'pending'
  }
]

export const HOTEL_FORM_STEPS: ProgressStep[] = [
  {
    id: 'location',
    title: 'Location',
    description: 'Choose destination',
    status: 'pending'
  },
  {
    id: 'dates',
    title: 'Dates',
    description: 'Select stay duration',
    status: 'pending'
  },
  {
    id: 'rooms',
    title: 'Rooms',
    description: 'Room & guest details',
    status: 'pending'
  },
  {
    id: 'preferences',
    title: 'Preferences',
    description: 'Amenities & budget',
    status: 'pending'
  },
  {
    id: 'review',
    title: 'Review',
    description: 'Confirm booking',
    status: 'pending'
  }
]

export const BUS_FORM_STEPS: ProgressStep[] = [
  {
    id: 'route',
    title: 'Route',
    description: 'From & To cities',
    status: 'pending'
  },
  {
    id: 'dates',
    title: 'Dates',
    description: 'Travel date',
    status: 'pending'
  },
  {
    id: 'passengers',
    title: 'Passengers',
    description: 'Number of travelers',
    status: 'pending'
  },
  {
    id: 'preferences',
    title: 'Preferences',
    description: 'Bus type & timing',
    status: 'pending'
  }
]

export const TRAIN_FORM_STEPS: ProgressStep[] = [
  {
    id: 'route',
    title: 'Route',
    description: 'From & To stations',
    status: 'pending'
  },
  {
    id: 'dates',
    title: 'Dates',
    description: 'Journey date',
    status: 'pending'
  },
  {
    id: 'passengers',
    title: 'Passengers',
    description: 'Traveler details',
    status: 'pending'
  },
  {
    id: 'class',
    title: 'Class',
    description: 'Travel class & quota',
    status: 'pending'
  },
  {
    id: 'preferences',
    title: 'Preferences',
    description: 'Train preferences',
    status: 'pending'
  }
]

export const TOUR_PACKAGE_STEPS: ProgressStep[] = [
  {
    id: 'destination',
    title: 'Destination',
    description: 'Choose your destination',
    status: 'pending'
  },
  {
    id: 'duration',
    title: 'Duration',
    description: 'Trip length & dates',
    status: 'pending'
  },
  {
    id: 'travelers',
    title: 'Travelers',
    description: 'Group composition',
    status: 'pending'
  },
  {
    id: 'theme',
    title: 'Theme',
    description: 'Travel style & budget',
    status: 'pending'
  },
  {
    id: 'inclusions',
    title: 'Inclusions',
    description: 'Package details',
    status: 'pending'
  },
  {
    id: 'review',
    title: 'Review',
    description: 'Finalize package',
    status: 'pending'
  }
]

// Hook for managing form progress
export function useFormProgress(initialSteps: ProgressStep[]) {
  const [steps, setSteps] = React.useState<ProgressStep[]>(initialSteps)
  const [currentStep, setCurrentStep] = React.useState(0)

  const updateStepStatus = (stepId: string, status: ProgressStep['status']) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status } : step
    ))
  }

  const moveToNextStep = () => {
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1
      updateStepStatus(steps[currentStep].id, 'completed')
      updateStepStatus(steps[nextStep].id, 'current')
      setCurrentStep(nextStep)
    }
  }

  const moveToPreviousStep = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1
      updateStepStatus(steps[currentStep].id, 'pending')
      updateStepStatus(steps[prevStep].id, 'current')
      setCurrentStep(prevStep)
    }
  }

  const markStepAsError = (stepId: string) => {
    updateStepStatus(stepId, 'error')
  }

  const resetProgress = () => {
    setSteps(initialSteps.map((step, index) => ({
      ...step,
      status: index === 0 ? 'current' : 'pending'
    })))
    setCurrentStep(0)
  }

  const isLastStep = currentStep === steps.length - 1
  const isFirstStep = currentStep === 0

  return {
    steps,
    currentStep,
    updateStepStatus,
    moveToNextStep,
    moveToPreviousStep,
    markStepAsError,
    resetProgress,
    isLastStep,
    isFirstStep
  }
}