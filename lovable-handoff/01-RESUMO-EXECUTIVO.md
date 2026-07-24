# DG Academy — Resumo Executivo para Lovable

**Projeto:** Plataforma de treinamentos em vídeo da DG Tech  
**Stack:** React + Vite + TypeScript + Tailwind + Supabase  
**Custo recorrente:** R$ 87/mês (só Panda Video)  
**Prazo V1:** Semana de 20/07/2026  
**Status:** Pronto para o Lovable

---

## Em uma frase

Uma plataforma web onde colaboradores assistem a vídeos obrigatórios (sem poder pular), respondem quizzes e a gestão vê em tempo real quem está estudando de verdade.

---

## O Problema

DG Tech não tem visibilidade de quem assistiu aos treinamentos de segurança. Em uma empresa de engenharia elétrica, onde procedimento de segurança é inegociável, essa cegueira é um risco operacional.

---

## A Solução

**Trava de avanço validada no servidor** — não é decorativa. A cada ~10s, o front reporta o que foi realmente assistido. Só depois de 95% de cobertura é que o quiz desbloqueado e o colaborador consegue marcar como concluído.

Sem isso, qualquer pessoa abre o DevTools e burla em segundos. A trava precisa ser real.

---

## Usuários

| Papel | Quem | O que faz |
|---|---|---|
| Colaborador | Eletricista, engenheiro, orçamentista | Assiste aula travada, responde quiz, ganha pontos |
| Gestor/RH | Danilo e designados | Vê progresso em tempo real (dado real, não fake) |
| Admin | Lucas / Guto | CRUD de trilhas, módulos, aulas, questões |

---

## As 4 funcionalidades que definem o produto

1. **Trava de avanço (validada no servidor)** — colaborador não consegue pular na 1ª visualização
2. **Trilha por setor** — engenheiro de campo vê trilhas de campo; orçamentista vê de orçamentos
3. **Quiz ao fim de cada aula** — fixação de aprendizado + pontuação
4. **Painel de acompanhamento** — gestor vê progresso de todos em tempo real

---

## Stack (não sair dela)

- **Front:** React 19+ + Vite + TypeScript + Tailwind + shadcn/ui
- **Backend:** Supabase (Postgres + Auth + RLS + Realtime + Storage)
- **Vídeo:** Panda Video (Bronze, R$ 87/mês)
- **Animações:** framer-motion
- **Servidor:** Edge Functions (validação de progresso)
- **Deploy:** Vercel ou Netlify (free tier)

**Dependências extras:** @supabase/supabase-js, TanStack Query, react-router-dom, react-hook-form, zod, lucide-react, date-fns

---

## Modelo de Dados (Multi-tenant)

```
tenants (instância do cliente)
  ↓
profiles (1:1 com auth.users) + setores
  ↓
trilhas + trilha_setores (colaborador vê só trilha do seu setor)
  ↓
modulos → aulas → progresso_aula (a trava mora aqui)
                   + questoes → respostas → conclusoes_modulo
```

**RLS:** colaborador vê só dados do próprio tenant e setor. Gestor vê tudo do tenant.

**Progresso:** derivado, nunca digitado. Views calculam pontos, acertos, média.

---

## Rotas Principais

```
/login                     autenticação
/onboarding                first-time (foto + nível experiência)
/                          home — trilha com módulos
/aula/:id                  player + quiz + resultado
/perfil                    dados pessoais + histórico
/gestao                    painel do gestor (KPIs + tabela)
/gestao/colaboradores      cadastro de colaborador
/admin/conteudo            CRUD de trilhas, módulos, aulas, questões
```

---

## Fluxo de Aula (o coração do produto)

```
1. Colaborador clica "Iniciar"
   ↓
2. PandaPlayer renderiza com seek DESABILITADO
   ↓
3. A cada 10s: heartbeat reporta intervalo assistido
   ↓
4. Edge Function acumula segmentos, valida tempo real
   ↓
5. Cobertura ≥ 95%?
   ├─ SIM: concluida_em = now, seek_liberado = true
   └─ NÃO: continua travado
   ↓
6. Quiz desbloqueado quando seek_liberado = true
   ↓
7. Responde 3 questões
   ↓
8. Resultado: pontos ganhos + confete
   ↓
9. Home atualiza: módulo agora "concluído", próximo é "atual"
```

---

## Design System

**Tema dark-only.**

| Cor | Uso |
|---|---|
| Amarelo #FFDA00 | Marca, ênfase, CTA |
| Fundo #0A0A0A | Background principal |
| Card #141414 | Cards, overlays |
| Sucesso #4CAF50 | Resposta correta |
| Danger #F44336 | Resposta errada |

**Tipografia:** Space Grotesk (títulos), Inter (body), JetBrains Mono (labels)

**Componentes:** Button, Input, Select, Modal, Card, Table (shadcn/ui base)

**Ícones:** lucide-react (não emoji)

---

