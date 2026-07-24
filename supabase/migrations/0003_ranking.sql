-- DG Academy — view de ranking para o painel de gestão
--
-- Tudo aqui é DERIVADO. Nenhuma pontuação, média ou posição é gravada em
-- coluna: se fosse, apodreceria na primeira vez que alguém refizesse um quiz.
--
-- Três medidas, porque o gestor pergunta três coisas diferentes:
--   entrega        → quantos módulos a pessoa concluiu
--   aproveitamento → % de acerto nas questões
--   ritmo          → dias por módulo concluído, do primeiro acesso até agora
--
-- Sobre o ritmo: como o vídeo não pode ser adiantado, ninguém consome mais
-- rápido que a duração da aula. Então "ritmo" aqui NÃO mede velocidade de
-- assistir — mede quanto a pessoa deixou o treinamento parado entre um módulo
-- e outro. É medida de constância, não de pressa.

create view vw_ranking_colaborador as
with base as (
  select
    p.id                as user_id,
    p.tenant_id,
    p.nome,
    p.cargo,
    p.setor_id,
    p.foto_url,
    p.criado_em,
    (select count(*) from modulos m
       join trilhas t on t.id = m.trilha_id
      where t.tenant_id = p.tenant_id and t.ativa)          as modulos_totais
  from profiles p
),
entrega as (
  select user_id,
         count(*)                    as modulos_concluidos,
         coalesce(sum(pontos_ganhos), 0) as pontos,
         min(concluido_em)           as primeira_conclusao,
         max(concluido_em)           as ultima_conclusao
  from conclusoes_modulo
  group by user_id
),
aproveitamento as (
  select user_id,
         count(*)                          as respostas_total,
         count(*) filter (where correta)   as acertos
  from respostas
  group by user_id
)
select
  b.user_id,
  b.tenant_id,
  b.nome,
  b.cargo,
  b.setor_id,
  b.foto_url,
  b.modulos_totais,
  coalesce(e.modulos_concluidos, 0) as modulos_concluidos,
  coalesce(e.pontos, 0)             as pontos,
  coalesce(a.respostas_total, 0)    as respostas_total,
  coalesce(a.acertos, 0)            as acertos,
  e.ultima_conclusao,
  -- dias por módulo concluído; nulo para quem ainda não concluiu nada
  case
    when coalesce(e.modulos_concluidos, 0) = 0 then null
    else round(
      extract(epoch from (e.ultima_conclusao - b.criado_em)) / 86400.0
        / e.modulos_concluidos
    , 2)
  end as dias_por_modulo
from base b
left join entrega e        on e.user_id = b.user_id
left join aproveitamento a on a.user_id = b.user_id;

-- Conclusões por semana, para o gráfico de ritmo da equipe.
create view vw_conclusoes_semana as
select
  tenant_id,
  date_trunc('week', concluido_em)::date as semana,
  count(*)                               as conclusoes
from conclusoes_modulo
group by tenant_id, date_trunc('week', concluido_em);
