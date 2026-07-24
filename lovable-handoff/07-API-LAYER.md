# Camada de API

**Contrato que nunca muda** — assinaturas fixas em `src/lib/api.ts`.

Hoje chamam `src/mocks/dados.ts`. Quando Supabase entrar, viram queries. Nenhum componente muda.

---

## Assinaturas

```typescript
// ── Autenticação ─────────────────────────────────────────
export async function obterUsuarioAtual(): Promise<Profile>

export async function logout(): Promise<void>

// ── Trilha ───────────────────────────────────────────────
export async function obterTrilha(): Promise<Trilha | null>

export async function listarSetores(): Promise<Setor[]>

export async function listarModulos(trilhaId: string): Promise<Modulo[]>

export async function obterModulo(moduloId: string): Promise<Modulo | null>

// ── Aulas ────────────────────────────────────────────────
export async function obterAulaDoModulo(moduloId: string): Promise<Aula | null>

export async function obterProgressoAula(
  userId: string,
  aulaId: string
): Promise<ProgressoAula | null>

// ── Quiz ─────────────────────────────────────────────────
export async function listarQuestoes(moduloId: string): Promise<Questao[]>

export async function enviarResposta(
  questaoId: string,
  indiceEscolhido: number
): Promise<Resposta>

export async function concluirModulo(
  moduloId: string,
  acertos: number,
  total: number
): Promise<ConclusaoModulo>

export async function listarConclusoes(userId: string): Promise<ConclusaoModulo[]>

// ── Progresso ────────────────────────────────────────────
export function calcularStatusModulos(
  modulos: { id: string }[],
  conclusoes: { modulo_id: string }[]
): Record<string, StatusModulo>

// ── Painel de Gestão ─────────────────────────────────────
export async function listarRanking(): Promise<RankingColaborador[]>

export async function listarProgresso(): Promise<ProgressoColaborador[]>

export async function listarColaboradores(): Promise<Profile[]>

export async function criarColaborador(dados: {
  nome: string
  email: string
  cargo?: string
  setor_id?: string
}): Promise<Profile>

export async function atualizarColaborador(
  userId: string,
  dados: Partial<Profile>
): Promise<Profile>

export async function uploadFotoPerfil(userId: string, file: File): Promise<string>

// ── Onboarding ──────────────────────────────────────────
export async function salvarOnboarding(dados: {
  foto_url: string | null
  nivel_experiencia: NivelExperiencia | null
}): Promise<void>
```

---

## Implementação Atual (Mocks)

Cada função lê de `src/mocks/dados.ts` e simula latência de 200-400ms:

```typescript
// Exemplo: listarModulos
export async function listarModulos(trilhaId: string) {
  await new Promise(resolve => setTimeout(resolve, 220))
  return MODULOS.filter(m => m.trilha_id === trilhaId)
}

// Exemplo: calcularStatusModulos (síncrono)
export function calcularStatusModulos(modulos, conclusoes) {
  const concluidos = new Set(conclusoes.map(c => c.modulo_id))
  let achouAtual = false
  
  return modulos.reduce((acc, modulo) => {
    if (concluidos.has(modulo.id)) {
      acc[modulo.id] = 'concluido'
    } else if (!achouAtual) {
      acc[modulo.id] = 'atual'
      achouAtual = true
    } else {
      acc[modulo.id] = 'bloqueado'
    }
    return acc
  }, {})
}
```

---

## Transição para Supabase

Quando o Supabase estiver pronto:

```typescript
// Exemplo: listarModulos vira query
export async function listarModulos(trilhaId: string) {
  const { data, error } = await supabase
    .from('modulos')
    .select('*')
    .eq('trilha_id', trilhaId)
    .order('ordem')
  
  if (error) throw error
  return data
}

// Exemplo: obterUsuarioAtual vira getUser
export async function obterUsuarioAtual() {
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError) throw authError
  
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  if (profileError) throw profileError
  return profile
}

// Exemplo: enviarResposta vira insert
export async function enviarResposta(questaoId, indiceEscolhido) {
  const user = await obterUsuarioAtual()
  
  const { data, error } = await supabase
    .from('respostas')
    .insert({
      questao_id: questaoId,
      indice_escolhido: indiceEscolhido,
      correta: /* calcular */,
      tenant_id: user.tenant_id,
      user_id: user.id,
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}
```

