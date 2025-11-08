'use client'

import ProgressIndicator from '@/components/agent/registration/ProgressIndicator'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

// Import step components (to be created)
// import PersonalInfoStep from '@/components/agent/registration/PersonalInfoStep'
// import CompanyInfoStep from '@/components/agent/registration/CompanyInfoStep'
// import DocumentUploadStep from '@/components/agent/registration/DocumentUploadStep'
// import SpecializationStep from '@/components/agent/registration/SpecializationStep'
// import BankDetailsStep from '@/components/agent/registration/BankDetailsStep'
// import ReviewStep from '@/components/agent/registration/ReviewStep'

interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

interface CompanyInfo {
  companyName: string
  businessType: 'proprietorship' | 'partnership' | 'private_limited' | 'llp' | ''
  yearEstablished: number | ''
  address: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  website?: string
  socialMedia?: {
    facebook?: string
    instagram?: string
    twitter?: string
  }
  description: string
}

interface Documents {
  gst: File | null
  pan: File | null
  tradeLicense: File | null
}

interface Specializations {
  serviceTypes: string[]
  destinations: string[]
}

interface BankDetails {
  accountHolderName: string
  accountNumber: string
  confirmAccountNumber: string
  bankName: string
  branch: string
  ifscCode: string
}

export interface AgentRegistrationData {
  personalInfo: PersonalInfo
  companyInfo: CompanyInfo
  documents: Documents
  specializations: Specializations
  bankDetails: BankDetails
}

const TOTAL_STEPS = 6

const STEP_TITLES = [
  'Personal Information',
  'Company Information',
  'Verification Documents',
  'Specializations',
  'Bank Details',
  'Review & Submit',
]

export default function AgentRegisterPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})

  const [formData, setFormData] = useState<AgentRegistrationData>({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
    companyInfo: {
      companyName: '',
      businessType: '',
      yearEstablished: '',
      address: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
      },
      website: '',
      socialMedia: {
        facebook: '',
        instagram: '',
        twitter: '',
      },
      description: '',
    },
    documents: {
      gst: null,
      pan: null,
      tradeLicense: null,
    },
    specializations: {
      serviceTypes: [],
      destinations: [],
    },
    bankDetails: {
      accountHolderName: '',
      accountNumber: '',
      confirmAccountNumber: '',
      bankName: '',
      branch: '',
      ifscCode: '',
    },
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleNext = () => {
    // Validate current step before proceeding
    const stepErrors = validateStep(currentStep)
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)
      return
    }

    setErrors({})
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setErrors({})
    }
  }

  const handleSubmit = async () => {
    // Final validation
    const allErrors = validateAllSteps()
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors)
      return
    }

    setIsSubmitting(true)
    try {
      // TODO: Implement registration API call
      console.log('Submitting registration:', formData)

      // Redirect to verification pending page
      router.push('/agent/verification-pending')
    } catch (error) {
      console.error('Registration failed:', error)
      setErrors({ submit: 'Registration failed. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const validateStep = (step: number): Record<string, string> => {
    // TODO: Implement step-specific validation
    return {}
  }

  const validateAllSteps = (): Record<string, string> => {
    // TODO: Implement comprehensive validation
    return {}
  }

  const updatePersonalInfo = (data: Partial<PersonalInfo>) => {
    setFormData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...data },
    }))
  }

  const updateCompanyInfo = (data: Partial<CompanyInfo>) => {
    setFormData((prev) => ({
      ...prev,
      companyInfo: { ...prev.companyInfo, ...data },
    }))
  }

  const updateDocuments = (data: Partial<Documents>) => {
    setFormData((prev) => ({
      ...prev,
      documents: { ...prev.documents, ...data },
    }))
  }

  const updateSpecializations = (data: Partial<Specializations>) => {
    setFormData((prev) => ({
      ...prev,
      specializations: { ...prev.specializations, ...data },
    }))
  }

  const updateBankDetails = (data: Partial<BankDetails>) => {
    setFormData((prev) => ({
      ...prev,
      bankDetails: { ...prev.bankDetails, ...data },
    }))
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Personal Information</h2>
            <p className="text-gray-600">Let's start with your basic information</p>
            {/* PersonalInfoStep component will go here */}
            <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
              Personal Info Step Component (To be implemented)
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Company Information</h2>
            <p className="text-gray-600">Tell us about your travel business</p>
            {/* CompanyInfoStep component will go here */}
            <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
              Company Info Step Component (To be implemented)
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Verification Documents</h2>
            <p className="text-gray-600">Upload your business verification documents</p>
            {/* DocumentUploadStep component will go here */}
            <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
              Document Upload Step Component (To be implemented)
            </div>
          </div>
        )
      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Specializations</h2>
            <p className="text-gray-600">Select your service types and destination expertise</p>
            {/* SpecializationStep component will go here */}
            <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
              Specialization Step Component (To be implemented)
            </div>
          </div>
        )
      case 5:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Bank Details</h2>
            <p className="text-gray-600">Provide your bank account for receiving payouts</p>
            {/* BankDetailsStep component will go here */}
            <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
              Bank Details Step Component (To be implemented)
            </div>
          </div>
        )
      case 6:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Review & Submit</h2>
            <p className="text-gray-600">Review your information before submitting</p>
            {/* ReviewStep component will go here */}
            <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
              Review Step Component (To be implemented)
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Agent Registration</h1>
        <p className="text-gray-600">
          Join our platform and start offering travel services to customers
        </p>
      </div>

      {/* Progress Indicator */}
      <ProgressIndicator
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        steps={STEP_TITLES.map((title, index) => ({
          number: index + 1,
          title,
          completed: index + 1 < currentStep,
        }))}
      />

      {/* Form Card */}
      <Card className="p-6 md:p-8 mt-8">
        {/* Step Content */}
        <div className="mb-8">{renderStep()}</div>

        {/* Error Display */}
        {Object.keys(errors).length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-semibold mb-2">Please fix the following errors:</p>
            <ul className="list-disc list-inside text-red-700 text-sm">
              {Object.entries(errors).map(([key, message]) => (
                <li key={key}>{message}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1 || isSubmitting}
          >
            Back
          </Button>

          <div className="text-sm text-gray-500">
            Step {currentStep} of {TOTAL_STEPS}
          </div>

          {currentStep < TOTAL_STEPS ? (
            <Button type="button" onClick={handleNext} disabled={isSubmitting}>
              Next
            </Button>
          ) : (
            <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Registration'}
            </Button>
          )}
        </div>
      </Card>

      {/* Help Text */}
      <div className="mt-6 text-center text-sm text-gray-600">
        <p>
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  )
}
