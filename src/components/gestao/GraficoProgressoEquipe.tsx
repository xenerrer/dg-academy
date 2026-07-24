import { useState } from 'react'
import { motion } from 'framer-motion'
import { progresso } from '@/lib/ranking'
import type { RankingColaborador } from '@/types/database'

interface GraficoProgressoEquipeProps {
  colaboradores: RankingColaborador[]
}

/**
 * Progresso da trilha por colaborador — barras horizontais.
 *
 * Nomes de pessoas são categorias NOMINAIS: trocar a ordem não muda o
 * significado. Então todas as barras usam o mesmo hue (chart.mark). Colorir
 * cada barra por valor gastaria o canal de identidade para reencodar o que o
 * comprimento da barra já diz.
 *
 * Uma série só → sem legenda; o título já nomeia o que está plotado.
 * O valor vai na ponta de cada barra, então o gráfico é legível sem hover.
 */
export function GraficoProgressoEquipe({ colaboradores }: GraficoProgressoEquipeProps) {
  const [ativo, setAtivo] = useState<string | null>(null)

  const ordenado = [...colaboradores].sort((a, b) => progresso(b) - progresso(a))

  return (
    <div>
      <div className="relative">
        {/* gridlines — hairline sólida, um passo da superfície, recessiva */}
        <div className="pointer-events-none absolute inset-y-0 left-[132px] right-[52px]">
          {[0, 25, 50, 75, 100].map((marca) => (
            <div
              key={marca}
              className="absolute top-0 h-full w-px bg-chart-grid"
              style={{ left: `${marca}%` }}
            />
          ))}
        </div>

        <ul className="relative space-y-2.5">
          {ordenado.map((colaborador) => {
            const pct = Math.round(progresso(colaborador) * 100)
            const destacado = ativo === colaborador.user_id

            return (
              <li
                key={colaborador.user_id}
                onMouseEnter={() => setAtivo(colaborador.user_id)}
                onMouseLeave={() => setAtivo(null)}
                onFocus={() => setAtivo(colaborador.user_id)}
                onBlur={() => setAtivo(null)}
                tabIndex={0}
                className="flex items-center gap-3 rounded outline-none focus-visible:ring-1 focus-visible:ring-chart-mark"
              >
                <span className="w-[120px] shrink-0 truncate text-right text-label text-dg-muted">
                  {colaborador.nome}
                </span>

                <div className="relative h-4 flex-1">
                  {/* cresce de 0 até pct ao entrar na viewport; zero é zero, sem
                      sliver — o rótulo à direita carrega a leitura */}
                  <motion.div
                    className="h-4 rounded-r bg-chart-mark"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
                    style={{ opacity: ativo && !destacado ? 0.45 : 1 }}
                  />
                  {destacado && (
                    <div className="absolute -top-9 left-0 z-10 whitespace-nowrap rounded-control border border-dg-line bg-dg-card2 px-2.5 py-1.5 text-caption shadow-lg">
                      <b className="text-dg-text">{colaborador.nome}</b>
                      <span className="text-dg-muted">
                        {' '}
                        · {colaborador.modulos_concluidos} de {colaborador.modulos_totais} módulos
                      </span>
                    </div>
                  )}
                </div>

                <span className="w-10 shrink-0 font-mono text-caption tabular-nums text-dg-muted">
                  {pct}%
                </span>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="mt-3 flex justify-between pl-[132px] pr-[52px] font-mono text-[10px] tabular-nums text-dg-muted">
        {[0, 25, 50, 75, 100].map((marca) => (
          <span key={marca}>{marca}%</span>
        ))}
      </div>
    </div>
  )
}
