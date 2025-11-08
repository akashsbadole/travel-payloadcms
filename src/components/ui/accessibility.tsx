'use client'

import * as React from 'react'
import { cn } from '@/utilities/cn'

// Accessible Form Field Wrapper
interface AccessibleFieldProps {
  children: React.ReactNode
  label: string
  description?: string
  error?: string
  required?: boolean
  id: string
  className?: string
}

export function AccessibleField({
  children,
  label,
  description,
  error,
  required = false,
  id,
  className,
}: AccessibleFieldProps) {
  const fieldId = `field-${id}`
  const descriptionId = description ? `${fieldId}-description` : undefined
  const errorId = error ? `${fieldId}-error` : undefined

  return (
    <div className={cn('space-y-2', className)}>
      <label
        htmlFor={fieldId}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
        {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
      </label>
      
      {React.cloneElement(children as React.ReactElement, {
        id: fieldId,
        'aria-describedby': cn(descriptionId, errorId).trim() || undefined,
        'aria-invalid': error ? 'true' : 'false',
        'aria-required': required,
      })}
      
      {description && (
        <p id={descriptionId} className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
      
      {error && (
        <p id={errorId} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

// Accessible Button with proper ARIA support
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  loadingText?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

export function AccessibleButton({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingText = 'Loading...',
  icon,
  iconPosition = 'left',
  disabled,
  className,
  ...props
}: AccessibleButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
  
  const variantClasses = {
    primary: 'bg-ocean-blue text-white hover:bg-ocean-blue/90',
    secondary: 'bg-sunset-orange text-white hover:bg-sunset-orange/90',
    outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground'
  }
  
  const sizeClasses = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 py-2 px-4',
    lg: 'h-11 px-8'
  }

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled || loading}
      aria-busy={loading}
      aria-disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="mr-2 h-4 w-4 animate-spin" aria-hidden="true">
          ⏳
        </span>
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <span className="mr-2" aria-hidden="true">
          {icon}
        </span>
      )}
      
      <span>{loading ? loadingText : children}</span>
      
      {!loading && icon && iconPosition === 'right' && (
        <span className="ml-2" aria-hidden="true">
          {icon}
        </span>
      )}
    </button>
  )
}

// Accessible Select with keyboard navigation
interface AccessibleSelectProps {
  label: string
  options: Array<{ value: string; label: string; disabled?: boolean }>
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  required?: boolean
  error?: string
  description?: string
  className?: string
}

export function AccessibleSelect({
  label,
  options,
  value,
  onValueChange,
  placeholder,
  required = false,
  error,
  description,
  className,
}: AccessibleSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1)
  const selectRef = React.useRef<HTMLDivElement>(null)
  const listboxRef = React.useRef<HTMLUListElement>(null)

  const selectedOption = options.find(option => option.value === value)
  const displayValue = selectedOption?.label || placeholder

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault()
        setIsOpen(!isOpen)
        break
      case 'ArrowDown':
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
        } else {
          setHighlightedIndex(prev => 
            prev < options.length - 1 ? prev + 1 : prev
          )
        }
        break
      case 'ArrowUp':
        e.preventDefault()
        if (isOpen) {
          setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0)
        }
        break
      case 'Escape':
        setIsOpen(false)
        break
    }
  }

  const handleOptionClick = (optionValue: string) => {
    onValueChange?.(optionValue)
    setIsOpen(false)
    setHighlightedIndex(-1)
  }

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <AccessibleField
      label={label}
      error={error}
      required={required}
      id="accessible-select"
      description={description}
      className={className}
    >
      <div ref={selectRef} className="relative">
        <div
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-required={required}
          aria-invalid={error ? 'true' : 'false'}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'cursor-pointer',
            error && 'border-red-500',
            'disabled:cursor-not-allowed disabled:opacity-50'
          )}
        >
          <span className={cn(!value && 'text-muted-foreground')}>
            {displayValue}
          </span>
          <span className="ml-auto" aria-hidden="true">
            ▼
          </span>
        </div>

        {isOpen && (
          <ul
            ref={listboxRef}
            role="listbox"
            aria-activedescendant={highlightedIndex >= 0 ? `option-${highlightedIndex}` : undefined}
            className={cn(
              'absolute z-50 w-full mt-1 bg-background border border-input rounded-md shadow-lg',
              'max-h-60 overflow-auto'
            )}
          >
            {options.map((option, index) => (
              <li
                key={option.value}
                id={`option-${index}`}
                role="option"
                aria-selected={value === option.value}
                aria-disabled={option.disabled}
                className={cn(
                  'px-3 py-2 text-sm cursor-pointer',
                  'focus:bg-accent focus:text-accent-foreground',
                  highlightedIndex === index && 'bg-accent text-accent-foreground',
                  value === option.value && 'bg-accent text-accent-foreground',
                  option.disabled && 'opacity-50 cursor-not-allowed'
                )}
                onClick={() => !option.disabled && handleOptionClick(option.value)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </AccessibleField>
  )
}

// Accessible Checkbox with proper keyboard support
interface AccessibleCheckboxProps {
  label: string
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  required?: boolean
  error?: string
  description?: string
  className?: string
}

export function AccessibleCheckbox({
  label,
  checked = false,
  onCheckedChange,
  required = false,
  error,
  description,
  className,
}: AccessibleCheckboxProps) {
  const [isChecked, setIsChecked] = React.useState(checked)
  const checkboxRef = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    setIsChecked(checked)
  }, [checked])

  const handleToggle = () => {
    const newChecked = !isChecked
    setIsChecked(newChecked)
    onCheckedChange?.(newChecked)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleToggle()
    }
  }

  return (
    <AccessibleField
      label={label}
      error={error}
      required={required}
      id="accessible-checkbox"
      description={description}
      className={className}
    >
      <button
        ref={checkboxRef}
        type="button"
        role="checkbox"
        aria-checked={isChecked}
        aria-required={required}
        aria-invalid={error ? 'true' : 'false'}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={cn(
          'flex items-center space-x-2 text-sm',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'rounded-md p-2',
          'hover:bg-accent hover:text-accent-foreground'
        )}
      >
        <div
          className={cn(
            'w-4 h-4 rounded border-2 flex items-center justify-center',
            isChecked
              ? 'bg-ocean-blue border-ocean-blue text-white'
              : 'border-input bg-background'
          )}
          aria-hidden="true"
        >
          {isChecked && <span className="text-xs">✓</span>}
        </div>
        <span>{label}</span>
      </button>
    </AccessibleField>
  )
}

// Screen reader announcements
export function useScreenReaderAnnouncements() {
  const [announcement, setAnnouncement] = React.useState('')

  const announce = React.useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    setAnnouncement(message)
    // Clear the announcement after it's been read
    setTimeout(() => setAnnouncement(''), 1000)
  }, [])

  const Announcer = React.useCallback(() => (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  ), [announcement])

  return { announce, Announcer }
}

