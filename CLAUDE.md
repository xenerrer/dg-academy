# DG Academy — contexto do projeto

Leia isto antes de mexer em qualquer arquivo.

## O que é

Plataforma de treinamentos em vídeo da **DG Tech Soluções Corporativas**. O cliente chama de
"Universidade DG". Colaboradores assistem às aulas, respondem quizzes e não conseguem pular o
conteúdo; a gestão acompanha quem está estudando de verdade.

**Não é** sistema de gestão, RH ou ERP. O cliente já tem os dele e foi explícito sobre isso.

## Stack — não sair dela

React + Vite + TypeScript + Tailwind + shadcn/ui + Supabase. Vídeo no Panda Video.

Dependências permitidas: React, Vite, TypeScript, Tailwind, shadcn/ui, `@supabase/supabase-js`,
TanStack Query, react-router-dom, react-hook-form, zod, lucide-react, date-fns, clsx,
tailwind-merge, class-variance-authority, **framer-motion**.

framer-motion foi adicionado para o Mapa da Jornada (avatar viajando pela trilha, keyframes ao
longo de path SVG, pathLength). Justificativa: é a lib de animação que o Lovable conhece e usa
por padrão. Três gotchas aprendidos na marra (não regredir):

1. framer escreve `transform` inline → nunca usar classes `-translate-*` do Tailwind no MESMO
   elemento que recebe `x`/`y`/`scale` do motion.
2. Animar keyframes na PROP `animate={{ x: [...] }}` TRAVA quando o valor corrente já é igual
   ao primeiro keyframe (framer entende "sem mudança"). O avatar usa `animate(motionValue, [...])`
   IMPERATIVO (AvatarViajante.tsx) — sempre dispara.
3. Efeito que roda no mount com um timer + ref-guard persistente quebra sob StrictMode: o 1º
   run agenda e o cleanup limpa, o 2º aborta pelo ref → nada acontece. Confiar no clearTimeout
   do cleanup, não em ref de "já iniciou" (MapaJornada.tsx).

Qualquer coisa fora dessa lista precisa de justificativa explícita. Este projeto migra para o
Lovable e ele trabalha mal com dependências que não conhece.

## ⚠️ A regra que não pode ser quebrada

**A trava de avanço do vídeo é validada NO SERVIDOR.**

Na primeira visualização de cada aula o colaborador não pode pular. Depois de assistir por
completo, libera. Essa regra vive na Edge Function de heartbeat, que acumula os intervalos
assistidos em `progresso_aula.segmentos` e rejeita saltos maiores que o tempo real decorrido.

`src/components/PandaPlayer.tsx` só esconde os controles e reporta progresso. Se essa lógica
migrar para o front, qualquer pessoa com o DevTools aberto burla a trava — e o relatório que o
gestor usa para decidir vira ficção. É o valor inteiro do produto.

Reflexo disso no banco: **`progresso_aula` não tem policy de INSERT/UPDATE para o colaborador.**
Isso é deliberado. Não "consertar".

## Estado atual

Casca navegável com dados de exemplo. O Supabase ainda não foi provisionado.

- `src/mocks/dados.ts` — dados de exemplo, tipados no formato exato do schema
- `src/lib/api.ts` — a costura. Cada função vira uma query do Supabase; a assinatura não muda
- `supabase/migrations/` — schema e RLS escritos, ainda não rodados
- `src/components/PandaPlayer.tsx` — placeholder; o embed real entra quando a conta do Panda
  estiver ativa e as capacidades do player forem confirmadas

Para ligar o Supabase: criar o projeto, rodar as migrations, gerar
`src/integrations/supabase/types.ts`, e trocar o corpo das funções de `src/lib/api.ts`.
Nenhum componente precisa ser tocado.

## Convenções

- Um componente por arquivo, máximo ~150 linhas
- Sem barrel files (`index.ts` reexportando)
- Imports com `@/`
- Tailwind direto no JSX; nada de CSS Modules ou styled-components
- Dado remoto sempre via TanStack Query
- Formulários com react-hook-form + zod
- Schema só em migrations SQL versionadas, nunca em cliques no painel do Supabase
- RLS ligado em toda tabela, sem exceção
- Nomes de tabela e coluna em snake_case e português, iguais ao SQL

## Design — Token System

Tema dark-only. **Fonte única de verdade em `src/index.css` (:root, CSS vars) + nomes em
`tailwind.config.ts`.** Ver `docs/10-TOKENS.md`. Nunca hex solto no JSX nem `text-[Npx]` avulso.

- Cor: classes `dg-yellow`, `dg-bg`, `dg-card`, `dg-muted`, `dg-success`… (alpha funciona:
  `bg-dg-yellow/10`). Em SVG use `rgb(var(--dg-yellow))`.
- Tipografia: escala semântica `text-eyebrow / caption / label / body / body-lg / subtitle /
  title / heading / display` — não usar pixel solto.
- Raio: `rounded-control` (botão), `rounded-poster`, `rounded-surface` (card), `rounded-modal`.
- Movimento: `duration-fast/base/slow/slower`, `ease-out-dg`, `ease-spring-dg`.
- Space Grotesk (títulos), Inter (texto), JetBrains Mono (rótulos técnicos), Montserrat (capas).
- A logo é sempre usada inteira, nunca recortada.

**Ícones: lucide-react, nunca emoji.** O raio da marca é `<Zap>` amarelo, não `⚡`.

Assinaturas visuais a preservar: a barra `/` amarela antes de títulos de seção
(`/minhaJornada`), rótulos `//` em mono, e o vocabulário — módulo "energizado" em vez de
"concluído", "jornada" em vez de "curso", o raio (ícone `Zap`) como marca recorrente.

## Vocabulário do domínio

trilha → módulo → aula. Módulo concluído é "energizado". O conjunto é a "jornada".
Papéis: colaborador, gestor, admin.

## Fora de escopo

Sistema de gestão/RH/ERP · IA para resumo de vídeos · geração de avatar por IA · infraestrutura
própria de vídeo · Stripe/créditos/cobrança · app mobile nativo.

Custo mensal é a restrição declarada do cliente. Toda feature que aumente custo recorrente
precisa passar por ele antes.
