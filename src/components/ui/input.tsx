import * as React from 'react'
import { cn } from '@/utilities/cn'

interface InputProps extends React.ComponentProps<'input'> {
  label?: string
  error?: string
  success?: string
  icon?: React.ReactNode
  floatingLabel?: boolean
}

function Input({
  className,
  type,
  label,
  error,
  success,
  icon,
  floatingLabel = true,
  id,
  ...props
}: InputProps) {
  const generatedId = React.useId()
  const inputId = id || `input-${generatedId}`
  
  if (floatingLabel && label) {
    return (
      <div className={cn('input-travel', error && 'error', success && 'success')}>
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none z-10">
            {icon}
          </div>
        )}
        <input
          type={type}
          id={inputId}
          data-slot="input"
          className={cn(
            'border-input bg-background file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-12 w-full min-w-0 rounded-lg border px-4 py-3 text-base shadow-sm transition-all duration-300 outline-none file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            'focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            'hover:border-primary/50',
            'aria-invalid:ring-destructive/20 aria-invalid:border-destructive',
            icon && 'pl-12',
            className,
          )}
          placeholder=" " // Required for floating label effect
          {...props}
        />
        <label
          htmlFor={inputId}
          className="text-sm font-medium"
        >
          {label}
        </label>
        {error && (
          <div className="error-message">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}
        {success && (
          <div className="success-message">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {success}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none z-10">
            {icon}
          </div>
        )}
        <input
          type={type}
          id={inputId}
          data-slot="input"
          className={cn(
            'border-input bg-background file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-12 w-full min-w-0 rounded-lg border px-4 py-3 text-base shadow-sm transition-all duration-300 outline-none file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            'focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            'hover:border-primary/50',
            'aria-invalid:ring-destructive/20 aria-invalid:border-destructive',
            error && 'border-destructive focus-visible:ring-destructive',
            success && 'border-success focus-visible:ring-success',
            icon && 'pl-12',
            className,
          )}
          {...props}
        />
      </div>
      {error && (
        <div className="error-message">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
      {success && (
        <div className="success-message">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {success}
        </div>
      )}
    </div>
  )
}

export { Input, type InputProps }
