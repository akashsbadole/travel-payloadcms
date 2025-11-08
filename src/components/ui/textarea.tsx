import * as React from 'react'

import { cn } from '@/utilities/cn'

interface TextareaProps extends React.ComponentProps<'textarea'> {
  label?: string
  error?: string
  success?: string
  floatingLabel?: boolean
}

function Textarea({
  className,
  label,
  error,
  success,
  floatingLabel = false,
  id,
  ...props
}: TextareaProps) {
  const generatedId = React.useId()
  const textareaId = id || `textarea-${generatedId}`

  if (floatingLabel && label) {
    return (
      <div className={cn('textarea-travel', error && 'error', success && 'success')}>
        <textarea
          id={textareaId}
          data-slot="textarea"
          className={cn(
            'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex field-sizing-content min-h-32 w-full rounded-lg border bg-transparent px-4 py-3 text-base shadow-sm transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            error && 'border-destructive focus-visible:ring-destructive',
            success && 'border-success focus-visible:ring-success',
            className,
          )}
          placeholder=" " // Required for floating label effect
          {...props}
        />
        <label
          htmlFor={textareaId}
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
        <label htmlFor={textareaId} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        data-slot="textarea"
        className={cn(
          'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex field-sizing-content min-h-32 w-full rounded-lg border bg-transparent px-4 py-3 text-base shadow-sm transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          error && 'border-destructive focus-visible:ring-destructive',
          success && 'border-success focus-visible:ring-success',
          className,
        )}
        {...props}
      />
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

export { Textarea, type TextareaProps }
