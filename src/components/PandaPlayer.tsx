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
 * A trava de avanço ("na primeira visualização não dá pra pular") é validada
 * NO SERVIDOR, por decisão de produto. O componente aqui só:
 *   1. esconde os controles de seek,
 *   2. reporta progresso via onProgresso a cada ~10s.
 *
 * Quem decide se a aula foi concluída é a Edge Function de heartbeat, que
 * acumula os intervalos assistidos e rejeita saltos maiores que o tempo real
 * decorrido. Se essa lógica migrar para cá, qualquer pessoa com o DevTools
 * aberto burla a trava — e o relatório que o gestor usa para decidir vira
 * ficção. O valor inteiro do produto depende disso.
 *
 * ============================================================================
 * ESTADO ATUAL: placeholder.
 *
 * O embed real do Panda ainda não foi implementado porque falta validar três
 * capacidades na documentação deles (ver docs/07-DECISOES-ABERTAS.md item 1):
 *   - desabilitar seek via configuração do player
 *   - travar velocidade em 1x
 *   - emitir eventos de progresso consumíveis por JS
 *
 * Enquanto isso, este componente simula a reprodução com um timer, mantendo
 * exatamente o mesmo contrato de props. Trocar a simulação pelo embed do Panda
 * não deve exigir mudança em nenhum outro arquivo.
 * ============================================================================
 */

import { useEffect, useRef, useState } from 'react'
import { Lock, Play, Zap } from 'lucide-react'
import { formatarTempo } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'

interface PandaPlayerProps {
  /** ID do vídeo no Panda. Nulo enquanto o cliente não subir os vídeos. */
  pandaVideoId: string | null
  duracaoSeg: number
  /** Se o servidor já liberou navegação livre (aula concluída antes). */
  seekLiberado: boolean
  /** Chamado a cada tick de progresso. Vira o heartbeat para a Edge Function. */
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
  const [tocando, setTocando] = useState(false)
  const [posicao, setPosicao] = useState(0)
  const [avisoSeek, setAvisoSeek] = useState(false)
  const concluiuRef = useRef(false)
  const posicaoRef = useRef(0)

  /**
   * Callbacks guardados em ref para não entrarem nas dependências do efeito.
   *
   * Sem isso, um pai que passe `onProgresso={(s) => ...}` inline recria a função
   * a cada render, o efeito é desmontado e remontado, e o setInterval reinicia
   * antes de completar 1s — o player simplesmente nunca avança. Já aconteceu
   * aqui; não voltar atrás.
   */
  const onProgressoRef = useRef(onProgresso)
  const onConcluirRef = useRef(onConcluir)
  onProgressoRef.current = onProgresso
  onConcluirRef.current = onConcluir

  useEffect(() => {
    if (!tocando) return

    // Efeitos colaterais (reportar progresso, avisar conclusão) rodam AQUI, no
    // callback do interval — não dentro do updater de setPosicao. Chamar o
    // setState do pai (onConcluir) de dentro de um updater dispara o aviso
    // "Cannot update a component while rendering a different component".
    const intervalo = setInterval(() => {
      const proximo = Math.min(posicaoRef.current + 1, duracaoSeg)
      posicaoRef.current = proximo
      setPosicao(proximo)
      onProgressoRef.current?.(proximo)

      if (proximo >= duracaoSeg && !concluiuRef.current) {
        concluiuRef.current = true
        setTocando(false)
        onConcluirRef.current?.()
      }
    }, 1000)

    return () => clearInterval(intervalo)
  }, [tocando, duracaoSeg])

  function tentarSeek() {
    if (seekLiberado) return
    setAvisoSeek(true)
    setTimeout(() => setAvisoSeek(false), 2100)
  }

  const percentual = duracaoSeg > 0 ? (posicao / duracaoSeg) * 100 : 0

  return (
    <div className="relative aspect-video max-h-[560px] overflow-hidden rounded-xl border border-dg-line bg-black">
      {/* Placeholder visual — sai quando o embed do Panda entrar */}
      <div className="absolute inset-0 bg-[radial-gradient(560px_320px_at_72%_18%,rgba(255,218,0,0.11),transparent_62%),linear-gradient(160deg,#151515,#080808)]" />

      <div className="absolute inset-x-0 top-0 flex flex-col items-center gap-2 px-8 pt-10 text-center">
        <span className="dg-eyebrow text-dg-yellow">
          {pandaVideoId ? `Panda · ${pandaVideoId}` : 'Aguardando vídeo do Panda'}
        </span>
        <p className="max-w-md text-xs leading-relaxed text-dg-muted">
          O embed real entra aqui. A simulação existe só para exercitar o fluxo de progresso
          enquanto a conta do Panda não está ativa.
        </p>
      </div>

      {!tocando && posicao === 0 && (
        <button
          onClick={() => setTocando(true)}
          aria-label="Reproduzir"
          className="absolute inset-0 z-10 m-auto flex h-[74px] w-[74px] items-center justify-center rounded-full bg-dg-yellow transition hover:scale-110 hover:shadow-[0_0_46px_rgba(255,218,0,0.4)]"
        >
          <Play className="h-6 w-6 fill-[#111] text-[#111]" />
        </button>
      )}

      {avisoSeek && (
        <div className="absolute bottom-16 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-control border border-dg-yellow/50 bg-dg-bg px-4 py-2 text-xs font-semibold">
          <Zap className="h-3.5 w-3.5 fill-dg-yellow text-dg-yellow" />
          <span>
            <b className="text-dg-yellow">Visualização monitorada</b> — não é possível avançar
          </span>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/90 to-transparent px-4 pb-3.5 pt-3">
        <div onClick={tentarSeek} className={seekLiberado ? 'cursor-pointer' : 'cursor-not-allowed'}>
          <Progress valor={percentual} />
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-[11.5px] text-dg-muted">
            {formatarTempo(posicao)} / {formatarTempo(duracaoSeg)}
          </span>
          {!seekLiberado && (
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-dg-yellow">
              <Lock className="h-3 w-3" /> Reprodução contínua obrigatória
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
