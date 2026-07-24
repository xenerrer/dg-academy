# Rotas e Fluxos de Usuário

---

## Mapa de Rotas

```
/login                    Login (e-mail + senha)
  └─ POST auth.signInWithPassword

/onboarding               First-time (foto + nível experiência)
  ├─ Upload foto → Supabase Storage
  └─ POST profiles.update({ nivel_experiencia, onboarding_concluido_em })

/                         Home — Trilha do colaborador
  ├─ GET trilhas (filtrado por setor)
  ├─ GET módulos da trilha
  ├─ GET progresso (conclusões_modulo)
  └─ Renderiza: carrossel ou mapa 2D

/aula/:id                 Player + Quiz + Comentários
  ├─ GET aula
  ├─ GET progresso_aula (para saber se está travada)
  ├─ WebSocket Realtime (hearbeat de progresso)
  ├─ POST questoes (quando vencimento de aula)
  ├─ POST respostas (resposta do user)
  └─ POST conclusoes_modulo (ao fim do quiz)

/perfil                   Dados pessoais + progresso
  ├─ GET profile
  ├─ GET progresso_colaborador (view)
  └─ Renderiza: avatar, pontos, histórico

/gestao                   Painel do gestor (KPIs + tabela)
  ├─ GET vw_kpis_tenant (KPIs calculados)
  ├─ GET vw_progresso_colaborador (tabela)
  └─ Realtime.onUpdateIn('vw_progresso_colaborador', ...)

/gestao/colaboradores     Cadastro e atribuição de setor
  ├─ GET profiles (todos do tenant)
  ├─ POST profiles (novo colaborador)
  ├─ PATCH profiles (update setor)
  └─ POST storage (foto de perfil)

/admin/conteudo           CRUD de trilhas, módulos, aulas, questões
  ├─ GET trilhas, modulos, aulas, questoes
  ├─ POST/PATCH/DELETE cada um
  └─ POST storage (capas de módulos)
```

---

## Fluxo de Autenticação (Colaborador)

```
1. Acessa /login
   ↓
2. Entra e-mail + senha
   ↓
3. Supabase Auth valida
   ↓
4. IF primeiro acesso:
     → Redireciona /onboarding
     → Upload foto
     → Define nível_experiencia
     → Set onboarding_concluido_em
     → Redireciona /
   ELSE:
     → Redireciona /
   ↓
5. Home exibe trilha do user (filtrada por setor)
```

---

## Fluxo de Aula (Colaborador)

```
1. Clica em módulo "atual" na home
   ↓
2. Navega para /aula/:id
   ↓
3. Frontend busca progresso_aula
   → seek_liberado = false? → Trava player
   → seek_liberado = true?  → Libera player
   ↓
4. Player Panda renderiza
   ← Controles de seek desabilitados
   ← Velocidade travada em 1×
   ↓
5. A cada 10s: heartbeat com intervalo assistido
   → POST /api/heartbeat
   ← Edge Function acumula segmentos
   ← Rejeita avanço > tempo real
   ↓
6. Quando cobertura ≥ 95%:
   → Edge Function seta concluida_em + seek_liberado = true
   → Frontend pode mostrar quiz (se seek_liberado)
   ↓
7. Responde quiz
   → POST respostas (3 questões)
   → GET feedback imediato
   → Calcula pontos_ganhos
   ↓
8. Ao fim do quiz (todas as 3 respondidas):
   → POST conclusoes_modulo
   ↓
9. Tela de resultado
   → Confete
   → Pontos ganhos
   → Botão "Continuar" → voltar home ou ver ranking
   ↓
10. Home atualiza: módulo agora é "concluído", próximo é "atual"
```

---

## Fluxo de Painel do Gestor

```
1. Acessa /gestao
   ↓
2. Frontend carrega:
   → GET vw_kpis_tenant
   → GET vw_progresso_colaborador
   ↓
3. Realtime.onUpdateIn('vw_progresso_colaborador', (payload) => {
     // Atualiza tabela em tempo real quando colaborador conclui módulo
   })
   ↓
4. Gestor clica em colaborador
   → Drilldown: aulas concluídas, acertos, última atividade
   ↓
5. Aba "Cadastro"
   → Lista colaboradores
   → Botão "+ Novo"
   → Form: nome, e-mail, cargo, setor
   → POST profiles (com tenant_id automático)
   ↓
6. Upload de foto
   → Clica em foto do colaborador
   → Supabase Storage
   → PATCH profiles.foto_url
```

