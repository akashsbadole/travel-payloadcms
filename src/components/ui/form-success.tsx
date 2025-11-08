'use client'

import * as React from 'react'
import { cn } from '@/utilities/cn'
import { Button } from './button'
import { Card } from './card'
import { CheckCircle, ArrowRight, Home, FileText, Phone, Mail } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface FormSuccessProps {
  title?: string
  message?: string
  subMessage?: string
  referenceNumber?: string
  showActions?: boolean
  primaryAction?: {
    label: string
    onClick: () => void
    icon?: React.ReactNode
  }
  secondaryAction?: {
    label: string
    onClick: () => void
    icon?: React.ReactNode
  }
  className?: string
  type?: 'success' | 'info' | 'warning'
}

export function FormSuccess({
  title = "Requirement Submitted Successfully!",
  message = "Your travel requirement has been received and our team will contact you shortly.",
  subMessage,
  referenceNumber,
  showActions = true,
  primaryAction,
  secondaryAction,
  className,
  type = 'success',
}: FormSuccessProps) {
  const router = useRouter()

  const defaultPrimaryAction = {
    label: "View My Requirements",
    onClick: () => router.push('/dashboard/requirements'),
    icon: <FileText className="h-4 w-4" />
  }

  const defaultSecondaryAction = {
    label: "Back to Home",
    onClick: () => router.push('/dashboard'),
    icon: <Home className="h-4 w-4" />
  }

  const getIconColor = () => {
    switch (type) {
      case 'success': return 'text-green-500'
      case 'info': return 'text-blue-500'
      case 'warning': return 'text-yellow-500'
      default: return 'text-green-500'
    }
  }

  const getBgGradient = () => {
    switch (type) {
      case 'success': return 'from-green-500/10 to-emerald-600/10 border-green-500/20'
      case 'info': return 'from-blue-500/10 to-sky-600/10 border-blue-500/20'
      case 'warning': return 'from-yellow-500/10 to-orange-600/10 border-yellow-500/20'
      default: return 'from-green-500/10 to-emerald-600/10 border-green-500/20'
    }
  }

  return (
    <div className={cn('max-w-2xl mx-auto', className)}>
      <Card className={cn('overflow-hidden', getBgGradient())}>
        <div className="p-8 text-center space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle className={cn('h-10 w-10', getIconColor())} />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-foreground">{title}</h2>
            <p className="text-muted-foreground leading-relaxed">{message}</p>
            {subMessage && (
              <p className="text-sm text-muted-foreground">{subMessage}</p>
            )}
          </div>

          {/* Reference Number */}
          {referenceNumber && (
            <div className="bg-background/50 rounded-lg p-4 border border-border/50">
              <div className="text-sm text-muted-foreground mb-1">Reference Number</div>
              <div className="font-mono font-semibold text-foreground">{referenceNumber}</div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-background/30 rounded-lg p-6 border border-border/30">
            <h3 className="font-semibold text-foreground mb-4">What happens next?</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-ocean-blue/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-ocean-blue">1</span>
                </div>
                <div>
                  <div className="font-medium text-foreground">Expert Review</div>
                  <div className="text-sm text-muted-foreground">Our travel experts will review your requirements within 2 hours</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-ocean-blue/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-ocean-blue">2</span>
                </div>
                <div>
                  <div className="font-medium text-foreground">Personalized Options</div>
                  <div className="text-sm text-muted-foreground">You'll receive customized travel options via email and WhatsApp</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-ocean-blue/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-ocean-blue">3</span>
                </div>
                <div>
                  <div className="font-medium text-foreground">Booking & Confirmation</div>
                  <div className="text-sm text-muted-foreground">Choose your preferred option and complete the booking</div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div className="bg-muted/20 rounded-lg p-4 border border-border/30">
            <div className="text-sm text-muted-foreground mb-2">Need immediate assistance?</div>
            <div className="flex items-center justify-center gap-4 text-sm">
              <a href="tel:+919876543210" className="flex items-center gap-1 text-ocean-blue hover:text-ocean-blue/80 transition-colors">
                <Phone className="h-4 w-4" />
                <span>+91 98765 43210</span>
              </a>
              <span className="text-border">•</span>
              <a href="mailto:support@travels.com" className="flex items-center gap-1 text-ocean-blue hover:text-ocean-blue/80 transition-colors">
                <Mail className="h-4 w-4" />
                <span>support@travels.com</span>
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          {showActions && (
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={primaryAction?.onClick || defaultPrimaryAction.onClick}
                className="travel-btn-primary flex-1"
              >
                {primaryAction?.icon || defaultPrimaryAction.icon}
                {primaryAction?.label || defaultPrimaryAction.label}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={secondaryAction?.onClick || defaultSecondaryAction.onClick}
                className="travel-btn-secondary"
              >
                {secondaryAction?.icon || defaultSecondaryAction.icon}
                {secondaryAction?.label || defaultSecondaryAction.label}
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Additional Resources */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/requirements')}>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-ocean-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="h-5 w-5 text-ocean-blue" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">View All Requirements</h3>
              <p className="text-sm text-muted-foreground">Track and manage all your travel requests</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/dashboard')}>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-sunset-orange/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Home className="h-5 w-5 text-sunset-orange" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Explore More</h3>
              <p className="text-sm text-muted-foreground">Discover new destinations and travel deals</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

// Specialized success components for different form types
export function FlightSuccess({ referenceNumber }: { referenceNumber?: string }) {
  return (
    <FormSuccess
      title="Flight Search Request Submitted!"
      message="Our flight experts are searching for the best deals matching your requirements. You'll receive competitive options within 2 hours."
      subMessage="We'll compare prices across multiple airlines to find you the best value."
      referenceNumber={referenceNumber}
      primaryAction={{
        label: "View Flight Requests",
        onClick: () => {}, // Will be implemented with routing
        icon: <FileText className="h-4 w-4" />
      }}
    />
  )
}

export function HotelSuccess({ referenceNumber }: { referenceNumber?: string }) {
  return (
    <FormSuccess
      title="Hotel Search Request Submitted!"
      message="Our hotel partners are checking availability and special rates for your dates. Expect personalized recommendations soon."
      subMessage="We'll find you the best accommodation options within your budget."
      referenceNumber={referenceNumber}
      primaryAction={{
        label: "View Hotel Requests",
        onClick: () => {}, // Will be implemented with routing
        icon: <FileText className="h-4 w-4" />
      }}
    />
  )
}

export function BusSuccess({ referenceNumber }: { referenceNumber?: string }) {
  return (
    <FormSuccess
      title="Bus Search Request Submitted!"
      message="We're checking bus availability and schedules across multiple operators. You'll receive the best options shortly."
      subMessage="Compare prices, amenities, and timings in one place."
      referenceNumber={referenceNumber}
      primaryAction={{
        label: "View Bus Requests",
        onClick: () => {}, // Will be implemented with routing
        icon: <FileText className="h-4 w-4" />
      }}
    />
  )
}

export function TrainSuccess({ referenceNumber }: { referenceNumber?: string }) {
  return (
    <FormSuccess
      title="Train Search Request Submitted!"
      message="Our railway experts are checking seat availability and fare options across all classes and trains."
      subMessage="We'll help you find confirmed seats at the best prices."
      referenceNumber={referenceNumber}
      primaryAction={{
        label: "View Train Requests",
        onClick: () => {}, // Will be implemented with routing
        icon: <FileText className="h-4 w-4" />
      }}
    />
  )
}

export function TourPackageSuccess({ referenceNumber }: { referenceNumber?: string }) {
  return (
    <FormSuccess
      title="Tour Package Request Submitted!"
      message="Our destination experts are crafting personalized tour packages based on your preferences. Get ready for an amazing journey!"
      subMessage="We'll include exclusive experiences and hidden gems in your itinerary."
      referenceNumber={referenceNumber}
      primaryAction={{
        label: "View Tour Requests",
        onClick: () => {}, // Will be implemented with routing
        icon: <FileText className="h-4 w-4" />
      }}
    />
  )
}