-- DG Academy — dados coletados no primeiro acesso
--
-- Três campos, e só. O colaborador não digita cargo nem setor: isso vem do
-- cadastro do RH. O que ele faz no primeiro login é dar a foto, confirmar que
-- o cadastro está certo e dizer quanta estrada tem.
--
-- Sobre nivel_experiencia: NÃO gateia conteúdo. Muda o tom das mensagens e a
-- ordem do conteúdo opcional. Se mudasse o conteúdo obrigatório, o treinamento
-- de segurança deixaria de ser garantia — e é justamente a garantia que o
-- cliente está comprando.

create type nivel_experiencia as enum ('iniciante', 'intermediario', 'veterano');

alter table profiles
  add column nivel_experiencia   nivel_experiencia,
  add column onboarding_concluido_em timestamptz;

-- O redirect para o onboarding é condicionado a este campo ser nulo.
comment on column profiles.onboarding_concluido_em is
  'Nulo = primeiro acesso ainda não concluído; o app redireciona para /bem-vindo.';

comment on column profiles.nivel_experiencia is
  'Autodeclarado no primeiro acesso. Afeta tom de mensagem e ordem de conteúdo opcional. Nunca gateia conteúdo obrigatório.';
