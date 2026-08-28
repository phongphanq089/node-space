import * as React from 'react'
import { Separator as SeparatorPrimitive } from 'radix-ui'
import { cn } from '../../utils/cn'

function Separator({
  className,
  orientation = 'vertical',
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'shrink-0 bg-border',
        orientation === 'horizontal'
          ? 'my-1 h-px w-full'
          : 'mx-1 h-5 w-px self-center',
        className
      )}
      {...props}
    />
  )
}

export { Separator }
