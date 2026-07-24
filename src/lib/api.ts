/**
 * A costura entre a interface e os dados.
 *
 * Hoje cada função lê de src/mocks/dados.ts. Quando o Supabase entrar, o corpo
 * de cada função vira uma query — a assinatura não muda, então nenhum componente
 * precisa ser tocado.
 *
 * Exemplo do que cada uma vira:
 *
 *   export async function listarModulos(trilhaId: string) {
 *     const { data, error } = await supabase
 *       .from('modulos').select('*').eq('trilha_id', trilhaId).order('ordem')
 *     if (error) throw error
 *     return data
 *   }
 */

import {
  AULAS,
  COLABORADORES,
  CONCLUSOES,
  MODULOS,
  PROGRESSO,
  QUESTOES,
  SETORES,
  TRILHA,
  TRILHA_MISSAO_VISAO_VALORES,
  TRILHA_CODIGOS_CONDUTA,
  TRILHA_REGRAS_DG,
  USUARIO_ATUAL,
} from '@/mocks/dados'
import type { ConclusaoModulo, NivelExperiencia, StatusModulo, Trilha } from '@/types/database'

/** Simula latência de rede para a interface não parecer instantânea demais. */
const atraso = <T>(dado: T, ms = 220): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(dado), ms))

export async function obterUsuarioAtual() {
  return atraso(USUARIO_ATUAL)
}

export async function obterTrilha() {
  return atraso(TRILHA)
}

/**
 * Lista todas as trilhas que um usuário deve ver:
 * - 3 trilhas obrigatórias (Missão/Visão/Valores, Códigos, Regras)
 * - A trilha de integração (por setor do usuário, ou geral)
 */
export async function listarTrilhasDoUsuario(usuario = USUARIO_ATUAL): Promise<Trilha[]> {
  const trilhas: Trilha[] = [
    TRILHA_MISSAO_VISAO_VALORES,
    TRILHA_CODIGOS_CONDUTA,
    TRILHA_REGRAS_DG,
    TRILHA,
  ]
  // Ordenar por ordem (as obrigatórias vêm primeiro)
  return atraso(trilhas.sort((a, b) => a.ordem - b.ordem))
}

export async function listarSetores() {
  return atraso(SETORES)
}

export async function listarModulos() {
  return atraso([...MODULOS].sort((a, b) => a.ordem - b.ordem))
}

export async function obterModulo(moduloId: string) {
  return atraso(MODULOS.find((m) => m.id === moduloId) ?? null)
}

export async function obterAulaDoModulo(moduloId: string) {
  return atraso(AULAS.find((a) => a.modulo_id === moduloId) ?? null)
}

export async function listarQuestoes(moduloId: string) {
  return atraso(QUESTOES.filter((q) => q.modulo_id === moduloId).sort((a, b) => a.ordem - b.ordem))
}

export async function listarConclusoes(userId: string) {
  const daSessao = lerConclusoesDaSessao().filter((c) => c.user_id === userId)
  const doMock = CONCLUSOES.filter(
    (c) => c.user_id === userId && !daSessao.some((s) => s.modulo_id === c.modulo_id),
  )
  return atraso([...doMock, ...daSessao])
}

export async function obterProgressoAula(userId: string, aulaId: string) {
  return atraso(PROGRESSO.find((p) => p.user_id === userId && p.aula_id === aulaId) ?? null)
}

export async function listarColaboradores() {
  return atraso(COLABORADORES)
}

/**
 * Status de cada módulo para a trilha.
 *
 * Derivado das conclusões, nunca guardado. O primeiro módulo não concluído é o
 * atual; os seguintes ficam bloqueados. É a mesma regra que o banco vai aplicar.
 */
export function calcularStatusModulos(
  modulos: { id: string }[],
  conclusoes: { modulo_id: string }[],
): Record<string, StatusModulo> {
  const concluidos = new Set(conclusoes.map((c) => c.modulo_id))
  let achouAtual = false

  return modulos.reduce<Record<string, StatusModulo>>((acc, modulo) => {
    if (concluidos.has(modulo.id)) {
      acc[modulo.id] = 'concluido'
    } else if (!achouAtual) {
      acc[modulo.id] = 'atual'
      achouAtual = true
    } else {
      acc[modulo.id] = 'bloqueado'
    }
    return acc
  }, {})
}

// ── Painel de gestão ────────────────────────────────────────────────────────
// Viram: supabase.from('vw_ranking_colaborador').select('*').order('pontos', ...)

export async function listarRanking() {
  const { RANKING } = await import('@/mocks/ranking')
  return atraso(RANKING)
}

export async function listarConclusoesSemana() {
  const { CONCLUSOES_SEMANA } = await import('@/mocks/ranking')
  return atraso(CONCLUSOES_SEMANA)
}

// ── Onboarding ──────────────────────────────────────────────────────────────
// Vira: supabase.from('profiles').update({ ...dados, onboarding_concluido_em: now })
//         .eq('id', user.id)
// A foto sobe antes para o Storage; foto_url guarda o caminho, não o base64.

export async function salvarOnboarding(dados: {
  foto_url: string | null
  nivel_experiencia: NivelExperiencia | null
}) {
  return atraso(dados, 400)
}

// ── Conclusão de módulo (overlay de sessão) ─────────────────────────────────
// A casca não tem banco, mas o fluxo aula → quiz → mapa precisa funcionar de
// ponta a ponta para ser testável. Conclusões feitas nesta sessão ficam em
// sessionStorage e são mescladas às do mock em listarConclusoes.
//
// Quando o Supabase entrar: concluirModulo vira um INSERT em conclusoes_modulo
// e este overlay inteiro é apagado. Nenhum componente muda.

const CHAVE_CONCLUSOES_SESSAO = 'dg-conclusoes-sessao'

function lerConclusoesDaSessao(): ConclusaoModulo[] {
  try {
    const dado = JSON.parse(sessionStorage.getItem(CHAVE_CONCLUSOES_SESSAO) ?? '[]')
    // valida a FORMA, não só o JSON: um '{}' guardado por engano é JSON válido
    // e quebraria o .filter/.some de quem consome com TypeError.
    return Array.isArray(dado) ? dado : []
  } catch {
    return []
  }
}

export async function concluirModulo(dados: {
  modulo_id: string
  acertos: number
  total: number
  pontos_ganhos: number
}) {
  const existentes = lerConclusoesDaSessao()
  if (existentes.some((c) => c.modulo_id === dados.modulo_id)) return

  existentes.push({
    id: `sessao-${dados.modulo_id}`,
    tenant_id: USUARIO_ATUAL.tenant_id,
    user_id: USUARIO_ATUAL.id,
    modulo_id: dados.modulo_id,
    acertos: dados.acertos,
    total: dados.total,
    pontos_ganhos: dados.pontos_ganhos,
    concluido_em: new Date().toISOString(),
  })
  try {
    sessionStorage.setItem(CHAVE_CONCLUSOES_SESSAO, JSON.stringify(existentes))
  } catch {
    // storage indisponível — a conclusão só não sobrevive ao reload
  }
}
