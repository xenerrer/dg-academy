-- DG Academy — Schema SQL Completo
-- Multi-tenant desde o começo. Rodar estas migrations no Supabase.

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
-- SETORES
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
create type nivel_experiencia as enum ('iniciante', 'intermediario', 'veterano');

create table profiles (
  id                      uuid primary key references auth.users(id) on delete cascade,
  tenant_id               uuid not null references tenants(id) on delete cascade,
  nome                    text not null,
  email                   text not null,
  cargo                   text,
  setor_id                uuid references setores(id) on delete set null,
  foto_url                text,
  papel                   papel_usuario not null default 'colaborador',
  nivel_experiencia       nivel_experiencia,
  onboarding_concluido_em timestamptz,
  criado_em               timestamptz not null default now()
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
  duracao_seg     int not null default 0,
  ordem           int not null default 0
);

create index on modulos (trilha_id);
create index on aulas (modulo_id);

-- ============================================================
-- PROGRESSO — A TRAVA DE AVANÇO
-- ============================================================
create table progresso_aula (
  id                  uuid primary key default uuid_generate_v4(),
  tenant_id           uuid not null references tenants(id) on delete cascade,
  user_id             uuid not null references profiles(id) on delete cascade,
  aula_id             uuid not null references aulas(id) on delete cascade,
  segmentos           jsonb not null default '[]'::jsonb,
  segundos_assistidos int not null default 0,
  seek_liberado       boolean not null default false,
  concluida_em        timestamptz,
  atualizado_em       timestamptz not null default now(),
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
  id               uuid primary key default uuid_generate_v4(),
  tenant_id        uuid not null references tenants(id) on delete cascade,
  user_id          uuid not null references profiles(id) on delete cascade,
  questao_id       uuid not null references questoes(id) on delete cascade,
  tentativa        int not null default 1,
  indice_escolhido int not null,
  correta          boolean not null,
  respondido_em    timestamptz not null default now()
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
-- COMENTÁRIOS (V1.1)
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
-- VIEWS
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
  count(*) filter (where r.correta)       as acertos,
  round(100.0 * count(*) filter (where r.correta) / count(*), 1) as taxa_acerto
from respostas r
group by r.tenant_id, r.user_id;

create view vw_kpis_tenant as
select
  p.tenant_id,
  count(distinct p.id)                                         as colabs_totais,
  count(distinct p.id) filter (where max(pa.atualizado_em) is not null) as colabs_em_trilha,
  round(avg(d.taxa_acerto)::numeric, 1)                        as media_acertos,
  round(avg(
    extract(epoch from (max(cm.concluido_em) - min(p.criado_em))) / 3600
  )::numeric, 1)                                               as tempo_medio_horas
from profiles p
left join progresso_aula pa         on pa.user_id = p.id
left join conclusoes_modulo cm      on cm.user_id = p.id
left join vw_desempenho_quiz d      on d.user_id = p.id
group by p.tenant_id;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

create or replace function auth_tenant_id()
returns uuid language sql stable security definer set search_path = public as $$
  select tenant_id from profiles where id = auth.uid()
$$;

create or replace function auth_papel()
returns papel_usuario language sql stable security definer set search_path = public as $$
  select papel from profiles where id = auth.uid()
$$;

create or replace function auth_setor_id()
returns uuid language sql stable security definer set search_path = public as $$
  select setor_id from profiles where id = auth.uid()
$$;

alter table tenants            enable row level security;
alter table setores            enable row level security;
alter table profiles           enable row level security;
alter table trilhas            enable row level security;
alter table trilha_setores     enable row level security;
alter table modulos            enable row level security;
alter table aulas              enable row level security;
alter table progresso_aula     enable row level security;
alter table questoes           enable row level security;
alter table respostas          enable row level security;
alter table conclusoes_modulo  enable row level security;
alter table comentarios        enable row level security;

-- Tenants
create policy "le o proprio tenant" on tenants
  for select using (id = auth_tenant_id());

-- Setores
create policy "le setores do tenant" on setores
  for select using (tenant_id = auth_tenant_id());

create policy "admin gerencia setores" on setores
  for all using (tenant_id = auth_tenant_id() and auth_papel() = 'admin');

-- Profiles
create policy "le o proprio perfil" on profiles
  for select using (id = auth.uid());

create policy "gestor le perfis do tenant" on profiles
  for select using (tenant_id = auth_tenant_id() and auth_papel() in ('gestor', 'admin'));

create policy "atualiza o proprio perfil" on profiles
  for update using (id = auth.uid());

create policy "gestor gerencia perfis do tenant" on profiles
  for all using (tenant_id = auth_tenant_id() and auth_papel() in ('gestor', 'admin'));

-- Trilhas: colaborador vê só trilhas do seu setor
create policy "le trilhas do seu setor" on trilhas
  for select using (
    tenant_id = auth_tenant_id()
    and ativa
    and (
      auth_papel() in ('gestor', 'admin')
      or not exists (select 1 from trilha_setores ts where ts.trilha_id = trilhas.id)
      or exists (
        select 1 from trilha_setores ts
        where ts.trilha_id = trilhas.id and ts.setor_id = auth_setor_id()
      )
    )
  );

create policy "admin gerencia trilhas" on trilhas
  for all using (tenant_id = auth_tenant_id() and auth_papel() = 'admin');

-- Trilha_setores
create policy "le vinculos de trilha visiveis" on trilha_setores
  for select using (exists (select 1 from trilhas t where t.id = trilha_id));

create policy "admin gerencia vinculos" on trilha_setores
  for all using (
    exists (select 1 from trilhas t where t.id = trilha_id and t.tenant_id = auth_tenant_id())
    and auth_papel() = 'admin'
  );

-- Modulos
create policy "le modulos de trilha visivel" on modulos
  for select using (exists (select 1 from trilhas t where t.id = trilha_id));

create policy "admin gerencia modulos" on modulos
  for all using (
    exists (select 1 from trilhas t where t.id = trilha_id and t.tenant_id = auth_tenant_id())
    and auth_papel() = 'admin'
  );

-- Aulas
create policy "le aulas de modulo visivel" on aulas
  for select using (exists (select 1 from modulos m where m.id = modulo_id));

create policy "admin gerencia aulas" on aulas
  for all using (
    exists (
      select 1 from modulos m join trilhas t on t.id = m.trilha_id
      where m.id = modulo_id and t.tenant_id = auth_tenant_id()
    )
    and auth_papel() = 'admin'
  );

-- Progresso: ATENÇÃO — colaborador não escreve, só Edge Function
create policy "le o proprio progresso" on progresso_aula
  for select using (user_id = auth.uid());

create policy "gestor le progresso do tenant" on progresso_aula
  for select using (tenant_id = auth_tenant_id() and auth_papel() in ('gestor', 'admin'));

-- Questoes
create policy "le questoes de modulo visivel" on questoes
  for select using (exists (select 1 from modulos m where m.id = modulo_id));

create policy "admin gerencia questoes" on questoes
  for all using (
    exists (
      select 1 from modulos m join trilhas t on t.id = m.trilha_id
      where m.id = modulo_id and t.tenant_id = auth_tenant_id()
    )
    and auth_papel() = 'admin'
  );

-- Respostas
create policy "le as proprias respostas" on respostas
  for select using (user_id = auth.uid());

create policy "grava as proprias respostas" on respostas
  for insert with check (user_id = auth.uid() and tenant_id = auth_tenant_id());

create policy "gestor le respostas do tenant" on respostas
  for select using (tenant_id = auth_tenant_id() and auth_papel() in ('gestor', 'admin'));

-- Conclusoes_modulo
create policy "le as proprias conclusoes" on conclusoes_modulo
  for select using (user_id = auth.uid());

create policy "gestor le conclusoes do tenant" on conclusoes_modulo
  for select using (tenant_id = auth_tenant_id() and auth_papel() in ('gestor', 'admin'));

-- Comentarios
create policy "le comentarios do tenant" on comentarios
  for select using (tenant_id = auth_tenant_id());

create policy "escreve o proprio comentario" on comentarios
  for insert with check (user_id = auth.uid() and tenant_id = auth_tenant_id());

create policy "apaga o proprio comentario" on comentarios
  for delete using (user_id = auth.uid());