---

## Heartbeat de Progresso

Chamado do componente `PandaPlayer.tsx` a cada ~10s:

```typescript
export async function enviarHeartbeat(payload: {
  aula_id: string
  posicao_atual: number
  intervalo_assistido: [number, number]
}): Promise<{ ok: boolean; error?: string }> {
  const response = await fetch('/api/heartbeat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  
  if (!response.ok) {
    return { ok: false, error: await response.text() }
  }
  
  return { ok: true }
}
```

**Edge Function** (Supabase):
```typescript
// supabase/functions/heartbeat/index.ts
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 })
  
  const { aula_id, posicao_atual, intervalo_assistido } = await req.json()
  
  // Validar intervalo
  const [inicio, fim] = intervalo_assistido
  if (fim - inicio > 15) {
    // Folga de 15s para latência
    return new Response('Avanço inválido', { status: 400 })
  }
  
  const supabase = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'))
  
  // Buscar aula para validar duração
  const { data: aula, error: aulaError } = await supabase
    .from('aulas').select('duracao_seg').eq('id', aula_id).single()
  
  if (aulaError || fim > aula.duracao_seg) {
    return new Response('Aula inválida', { status: 400 })
  }
  
  // Buscar progresso atual
  const { data: progresso, error: progresoError } = await supabase
    .from('progresso_aula')
    .select('segmentos, atualizado_em')
    .eq('aula_id', aula_id)
    .eq('user_id', req.headers.get('x-user-id'))
    .single()
  
  // Acumular segmentos
  const novoSegmento = [inicio, fim]
  const segmentosAcumulados = mergeSegmentos([...progresso?.segmentos || [], novoSegmento])
  const segundosAssistidos = somaSegmentos(segmentosAcumulados)
  
  // Verificar se 95% foi assistido
  const percentual = (segundosAssistidos / aula.duracao_seg) * 100
  const concluido = percentual >= 95
  
  // Atualizar progresso
  await supabase.from('progresso_aula').upsert({
    aula_id,
    user_id: req.headers.get('x-user-id'),
    segmentos: segmentosAcumulados,
    segundos_assistidos: segundosAssistidos,
    seek_liberado: concluido,
    concluida_em: concluido ? new Date().toISOString() : null,
  })
  
  return new Response(JSON.stringify({ ok: true, percentual }))
})

// Helpers
function mergeSegmentos(segs) {
  // Mesclar intervalos sobrepostos
  return segs.sort().reduce((acc, [a, b]) => {
    const last = acc[acc.length - 1]
    if (last && a <= last[1]) {
      last[1] = Math.max(last[1], b)
    } else {
      acc.push([a, b])
    }
    return acc
  }, [])
}

function somaSegmentos(segs) {
  return segs.reduce((sum, [a, b]) => sum + (b - a), 0)
}
```

---

## Dados em Tempo Real

Usar TanStack Query + Supabase Realtime:

```typescript
// Hook customizado
export function useProgressoRealtime(userId: string) {
  const { data: progresso } = useQuery({
    queryKey: ['progresso', userId],
    queryFn: () => listarProgresso(),
  })
  
  useEffect(() => {
    const subscription = supabase
      .channel('progresso-' + userId)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'progresso_aula',
          filter: `user_id=eq.${userId}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['progresso', userId] })
        }
      )
      .subscribe()
    
    return () => subscription.unsubscribe()
  }, [userId])
  
  return progresso
}
```

---

## Erros e Retry

Usar TanStack Query com retry automático:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 min
    },
  },
})
```

Erros tratados no componente:
```typescript
const { data, error, isPending } = useQuery({...})

if (error) {
  return <div className="text-dg-danger">Erro ao carregar: {error.message}</div>
}

if (isPending) {
  return <div>Carregando...</div>
}
```
