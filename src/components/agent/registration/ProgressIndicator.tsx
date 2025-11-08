'use client'

import { Check } from 'lucide-react'

interface Step {
  number: number
  title: string
  completed: boolean
}

interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
  steps: Step[]
}

export default function ProgressIndicator({
  currentStep,
  totalSteps,
  steps,
}: ProgressIndicatorProps) {
  return (
    <div className="w-full">
      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                    step.completed
                      ? 'border-green-500 bg-green-500 text-white'
                      : step.number === currentStep
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-gray-300 bg-white text-gray-400'
                  }`}
                >
                  {step.completed ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-semibold">{step.number}</span>
                  )}
                </div>
                <span
                  className={`mt-2 text-xs font-medium ${
                    step.number === currentStep
                      ? 'text-blue-600'
                      : step.completed
                        ? 'text-green-600'
                        : 'text-gray-500'
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`mx-2 h-0.5 flex-1 transition-all ${
                    step.completed ? 'bg-green-500' : 'bg-[#e8e8e4]-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm text-gray-500">{steps[currentStep - 1].title}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#e8e8e4]-200">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
