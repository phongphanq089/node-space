import * as React from 'react'
import { Eye, EyeOff } from 'lucide-react'

import { cn } from '@/lib/utils'

interface InputProps extends React.ComponentProps<'input'> {
  className?: string
  suffix?: React.ReactNode
  showPasswordToggle?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, suffix, type, showPasswordToggle, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)

    const isPasswordType = type === 'password'
    const finalType =
      isPasswordType && showPasswordToggle
        ? showPassword
          ? 'text'
          : 'password'
        : type

    const passwordToggle = isPasswordType && showPasswordToggle && (
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="cursor-pointer text-ns-placeholder/60 transition-colors hover:text-ns-text"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? (
          <EyeOff className="size-5" />
        ) : (
          <Eye className="size-5" />
        )}
      </button>
    )

    const renderedSuffix = suffix || passwordToggle

    return (
      <div className="relative flex w-full items-center">
        <input
          ref={ref}
          type={finalType}
          data-slot="input"
          className={cn(
            'h-9 w-full min-w-0 rounded-lg border border-ns-border bg-ns-bg/30 py-1.5 pr-3 pl-3 text-base transition-all duration-200 outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-ns-placeholder focus-visible:border-ns-primary focus-visible:ring-3 focus-visible:ring-ns-primary/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-ns-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm',
            renderedSuffix ? 'pr-10' : 'pr-3',
            className
          )}
          {...props}
        />

        {renderedSuffix && (
          <div className="absolute right-3 flex items-center">
            {renderedSuffix}
          </div>
        )}
      </div>
    )
  }
)
export default Input
