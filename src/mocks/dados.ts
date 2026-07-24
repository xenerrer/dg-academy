/**
 * Dados de exemplo, tipados no formato exato do schema.
 *
 * Este arquivo é o ÚNICO ponto que precisa sair quando o Supabase entrar.
 * Cada função aqui vira uma query — a assinatura já é a mesma. É por isso
 * que os mocks usam nomes de coluna do banco e não um formato próprio: se
 * divergissem, todo componente teria que ser reescrito depois.
 *
 * Conteúdo herdado do protótipo aprovado pelo cliente. As questões
 * definitivas vêm do Danilo.
 */

import type {
  Aula,
  ConclusaoModulo,
  Modulo,
  Profile,
  ProgressoAula,
  ProgressoColaborador,
  Questao,
  Setor,
  Tenant,
  Trilha,
} from '@/types/database'

const TENANT_ID = 'tenant-dgtech'

export const TENANT: Tenant = {
  id: TENANT_ID,
  nome: 'DG Tech Soluções Corporativas',
  slug: 'dgtech',
  logo_url: '/logo-dgtech.png',
  cor_primaria: '#FFDA00',
  criado_em: '2026-07-01T00:00:00Z',
}

export const SETORES: Setor[] = [
  { id: 'setor-campo', tenant_id: TENANT_ID, nome: 'Engenharia de Campo' },
  { id: 'setor-orcamentos', tenant_id: TENANT_ID, nome: 'Orçamentos' },
  { id: 'setor-adm', tenant_id: TENANT_ID, nome: 'Administrativo' },
  { id: 'setor-fornecedores', tenant_id: TENANT_ID, nome: 'Fornecedores' },
]

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

export const TRILHA: Trilha = {
  id: 'trilha-integracao',
  tenant_id: TENANT_ID,
  nome: 'Integração DG Tech',
  descricao: 'A jornada de entrada de todo colaborador da DG.',
  ordem: 0,
  ativa: true,
  capa_url: '/capas/trilha-integracao.jpg',
}

// Trilhas obrigatórias para TODOS (independente do setor)
export const TRILHA_MISSAO_VISAO_VALORES: Trilha = {
  id: 'trilha-missao-visao-valores',
  tenant_id: TENANT_ID,
  nome: 'Missão, Visão e Valores',
  descricao: 'Entenda o propósito e os valores que guiam a DG Tech.',
  ordem: 10,
  ativa: true,
  capa_url: '/capas/trilha-mvv.jpg',
}

export const TRILHA_CODIGOS_CONDUTA: Trilha = {
  id: 'trilha-codigos-conduta',
  tenant_id: TENANT_ID,
  nome: 'Códigos de Conduta',
  descricao: 'Normas e princípios éticos que orientam o comportamento na DG Tech.',
  ordem: 11,
  ativa: true,
  capa_url: '/capas/trilha-conduta.jpg',
}

export const TRILHA_REGRAS_DG: Trilha = {
  id: 'trilha-regras-dg',
  tenant_id: TENANT_ID,
  nome: 'Regras da DG',
  descricao: 'Políticas e procedimentos operacionais da empresa.',
  ordem: 12,
  ativa: true,
  capa_url: '/capas/trilha-regras.jpg',
}

