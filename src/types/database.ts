/**
 * Tipos do domínio, no formato exato do schema em supabase/migrations/.
 *
 * Estes tipos são escritos à mão por enquanto. Quando o projeto Supabase
 * existir, rodar `supabase gen types typescript` e substituir este arquivo
 * por src/integrations/supabase/types.ts — os nomes já batem, então a troca
 * é mecânica.
 *
 * Nomes de tabela e coluna em snake_case e português, iguais ao SQL.
 */

export type PapelUsuario = 'colaborador' | 'gestor' | 'admin'

/**
 * Autodeclarado no primeiro acesso. Afeta tom das mensagens e ordem do
 * conteúdo opcional — nunca o conteúdo obrigatório.
 */
export type NivelExperiencia = 'iniciante' | 'intermediario' | 'veterano'

export interface Tenant {
  id: string
  nome: string
  slug: string
  logo_url: string | null
  cor_primaria: string
  criado_em: string
}

export interface Setor {
  id: string
  tenant_id: string
  nome: string
}

export interface Profile {
  id: string
  tenant_id: string
  nome: string
  email: string
  cargo: string | null
  setor_id: string | null
  foto_url: string | null
  papel: PapelUsuario
  nivel_experiencia: NivelExperiencia | null
  onboarding_concluido_em: string | null
  criado_em: string
}

export interface Trilha {
  id: string
  tenant_id: string
  nome: string
  descricao: string | null
  ordem: number
  ativa: boolean
}

export interface Modulo {
  id: string
  trilha_id: string
  numero: number
  titulo: string
  descricao: string | null
  capa_url: string | null
  ordem: number
  /** Ignora a trava sequencial: fica sempre acessível, independente do progresso. */
  sempre_disponivel?: boolean
  /** Selo "NOVO" + brilho no card — fixo por módulo, não é derivado do progresso. */
  destaque?: boolean
}

export interface Aula {
  id: string
  modulo_id: string
  titulo: string
  descricao: string | null
  panda_video_id: string | null
  duracao_seg: number
  ordem: number
}

/** Intervalo assistido, em segundos: [inicio, fim] */
export type Segmento = [number, number]

export interface ProgressoAula {
  id: string
  tenant_id: string
  user_id: string
  aula_id: string
  segmentos: Segmento[]
  segundos_assistidos: number
  seek_liberado: boolean
  concluida_em: string | null
  atualizado_em: string
}

export interface Questao {
  id: string
  modulo_id: string
  enunciado: string
  alternativas: string[]
  indice_correto: number
  feedback: string | null
  pontos: number
  ordem: number
}

export interface Resposta {
  id: string
  tenant_id: string
  user_id: string
  questao_id: string
  tentativa: number
  indice_escolhido: number
  correta: boolean
  respondido_em: string
}

export interface ConclusaoModulo {
  id: string
  tenant_id: string
  user_id: string
  modulo_id: string
  acertos: number
  total: number
  pontos_ganhos: number
  concluido_em: string
}

export interface Comentario {
  id: string
  tenant_id: string
  aula_id: string
  user_id: string
  parent_id: string | null
  texto: string
  criado_em: string
}

/** View vw_progresso_colaborador */
export interface ProgressoColaborador {
  user_id: string
  tenant_id: string
  nome: string
  cargo: string | null
  setor_id: string | null
  foto_url: string | null
  aulas_concluidas: number
  aulas_totais: number
  pontos_total: number
  ultima_atividade: string | null
}

/**
 * Estado derivado de um módulo para a interface.
 * Não existe no banco — é calculado a partir de conclusoes_modulo.
 * 'disponivel': módulo com sempre_disponivel=true, não concluído — acessível
 * mas não é "a etapa atual" da trilha sequencial.
 */
export type StatusModulo = 'concluido' | 'atual' | 'bloqueado' | 'disponivel'

/** View vw_ranking_colaborador */
export interface RankingColaborador {
  user_id: string
  tenant_id: string
  nome: string
  cargo: string | null
  setor_id: string | null
  foto_url: string | null
  modulos_totais: number
  modulos_concluidos: number
  pontos: number
  respostas_total: number
  acertos: number
  ultima_conclusao: string | null
  /** Dias por módulo concluído. Nulo para quem ainda não concluiu nada. */
  dias_por_modulo: number | null
}

/** View vw_conclusoes_semana */
export interface ConclusoesSemana {
  tenant_id: string
  semana: string
  conclusoes: number
}
