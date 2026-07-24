import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.06em] whitespace-nowrap',
  {
    variants: {
      variant: {
        andamento: 'border-dg-yellow/30 bg-dg-yellow/10 text-dg-yellow',
        concluido: 'border-dg-success/30 bg-dg-success/10 text-dg-success',
        inicial: 'border-dg-line bg-dg-card2 text-dg-muted',
      },
    },
    defaultVariants: { variant: 'inicial' },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
