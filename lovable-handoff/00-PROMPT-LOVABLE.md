# 🎯 PROMPT COMPLETO — DG ACADEMY (UNIVERSIDADE DG)

**Use este prompt exato no Lovable. Contém todas as especificações, design, dados e arquitetura.**

---

## CONTEXTO DO PROJETO

Você vai construir **DG Academy**, uma plataforma de treinamentos em vídeo para a DG Tech Soluções Corporativas. 

O cliente (Danilo) exigiu: **video + acompanhamento, barato, pronto**. A restrição de custo é dominante — R$ 87/mês recorrente (só o Panda Video). Tudo mais em tier gratuito.

### O que o produto faz

1. **Colaboradores** acessam trilha de vídeos obrigatórios do seu setor
2. Na **primeira visualização**, não conseguem pular/acelerar — isso é validado no servidor
3. Ao fim, respondem **quiz** e ganham pontos
4. Conclusão de módulo desbloqueia o próximo
5. **Gestor/RH** vê progresso em tempo real com dados reais (não fake)

### Por que existe

A DG Tech não tem visibilidade de quem assistiu ao treinamento de segurança. Sem isso, não conseguem validar conformidade. Este produto resolve.

### O que NÃO é

Sistema de gestão, RH, ERP, ponto, folha, IA para resumo, geração de avatar, infraestrutura própria de vídeo, Stripe/cobrança.

---

## STACK (não sair dela)

- **Front:** React 19+ + Vite + TypeScript + Tailwind + shadcn/ui
- **Backend:** Supabase (Postgres + Auth + RLS + Realtime + Storage)
- **Vídeo:** Panda Video (Bronze, R$ 87/mês) — embed com player controlável
- **Animações:** framer-motion (é a que o Lovable conhece bem)
- **Servidor:** Edge Functions (validação de progresso, anti-fraude)
- **Deploy:** Vercel ou Netlify (free tier)

**Dependências permitidas:** React, Vite, TS, Tailwind, shadcn/ui, @supabase/supabase-js, TanStack Query, react-router-dom, react-hook-form, zod, lucide-react, date-fns, framer-motion, clsx, tailwind-merge, class-variance-authority.

Qualquer coisa fora disso precisa de justificativa — este projeto é feito para o Lovable.

---

## ⚠️ A REGRA QUE NÃO PODE SER QUEBRADA

**A trava de avanço do vídeo é validada no servidor, não no front.**

### Por que

Se implementada só no front:
- Qualquer pessoa abre DevTools e burla em segundos
- O relatório do gestor vira ficção
- O valor inteiro do produto some

### Como funciona

1. Front embute o **player Panda** com controles de seek **desabilitados** e velocidade **travada em 1×**
2. A cada ~10 seg, envia **heartbeat** para Edge Function: `{ aula_id, posicao_atual, intervalo_assistido: [inicio, fim] }`
3. Edge Function **acumula intervalos** em `progresso_aula.segmentos`, **mesclando sobrepostos**
4. Rejeita heartbeats cujo avanço seja maior que tempo real decorrido (anti-fraude óbvio)
5. Quando cobertura ≥ 95% da duração, marca `concluida_em` + `seek_liberado = true`
6. **Quiz só abre se servidor disser "pronto"**

### Reflexo no banco

- `progresso_aula` **não tem policy de INSERT/UPDATE para o colaborador**
- Quem escreve lá é só a Edge Function
- Isso é deliberado — não consertar

---

## MODELO DE DADOS

Multi-tenant desde o início: `tenant_id` em toda tabela de domínio.

Ver arquivo `03-DATABASE-SCHEMA.sql` para o SQL completo com índices e constraints.

### Tabelas principais

