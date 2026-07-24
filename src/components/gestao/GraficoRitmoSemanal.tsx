import { useState } from 'react'
import { motion } from 'framer-motion'
import type { ConclusoesSemana } from '@/types/database'

// cores via token (CSS var) — nada de hex solto, nem em SVG
const COR_MARCA = 'rgb(var(--dg-yellow))'
const COR_SUP = 'rgb(var(--dg-bg))'
const COR_GRID = 'rgb(var(--chart-grid))'
const COR_CROSS = 'rgb(var(--chart-muted))'

interface GraficoRitmoSemanalProps {
  semanas: ConclusoesSemana[]
}

const L = 34 // margem esquerda para os ticks do eixo Y
const R = 8
const T = 12
const B = 24
const W = 560
const H = 180

/**
 * Conclusões de módulo por semana — linha, série única.
 *
 * Tendência ao longo do tempo com uma série só: linha de 2px, área em ~10% de
 * opacidade (lavagem, nunca bloco saturado), ponto final marcado e rotulado.
 * Sem legenda — uma série só, o título já diz o que é.
 *
 * Nenhum valor depende do tooltip: os ticks do eixo Y e o rótulo do ponto
 * final carregam a leitura, e a tabela abaixo tem tudo.
 */
export function GraficoRitmoSemanal({ semanas }: GraficoRitmoSemanalProps) {
  const [ativo, setAtivo] = useState<number | null>(null)

  if (semanas.length === 0) return null

  const maximo = Math.max(...semanas.map((s) => s.conclusoes))
  const teto = Math.ceil(maximo / 2) * 2 || 2

  const x = (i: number) => L + (i / (semanas.length - 1)) * (W - L - R)
  const y = (valor: number) => T + (1 - valor / teto) * (H - T - B)

  const pontos = semanas.map((s, i) => [x(i), y(s.conclusoes)] as const)
  const linha = pontos.map(([px, py]) => `${px},${py}`).join(' ')
  const area = `${L},${y(0)} ${linha} ${x(semanas.length - 1)},${y(0)}`

  const ultimo = semanas[semanas.length - 1]

  /**
   * A view devolve `semana` como date (YYYY-MM-DD). `new Date('2026-06-15')`
   * seria lido como meia-noite UTC e, no fuso de Brasília, exibido como 14/06.
   * Montamos a data em horário local para o rótulo bater com o dado.
   */
  const rotuloSemana = (iso: string) => {
    const [ano, mes, dia] = iso.split('-').map(Number)
    return new Date(ano, mes - 1, dia).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    })
  }

  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label={`Conclusões de módulo por semana. Última semana: ${ultimo.conclusoes}.`}
      >
        {/* gridlines horizontais — hairline sólida, recessiva */}
        {[0, teto / 2, teto].map((valor) => (
          <g key={valor}>
            <line x1={L} x2={W - R} y1={y(valor)} y2={y(valor)} stroke={COR_GRID} strokeWidth={1} />
            <text
              x={L - 8}
              y={y(valor) + 3.5}
              textAnchor="end"
              className="fill-dg-muted font-mono text-[9px] tabular-nums"
            >
              {valor}
            </text>
          </g>
        ))}

        <motion.polygon
          points={area}
          fill={COR_MARCA}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, delay: 0.5 }}
        />
        {/* a linha DESENHA ao entrar na viewport (pathLength 0 → 1) */}
        <motion.polyline
          points={linha}
          fill="none"
          stroke={COR_MARCA}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
        />

        {/* ponto final com anel na cor da superfície — surge quando a linha chega */}
        <motion.circle
          cx={pontos[pontos.length - 1][0]}
          cy={pontos[pontos.length - 1][1]}
          r={4}
          fill={COR_MARCA}
          stroke={COR_SUP}
          strokeWidth={2}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.3, delay: 0.9 }}
        />

        {/* alvos de hover generosos — a marca é pequena, o alvo não */}
        {semanas.map((semana, i) => (
          <rect
            key={semana.semana}
            x={x(i) - (W - L - R) / (semanas.length - 1) / 2}
            y={0}
            width={(W - L - R) / (semanas.length - 1)}
            height={H}
            fill="transparent"
            onMouseEnter={() => setAtivo(i)}
            onMouseLeave={() => setAtivo(null)}
          />
        ))}

        {ativo !== null && (
          <g pointerEvents="none">
            <line x1={x(ativo)} x2={x(ativo)} y1={T} y2={H - B} stroke={COR_CROSS} strokeWidth={1} />
            <circle
              cx={x(ativo)}
              cy={y(semanas[ativo].conclusoes)}
              r={4}
              fill={COR_MARCA}
              stroke={COR_SUP}
              strokeWidth={2}
            />
          </g>
        )}

        {semanas.map((semana, i) => (
          <text
            key={semana.semana}
            x={x(i)}
            y={H - 6}
            textAnchor="middle"
            className="fill-dg-muted font-mono text-[9px] tabular-nums"
          >
            {rotuloSemana(semana.semana)}
          </text>
        ))}
      </svg>

      <p className="mt-1 text-[11.5px] text-dg-muted">
        {ativo !== null ? (
          <>
            Semana de <b className="text-dg-text">{rotuloSemana(semanas[ativo].semana)}</b> ·{' '}
            <b className="text-dg-text">{semanas[ativo].conclusoes}</b> conclusões
          </>
        ) : (
          <>
            Última semana: <b className="text-dg-text">{ultimo.conclusoes}</b> módulos concluídos
            pela equipe
          </>
        )}
      </p>
    </div>
  )
}
