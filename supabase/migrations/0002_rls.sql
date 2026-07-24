-- DG Academy — Row Level Security
--
-- Regra geral: ninguém enxerga outro tenant. Sem exceção.
-- Colaborador lê o conteúdo do seu setor e escreve só o próprio progresso.
-- Gestor lê tudo do tenant. Admin também escreve conteúdo.
--
-- Nunca depender de filtro no cliente para segurança. O filtro no front é
-- conveniência; a política aqui é a garantia.

-- ============================================================
-- Helpers
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

-- ============================================================
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

-- ============================================================
-- TENANTS / SETORES
-- ============================================================
create policy "le o proprio tenant" on tenants
  for select using (id = auth_tenant_id());

create policy "le setores do tenant" on setores
  for select using (tenant_id = auth_tenant_id());

create policy "admin gerencia setores" on setores
  for all using (tenant_id = auth_tenant_id() and auth_papel() = 'admin');

-- ============================================================
-- PROFILES
-- ============================================================
create policy "le o proprio perfil" on profiles
  for select using (id = auth.uid());

create policy "gestor le perfis do tenant" on profiles
  for select using (tenant_id = auth_tenant_id() and auth_papel() in ('gestor', 'admin'));

create policy "atualiza o proprio perfil" on profiles
  for update using (id = auth.uid());

create policy "gestor gerencia perfis do tenant" on profiles
  for all using (tenant_id = auth_tenant_id() and auth_papel() in ('gestor', 'admin'));

-- ============================================================
-- CONTEÚDO — colaborador só vê trilha do seu setor.
-- Trilha sem vínculo em trilha_setores é visível a todos do tenant.
-- ============================================================
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

create policy "le vinculos de trilha visiveis" on trilha_setores
  for select using (exists (select 1 from trilhas t where t.id = trilha_id));

create policy "admin gerencia vinculos" on trilha_setores
  for all using (
    exists (select 1 from trilhas t where t.id = trilha_id and t.tenant_id = auth_tenant_id())
    and auth_papel() = 'admin'
  );

create policy "le modulos de trilha visivel" on modulos
  for select using (exists (select 1 from trilhas t where t.id = trilha_id));

create policy "admin gerencia modulos" on modulos
  for all using (
    exists (select 1 from trilhas t where t.id = trilha_id and t.tenant_id = auth_tenant_id())
    and auth_papel() = 'admin'
  );

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

-- ============================================================
-- PROGRESSO
--
-- ATENÇÃO: não existe policy de INSERT/UPDATE para o colaborador aqui,
-- e isso é deliberado. Quem escreve progresso é a Edge Function de
-- heartbeat, com service role. Se o cliente pudesse escrever, a trava de
-- avanço seria decorativa e o relatório do gestor viraria ficção.
-- ============================================================
create policy "le o proprio progresso" on progresso_aula
  for select using (user_id = auth.uid());

create policy "gestor le progresso do tenant" on progresso_aula
  for select using (tenant_id = auth_tenant_id() and auth_papel() in ('gestor', 'admin'));

-- ============================================================
-- QUIZ
-- ============================================================
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

create policy "le as proprias respostas" on respostas
  for select using (user_id = auth.uid());

create policy "grava as proprias respostas" on respostas
  for insert with check (user_id = auth.uid() and tenant_id = auth_tenant_id());

create policy "gestor le respostas do tenant" on respostas
  for select using (tenant_id = auth_tenant_id() and auth_papel() in ('gestor', 'admin'));

create policy "le as proprias conclusoes" on conclusoes_modulo
  for select using (user_id = auth.uid());

create policy "gestor le conclusoes do tenant" on conclusoes_modulo
  for select using (tenant_id = auth_tenant_id() and auth_papel() in ('gestor', 'admin'));

-- ============================================================
-- COMENTÁRIOS
-- ============================================================
create policy "le comentarios do tenant" on comentarios
  for select using (tenant_id = auth_tenant_id());

create policy "escreve o proprio comentario" on comentarios
  for insert with check (user_id = auth.uid() and tenant_id = auth_tenant_id());

create policy "apaga o proprio comentario" on comentarios
  for delete using (user_id = auth.uid());