export const MODULOS: Modulo[] = [
  // Trilha: Integração DG Tech
  { id: 'mod-1', trilha_id: TRILHA.id, numero: 1, titulo: 'Boas-vindas à DG', descricao: null, capa_url: null, ordem: 0 },
  { id: 'mod-2', trilha_id: TRILHA.id, numero: 2, titulo: 'Cultura, Missão & Valores', descricao: null, capa_url: null, ordem: 1 },
  { id: 'mod-3', trilha_id: TRILHA.id, numero: 3, titulo: 'Código de Conduta', descricao: 'As regras da casa — do jeito DG de ser.', capa_url: null, ordem: 2 },
  { id: 'mod-4', trilha_id: TRILHA.id, numero: 4, titulo: 'Segurança & EPIs', descricao: null, capa_url: null, ordem: 3 },
  { id: 'mod-5', trilha_id: TRILHA.id, numero: 5, titulo: 'Materiais & Ferramentas', descricao: null, capa_url: null, ordem: 4 },
  { id: 'mod-6', trilha_id: TRILHA.id, numero: 6, titulo: 'Certificação DG Tech', descricao: null, capa_url: null, ordem: 5 },

  // Trilha: Missão, Visão e Valores (obrigatória)
  { id: 'mod-mvv-1', trilha_id: TRILHA_MISSAO_VISAO_VALORES.id, numero: 1, titulo: 'Nossa Missão', descricao: 'O propósito que nos move.', capa_url: null, ordem: 0 },
  { id: 'mod-mvv-2', trilha_id: TRILHA_MISSAO_VISAO_VALORES.id, numero: 2, titulo: 'Nossa Visão', descricao: 'Onde queremos chegar.', capa_url: null, ordem: 1 },
  { id: 'mod-mvv-3', trilha_id: TRILHA_MISSAO_VISAO_VALORES.id, numero: 3, titulo: 'Nossos Valores', descricao: 'Os princípios que nos guiam.', capa_url: null, ordem: 2 },

  // Trilha: Códigos de Conduta (obrigatória)
  { id: 'mod-cond-1', trilha_id: TRILHA_CODIGOS_CONDUTA.id, numero: 1, titulo: 'Ética e Integridade', descricao: 'Princípios éticos na DG Tech.', capa_url: null, ordem: 0 },
  { id: 'mod-cond-2', trilha_id: TRILHA_CODIGOS_CONDUTA.id, numero: 2, titulo: 'Respeito e Diversidade', descricao: 'Um ambiente inclusivo para todos.', capa_url: null, ordem: 1 },
  { id: 'mod-cond-3', trilha_id: TRILHA_CODIGOS_CONDUTA.id, numero: 3, titulo: 'Conflitos de Interesse', descricao: 'Como identificar e lidar.', capa_url: null, ordem: 2 },

  // Trilha: Regras da DG (obrigatória)
  { id: 'mod-regras-1', trilha_id: TRILHA_REGRAS_DG.id, numero: 1, titulo: 'Políticas Gerais', descricao: 'Regras operacionais básicas.', capa_url: null, ordem: 0 },
  { id: 'mod-regras-2', trilha_id: TRILHA_REGRAS_DG.id, numero: 2, titulo: 'Saúde e Segurança', descricao: 'Regras de proteção no trabalho.', capa_url: null, ordem: 1 },
  { id: 'mod-regras-3', trilha_id: TRILHA_REGRAS_DG.id, numero: 3, titulo: 'Confidencialidade', descricao: 'Proteção de informações.', capa_url: null, ordem: 2 },
]

export const AULAS: Aula[] = [
  // Trilha: Integração DG Tech
  { id: 'aula-1', modulo_id: 'mod-1', titulo: 'Boas-vindas à DG', descricao: null, panda_video_id: null, duracao_seg: 180, ordem: 0 },
  { id: 'aula-2', modulo_id: 'mod-2', titulo: 'Cultura, Missão & Valores', descricao: null, panda_video_id: null, duracao_seg: 240, ordem: 0 },
  {
    id: 'aula-3',
    modulo_id: 'mod-3',
    titulo: 'Código de Conduta',
    descricao:
      'O que é conduta? Conduta não é um manual na gaveta. Não é uma lista de proibições. Conduta é a soma de todas as escolhas que fazemos quando ninguém está olhando — e é exatamente isso que constrói a reputação da DG Tech em cada obra, em cada cliente, em cada aperto de mão.',
    panda_video_id: null,
    duracao_seg: 204,
    ordem: 0,
  },
  { id: 'aula-4', modulo_id: 'mod-4', titulo: 'Segurança & EPIs', descricao: null, panda_video_id: null, duracao_seg: 300, ordem: 0 },
  { id: 'aula-5', modulo_id: 'mod-5', titulo: 'Materiais & Ferramentas', descricao: null, panda_video_id: null, duracao_seg: 260, ordem: 0 },
  { id: 'aula-6', modulo_id: 'mod-6', titulo: 'Certificação DG Tech', descricao: null, panda_video_id: null, duracao_seg: 320, ordem: 0 },

  // Trilha: Missão, Visão e Valores (obrigatória)
  { id: 'aula-mvv-1', modulo_id: 'mod-mvv-1', titulo: 'Nossa Missão', descricao: 'Conheça o propósito que move a DG Tech.', panda_video_id: null, duracao_seg: 240, ordem: 0 },
  { id: 'aula-mvv-2', modulo_id: 'mod-mvv-2', titulo: 'Nossa Visão', descricao: 'Veja onde queremos chegar como empresa.', panda_video_id: null, duracao_seg: 220, ordem: 0 },
  { id: 'aula-mvv-3', modulo_id: 'mod-mvv-3', titulo: 'Nossos Valores', descricao: 'Os princípios que guiam todas as nossas decisões.', panda_video_id: null, duracao_seg: 260, ordem: 0 },

  // Trilha: Códigos de Conduta (obrigatória)
  { id: 'aula-cond-1', modulo_id: 'mod-cond-1', titulo: 'Ética e Integridade', descricao: 'Princípios éticos que devemos manter.', panda_video_id: null, duracao_seg: 280, ordem: 0 },
  { id: 'aula-cond-2', modulo_id: 'mod-cond-2', titulo: 'Respeito e Diversidade', descricao: 'Construindo um ambiente inclusivo.', panda_video_id: null, duracao_seg: 250, ordem: 0 },
  { id: 'aula-cond-3', modulo_id: 'mod-cond-3', titulo: 'Conflitos de Interesse', descricao: 'Como identificar e reportar conflitos.', panda_video_id: null, duracao_seg: 200, ordem: 0 },

  // Trilha: Regras da DG (obrigatória)
  { id: 'aula-regras-1', modulo_id: 'mod-regras-1', titulo: 'Políticas Gerais', descricao: 'Regras operacionais e administrativas.', panda_video_id: null, duracao_seg: 300, ordem: 0 },
  { id: 'aula-regras-2', modulo_id: 'mod-regras-2', titulo: 'Saúde e Segurança', descricao: 'Protegendo nossos colaboradores.', panda_video_id: null, duracao_seg: 320, ordem: 0 },
  { id: 'aula-regras-3', modulo_id: 'mod-regras-3', titulo: 'Confidencialidade', descricao: 'Protegendo informações sensíveis.', panda_video_id: null, duracao_seg: 280, ordem: 0 },
]

