import { HTMLAttributes, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

const cardVariants = cva(
  'rounded-lg border bg-white shadow-sm transition-all',
  {
    variants: {
      variant: {
        default: 'border-neutral-200',
        elevated: 'border-neutral-200 shadow-lg',
        outlined: 'border-2 border-primary-200',
        ghost: 'border-transparent shadow-none',
      },
      padding: {
        none: '',
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'default',
    },
  }
)

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children: ReactNode
}

export default function Card({
  className,
  variant,
  padding,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cardVariants({ variant, padding, className })}
      {...props}
    >
      {children}
    </div>
  )
}