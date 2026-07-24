/**
 * Geometria e memória do Mapa da Jornada.
 *
 * A trilha é PROCEDURAL: desenhada em código, genérica para todos os
 * colaboradores. Quando a arte final do Carlos chegar, ela entra como camada
 * de fundo — a geometria das casas e o movimento do avatar não mudam.
 *
 * Direção de composição (docs/09-ONBOARDING-E-UX.md §3.2 ①): a jornada SOBE.
 * Casa 1 fica embaixo e a certificação no topo, como um prédio sendo
 * energizado andar por andar. O scroll vertical estilo Duolingo se mantém —
 * só a direção do progresso é para cima.
 */

export interface PontoCasa {
  x: number
  y: number
}

export interface TrilhaGeometria {
  casas: PontoCasa[]
  /** Um path SVG por trecho entre casas — pintável e amostrável um a um. */
  segmentos: string[]
  altura: number
  largura: number
}

/** Mesma largura da coluna 9:16 do onboarding. */
const LARGURA = 430
const CENTRO = LARGURA / 2
/** Serpente: centro → esquerda → centro → direita → repete. */
const DESVIOS = [0, -84, 0, 84]
const ESPACO_Y = 150
const MARGEM_TOPO = 130
const MARGEM_BASE = 150

export function gerarTrilha(totalCasas: number): TrilhaGeometria {
  const altura = MARGEM_TOPO + Math.max(0, totalCasas - 1) * ESPACO_Y + MARGEM_BASE

  const casas: PontoCasa[] = Array.from({ length: totalCasas }, (_, i) => ({
    x: CENTRO + DESVIOS[i % DESVIOS.length],
    // casa 1 embaixo: a jornada sobe
    y: altura - MARGEM_BASE - i * ESPACO_Y,
  }))

  const segmentos = casas.slice(0, -1).map((a, i) => {
    const b = casas[i + 1]
    const curva = ESPACO_Y * 0.55
    return `M ${a.x} ${a.y} C ${a.x} ${a.y - curva}, ${b.x} ${b.y + curva}, ${b.x} ${b.y}`
  })

  return { casas, segmentos, altura, largura: LARGURA }
}

/**
 * Amostra um trecho de path em pontos uniformes por comprimento de arco —
 * velocidade constante quando os pontos viram keyframes do avatar.
 */
export function amostrarSegmento(path: SVGPathElement, pontos = 22): PontoCasa[] {
  const comprimento = path.getTotalLength()
  return Array.from({ length: pontos }, (_, i) => {
    const p = path.getPointAtLength((comprimento * i) / (pontos - 1))
    return { x: p.x, y: p.y }
  })
}

// ── Memória da última visita ────────────────────────────────────────────────
// É a comparação "o que eu vi da última vez" × "o que o dado diz agora" que
// dispara a animação de avanço quando o colaborador volta da aula.
//
// sessionStorage de propósito: as conclusões da casca também são de sessão
// (ver api.ts). Quando o Supabase entrar, isto pode virar localStorage keyed
// por user_id — a lógica de comparação não muda.

const CHAVE_VISTO = 'dg-mapa-visto'

export interface EstadoVisto {
  /** Índice da casa em que o avatar estava na última visita. */
  casa: number
  /** Pontos exibidos na última visita — o contador anima a partir daqui. */
  pontos: number
}

export function lerVisto(): EstadoVisto | null {
  try {
    const bruto = sessionStorage.getItem(CHAVE_VISTO)
    if (!bruto) return null
    const dado = JSON.parse(bruto)
    if (typeof dado?.casa !== 'number' || typeof dado?.pontos !== 'number') return null
    return dado
  } catch {
    return null
  }
}

export function gravarVisto(estado: EstadoVisto) {
  try {
    sessionStorage.setItem(CHAVE_VISTO, JSON.stringify(estado))
  } catch {
    // storage indisponível (modo privado etc.) — o mapa só perde a animação
  }
}
