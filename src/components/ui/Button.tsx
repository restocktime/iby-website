import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl font-modern font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none min-h-[44px] min-w-[44px] relative overflow-hidden group',
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl active:scale-95 transform hover:scale-105',
        secondary: 'bg-gradient-to-r from-slate-600 to-slate-700 text-white hover:from-slate-700 hover:to-slate-800 shadow-lg hover:shadow-xl active:scale-95 transform hover:scale-105',
        outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-700 active:bg-blue-700 backdrop-blur-sm bg-white/10 transform hover:scale-105',
        ghost: 'text-blue-600 hover:bg-blue-50 active:bg-blue-100 transform hover:scale-105',
        destructive: 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl active:scale-95 transform hover:scale-105',
        premium: 'bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95',
      },
      size: {
        default: 'h-11 px-6 py-2 text-sm',
        sm: 'h-9 px-4 text-sm',
        lg: 'h-14 px-10 text-lg',
        xl: 'h-16 px-12 text-xl',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode
  loading?: boolean
  loadingText?: string
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  variant,
  size,
  children,
  loading = false,
  loadingText = 'Loading...',
  icon,
  iconPosition = 'left',
  disabled,
  'aria-label': ariaLabel,
  ...props
}, ref) => {
  const isDisabled = disabled || loading

  return (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={isDisabled}
      aria-label={loading ? loadingText : ariaLabel}
      aria-disabled={isDisabled}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <span className="mr-2" aria-hidden="true">
          {icon}
        </span>
      )}
      
      <span className={loading ? 'sr-only' : ''}>
        {loading ? loadingText : children}
      </span>
      
      {!loading && icon && iconPosition === 'right' && (
        <span className="ml-2" aria-hidden="true">
          {icon}
        </span>
      )}
    </button>
  )
})

Button.displayName = 'Button'

export default Button