---

## Fluxo de Admin (CRUD)

```
/admin/conteudo
├─ Aba "Trilhas"
│  ├─ Lista trilhas
│  ├─ Botão "+ Nova"
│  ├─ Form: nome, descrição, ativa
│  └─ Modal: vincular setores (trilha_setores)
│
├─ Aba "Módulos"
│  ├─ Seleciona trilha
│  ├─ Lista módulos da trilha
│  ├─ Botão "+ Novo"
│  └─ Form: numero, titulo, descricao, capa_url
│
├─ Aba "Aulas"
│  ├─ Seleciona módulo
│  ├─ Lista aulas
│  ├─ Botão "+ Nova"
│  └─ Form: titulo, descricao, panda_video_id, duracao_seg
│
└─ Aba "Questões"
   ├─ Seleciona módulo
   ├─ Lista questões
   ├─ Botão "+ Nova"
   └─ Form: enunciado, alternativas[4], indice_correto, feedback, pontos
```

---

## Estados da Trilha (Home)

Cada módulo tem um estado derivado de `conclusoes_modulo`:

```
concluido  — user tem entrada em conclusoes_modulo para este módulo
   └─ Botão "Revisar" (abre player sem trava, sem quiz)

atual      — é o primeiro módulo sem conclusão
   └─ Botão "Iniciar" (abre player com trava, com quiz)

bloqueado  — vem depois do "atual"
   └─ Desabilitado (sem botão)
```

---

## Detalhes: Heartbeat (Anti-fraude)

**Request:**
```json
{
  "aula_id": "uuid",
  "posicao_atual": 45,
  "intervalo_assistido": [40, 45]
}
```

**Edge Function valida:**
1. `intervalo_assistido` é válido? [inicio, fim]
2. `fim - inicio` ≤ tempo real decorrido desde heartbeat anterior + 5s (folga latência)?
3. `fim` ≤ `duracao_seg` da aula (vem do Panda)?

**Response:**
- 200 OK — intervalo aceito, acumula em segmentos
- 400 Bad Request — intervalo rejeitado, nada muda

**Acúmulo:**
```
Heartbeat 1: [0, 45]       segmentos = [[0, 45]]
Heartbeat 2: [40, 90]      segmentos = [[0, 90]]     (mesclado)
Heartbeat 3: [100, 150]    segmentos = [[0, 90], [100, 150]]
```

Quando `sum(fim - inicio)` ≥ `duracao_seg * 0.95`:
- `concluida_em = now()`
- `seek_liberado = true`
- Quiz pode ser servido

---

## Notificações Realtime

### Para o Gestor

```javascript
const subscription = supabase
  .channel('progresso')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'progresso_aula' },
    (payload) => {
      console.log('Progresso atualizado:', payload)
      // Atualizar tabela
    }
  )
  .subscribe()
```

### Para o Colaborador

```javascript
const subscription = supabase
  .channel('meu-progresso')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'progresso_aula',
      filter: `user_id=eq.${auth.uid()}`
    },
    (payload) => {
      if (payload.new.seek_liberado) {
        // Destravar player, mostrar quiz
      }
    }
  )
  .subscribe()
```

---

## Regra de Ouro: Progressão Linear

Colaborador **não pode** saltar módulos. Só pode:
1. Fazer o módulo "atual"
2. Revisar módulos "concluidos"
3. Não pode tocar em "bloqueado"

Isso é garantido por:
- **RLS no banco** (colaborador vê só trilhas do seu setor)
- **Lógica no front** (desabilita botão se bloqueado)
- **Validação no servidor** (Edge Function rejeita se fora de ordem)

---

## Fallbacks

Se o Panda não conseguir desabilitar seek/velocidade via config:
- Renderizar **overlay transparente** sobre o iframe
- Ouvir `timeupdate` e corrigir `currentTime` se user tentar pular
- Mais frágil, mas viável como último recurso