```
tenants               — instância do cliente (DG Tech aqui)
  id, nome, slug, logo_url, cor_primaria

profiles              — 1:1 com auth.users
  id (FK auth.users), tenant_id, nome, email, cargo, setor_id,
  foto_url, papel ('colaborador' | 'gestor' | 'admin')

setores               — "Engenharia de Campo", "Orçamentos", etc
  id, tenant_id, nome

trilhas               — "Integração DG Tech", "Segurança Avançada"
  id, tenant_id, nome, descricao, ordem, ativa

trilha_setores        — resolve: "engenheiro de campo vê trilhas de campo"
  trilha_id, setor_id

modulos               — "Boas-vindas", "Código de Conduta"
  id, trilha_id, numero, titulo, descricao, capa_url, ordem

aulas                 — "Boas-vindas à DG" (vídeo + quiz)
  id, modulo_id, titulo, descricao, panda_video_id, duracao_seg, ordem

progresso_aula        — **A tabela que sustenta a trava**
  id, tenant_id, user_id, aula_id,
  segmentos jsonb (ex: [[0,45],[60,120]]),
  segundos_assistidos, seek_liberado, concluida_em, atualizado_em
  UNIQUE(user_id, aula_id)

questoes              — perguntas do quiz (3+ por módulo)
  id, modulo_id, enunciado, alternativas jsonb, indice_correto,
  feedback, pontos, ordem

respostas             — tentativas do user
  id, tenant_id, user_id, questao_id, tentativa, indice_escolhido,
  correta, respondido_em

conclusoes_modulo     — módulo concluído
  id, tenant_id, user_id, modulo_id, acertos, total,
  pontos_ganhos, concluido_em
  UNIQUE(user_id, modulo_id)

comentarios           — V1.1, mas a tabela já nasce aqui
  id, tenant_id, aula_id, user_id, parent_id, texto, criado_em
```

### RLS (Row Level Security)

- **Colaborador:** lê trilhas/módulos/aulas do seu `tenant_id` E cujo setor bata com o dele. Lê/escreve só o próprio progresso, respostas.
- **Gestor:** lê tudo do tenant, incluso progresso de todos. Escreve `profiles` do tenant (cadastrar colaborador).
- **Admin:** tudo do tenant, incluso CRUD de conteúdo.
- **Ninguém** enxerga outro tenant, sem exceção.

### Views (progresso é sempre derivado)

```sql
vw_progresso_colaborador
  — aulas_concluidas, aulas_totais, pontos_total, ultima_atividade

vw_desempenho_quiz
  — respostas_total, acertos, taxa_acerto

vw_kpis_tenant
  — colabs_em_trilha, media_acertos, tempo_medio
```

---

## TOKENS VISUAIS (Design System)

**Tema dark-only.** Fonte única de verdade: `src/index.css` (CSS vars) + nomes em `tailwind.config.ts`.

Ver arquivo `02-TOKENS.md` para detalhes completos.

### Cores (classes + CSS vars)

```
dg-yellow        #FFDA00    — marca, ênfase, CTA
dg-bg            #0A0A0A    — fundo principal
dg-card          #141414    — card padrão
dg-card2         #1C1C1C    — card secundário
dg-line          #2C2C2C    — divisor
dg-text          #FFFFFF    — texto
dg-muted         #999999    — texto secundário
dg-success       #4CAF50    — resposta correta
dg-danger        #F44336    — resposta errada
dg-info          #2196F3    — informação

chart-mark       #FFD700    — ordinal ramp (1º lugar)
chart-mark2      #FFB300    — ordinal ramp (2º)
chart-mark3      #FF9500    — ordinal ramp (3º)
```

### Tipografia (escala semântica)

```
text-eyebrow      10.5px
text-caption      11.5px
text-label        12.5px
text-body         14px
text-body-lg      15px
text-subtitle     17px
text-title        21px
text-heading      26px
text-display      30px
```

**Famílias:**
- Space Grotesk — títulos, display, eyebrow
- Inter — body, captions
- JetBrains Mono — rótulos técnicos, labels
- Montserrat — capas de módulos

### Raios (semânticos)

```
rounded-control   — botões, inputs
rounded-poster    — capas de módulos
rounded-surface   — cards
rounded-modal     — modais
```

### Movimento (durações + timing)

```
duration-fast      180ms
duration-base      280ms
duration-slow      500ms
duration-slower    900ms

ease-out-dg        — easing customizado DG (cubic-bezier)
ease-spring-dg     — spring customizado (cubic-bezier)
```

### Identidade visual preservar

- Barra `/` amarela antes de títulos de seção (ex: `/minhaJornada`)
- Rótulos `//` em JetBrains Mono (ex: `// 1.200 pontos`)
- Ícone `Zap` (lucide-react) como marca recorrente
- Vocabulário: "energizado" (módulo concluído), "jornada" (trilha), "mapa" (visualização 2D)
- Logo **sempre inteira**, nunca recortada

---

## ROTAS

