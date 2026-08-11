/**
 * ============================================================================
 * PLAYER — ponto de integração com o Panda Video
 * ============================================================================
 *
 * Este é o único arquivo do projeto que sabe que o Panda existe. Todo o resto
 * conversa por props e callbacks. Manter assim.
 *
 * ⚠️ REGRA DE PRODUTO — não mover para o front:
 *
 * A trava de avanço ("na primeira visualização não dá pra pular") tem duas
 * camadas. A camada de UX é o embed do Panda, enquanto `seekLiberado` for
 * falso: `disableForward` recusa o arrasto/clique/seta-do-teclado pra frente
 * OU pra trás, e `controls` some com a barra de progresso e os botões de
 * avançar/retroceder — não é só bloquear o gesto, é tirar o afordance de tela
 * inteiro (testado manualmente contra clique, arrasto, seta e duplo-clique).
 * Mas a decisão que VALE pra liberar o módulo é do SERVIDOR: a Edge Function
 * de heartbeat acumula os intervalos assistidos (via onProgresso) e rejeita
 * saltos maiores que o tempo real decorrido. Se essa validação migrar pra cá,
 * qualquer pessoa com o DevTools aberto burla a trava — e o relatório que o
 * gestor usa pra decidir vira ficção.
 *
 * ============================================================================
 * Integração via Panda Player API (script oficial `api.v2.js`), documentada em
 * https://docs.pandavideo.com/reference/player-api e
 * https://docs.pandavideo.com/reference/receive-events — eventos consumidos:
 * `panda_timeupdate` (progresso) e `panda_ended` (conclusão).
 * ============================================================================
 */

import { useEffect, useRef, useState } from 'react'
import { formatarTempo } from '@/lib/utils'

/** Subdomínio do player é por conta do cliente no Panda — fixo pro tenant DG Tech. */
export const PANDA_EMBED_HOST = 'https://player-vz-7716ee52-705.tv.pandavideo.com.br'
const PANDA_API_SRC = 'https://player.pandavideo.com.br/api.v2.js'

/** Sem "progress"/"current-time"/"rewind"/"fast-forward": zero afordance de avanço na tela. */
const CONTROLES_SEM_AVANCO = 'play,volume,captions,settings,pip,cast,fullscreen'

interface PandaEvento {
  message: string
  currentTime?: number
}

interface PandaInstancia {
  onEvent: (callback: (evento: PandaEvento) => void) => void
  getDuration: () => number
  play: () => void
  destroy: () => void
}

declare global {
  interface Window {
    pandascripttag?: Array<() => void>
    PandaPlayer: new (
      elementId: string,
      opcoes: { onReady?: () => void; onError?: (evento: unknown) => void },
    ) => PandaInstancia
  }
}

let scriptDoPandaCarregado: Promise<void> | null = null

/** Garante um único <script> do Panda na página, mesmo com vários players montando. */
function carregarScriptDoPanda(): Promise<void> {
  if (window.PandaPlayer) return Promise.resolve()
  if (scriptDoPandaCarregado) return scriptDoPandaCarregado

  scriptDoPandaCarregado = new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = PANDA_API_SRC
    script.async = true
    script.addEventListener('load', () => resolve(), { once: true })
    document.body.appendChild(script)
  })
  return scriptDoPandaCarregado
}

interface PandaPlayerProps {
  /** ID (UUID) do vídeo no Panda. Nulo enquanto o cliente não subir o vídeo. */
  pandaVideoId: string | null
  duracaoSeg: number
  /** Se o servidor já liberou navegação livre (aula concluída antes). */
  seekLiberado: boolean
  /** Chamado a cada atualização de progresso do player. Vira o heartbeat para a Edge Function. */
  onProgresso?: (segundoAtual: number) => void
  onConcluir?: () => void
}

export function PandaPlayer({
  pandaVideoId,
  duracaoSeg,
  seekLiberado,
  onProgresso,
  onConcluir,
}: PandaPlayerProps) {
  const [duracaoReal, setDuracaoReal] = useState(duracaoSeg)
  const concluiuRef = useRef(false)
  const onProgressoRef = useRef(onProgresso)
  const onConcluirRef = useRef(onConcluir)
  onProgressoRef.current = onProgresso
  onConcluirRef.current = onConcluir

  const elementId = pandaVideoId ? `panda-${pandaVideoId}` : ''

  useEffect(() => {
    if (!pandaVideoId) return
    concluiuRef.current = false
    let instancia: PandaInstancia | null = null
    let cancelado = false

    carregarScriptDoPanda().then(() => {
      if (cancelado) return
      window.pandascripttag = window.pandascripttag ?? []
      window.pandascripttag.push(() => {
        // Troca rápida de aula/módulo pode desmontar o <iframe> antes desse
        // callback assíncrono rodar. O SDK do Panda não lida bem com o
        // elemento sumido (lança "element not found" fora de qualquer
        // try/catch nosso) — sem essa checagem, isso derruba a página
        // inteira, sem barreira de erro (foi exatamente o bug reportado:
        // tela preta ao trocar de módulo).
        if (cancelado || !document.getElementById(elementId)) return
        try {
          instancia = new window.PandaPlayer(elementId, {
            onReady: () => {
              if (cancelado || !instancia) return
              const duracao = instancia.getDuration()
              if (duracao > 0) setDuracaoReal(duracao)

              instancia.onEvent(({ message, currentTime }) => {
                if (message === 'panda_timeupdate' && typeof currentTime === 'number') {
                  onProgressoRef.current?.(Math.floor(currentTime))
                }
                if (message === 'panda_ended' && !concluiuRef.current) {
                  concluiuRef.current = true
                  onConcluirRef.current?.()
                }
              })
            },
            onError: () => {
              // Falha do player (ex.: vídeo removido no Panda) não deve
              // derrubar a página — o usuário só vê o placeholder por baixo.
            },
          })
        } catch {
          // ver comentário acima — elemento sumiu entre o check e a criação
        }
      })
    })

    return () => {
      cancelado = true
      try {
        instancia?.destroy?.()
      } catch {
        // mesmo motivo: o SDK pode falhar ao limpar um elemento já removido
      }
    }
  }, [pandaVideoId, elementId])

  if (!pandaVideoId) {
    return (
      <div className="relative flex aspect-video max-h-[560px] items-center justify-center overflow-hidden rounded-xl border border-dg-line bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(560px_320px_at_72%_18%,rgba(255,218,0,0.11),transparent_62%),linear-gradient(160deg,#151515,#080808)]" />
        <span className="relative dg-eyebrow text-dg-muted">Aguardando vídeo do Panda</span>
      </div>
    )
  }

  const src = `${PANDA_EMBED_HOST}/embed/?v=${pandaVideoId}${
    seekLiberado ? '' : `&disableForward=true&controls=${CONTROLES_SEM_AVANCO}`
  }`

  return (
    <div className="relative aspect-video max-h-[560px] overflow-hidden rounded-xl border border-dg-line bg-black">
      <iframe
        id={elementId}
        key={elementId}
        src={src}
        style={{ border: 'none' }}
        className="absolute inset-0 h-full w-full"
        allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture"
        allowFullScreen
      />
      <span className="sr-only">Duração: {formatarTempo(duracaoReal)}</span>
    </div>
  )
}
