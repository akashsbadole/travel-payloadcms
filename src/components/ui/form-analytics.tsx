'use client'

import * as React from 'react'
import { cn } from '@/utilities/cn'

// Form field interaction tracking
interface FieldInteraction {
  fieldName: string
  fieldType: string
  interactions: {
    firstFocus: number
    lastBlur: number
    focusCount: number
    inputChanges: number
    validationErrors: string[]
    timeSpent: number
  }
}

interface FormAnalyticsData {
  formId: string
  formType: string
  startTime: number
  endTime?: number
  completionTime?: number
  fields: FieldInteraction[]
  abandonmentPoint?: string
  submissionStatus: 'in_progress' | 'completed' | 'abandoned' | 'error'
  userAgent: string
  viewport: {
    width: number
    height: number
  }
  sessionId: string
}

class FormAnalytics {
  private static instance: FormAnalytics
  private formData: Map<string, FormAnalyticsData> = new Map()
  private fieldInteractions: Map<string, FieldInteraction> = new Map()

  static getInstance(): FormAnalytics {
    if (!FormAnalytics.instance) {
      FormAnalytics.instance = new FormAnalytics()
    }
    return FormAnalytics.instance
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private getViewport() {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    }
  }

  startFormTracking(formId: string, formType: string): void {
    const sessionId = this.generateSessionId()
    const formData: FormAnalyticsData = {
      formId,
      formType,
      startTime: Date.now(),
      fields: [],
      submissionStatus: 'in_progress',
      userAgent: navigator.userAgent,
      viewport: this.getViewport(),
      sessionId
    }
    
    this.formData.set(formId, formData)
    this.trackEvent('form_start', { formId, formType, sessionId })
  }

  trackFieldInteraction(
    formId: string,
    fieldName: string,
    fieldType: string,
    interaction: 'focus' | 'blur' | 'input' | 'validation_error',
    error?: string
  ): void {
    const formData = this.formData.get(formId)
    if (!formData) return

    let fieldInteraction = this.fieldInteractions.get(`${formId}_${fieldName}`)
    
    if (!fieldInteraction) {
      fieldInteraction = {
        fieldName,
        fieldType,
        interactions: {
          firstFocus: 0,
          lastBlur: 0,
          focusCount: 0,
          inputChanges: 0,
          validationErrors: [],
          timeSpent: 0
        }
      }
      this.fieldInteractions.set(`${formId}_${fieldName}`, fieldInteraction)
    }

    const now = Date.now()

    switch (interaction) {
      case 'focus':
        if (fieldInteraction.interactions.firstFocus === 0) {
          fieldInteraction.interactions.firstFocus = now
        }
        fieldInteraction.interactions.focusCount++
        break
      case 'blur':
        fieldInteraction.interactions.lastBlur = now
        if (fieldInteraction.interactions.firstFocus > 0) {
          fieldInteraction.interactions.timeSpent += now - fieldInteraction.interactions.firstFocus
        }
        break
      case 'input':
        fieldInteraction.interactions.inputChanges++
        break
      case 'validation_error':
        if (error) {
          fieldInteraction.interactions.validationErrors.push(error)
        }
        break
    }

    this.trackEvent('field_interaction', {
      formId,
      fieldName,
      fieldType,
      interaction,
      error,
      timestamp: now
    })
  }

  trackFormSubmission(formId: string, status: 'completed' | 'error', error?: string): void {
    const formData = this.formData.get(formId)
    if (!formData) return

    const now = Date.now()
    formData.endTime = now
    formData.completionTime = now - formData.startTime
    formData.submissionStatus = status
    formData.fields = Array.from(this.fieldInteractions.values()).filter(
      interaction => interaction.fieldName.startsWith(formId)
    )

    if (status === 'error' && error) {
      formData.abandonmentPoint = error
    }

    this.trackEvent('form_submission', {
      formId,
      status,
      completionTime: formData.completionTime,
      error,
      fields: formData.fields.length
    })

    this.sendAnalyticsData(formData)
  }

