import { cn } from '@/lib/utils'

interface ProgressProps {
  valor: number
  className?: string
}

export function Progress({ valor, className }: ProgressProps) {
  return (
    <div className={cn('h-[5px] overflow-hidden rounded bg-dg-card2', className)}>
      <div
        className="h-full rounded bg-dg-yellow transition-[width] duration-1000 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, valor))}%` }}
      />
    </div>
  )
}
