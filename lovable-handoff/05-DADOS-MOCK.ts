/**
 * DADOS DE TESTE — exemplo completo de cada tabela
 * Tipados no formato exato do schema. Copiar pro Supabase quando pronto.
 */

import type {
  Aula,
  ConclusaoModulo,
  Modulo,
  Profile,
  ProgressoAula,
  Questao,
  Setor,
  Tenant,
  Trilha,
} from './04-TYPES'

const TENANT_ID = 'tenant-dgtech'

// ============================================================
// TENANT
// ============================================================
export const TENANT: Tenant = {
  id: TENANT_ID,
  nome: 'DG Tech Soluções Corporativas',
  slug: 'dgtech',
  logo_url: '/logo-dgtech.png',
  cor_primaria: '#FFDA00',
  criado_em: '2026-07-01T00:00:00Z',
}

// ============================================================
// SETORES
// ============================================================
export const SETORES: Setor[] = [
  { id: 'setor-campo', tenant_id: TENANT_ID, nome: 'Engenharia de Campo' },
  { id: 'setor-orcamentos', tenant_id: TENANT_ID, nome: 'Orçamentos' },
  { id: 'setor-adm', tenant_id: TENANT_ID, nome: 'Administrativo' },
]

// ============================================================
// PROFILES
// ============================================================
export const USUARIO_ATUAL: Profile = {
  id: 'user-marcos',
  tenant_id: TENANT_ID,
  nome: 'Marcos Oliveira',
  email: 'marcos@dgtech.com.br',
  cargo: 'Eletricista Jr.',
  setor_id: 'setor-campo',
  foto_url: null,
  papel: 'colaborador',
  nivel_experiencia: null,
  onboarding_concluido_em: null,
  criado_em: '2026-07-10T00:00:00Z',
}

export const GESTOR: Profile = {
  id: 'user-danilo',
  tenant_id: TENANT_ID,
  nome: 'Danilo da Silva',
  email: 'danilo@dgtech.com.br',
  cargo: 'Fundador',
  setor_id: null,
  foto_url: null,
  papel: 'gestor',
  nivel_experiencia: null,
  onboarding_concluido_em: '2026-07-01T00:00:00Z',
  criado_em: '2026-07-01T00:00:00Z',
}

// ============================================================
// TRILHA
// ============================================================
export const TRILHA: Trilha = {
  id: 'trilha-integracao',
  tenant_id: TENANT_ID,
  nome: 'Integração DG Tech',
  descricao: 'A jornada de entrada de todo colaborador da DG.',
  ordem: 0,
  ativa: true,
}

// ============================================================
// MÓDULOS
// ============================================================
export const MODULOS: Modulo[] = [
  {
    id: 'mod-1',
    trilha_id: TRILHA.id,
    numero: 1,
    titulo: 'Boas-vindas à DG',
    descricao: null,
    capa_url: null,
    ordem: 0,
  },
  {
    id: 'mod-2',
    trilha_id: TRILHA.id,
    numero: 2,
    titulo: 'Cultura, Missão & Valores',
    descricao: null,
    capa_url: null,
    ordem: 1,
  },
  {
    id: 'mod-3',
    trilha_id: TRILHA.id,
    numero: 3,
    titulo: 'Código de Conduta',
    descricao: 'As regras da casa — do jeito DG de ser.',
    capa_url: null,
    ordem: 2,
  },
  {
    id: 'mod-4',
    trilha_id: TRILHA.id,
    numero: 4,
    titulo: 'Segurança & EPIs',
    descricao: null,
    capa_url: null,
    ordem: 3,
  },
  {
    id: 'mod-5',
    trilha_id: TRILHA.id,
    numero: 5,
    titulo: 'Materiais & Ferramentas',
    descricao: null,
    capa_url: null,
    ordem: 4,
  },
  {
    id: 'mod-6',
    trilha_id: TRILHA.id,
    numero: 6,
    titulo: 'Certificação DG Tech',
    descricao: null,
    capa_url: null,
    ordem: 5,
  },
]

