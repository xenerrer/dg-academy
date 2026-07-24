/**
 * Dados de exemplo do painel de gestão, no formato exato das views
 * vw_ranking_colaborador e vw_conclusoes_semana (0003_ranking.sql).
 *
 * Sai junto com src/mocks/dados.ts quando o Supabase entrar.
 */

import type { ConclusoesSemana, RankingColaborador } from '@/types/database'

const TENANT_ID = 'tenant-dgtech'

const base = { tenant_id: TENANT_ID, foto_url: null, modulos_totais: 6 }

export const RANKING: RankingColaborador[] = [
  {
    ...base,
    user_id: 'user-patricia',
    nome: 'Patrícia Lima',
    cargo: 'Orçamentista',
    setor_id: 'setor-orcamentos',
    modulos_concluidos: 6,
    pontos: 480,
    respostas_total: 18,
    acertos: 16,
    ultima_conclusao: '2026-07-19T15:20:00Z',
    dias_por_modulo: 2.0,
  },
  {
    ...base,
    user_id: 'user-juliana',
    nome: 'Juliana Prado',
    cargo: 'Téc. Segurança',
    setor_id: 'setor-campo',
    modulos_concluidos: 5,
    pontos: 420,
    respostas_total: 15,
    acertos: 14,
    ultima_conclusao: '2026-07-19T16:40:00Z',
    dias_por_modulo: 1.4,
  },
  {
    ...base,
    user_id: 'user-rafael',
    nome: 'Rafael Nunes',
    cargo: 'Eletricista Pleno',
    setor_id: 'setor-campo',
    modulos_concluidos: 5,
    pontos: 390,
    respostas_total: 15,
    acertos: 13,
    ultima_conclusao: '2026-07-20T09:12:00Z',
    dias_por_modulo: 1.2,
  },
  {
    ...base,
    user_id: 'user-bruno',
    nome: 'Bruno Tavares',
    cargo: 'Engenheiro de Campo',
    setor_id: 'setor-campo',
    modulos_concluidos: 4,
    pontos: 330,
    respostas_total: 12,
    acertos: 11,
    ultima_conclusao: '2026-07-18T11:05:00Z',
    dias_por_modulo: 1.25,
  },
  {
    ...base,
    user_id: 'user-diego',
    nome: 'Diego Ramos',
    cargo: 'Eletricista Jr.',
    setor_id: 'setor-campo',
    modulos_concluidos: 3,
    pontos: 180,
    respostas_total: 9,
    acertos: 6,
    ultima_conclusao: '2026-07-17T14:30:00Z',
    dias_por_modulo: 2.67,
  },
  {
    ...base,
    user_id: 'user-marcos',
    nome: 'Marcos Oliveira',
    cargo: 'Eletricista Jr.',
    setor_id: 'setor-campo',
    modulos_concluidos: 2,
    pontos: 150,
    respostas_total: 6,
    acertos: 5,
    ultima_conclusao: '2026-07-19T10:30:00Z',
    dias_por_modulo: 1.5,
  },
  {
    ...base,
    user_id: 'user-camila',
    nome: 'Camila Souza',
    cargo: 'Aux. Administrativo',
    setor_id: 'setor-adm',
    modulos_concluidos: 1,
    pontos: 60,
    respostas_total: 3,
    acertos: 2,
    ultima_conclusao: '2026-07-16T09:45:00Z',
    dias_por_modulo: 9.0,
  },
  {
    ...base,
    user_id: 'user-fernanda',
    nome: 'Fernanda Alves',
    cargo: 'Aux. Administrativo',
    setor_id: 'setor-adm',
    modulos_concluidos: 0,
    pontos: 0,
    respostas_total: 0,
    acertos: 0,
    ultima_conclusao: null,
    dias_por_modulo: null,
  },
]

export const CONCLUSOES_SEMANA: ConclusoesSemana[] = [
  { tenant_id: TENANT_ID, semana: '2026-05-25', conclusoes: 2 },
  { tenant_id: TENANT_ID, semana: '2026-06-01', conclusoes: 5 },
  { tenant_id: TENANT_ID, semana: '2026-06-08', conclusoes: 3 },
  { tenant_id: TENANT_ID, semana: '2026-06-15', conclusoes: 7 },
  { tenant_id: TENANT_ID, semana: '2026-06-22', conclusoes: 4 },
  { tenant_id: TENANT_ID, semana: '2026-06-29', conclusoes: 8 },
  { tenant_id: TENANT_ID, semana: '2026-07-06', conclusoes: 6 },
  { tenant_id: TENANT_ID, semana: '2026-07-13', conclusoes: 9 },
]
