/**
 * Métricas derivadas do ranking.
 *
 * Nenhuma delas é gravada no banco — todas saem de vw_ranking_colaborador.
 * Mantidas aqui, longe dos componentes, para que a regra de negócio fique em
 * um lugar só quando o Danilo pedir para mudar o peso de alguma coisa.
 */

import type { RankingColaborador } from '@/types/database'

export interface Destaque {
  chave: 'aproveitamento' | 'entrega' | 'ritmo'
  rotulo: string
  explicacao: string
  colaborador: RankingColaborador | null
  valorFormatado: string
}

export function aproveitamento(c: RankingColaborador) {
  if (c.respostas_total === 0) return null
  return c.acertos / c.respostas_total
}

export function progresso(c: RankingColaborador) {
  if (c.modulos_totais === 0) return 0
  return c.modulos_concluidos / c.modulos_totais
}

/** Ordem do pódio: pontos, que já é a moeda do domínio (30 por acerto). */
export function ordenarPorPontos(lista: RankingColaborador[]) {
  return [...lista].sort((a, b) => b.pontos - a.pontos)
}

/**
 * Elegibilidade para destaque: pelo menos 3 respostas e 2 módulos concluídos.
 *
 * Sem isso, quem respondeu uma única questão e acertou aparece com 100% de
 * aproveitamento e ganha o destaque de quem concluiu a trilha inteira. Um
 * ranking que premia amostra pequena não é lido duas vezes.
 */
const MIN_RESPOSTAS = 3
const MIN_MODULOS = 2

function elegiveis(lista: RankingColaborador[]) {
  return lista.filter((c) => c.respostas_total >= MIN_RESPOSTAS && c.modulos_concluidos >= MIN_MODULOS)
}

export function calcularDestaques(lista: RankingColaborador[]): Destaque[] {
  const aptos = elegiveis(lista)

  const melhorAproveitamento = [...aptos].sort(
    (a, b) => (aproveitamento(b) ?? 0) - (aproveitamento(a) ?? 0),
  )[0]

  const maiorEntrega = [...aptos].sort((a, b) => b.modulos_concluidos - a.modulos_concluidos)[0]

  const melhorRitmo = [...aptos]
    .filter((c) => c.dias_por_modulo !== null)
    .sort((a, b) => (a.dias_por_modulo ?? 0) - (b.dias_por_modulo ?? 0))[0]

  return [
    {
      chave: 'aproveitamento',
      rotulo: 'Melhor aproveitamento',
      explicacao: 'Maior % de acerto nas questões',
      colaborador: melhorAproveitamento ?? null,
      valorFormatado: melhorAproveitamento
        ? `${Math.round((aproveitamento(melhorAproveitamento) ?? 0) * 100)}%`
        : '—',
    },
    {
      chave: 'entrega',
      rotulo: 'Mais entregou',
      explicacao: 'Maior número de módulos concluídos',
      colaborador: maiorEntrega ?? null,
      valorFormatado: maiorEntrega
        ? `${maiorEntrega.modulos_concluidos}/${maiorEntrega.modulos_totais}`
        : '—',
    },
    {
      chave: 'ritmo',
      rotulo: 'Ritmo mais constante',
      explicacao: 'Menos dias entre um módulo e o seguinte',
      colaborador: melhorRitmo ?? null,
      valorFormatado: melhorRitmo ? `${melhorRitmo.dias_por_modulo} d/módulo` : '—',
    },
  ]
}

export function iniciais(nome: string) {
  return nome
    .split(' ')
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
}