// ============================================================
// AULAS
// ============================================================
export const AULAS: Aula[] = [
  {
    id: 'aula-1',
    modulo_id: 'mod-1',
    titulo: 'Boas-vindas à DG',
    descricao: null,
    panda_video_id: null,
    duracao_seg: 180,
    ordem: 0,
  },
  {
    id: 'aula-2',
    modulo_id: 'mod-2',
    titulo: 'Cultura, Missão & Valores',
    descricao: null,
    panda_video_id: null,
    duracao_seg: 240,
    ordem: 0,
  },
  {
    id: 'aula-3',
    modulo_id: 'mod-3',
    titulo: 'Código de Conduta',
    descricao:
      'O que é conduta? Conduta não é um manual na gaveta. Não é uma lista de proibições. Conduta é a soma de todas as escolhas que fazemos quando ninguém está olhando.',
    panda_video_id: null,
    duracao_seg: 204,
    ordem: 0,
  },
  {
    id: 'aula-4',
    modulo_id: 'mod-4',
    titulo: 'Segurança & EPIs',
    descricao: null,
    panda_video_id: null,
    duracao_seg: 300,
    ordem: 0,
  },
  {
    id: 'aula-5',
    modulo_id: 'mod-5',
    titulo: 'Materiais & Ferramentas',
    descricao: null,
    panda_video_id: null,
    duracao_seg: 260,
    ordem: 0,
  },
  {
    id: 'aula-6',
    modulo_id: 'mod-6',
    titulo: 'Certificação DG Tech',
    descricao: null,
    panda_video_id: null,
    duracao_seg: 320,
    ordem: 0,
  },
]

// ============================================================
// QUESTÕES (protótipo — as definitivas vêm do Danilo)
// ============================================================
export const QUESTOES: Questao[] = [
  {
    id: 'q-1',
    modulo_id: 'mod-3',
    enunciado:
      'Um colega pede pra "agilizar" pulando o checklist de segurança em uma instalação simples. Qual é a conduta DG?',
    alternativas: [
      'Aceitar, já que a instalação é simples',
      'Seguir o checklist completo — segurança não se negocia',
      'Fazer só os itens principais',
      'Perguntar ao cliente se pode pular',
    ],
    indice_correto: 1,
    feedback: 'Na DG, procedimento de segurança é inegociável — não existe "só dessa vez".',
    pontos: 30,
    ordem: 0,
  },
  {
    id: 'q-2',
    modulo_id: 'mod-3',
    enunciado: 'Como a DG Tech define o tom do ambiente de trabalho?',
    alternativas: [
      'Formalidade total, sem descontração',
      'Cada um age como preferir',
      'Sério no compromisso, leve no convívio',
      'Descontração acima da entrega',
    ],
    indice_correto: 2,
    feedback: 'Somos extremamente sérios na entrega — e mantemos um ambiente leve e humano.',
    pontos: 30,
    ordem: 1,
  },
  {
    id: 'q-3',
    modulo_id: 'mod-3',
    enunciado: 'Você percebe um desvio de conduta de um colega com um cliente. O que fazer?',
    alternativas: [
      'Comentar com outros colegas',
      'Ignorar, não é problema seu',
      'Expor nas redes internas',
      'Reportar ao gestor ou canal de conduta, com discrição',
    ],
    indice_correto: 3,
    feedback: 'Conduta se corrige pelos canais certos, com respeito e discrição.',
    pontos: 30,
    ordem: 2,
  },
]

// ============================================================
// CONCLUSÕES
// ============================================================
export const CONCLUSOES: ConclusaoModulo[] = [
  {
    id: 'c-1',
    tenant_id: TENANT_ID,
    user_id: USUARIO_ATUAL.id,
    modulo_id: 'mod-1',
    acertos: 3,
    total: 3,
    pontos_ganhos: 90,
    concluido_em: '2026-07-18T14:00:00Z',
  },
  {
    id: 'c-2',
    tenant_id: TENANT_ID,
    user_id: USUARIO_ATUAL.id,
    modulo_id: 'mod-2',
    acertos: 2,
    total: 3,
    pontos_ganhos: 60,
    concluido_em: '2026-07-19T10:30:00Z',
  },
]

// ============================================================
// PROGRESSO
// ============================================================
export const PROGRESSO: ProgressoAula[] = [
  {
    id: 'p-1',
    tenant_id: TENANT_ID,
    user_id: USUARIO_ATUAL.id,
    aula_id: 'aula-1',
    segmentos: [[0, 180]],
    segundos_assistidos: 180,
    seek_liberado: true,
    concluida_em: '2026-07-18T14:00:00Z',
    atualizado_em: '2026-07-18T14:00:00Z',
  },
  {
    id: 'p-2',
    tenant_id: TENANT_ID,
    user_id: USUARIO_ATUAL.id,
    aula_id: 'aula-2',
    segmentos: [[0, 240]],
    segundos_assistidos: 240,
    seek_liberado: true,
    concluida_em: '2026-07-19T10:30:00Z',
    atualizado_em: '2026-07-19T10:30:00Z',
  },
  {
    id: 'p-3',
    tenant_id: TENANT_ID,
    user_id: USUARIO_ATUAL.id,
    aula_id: 'aula-3',
    segmentos: [[0, 120], [150, 204]],
    segundos_assistidos: 174,
    seek_liberado: false,
    concluida_em: null,
    atualizado_em: '2026-07-24T09:15:00Z',
  },
]
