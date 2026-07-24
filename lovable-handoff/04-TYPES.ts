/**
 * Tipos do domínio — formato exato do schema.
 * Quando o Supabase estiver pronto, substituir por `src/integrations/supabase/types.ts`
 */

export type PapelUsuario = 'colaborador' | 'gestor' | 'admin'
export type NivelExperiencia = 'iniciante' | 'intermediario' | 'veterano'
export type StatusModulo = 'concluido' | 'atual' | 'bloqueado'

export type Segmento = [number, number] // [inicio, fim] em segundos

// ============================================================
// Domínio
// ============================================================

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

// ============================================================
// Views
// ============================================================

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

export interface DesempenhoQuiz {
  tenant_id: string
  user_id: string
  respostas_total: number
  acertos: number
  taxa_acerto: number
}

export interface KPIsTenant {
  tenant_id: string
  colabs_totais: number
  colabs_em_trilha: number
  media_acertos: number
  tempo_medio_horas: number
}

// ============================================================
// Dados derivados para a interface
// ============================================================

export interface StatusModuloComAula extends Modulo {
  status: StatusModulo
  aula?: Aula
}