// Focus trap for modals and dropdowns
export function useFocusTrap(isActive: boolean) {
  const containerRef = React.useRef<HTMLElement>(null)

  React.useEffect(() => {
    if (!isActive || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus()
          e.preventDefault()
        }
      }
    }

    container.addEventListener('keydown', handleTabKey)
    firstElement?.focus()

    return () => {
      container.removeEventListener('keydown', handleTabKey)
    }
  }, [isActive])

  return containerRef
}

// Skip to main content link
export function SkipToMainContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-ocean-blue text-white px-4 py-2 rounded-md z-50"
    >
      Skip to main content
    </a>
  )
}

// High contrast mode toggle
export function HighContrastToggle() {
  const [isHighContrast, setIsHighContrast] = React.useState(false)

  React.useEffect(() => {
    const stored = localStorage.getItem('high-contrast')
    setIsHighContrast(stored === 'true')
  }, [])

  React.useEffect(() => {
    if (isHighContrast) {
      document.documentElement.classList.add('high-contrast')
      localStorage.setItem('high-contrast', 'true')
    } else {
      document.documentElement.classList.remove('high-contrast')
      localStorage.setItem('high-contrast', 'false')
    }
  }, [isHighContrast])

  return (
    <button
      onClick={() => setIsHighContrast(!isHighContrast)}
      className="p-2 rounded-md hover:bg-accent"
      aria-label="Toggle high contrast mode"
    >
      <span aria-hidden="true">👁️</span>
    </button>
  )
}

// Font size controls
export function FontSizeControls() {
  const [fontSize, setFontSize] = React.useState('medium')

  React.useEffect(() => {
    const stored = localStorage.getItem('font-size')
    if (stored) {
      setFontSize(stored)
      document.documentElement.setAttribute('data-font-size', stored)
    }
  }, [])

  React.useEffect(() => {
    document.documentElement.setAttribute('data-font-size', fontSize)
    localStorage.setItem('font-size', fontSize)
  }, [fontSize])

  return (
    <div className="flex items-center gap-2" role="group" aria-label="Font size controls">
      <button
        onClick={() => setFontSize('small')}
        className={cn(
          'px-2 py-1 rounded',
          fontSize === 'small' ? 'bg-ocean-blue text-white' : 'hover:bg-accent'
        )}
        aria-label="Small font size"
      >
        A-
      </button>
      <button
        onClick={() => setFontSize('medium')}
        className={cn(
          'px-2 py-1 rounded',
          fontSize === 'medium' ? 'bg-ocean-blue text-white' : 'hover:bg-accent'
        )}
        aria-label="Medium font size"
      >
        A
      </button>
      <button
        onClick={() => setFontSize('large')}
        className={cn(
          'px-2 py-1 rounded',
          fontSize === 'large' ? 'bg-ocean-blue text-white' : 'hover:bg-accent'
        )}
        aria-label="Large font size"
      >
        A+
      </button>
    </div>
  )
}