import { aproveitamento, iniciais, progresso } from '@/lib/ranking'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import type { RankingColaborador, Setor } from '@/types/database'

interface TabelaEquipeProps {
  colaboradores: RankingColaborador[]
  setores: Setor[]
}

function statusDe(c: RankingColaborador) {
  if (c.modulos_concluidos >= c.modulos_totais) return { variant: 'concluido' as const, rotulo: 'Concluído' }
  if (c.modulos_concluidos === 0) return { variant: 'inicial' as const, rotulo: 'Não iniciou' }
  return { variant: 'andamento' as const, rotulo: 'Em trilha' }
}

/**
 * A planilha de todo mundo.
 *
 * Também é a "table view" dos gráficos acima: todo valor plotado está aqui em
 * texto, então nada fica preso a hover ou a cor.
 */
export function TabelaEquipe({ colaboradores, setores }: TabelaEquipeProps) {
  const ordenado = [...colaboradores].sort((a, b) => b.pontos - a.pontos)

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr>
            {['#', 'Colaborador', 'Setor', 'Progresso', 'Aproveitamento', 'Ritmo', 'Pontos', 'Status'].map(
              (th) => (
                <th
                  key={th}
                  className="whitespace-nowrap px-3 pb-3 text-left font-mono text-[9.5px] font-bold uppercase tracking-[0.16em] text-dg-muted"
                >
                  {th}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {ordenado.map((c, i) => {
            const pct = Math.round(progresso(c) * 100)
            const apr = aproveitamento(c)
            const status = statusDe(c)

            return (
              <tr key={c.user_id} className="border-t border-dg-line">
                <td className="px-3 py-3 font-mono text-[11.5px] tabular-nums text-dg-muted">
                  {i + 1}
                </td>

                <td className="px-3 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-dg-line bg-dg-card2 font-display text-[11px] font-bold text-dg-muted">
                      {iniciais(c.nome)}
                    </div>
                    <div>
                      <b className="block whitespace-nowrap text-[13px] text-dg-text">{c.nome}</b>
                      <small className="whitespace-nowrap text-[11px] text-dg-muted">{c.cargo}</small>
                    </div>
                  </div>
                </td>

                <td className="whitespace-nowrap px-3 py-3 text-[12px] text-dg-muted">
                  {setores.find((s) => s.id === c.setor_id)?.nome ?? '—'}
                </td>

                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <Progress valor={pct} className="w-20" />
                    <span className="font-mono text-[11.5px] tabular-nums text-dg-muted">
                      {c.modulos_concluidos}/{c.modulos_totais}
                    </span>
                  </div>
                </td>

                <td className="px-3 py-3 font-mono text-[11.5px] tabular-nums text-dg-muted">
                  {apr === null ? '—' : `${Math.round(apr * 100)}%`}
                  {c.respostas_total > 0 && (
                    <span className="ml-1 text-[10px] text-dg-muted/70">
                      ({c.acertos}/{c.respostas_total})
                    </span>
                  )}
                </td>

                <td className="whitespace-nowrap px-3 py-3 font-mono text-[11.5px] tabular-nums text-dg-muted">
                  {c.dias_por_modulo === null ? '—' : `${c.dias_por_modulo} d/mód`}
                </td>

                <td className="px-3 py-3 font-mono text-[11.5px] tabular-nums text-dg-text">
                  {c.pontos}
                </td>

                <td className="px-3 py-3">
                  <Badge variant={status.variant}>{status.rotulo}</Badge>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
