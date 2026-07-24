import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-bold transition disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-dg-yellow text-[#111] font-extrabold hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(255,218,0,0.3)]',
        outline:
          'border-[1.5px] border-dg-yellow bg-transparent text-dg-yellow hover:bg-dg-yellow/10',
        ghost: 'bg-dg-card2 border border-dg-line text-dg-muted hover:border-dg-yellow hover:text-dg-yellow',
        success: 'bg-dg-success text-[#0d2417]',
      },
      size: {
        default: 'h-11 px-5 text-sm',
        sm: 'h-9 px-4 text-[13px]',
        lg: 'h-14 px-8 text-[15px]',
        icon: 'h-11 w-11 rounded-full p-0',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  ),
)
Button.displayName = 'Button'

export { Button, buttonVariants }