```
/login                    — login com e-mail + senha (Supabase Auth)
/onboarding               — foto + nível de experiência (first-time)
/                         — home: trilha do colaborador (mapa 2D ou carrossel)
/aula/:id                 — player + quiz + comentários
/perfil                   — dados, foto, pontos, histórico
/gestao                   — painel do gestor (KPIs + tabela)
/gestao/colaboradores     — cadastro e atribuição de setor
/admin/conteudo           — CRUD de trilhas, módulos, aulas, questões
```

---

## COMPONENTES ESPERADOS

### Autenticação
- `LoginForm` — e-mail + senha, integrado ao Supabase Auth
- `OnboardingFlow` — foto + nível de experiência

### Trilha / Home
- `TrilhaCarrossel` — visualização atual do protótipo (versão fallback)
- `MapaJornada` — 2D com SVG + avatar (quando arte chegar)
- `AvatarViajante` — avatar animado no mapa (framer-motion, pathLength)
- `ModuloPoster` — card de módulo com capa, estados (concluído/atual/bloqueado)

### Aula
- `PandaPlayer` — embed do player Panda, heartbeat a cada 10s, desabilita seek
- `QuizCard` — questão com alternativas, feedback imediato, pontuação
- `ResultadoModulo` — confete, pontos ganhos, botão de continuar/ranking

### Painel de Gestão
- `PainelKPIs` — cards de KPIs (colaboradores em trilha, média de acertos, tempo médio)
- `TabelaProgresso` — colaboradores com progresso, acertos, última atividade (Realtime)
- `CadastroColaborador` — form com cargo e setor
- `UploadFoto` — upload para Supabase Storage

### Admin
- `CRUDTrilhas` — CRUD de trilhas
- `CRUDModulos` — CRUD de módulos
- `CRUDAulas` — CRUD de aulas (panda_video_id)
- `CRUDQuestoes` — CRUD de questões

### UI Geral
- `AppNav` — barra de navegação com avatar
- `ParaVoce` — recomendação personalizada (baseado em rol e setor)
- `Comentarios` — árvore de comentários (V1.1, UI já feita)
- Modal, Button, Input, Card, Select — do shadcn/ui

---

## DADOS DE TESTE

Ver arquivo `05-DADOS-MOCK.ts` — um exemplo completo de cada tabela, tipado, pronto pra copiar pro Supabase.

```typescript
TENANT_ID = 'tenant-dgtech'
TENANT = DG Tech Soluções Corporativas, #FFDA00

SETORES = [
  'Engenharia de Campo',
  'Orçamentos',
  'Administrativo'
]

USUARIO_ATUAL = Marcos Oliveira (eletricista jr., setor campo)

TRILHA = Integração DG Tech (6 módulos)

MODULOS = [
  Boas-vindas à DG,
  Cultura, Missão & Valores,
  Código de Conduta,
  Segurança & EPIs,
  Materiais & Ferramentas,
  Certificação DG Tech
]

AULAS = 1 aula por módulo (durações variadas)

QUESTOES = 3 questões sobre Código de Conduta (do protótipo)
  — Exemplo 1: "Colega pede pra pular checklist; qual é a conduta DG?"
  — Resposta: "Seguir checklist completo — segurança não se negocia"

CONCLUSOES = Marcos concluiu módulos 1 e 2

PROGRESSO = Marcos completou 100% das aulas 1 e 2
```

---

## PANDA VIDEO — ESPECIFICAÇÃO

### Embed

```html
<iframe
  allow="autoplay"
  frameborder="0"
  height="100%"
  width="100%"
  src="https://player.pandavideo.com.br/player.html?id=PANDA_VIDEO_ID&token=TOKEN"
></iframe>
```

### Configurações necessárias

**Validar antes de codar:**
- [ ] O player emite eventos JS (`play`, `pause`, `timeupdate`, `ended`)?
- [ ] Dá pra desabilitar seek/scrubbing?
- [ ] Dá pra travar velocidade em 1×?

Se tudo funciona, ótimo. Se não:
- Usar overlay próprio (mais frágil, mas viável)
- Ou escalar para cliente validar capacidades

### Heartbeat

A cada ~10s de reprodução:

```javascript
fetch('/api/heartbeat', {
  method: 'POST',
  body: JSON.stringify({
    aula_id: 'uuid',
    posicao_atual: 45,        // segundos
    intervalo_assistido: [40, 45]
  })
})
```

