import { Check, Play } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Aula } from '@/types/database'

interface PlaylistAulasProps {
  aulas: Aula[]
  assistidas: Set<string>
  aulaAtualId: string | null
  onSelecionar: (aula: Aula) => void
}

/**
 * Lista de vídeos de um módulo com mais de 1 aula (ex.: "Regras da Casa").
 * Qualquer vídeo pode ser escolhido a qualquer momento — não há ordem
 * obrigatória entre eles, só a trava de avanço de cada vídeo individual.
 */
export function PlaylistAulas({ aulas, assistidas, aulaAtualId, onSelecionar }: PlaylistAulasProps) {
  return (
    <div className="mb-7 rounded-2xl border border-dg-line bg-dg-card p-3">
      <p className="mb-2 px-2 pt-1 font-mono text-[10.5px] uppercase tracking-[0.28em] text-dg-yellow">
        // Playlist · {assistidas.size} / {aulas.length} assistidos
      </p>
      <ul className="space-y-1">
        {aulas.map((aula, i) => {
          const assistida = assistidas.has(aula.id)
          const ativa = aula.id === aulaAtualId
          return (
            <li key={aula.id}>
              <button
                onClick={() => onSelecionar(aula)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl border-[1.5px] px-3 py-2.5 text-left text-[13.5px] transition',
                  ativa
                    ? 'border-dg-yellow bg-dg-yellow/[0.06]'
                    : 'border-transparent hover:border-dg-line hover:bg-dg-card2',
                )}
              >
                <span
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-mono text-[11px] font-bold',
                    assistida
                      ? 'border-dg-success bg-dg-success text-[#111]'
                      : 'border-dg-line bg-[#0c0c0c] text-dg-muted',
                  )}
                >
                  {assistida ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
                </span>
                <span className={cn('flex-1', ativa ? 'text-dg-yellow' : 'text-dg-text')}>{aula.titulo}</span>
                {ativa && <Play className="h-3.5 w-3.5 shrink-0 fill-dg-yellow text-dg-yellow" />}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
