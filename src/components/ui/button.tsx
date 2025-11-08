import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/utilities/cn'

const buttonVariants = cva(
  "relative inline-flex items-center justify-center cursor-pointer gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md hover:scale-105 active:scale-95',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:shadow-md hover:scale-105 active:scale-95 focus-visible:ring-destructive',
        outline:
          'border-2 border-primary bg-background text-primary shadow-sm hover:bg-primary hover:text-primary-foreground hover:shadow-md hover:scale-105 active:scale-95',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:shadow-md hover:scale-105 active:scale-95',
        ghost:
          'text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors duration-200',
        link: 'text-primary underline-offset-4 hover:underline transition-colors duration-200',
        nav: 'text-muted-foreground hover:text-primary duration-200 font-medium relative [&.active]:text-primary',
        success:
          'bg-success text-success-foreground shadow-sm hover:bg-success/90 hover:shadow-md hover:scale-105 active:scale-95',
        warning:
          'bg-warning text-warning-foreground shadow-sm hover:bg-warning/90 hover:shadow-md hover:scale-105 active:scale-95',
        info: 'bg-sky-blue text-black shadow-sm hover:bg-sky-blue/90 hover:shadow-md hover:scale-105 active:scale-95',
        gradient:
          'gradient-primary text-primary-foreground shadow-md hover:shadow-lg hover:scale-105 active:scale-95',
        glass:
          'glass text-foreground hover:bg-white/20 hover:shadow-lg hover:scale-105 active:scale-95',
        travel:
          'btn-travel-primary text-black shadow-md hover:shadow-lg hover:scale-105 active:scale-95',
        'travel-secondary':
          'btn-travel-secondary text-ocean-blue border-2 border-ocean-blue hover:bg-ocean-blue hover:text-white hover:shadow-md hover:scale-105 active:scale-95',
      },
      size: {
        xs: 'h-7 rounded-md px-2 text-xs gap-1.5 has-[>svg]:px-1.5',
        sm: 'h-8 rounded-md gap-1.5 px-3 text-sm has-[>svg]:px-2.5',
        default: 'h-10 rounded-lg px-4 py-2 has-[>svg]:px-3',
        lg: 'h-12 rounded-lg px-6 text-base has-[>svg]:px-4',
        xl: 'h-14 rounded-xl px-8 text-lg has-[>svg]:px-5',
        icon: 'h-10 w-10 rounded-lg',
        'icon-sm': 'h-8 w-8 rounded-md',
        'icon-lg': 'h-12 w-12 rounded-lg',
      },
      effect: {
        none: '',
        glow: 'hover:shadow-lg hover:shadow-primary/25',
        lift: 'hover:-translate-y-1',
        scale: 'hover:scale-105',
        bounce: 'hover:animate-bounce',
        pulse: 'hover:animate-pulse',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      effect: 'scale',
    },
  },
)

export type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
