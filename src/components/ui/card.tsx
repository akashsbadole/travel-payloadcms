import * as React from 'react'

import { cn } from '@/utilities/cn'

function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card"
      className={cn(
        'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-border p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-primary/5 hover:border-primary/20',
        className,
      )}
      {...props}
    />
  )
}

function TravelCard({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="travel-card"
      className={cn(
        'form-travel text-card-foreground flex flex-col gap-6 rounded-2xl p-8 transition-all duration-300 hover:shadow-xl',
        className,
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn('flex flex-col gap-1.5 px-6', className)}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn('leading-none font-semibold', className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-content" className={cn('px-6', className)} {...props} />
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="card-footer" className={cn('flex items-center px-6', className)} {...props} />
  )
}

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, TravelCard }
