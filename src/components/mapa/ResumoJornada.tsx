import { Zap } from 'lucide-react'

interface ResumoJornadaProps {
  concluidos: number
  total: number
  pontos: number
}

/**
 * Resumo da jornada para o painel lateral do desktop: anel de progresso,
 * pontos e módulos concluídos. É o contexto que sobra de espaço no desktop e
 * falta no mobile — sem distorcer a trilha (que continua vertical).
 */
export function ResumoJornada({ concluidos, total, pontos }: ResumoJornadaProps) {
  const pct = total > 0 ? Math.round((concluidos / total) * 100) : 0
  const raio = 34
  const circ = 2 * Math.PI * raio
  const preenchido = circ * (pct / 100)

  return (
    <div className="rounded-surface border border-dg-line bg-dg-card p-5">
      <div className="flex items-center gap-4">
        <div className="relative h-[86px] w-[86px] shrink-0">
          <svg viewBox="0 0 86 86" className="h-full w-full -rotate-90">
            <circle cx="43" cy="43" r={raio} fill="none" stroke="rgb(var(--dg-line))" strokeWidth="6" />
            <circle
              cx="43"
              cy="43"
              r={raio}
              fill="none"
              stroke="rgb(var(--dg-yellow))"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={circ - preenchido}
              style={{ transition: 'stroke-dashoffset 0.9s var(--ease-out-dg)' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center font-mono text-subtitle font-bold text-dg-text">
            {pct}%
          </div>
        </div>

        <div>
          <p className="font-display text-body-lg font-bold">Sua jornada</p>
          <p className="mt-0.5 text-label text-dg-muted">
            {concluidos} de {total} módulos energizados
          </p>
          <div className="mt-2 flex items-center gap-1.5 font-mono text-label font-bold text-dg-text">
            <Zap className="h-3.5 w-3.5 fill-dg-yellow text-dg-yellow" />
            {pontos} pontos
          </div>
        </div>
      </div>
    </div>
  )
}
