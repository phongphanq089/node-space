import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'focus-visible:border-ns-primary focus-visible:ring-ns-primary/20 h-9 w-full min-w-0 rounded-lg border border-ns-border bg-ns-bg/30 px-3 py-1.5 text-base transition-all duration-200 outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-ns-placeholder focus-visible:ring-3 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-ns-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm',
        className
      )}
      {...props}
    />
  )
}

export { Input }
