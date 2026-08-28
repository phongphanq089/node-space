import * as React from 'react'
import { Eye, EyeOff } from 'lucide-react'

import { cn } from '@/shared/lib/utils'

interface InputProps extends Omit<React.ComponentProps<'input'>, 'prefix'> {
  className?: string
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  showPasswordToggle?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, prefix, suffix, type, showPasswordToggle, ...props }, ref) => {
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
        {prefix && (
          <div className="pointer-events-none absolute left-3 z-10 flex items-center text-ns-ghost">
            {prefix}
          </div>
        )}

        <input
          ref={ref}
          type={finalType}
          data-slot="input"
          className={cn(
            'h-10 w-full min-w-0 rounded-lg border border-ns-primary/60 bg-ns-bg/30 py-1.5 text-base transition-all duration-200 outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-ns-placeholder focus-visible:border-ns-primary focus-visible:ring-3 focus-visible:ring-ns-primary/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-ns-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:border-ns-border/70',
            prefix ? 'pl-9' : 'pl-3',
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