  trackFormAbandonment(formId: string, abandonmentPoint?: string): void {
    const formData = this.formData.get(formId)
    if (!formData) return

    const now = Date.now()
    formData.endTime = now
    formData.completionTime = now - formData.startTime
    formData.submissionStatus = 'abandoned'
    formData.abandonmentPoint = abandonmentPoint || 'unknown'
    formData.fields = Array.from(this.fieldInteractions.values()).filter(
      interaction => interaction.fieldName.startsWith(formId)
    )

    this.trackEvent('form_abandonment', {
      formId,
      abandonmentPoint,
      timeSpent: formData.completionTime,
      fieldsCompleted: formData.fields.filter(f => f.interactions.inputChanges > 0).length
    })

    this.sendAnalyticsData(formData)
  }

  private trackEvent(eventName: string, data: any): void {
    // Send to analytics service
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, {
        custom_parameter_1: JSON.stringify(data)
      })
    }

    // Also log to console for development
    console.log('Form Analytics Event:', eventName, data)
  }

  private sendAnalyticsData(data: FormAnalyticsData): void {
    // Send to your analytics endpoint
    fetch('/api/analytics/form-events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).catch(error => {
      console.error('Failed to send form analytics:', error)
    })
  }

  getFormData(formId: string): FormAnalyticsData | undefined {
    return this.formData.get(formId)
  }

  clearFormData(formId: string): void {
    this.formData.delete(formId)
    // Clear related field interactions
    for (const [key] of this.fieldInteractions) {
      if (key.startsWith(formId)) {
        this.fieldInteractions.delete(key)
      }
    }
  }
}

// React hook for form analytics
export function useFormAnalytics(formId: string, formType: string) {
  const analytics = React.useMemo(() => FormAnalytics.getInstance(), [])
  const [isTracking, setIsTracking] = React.useState(false)

  React.useEffect(() => {
    analytics.startFormTracking(formId, formType)
    setIsTracking(true)

    return () => {
      // Track abandonment if form is unmounted without submission
      if (isTracking) {
        analytics.trackFormAbandonment(formId, 'component_unmount')
      }
    }
  }, [formId, formType, analytics, isTracking])

  const trackFieldInteraction = React.useCallback((
    fieldName: string,
    fieldType: string,
    interaction: 'focus' | 'blur' | 'input' | 'validation_error',
    error?: string
  ) => {
    analytics.trackFieldInteraction(formId, fieldName, fieldType, interaction, error)
  }, [analytics, formId])

  const trackSubmission = React.useCallback((
    status: 'completed' | 'error',
    error?: string
  ) => {
    analytics.trackFormSubmission(formId, status, error)
    setIsTracking(false)
  }, [analytics, formId])

  const trackAbandonment = React.useCallback((abandonmentPoint?: string) => {
    analytics.trackFormAbandonment(formId, abandonmentPoint)
    setIsTracking(false)
  }, [analytics, formId])

  return {
    trackFieldInteraction,
    trackSubmission,
    trackAbandonment,
    isTracking
  }
}

// Enhanced form field with analytics tracking
interface AnalyticsFieldProps {
  name: string
  type: string
  children: (props: {
    onFocus: () => void
    onBlur: () => void
    onChange: () => void
    onError: (error: string) => void
  }) => React.ReactNode
  formId: string
}

export function AnalyticsField({ name, type, children, formId }: AnalyticsFieldProps) {
  const { trackFieldInteraction } = useFormAnalytics(formId, 'form')

  const handlers = {
    onFocus: () => trackFieldInteraction(name, type, 'focus'),
    onBlur: () => trackFieldInteraction(name, type, 'blur'),
    onChange: () => trackFieldInteraction(name, type, 'input'),
    onError: (error: string) => trackFieldInteraction(name, type, 'validation_error', error)
  }

  return <>{children(handlers)}</>
}

// Form performance monitoring
interface FormPerformanceMetrics {
  renderTime: number
  interactionTime: number
  validationTime: number
  submissionTime: number
  memoryUsage?: number
}