## Anti-fraude

Edge Function rejeita heartbeat se:
1. Avanço declarado > tempo real decorrido (com folga de latência)
2. Fim > duração da aula
3. Intervalo não é válido [início, fim]

Sem isso: DevTools burla em segundos.

---

## Dados Iniciais (Mock)

Arquivo `05-DADOS-MOCK.ts` tem:
- 1 tenant (DG Tech)
- 3 setores (Campo, Orçamentos, Administrativo)
- 1 trilha (Integração DG Tech)
- 6 módulos
- 6 aulas
- 3 questões (Código de Conduta)
- 2 módulos concluídos (user Marcos)
- 3 registros de progresso

Pronto pra copiar pro Supabase quando estiver.

---

## Bloqueadores Externos

| O quê | Status | Impacto |
|---|---|---|
| Validar capacidades do Panda (seek, velocidade, eventos) | ⏳ Pendente | CRÍTICO — trava inteira depende disso |
| Danilo assinar conta Panda | ⏳ Pendente | SEM TESTE, SEM VALIDAÇÃO |
| Carlos entregar arte do mapa 2D | ⏳ Pendente | BAIXO — carrossel substitui |
| Questões definitivas do Danilo | ⏳ Pendente | BAIXO — protótipo funciona |

---

## Checklist V1 (Blocos A-E)

### Bloco A — Núcleo (CRÍTICO)
- [ ] Auth real (Supabase)
- [ ] Perfis (colaborador/gestor/admin)
- [ ] Trilha com estados (concluído/atual/bloqueado)
- [ ] Player Panda com trava servidor
- [ ] Quiz ao fim
- [ ] Resultado com confete

### Bloco B — Painel do Gestor
- [ ] KPIs (colaboradores, média acertos, tempo médio)
- [ ] Tabela de progresso com Realtime
- [ ] Cadastro de colaborador
- [ ] Upload de foto

### Bloco C — Multi-tenancy
- [ ] tenant_id em todas as tabelas
- [ ] RLS isolando tenant
- [ ] (Sem UI de gestão de tenants)

### Bloco D — Trilha por Setor
- [ ] Colaborador vê só trilhas do seu setor

### Bloco E — Mapa 2D
- [ ] (Bloqueado por arte — carrossel é fallback)

---

## Critério de Sucesso

Danilo conseguir, sozinho:

1. ✅ Fazer login como gestor, cadastrar colaborador com cargo e setor
2. ✅ Ver colaborador logar, assistir aula real (sem poder pular), responder quiz, concluir módulo
3. ✅ Abrir painel e enxergar aquele progresso ali, com dado real, sem recarregar

Se esses 3 funcionam com dado persistido → V1 pronta.

---

## Como Usar Esta Pasta

Copie o **arquivo 00-PROMPT-LOVABLE.md** inteiro no Lovable.

Depois use os 9 arquivos como referência conforme implementa:

| Arquivo | Para quê |
|---|---|
| `01-RESUMO-EXECUTIVO.md` | Este documento |
| `02-TOKENS.md` | Cores, tipografia, componentes, movimento |
| `03-DATABASE-SCHEMA.sql` | Rodar migrations no Supabase |
| `04-TYPES.ts` | Copiar tipos para `src/types/database.ts` |
| `05-DADOS-MOCK.ts` | Dados de teste, copiar pro Supabase |
| `06-ROTAS-E-FLUXOS.md` | Jornadas de usuário, detalhes de cada rota |
| `07-API-LAYER.md` | Contrato da API, implementação mock → Supabase |
| `08-PANDA-VIDEO.md` | Especificação do embed, heartbeat, validação |
| `09-COMPONENTES.md` | Lista de componentes esperados e padrões |

---

## Próximos Passos

1. **Copiar prompt do arquivo 00 pro Lovable** e começar implementação
2. **Validar Panda antes de codar:** confirmar seek, velocidade, eventos
3. **Implementar Bloco A primeiro:** auth, trilha, player, trava, quiz
4. **Depois Bloco B:** painel com Realtime
5. **Testar com dados mock** (`05-DADOS-MOCK.ts`)
6. **Rodar migrations** (`03-DATABASE-SCHEMA.sql`) quando Supabase pronto
7. **Ligar ao Supabase:** trocar implementação de `src/lib/api.ts`
8. **Deploy** em Vercel/Netlify
9. **Entregar ao Danilo** para validação

---

## Restrição Dominante

**Custo recorrente: R$ 87/mês (só Panda).**

Toda decisão técnica é justificada contra esse número. Qualquer feature que aumente custo está **fora da V1**.

---

## Contato / Dúvidas

- **Cliente:** Danilo (DG Tech)
- **Intermediação:** Carlos (Guto Films)
- **Desenvolvimento:** Lucas Schoenherr
- **Destino final:** Código será migrado ao Lovable (design limpo, sem gambiarra)

---

**Pronto para o Lovable! 🚀**
