import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { aproveitamento, iniciais } from '@/lib/ranking'
import type { RankingColaborador } from '@/types/database'

interface PodioProps {
  /** Já ordenado por pontos, do maior para o menor. */
  top: RankingColaborador[]
}

/**
 * Pódio dos 3 primeiros.
 *
 * Não é gráfico — é ranking, então a forma certa é figura, não barra.
 * As três alturas existem para dar a leitura de posição num relance; o valor
 * está escrito em cada card, nunca só na altura.
 *
 * Cor: ramp ORDINAL de um hue só (chart.mark → mark2 → mark3). Posição tem
 * ordem, então a cor carrega a ordem.
 *
 * Animação: os blocos SOBEM da base ao entrar na viewport (scaleY com origem
 * embaixo, escalonado do 1º ao 3º); o resto do card entra em fade. É a
 * "chegada ao pódio". Respeita prefers-reduced-motion via framer.
 */
export function Podio({ top }: PodioProps) {
  if (top.length === 0) return null

  // 2º, 1º, 3º — a ordem visual do pódio, não a do ranking
  const ordemVisual = [top[1], top[0], top[2]].filter(Boolean)

  const estilo: Record<number, { altura: string; cor: string; anel: string; delay: number }> = {
    0: { altura: 'h-32', cor: 'bg-chart-mark', anel: 'border-chart-mark', delay: 0.1 },
    1: { altura: 'h-24', cor: 'bg-chart-mark2', anel: 'border-chart-mark2', delay: 0 },
    2: { altura: 'h-16', cor: 'bg-chart-mark3', anel: 'border-chart-mark3', delay: 0.2 },
  }

  return (
    <div className="flex items-end justify-center gap-4 sm:gap-6">
      {ordemVisual.map((colaborador) => {
        const posicao = top.indexOf(colaborador)
        const { altura, cor, anel, delay } = estilo[posicao]
        const pct = aproveitamento(colaborador)

        return (
          <motion.div
            key={colaborador.user_id}
            className="flex w-28 flex-col items-center sm:w-36"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: delay + 0.15, duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <div
              className={cn(
                'mb-3 flex h-14 w-14 items-center justify-center rounded-full border-2 bg-dg-card2',
                'font-display text-sm font-bold text-dg-text',
                anel,
              )}
            >
              {colaborador.foto_url ? (
                <img
                  src={colaborador.foto_url}
                  alt=""
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                iniciais(colaborador.nome)
              )}
            </div>

            <p className="text-center text-label font-semibold leading-tight text-dg-text">
              {colaborador.nome}
            </p>
            <p className="mb-2 text-center text-eyebrow leading-tight text-dg-muted">
              {colaborador.cargo}
            </p>

            <div className="flex items-center gap-1 font-mono text-label font-bold text-dg-text">
              <Zap className="h-3 w-3 fill-chart-mark text-chart-mark" />
              {colaborador.pontos}
            </div>
            <p className="mb-2 text-eyebrow text-dg-muted">
              {colaborador.modulos_concluidos}/{colaborador.modulos_totais} módulos ·{' '}
              {pct === null ? '—' : `${Math.round(pct * 100)}%`}
            </p>

            <motion.div
              className={cn('flex w-full origin-bottom items-start justify-center rounded-t pt-2.5', altura, cor)}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay, duration: 0.55, ease: [0.2, 0.7, 0.2, 1] }}
            >
              <span className="font-display text-lg font-bold text-dg-bg">{posicao + 1}º</span>
            </motion.div>
          </motion.div>
        )
      })}
    </div>
  )
}