/** Questões do protótipo. As definitivas vêm do Danilo (prometidas seg/ter). */
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

export const CONCLUSOES: ConclusaoModulo[] = [
  { id: 'c-1', tenant_id: TENANT_ID, user_id: USUARIO_ATUAL.id, modulo_id: 'mod-1', acertos: 3, total: 3, pontos_ganhos: 90, concluido_em: '2026-07-18T14:00:00Z' },
  { id: 'c-2', tenant_id: TENANT_ID, user_id: USUARIO_ATUAL.id, modulo_id: 'mod-2', acertos: 2, total: 3, pontos_ganhos: 60, concluido_em: '2026-07-19T10:30:00Z' },
]

export const PROGRESSO: ProgressoAula[] = [
  { id: 'p-1', tenant_id: TENANT_ID, user_id: USUARIO_ATUAL.id, aula_id: 'aula-1', segmentos: [[0, 180]], segundos_assistidos: 180, seek_liberado: true, concluida_em: '2026-07-18T14:00:00Z', atualizado_em: '2026-07-18T14:00:00Z' },
  { id: 'p-2', tenant_id: TENANT_ID, user_id: USUARIO_ATUAL.id, aula_id: 'aula-2', segmentos: [[0, 240]], segundos_assistidos: 240, seek_liberado: true, concluida_em: '2026-07-19T10:30:00Z', atualizado_em: '2026-07-19T10:30:00Z' },
]

export const COLABORADORES: ProgressoColaborador[] = [
  { user_id: 'user-marcos', tenant_id: TENANT_ID, nome: 'Marcos Oliveira', cargo: 'Eletricista Jr.', setor_id: 'setor-campo', foto_url: null, aulas_concluidas: 2, aulas_totais: 6, pontos_total: 150, ultima_atividade: '2026-07-20T09:00:00Z' },
  { user_id: 'user-juliana', tenant_id: TENANT_ID, nome: 'Juliana Prado', cargo: 'Téc. Segurança', setor_id: 'setor-campo', foto_url: null, aulas_concluidas: 6, aulas_totais: 6, pontos_total: 420, ultima_atividade: '2026-07-19T16:40:00Z' },
  { user_id: 'user-rafael', tenant_id: TENANT_ID, nome: 'Rafael Nunes', cargo: 'Eletricista Pleno', setor_id: 'setor-campo', foto_url: null, aulas_concluidas: 4, aulas_totais: 6, pontos_total: 300, ultima_atividade: '2026-07-20T09:12:00Z' },
  { user_id: 'user-camila', tenant_id: TENANT_ID, nome: 'Camila Souza', cargo: 'Aux. Administrativo', setor_id: 'setor-adm', foto_url: null, aulas_concluidas: 1, aulas_totais: 6, pontos_total: 60, ultima_atividade: '2026-07-20T11:35:00Z' },
]
