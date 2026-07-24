# Especificação: Panda Video + Trava de Avanço

---

## Embed Básico

```html
<iframe
  allow="autoplay"
  frameborder="0"
  height="100%"
  width="100%"
  src="https://player.pandavideo.com.br/player.html?id=PANDA_VIDEO_ID&token=TOKEN"
></iframe>
```

**Onde:**
- `PANDA_VIDEO_ID` — armazenado em `aulas.panda_video_id`
- `TOKEN` — gerado pela conta Panda (domínio restrito, link assinado)

---

## Capacidades Necessárias

Validar na documentação do Panda **antes de codar:**

### 1. Desabilitar Seek/Scrubbing

```javascript
// Pseudo-código — ajustar conforme API real do Panda
const player = new Panda.Player({
  id: 'PANDA_VIDEO_ID',
  controls: {
    seek: false,          // ← desabilita barra de progresso
    scrubbing: false      // ← desabilita drag
  }
})
```

Se não conseguir via config:
- **Fallback:** overlay transparente sobre iframe
- Rejeitar clicks que tentam pular
- Corrigir `currentTime` se user forçar

### 2. Travar Velocidade em 1×

```javascript
const player = new Panda.Player({
  id: 'PANDA_VIDEO_ID',
  playbackRate: 1.0,
  allowPlaybackRateChange: false  // ← não deixa user mudar
})
```

Se não conseguir:
- **Fallback:** monitorar evento `playbackratechange` e corrigir
- Menos ideal, mas viável

### 3. Eventos de Progresso

Precisa escutar eventos que o player emite:

```javascript
player.on('timeupdate', (event) => {
  // event.currentTime — posição atual em segundos
})

player.on('play', () => {})
player.on('pause', () => {})
player.on('ended', () => {})
```

Se o player não emitir `timeupdate`:
- **Fallback:** polling com `setInterval` a cada 1s
- Menos exato, mas funciona

---

## Implementação: PandaPlayer.tsx

```typescript
import { useEffect, useRef, useState } from 'react'
import { enviarHeartbeat } from '@/lib/api'

interface PandaPlayerProps {
  pandaVideoId: string
  duration: number
  onCompleted: () => void
}

export function PandaPlayer({ pandaVideoId, duration, onCompleted }: PandaPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [seekLiberado, setSekLiberado] = useState(false)
  const ultimoHeartbeatRef = useRef<number>(0)

  useEffect(() => {
    if (!iframeRef.current) return

    const iframe = iframeRef.current
    let player: any

    // Aguardar player estar pronto
    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== 'https://player.pandavideo.com.br') return

      if (event.data.action === 'onReady') {
        player = event.data.player
      }

      if (event.data.action === 'onTimeUpdate') {
        const currentTime = event.data.currentTime
        const now = Date.now()

        // Heartbeat a cada 10s
        if (now - ultimoHeartbeatRef.current > 10000) {
          ultimoHeartbeatRef.current = now

          // Calcular intervalo assistido (aproximação)
          const intervalo: [number, number] = [
            Math.floor(currentTime - 1),
            Math.floor(currentTime)
          ]

          const result = await enviarHeartbeat({
            aula_id: pandaVideoId,
            posicao_atual: currentTime,
            intervalo_assistido: intervalo
          })

          if (!result.ok) {
            console.error('Heartbeat falhou:', result.error)
          }
        }
      }

      if (event.data.action === 'onEnded') {
        onCompleted()
      }

      // Rejeitar tentativa de pular (se seek_liberado = false)
      if (event.data.action === 'onSeeking' && !seekLiberado) {
        // Corrigir currentTime para onde estava
        iframe.contentWindow?.postMessage({ action: 'seek', time: ultimoHeartbeatRef.current }, '*')
      }
    }

    window.addEventListener('message', handleMessage)

    return () => window.removeEventListener('message', handleMessage)
  }, [pandaVideoId, seekLiberado])

  return (
    <div className="aspect-video bg-dg-card rounded-surface overflow-hidden">
      <iframe
        ref={iframeRef}
        allow="autoplay"
        frameborder="0"
        height="100%"
        width="100%"
        src={`https://player.pandavideo.com.br/player.html?id=${pandaVideoId}&controls=1&seek=${seekLiberado ? '1' : '0'}&speed=1`}
        className="w-full h-full"
      />
    </div>
  )
}
```

---

## Fluxo de Desbloqueio

```
[Começa aula]
  ↓
[PandaPlayer renderiza com seek=0]
  ↓
[User tenta pular]
  ↓
[Player rejeita ou overlay bloqueia]
  ↓
[Heartbeats vão mandando intervalos]
  ↓
[Edge Function acumula: 174s / 204s = 85%]
  ↓
[User continua assistindo...]
  ↓
[Edge Function: 194s / 204s = 95%] ✓
  └─ Set concluida_em
  └─ Set seek_liberado = true
  └─ UPDATE progresso_aula
  ↓
[Frontend recebe Realtime UPDATE]
  ↓
[setPandaPlayerConfig({ seek: 1 })]
  ↓
[User agora consegue pular]
  ↓
[Quando acabar ou user clicar "Quiz"]
  ↓
[PandaPlayer.onCompleted()]
  ↓
[Renderiza QuizCard]
```

---

## Validação Panda (TODO)

**Antes de escrever um linha de código:**

- [ ] Ler documentação oficial do Panda Player API
- [ ] Confirmar: desabilita seek? (SIM/NÃO)
- [ ] Confirmar: trava velocidade? (SIM/NÃO)
- [ ] Confirmar: emite `timeupdate`? (SIM/NÃO)
- [ ] Testar com vídeo dummy no Panda de teste
- [ ] Validar eventos que player emite
- [ ] Documentar qualquer gotcha (ex: rate limiting de eventos)

Se alguma for NÃO:
- Documentar fallback
- Avisar ao Danilo o impacto na segurança

---

## Dicas de Implementação

### Heartbeat preciso

Não usar `setInterval` — é impreciso. Escutar `timeupdate` do player:

```javascript
player.on('timeupdate', (event) => {
  const agora = Date.now()
  const tempoDesdeUltimo = agora - ultimoHeartbeatRef.current

  if (tempoDesdeUltimo > 10000) {
    enviarHeartbeat(...)
    ultimoHeartbeatRef.current = agora
  }
})
```

### Teste sem Panda

Enquanto a conta não estiver assinada:
- Renderizar `<video>` HTML5 dummy
- Emitir eventos fake via script
- Validar lógica de anti-fraude

```typescript
// Mock para teste
const VIDEO_DUMMY = '/test-video.mp4'

export function PandaPlayerMock() {
  return (
    <video
      controls
      style={{ width: '100%', height: '100%' }}
      src={VIDEO_DUMMY}
      onPlay={() => console.log('play')}
      onTimeUpdate={(e) => console.log('time:', e.currentTarget.currentTime)}
      onEnded={() => console.log('ended')}
    />
  )
}
```

### Taxa de heartbeat

Recomendado: 1 heartbeat a cada 10-15s
- Menos: mais tráfego, resposta mais rápida
- Mais: menos tráfego, resposta mais lenta

Com 10s: ~1.8 KB/min por user (negligenciável)

### Segurança do token

- Token gerado no servidor (nunca no client)
- Domínio restrito (Panda Player só funciona em `dgtech.lucasschoenherr.com.br`)
- Link assinado com expiration (ex: 24h)
- Revalidar a cada carregamento da página

```typescript
// No servidor (Supabase Edge Function)
const token = await gerarTokenPanda(aula_id, user_id)
// Response: { url_com_token }

// No cliente
<iframe src={url_com_token} />
```
