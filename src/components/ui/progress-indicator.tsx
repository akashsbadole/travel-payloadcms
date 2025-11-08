'use client'

import * as React from 'react'
import { cn } from '@/utilities/cn'
import { Check, Plane, Hotel, Bus, Train, Package } from 'lucide-react'

interface ProgressStep {
  id: string
  label: string
  icon?: React.ReactNode
  status?: 'pending' | 'active' | 'completed'
}

interface ProgressIndicatorProps {
  steps: ProgressStep[]
  currentStep: string
  className?: string
}

const defaultIcons = {
  flight: <Plane className="w-4 h-4" />,
  hotel: <Hotel className="w-4 h-4" />,
  bus: <Bus className="w-4 h-4" />,
  train: <Train className="w-4 h-4" />,
  package: <Package className="w-4 h-4" />,
}

function ProgressIndicator({ steps, currentStep, className }: ProgressIndicatorProps) {
  return (
    <div className={cn('progress-travel', className)}>
      {steps.map((step, index) => {
        const isActive = step.id === currentStep
        const isCompleted = steps.findIndex(s => s.id === currentStep) > index
        const status = isActive ? 'active' : isCompleted ? 'completed' : 'pending'
        
        return (
          <div key={step.id} className={cn('progress-step', status)}>
            <div className={cn('progress-step-icon', status)}>
              {status === 'completed' ? (
                <Check className="w-5 h-5" />
              ) : (
                step.icon || defaultIcons[step.id as keyof typeof defaultIcons] || (
                  <span className="text-sm font-semibold">{index + 1}</span>
                )
              )}
            </div>
            <div className="progress-step-label">{step.label}</div>
          </div>
        )
      })}
    </div>
  )
}

export { ProgressIndicator, type ProgressIndicatorProps, type ProgressStep }