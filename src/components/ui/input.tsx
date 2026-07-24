import * as React from 'react'
import { cn } from '@/lib/utils'

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'h-11 w-full rounded-lg border border-dg-line bg-dg-card2 px-4 text-sm text-dg-text',
        'placeholder:text-dg-muted focus:border-dg-yellow focus:outline-none',
        className,
      )}
      {...props}
    />
  ),
)
Input.displayName = 'Input'

export { Input }