Edge Function responde:
- 200 OK — intervalo aceito, continue
- 400 — intervalo inválido (avanço > tempo real), rejeita

---

## API LAYER

Ver arquivo `07-API-LAYER.md`.

Cada função em `src/lib/api.ts` terá assinatura que **nunca muda**:

```typescript
export async function listarModulos(trilhaId: string): Promise<Modulo[]>
export async function obterAulaDoModulo(moduloId: string): Promise<Aula | null>
export async function listarQuestoes(moduloId: string): Promise<Questao[]>
export async function obterProgressoAula(userId: string, aulaId: string): Promise<ProgressoAula | null>
// ... etc
```

Hoje chamam `src/mocks/dados.ts`. Quando Supabase entrar, viram queries — nenhum componente muda.

---

## CONVENÇÕES DE CÓDIGO

- 1 componente por arquivo, máx ~150 linhas
- Sem barrel files (`index.ts` reexportando)
- Imports com `@/`
- Tailwind direto no JSX; zero CSS Modules
- Dado remoto via TanStack Query
- Formulários: react-hook-form + zod
- Schema em migrations SQL versionadas, nunca em cliques
- RLS ligado em toda tabela
- Nomes de tabela/coluna em snake_case + português

---

## CHECKLIST PARA A V1

### Bloco A — Núcleo
- [ ] Auth real (Supabase, e-mail + senha)
- [ ] Perfis: colaborador, gestor, admin
- [ ] Trilha com estados: concluído/atual/bloqueado
- [ ] Player Panda com trava servidor
- [ ] Velocidade travada em 1× na 1ª visualização
- [ ] Quiz com feedback e pontuação
- [ ] Conclusão de módulo desbloqueia próximo
- [ ] Tela de resultado

### Bloco B — Painel do Gestor
- [ ] KPIs calculados do banco
- [ ] Tabela de progresso com Realtime
- [ ] Cadastro de colaborador + setor
- [ ] Upload de foto

### Bloco C — Multi-tenancy
- [ ] `tenant_id` em todas as tabelas
- [ ] RLS isolando tenant
- [ ] (Sem UI de gestão de tenants)

### Bloco D — Trilha por Setor
- [ ] Colaborador vê só trilhas do seu setor

### Bloco E — Mapa 2D
- [ ] (Depende de arte do Carlos — carrossel substitui por enquanto)

---

## CRITÉRIO DE SUCESSO

O Danilo conseguir, sozinho:

1. ✅ Fazer login como gestor, cadastrar colaborador com cargo e setor
2. ✅ Ver colaborador logar, assistir aula real (sem poder pular), responder quiz, concluir módulo
3. ✅ Abrir painel e enxergar aquele progresso ali, com dado real, sem recarregar

Se esses 3 funcionam com dado persistido → **V1 pronta.**

---

## O QUE NÃO FAZER

- ❌ Replicar o protótipo como base de código (é só referência visual)
- ❌ Colocar regra de progresso no front
- ❌ Criar tabela sem `tenant_id`
- ❌ Usar dependência que Lovable não conhece
- ❌ Implementar RLS depois ("quando tivermos tempo")
- ❌ Avatar gerado por IA, resumo automático, Stripe, servidor próprio de vídeo

---

## QUESTÕES PENDENTES DO CLIENTE

- Vídeos reais (Danilo sobe no Panda)
- Questões definitivas (prometidas seg/ter)
- Arte do mapa 2D (Carlos entrega)
- Lista completa de setores reais (hoje: Campo, Orçamentos, Administrativo)

Enquanto espera, teste com vídeos dummy e questões do protótipo.

---

## PRONTO PARA COMEÇAR

Copie este prompt na integra no Lovable. Depois use os arquivos desta pasta como referência:

- `02-TOKENS.md` — paleta, tipografia, raios
- `03-DATABASE-SCHEMA.sql` — schema completo
- `04-TYPES.ts` — tipos do domínio
- `05-DADOS-MOCK.ts` — exemplo de cada tabela
- `06-ROTAS-E-FLUXOS.md` — jornadas de usuário
- `07-API-LAYER.md` — contrato da API
- `08-PANDA-VIDEO.md` — especificação do player
- `09-COMPONENTES.md` — lista de componentes

Boa sorte! 🚀
