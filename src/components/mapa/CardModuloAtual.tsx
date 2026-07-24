import { Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Modulo } from '@/types/database'

interface CardModuloAtualProps {
  modulo: Modulo
  mostrarCompleta: boolean
  onContinuar: () => void
}

/**
 * O card do módulo atual — usado em dois lugares: fixo na base no mobile
 * (zona do polegar) e no painel lateral no desktop. Mesmo conteúdo, wrappers
 * diferentes, para não duplicar markup.
 */
export function CardModuloAtual({ modulo, mostrarCompleta, onContinuar }: CardModuloAtualProps) {
  if (mostrarCompleta) {
    return (
      <div className="text-center">
        <b className="inline-flex items-center gap-1.5 font-display text-body-lg">
          Jornada <span className="text-dg-yellow">completa</span>
          <Zap className="h-4 w-4 fill-dg-yellow text-dg-yellow" />
        </b>
        <p className="mt-1 text-label text-dg-muted">
          Todos os módulos energizados. A certificação está no topo.
        </p>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <div className="min-w-0 flex-1">
        <span className="font-mono text-eyebrow uppercase tracking-[0.2em] text-dg-muted">
          Módulo {modulo.numero}
        </span>
        <b className="block truncate font-display text-body-lg font-bold">{modulo.titulo}</b>
      </div>
      <Button onClick={onContinuar} className="shrink-0">
        Continuar
        <Zap className="h-4 w-4" />
      </Button>
    </div>
  )
}