export function useFormPerformance() {
  const [metrics, setMetrics] = React.useState<FormPerformanceMetrics>({
    renderTime: 0,
    interactionTime: 0,
    validationTime: 0,
    submissionTime: 0
  })

  const measureRenderTime = React.useCallback((callback: () => void) => {
    const start = performance.now()
    callback()
    const end = performance.now()
    setMetrics(prev => ({ ...prev, renderTime: end - start }))
  }, [])

  const measureInteractionTime = React.useCallback((callback: () => void) => {
    const start = performance.now()
    callback()
    const end = performance.now()
    setMetrics(prev => ({ ...prev, interactionTime: end - start }))
  }, [])

  const measureValidationTime = React.useCallback((callback: () => void) => {
    const start = performance.now()
    callback()
    const end = performance.now()
    setMetrics(prev => ({ ...prev, validationTime: end - start }))
  }, [])

  const measureSubmissionTime = React.useCallback((callback: () => Promise<void>) => {
    const start = performance.now()
    return callback().finally(() => {
      const end = performance.now()
      setMetrics(prev => ({ ...prev, submissionTime: end - start }))
    })
  }, [])

  React.useEffect(() => {
    if ('memory' in performance) {
      setMetrics(prev => ({ 
        ...prev, 
        memoryUsage: (performance as any).memory.usedJSHeapSize 
      }))
    }
  }, [])

  return {
    metrics,
    measureRenderTime,
    measureInteractionTime,
    measureValidationTime,
    measureSubmissionTime
  }
}

// A/B testing for form variations
interface FormVariant {
  id: string
  name: string
  weight: number
  changes: Record<string, any>
}

export function useFormABTest(formId: string, variants: FormVariant[]) {
  const [selectedVariant, setSelectedVariant] = React.useState<FormVariant | null>(null)

  React.useEffect(() => {
    // Get stored variant or select new one
    const stored = localStorage.getItem(`form_ab_test_${formId}`)
    
    if (stored) {
      const variant = variants.find(v => v.id === stored)
      if (variant) {
        setSelectedVariant(variant)
        return
      }
    }

    // Select variant based on weights
    const random = Math.random()
    let cumulative = 0
    
    for (const variant of variants) {
      cumulative += variant.weight
      if (random <= cumulative) {
        setSelectedVariant(variant)
        localStorage.setItem(`form_ab_test_${formId}`, variant.id)
        
        // Track A/B test assignment
        FormAnalytics.getInstance().trackEvent('form_ab_test_assigned', {
          formId,
          variantId: variant.id,
          variantName: variant.name
        })
        break
      }
    }
  }, [formId, variants])

  const trackConversion = React.useCallback(() => {
    if (selectedVariant) {
      FormAnalytics.getInstance().trackEvent('form_ab_test_conversion', {
        formId,
        variantId: selectedVariant.id,
        variantName: selectedVariant.name
      })
    }
  }, [formId, selectedVariant])

  return {
    variant: selectedVariant,
    trackConversion
  }
}

// Form heat map tracking
export function useFormHeatMap() {
  const [clicks, setClicks] = React.useState<Array<{ x: number; y: number; timestamp: number }>>([])
  const [scrolls, setScrolls] = React.useState<Array<{ y: number; timestamp: number }>>([])

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      setClicks(prev => [...prev, {
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now()
      }])
    }

    const handleScroll = () => {
      setScrolls(prev => [...prev, {
        y: window.scrollY,
        timestamp: Date.now()
      }])
    }

    document.addEventListener('click', handleClick)
    window.addEventListener('scroll', handleScroll)

    return () => {
      document.removeEventListener('click', handleClick)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const getHeatMapData = React.useCallback(() => ({
    clicks,
    scrolls,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight
    }
  }), [clicks, scrolls])

  return {
    getHeatMapData,
    clearData: () => {
      setClicks([])
      setScrolls([])
    }
  }
}

// Export analytics instance for global use
export const formAnalytics = FormAnalytics.getInstance()

// TypeScript declarations for global objects
declare global {
  interface Window {
    gtag?: (command: string, eventName: string, parameters?: any) => void
  }
}