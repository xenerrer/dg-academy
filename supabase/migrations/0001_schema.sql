-- DG Academy — schema inicial
-- Multi-tenant desde o começo: tenant_id em toda tabela de domínio.
-- Fazer isso agora custa quase nada; fazer depois é migração completa.

create extension if not exists "uuid-ossp";

-- ============================================================
-- TENANTS
-- ============================================================
create table tenants (
  id            uuid primary key default uuid_generate_v4(),
  nome          text not null,
  slug          text not null unique,
  logo_url      text,
  cor_primaria  text not null default '#FFDA00',
  criado_em     timestamptz not null default now()
);

-- ============================================================
-- SETORES  — "Engenharia de Campo", "Orçamentos", "Administrativo"
-- Pedido explícito do Danilo: cada cargo vê os treinamentos dele.
-- ============================================================
create table setores (
  id         uuid primary key default uuid_generate_v4(),
  tenant_id  uuid not null references tenants(id) on delete cascade,
  nome       text not null,
  unique (tenant_id, nome)
);

-- ============================================================
-- PROFILES — 1:1 com auth.users
-- ============================================================
create type papel_usuario as enum ('colaborador', 'gestor', 'admin');

create table profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  tenant_id     uuid not null references tenants(id) on delete cascade,
  nome          text not null,
  email         text not null,
  cargo         text,
  setor_id      uuid references setores(id) on delete set null,
  foto_url      text,
  papel         papel_usuario not null default 'colaborador',
  criado_em     timestamptz not null default now()
);

create index on profiles (tenant_id);
create index on profiles (setor_id);

-- ============================================================
-- CONTEÚDO
-- ============================================================
create table trilhas (
  id         uuid primary key default uuid_generate_v4(),
  tenant_id  uuid not null references tenants(id) on delete cascade,
  nome       text not null,
  descricao  text,
  ordem      int not null default 0,
  ativa      boolean not null default true
);

-- Liga trilha a setor. Trilha sem nenhuma linha aqui é visível a todos os setores.
create table trilha_setores (
  trilha_id uuid not null references trilhas(id) on delete cascade,
  setor_id  uuid not null references setores(id) on delete cascade,
  primary key (trilha_id, setor_id)
);

create table modulos (
  id         uuid primary key default uuid_generate_v4(),
  trilha_id  uuid not null references trilhas(id) on delete cascade,
  numero     int not null,
  titulo     text not null,
  descricao  text,
  capa_url   text,
  ordem      int not null default 0,
  unique (trilha_id, numero)
);

create table aulas (
  id              uuid primary key default uuid_generate_v4(),
  modulo_id       uuid not null references modulos(id) on delete cascade,
  titulo          text not null,
  descricao       text,
  panda_video_id  text,
  -- duração vem da API do Panda, nunca é digitada
  duracao_seg     int not null default 0,
  ordem           int not null default 0
);

create index on modulos (trilha_id);
create index on aulas (modulo_id);

-- ============================================================
-- PROGRESSO — a tabela que sustenta a trava de avanço
--
-- `segmentos` guarda os intervalos realmente assistidos, mesclados:
--   [[0,45],[60,180]]
-- Quem escreve aqui é a Edge Function, não o cliente. O front nunca
-- decide se uma aula foi concluída.
-- ============================================================
create table progresso_aula (
  id                 uuid primary key default uuid_generate_v4(),
  tenant_id          uuid not null references tenants(id) on delete cascade,
  user_id            uuid not null references profiles(id) on delete cascade,
  aula_id            uuid not null references aulas(id) on delete cascade,
  segmentos          jsonb not null default '[]'::jsonb,
  segundos_assistidos int not null default 0,
  seek_liberado      boolean not null default false,
  concluida_em       timestamptz,
  atualizado_em      timestamptz not null default now(),
  unique (user_id, aula_id)
);

create index on progresso_aula (tenant_id, user_id);
create index on progresso_aula (aula_id);

-- ============================================================
-- QUIZ
-- ============================================================
create table questoes (
  id              uuid primary key default uuid_generate_v4(),
  modulo_id       uuid not null references modulos(id) on delete cascade,
  enunciado       text not null,
  alternativas    jsonb not null,
  indice_correto  int not null,
  feedback        text,
  pontos          int not null default 30,
  ordem           int not null default 0
);

create table respostas (
  id              uuid primary key default uuid_generate_v4(),
  tenant_id       uuid not null references tenants(id) on delete cascade,
  user_id         uuid not null references profiles(id) on delete cascade,
  questao_id      uuid not null references questoes(id) on delete cascade,
  tentativa       int not null default 1,
  indice_escolhido int not null,
  correta         boolean not null,
  respondido_em   timestamptz not null default now()
);

create table conclusoes_modulo (
  id            uuid primary key default uuid_generate_v4(),
  tenant_id     uuid not null references tenants(id) on delete cascade,
  user_id       uuid not null references profiles(id) on delete cascade,
  modulo_id     uuid not null references modulos(id) on delete cascade,
  acertos       int not null,
  total         int not null,
  pontos_ganhos int not null,
  concluido_em  timestamptz not null default now(),
  unique (user_id, modulo_id)
);

create index on respostas (tenant_id, user_id);
create index on conclusoes_modulo (tenant_id, user_id);

-- ============================================================
-- COMENTÁRIOS  (V1.1, mas a tabela já nasce aqui)
-- ============================================================
create table comentarios (
  id         uuid primary key default uuid_generate_v4(),
  tenant_id  uuid not null references tenants(id) on delete cascade,
  aula_id    uuid not null references aulas(id) on delete cascade,
  user_id    uuid not null references profiles(id) on delete cascade,
  parent_id  uuid references comentarios(id) on delete cascade,
  texto      text not null,
  criado_em  timestamptz not null default now()
);

-- ============================================================
-- VIEWS — progresso é sempre derivado, nunca digitado.
-- É assim que dado de progresso deixa de apodrecer.
-- ============================================================
create view vw_progresso_colaborador as
select
  p.id                as user_id,
  p.tenant_id,
  p.nome,
  p.cargo,
  p.setor_id,
  p.foto_url,
  count(distinct pa.aula_id) filter (where pa.concluida_em is not null) as aulas_concluidas,
  (select count(*) from aulas a
     join modulos m on m.id = a.modulo_id
     join trilhas t on t.id = m.trilha_id
    where t.tenant_id = p.tenant_id)                                     as aulas_totais,
  coalesce(sum(cm.pontos_ganhos), 0)                                     as pontos_total,
  max(pa.atualizado_em)                                                  as ultima_atividade
from profiles p
left join progresso_aula pa    on pa.user_id = p.id
left join conclusoes_modulo cm on cm.user_id = p.id
group by p.id;

create view vw_desempenho_quiz as
select
  r.tenant_id,
  r.user_id,
  count(*)                                as respostas_total,
  count(*) filter (where r.correta)       as acertos
from respostas r
group by r.tenant_id, r.user_id;
