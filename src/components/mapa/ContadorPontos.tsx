import { useEffect, useRef, useState } from 'react'
import { animate, useReducedMotion } from 'framer-motion'
import { Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ContadorPontosProps {
  valor: number
}

/**
 * Pill de pontos do HUD. Quando `valor` sobe, o número CONTA até o novo total
 * e a pill dá o bump — a reação síncrona de UI da vitória. Sem explicação de
 * pontuação em lugar nenhum: o movimento é a explicação.
 *
 * Acessibilidade: o número que muda a cada frame é aria-hidden. Um live region
 * separado anuncia SÓ o valor final — senão o leitor de tela enfileiraria as
 * dezenas de valores intermediários da contagem.
 */
export function ContadorPontos({ valor }: ContadorPontosProps) {
  const reduzirMovimento = useReducedMotion()
  const [exibido, setExibido] = useState(valor)
  const [anuncio, setAnuncio] = useState(valor)
  const [pulando, setPulando] = useState(false)
  const anteriorRef = useRef(valor)

  useEffect(() => {
    const de = anteriorRef.current
    anteriorRef.current = valor
    if (de === valor) return

    // anuncia o destino uma vez, não cada frame intermediário
    setAnuncio(valor)

    if (reduzirMovimento) {
      setExibido(valor)
      return
    }

    setPulando(true)
    const controle = animate(de, valor, {
      duration: 0.9,
      ease: 'easeOut',
      onUpdate: (v) => setExibido(Math.round(v)),
      onComplete: () => setPulando(false),
    })
    return () => controle.stop()
  }, [valor, reduzirMovimento])

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 rounded-full border border-dg-line bg-dg-bg/70 px-4 py-2.5 font-mono text-[14px] font-bold backdrop-blur',
        pulando && 'animate-bump motion-reduce:animate-none',
      )}
    >
      <Zap className="h-4 w-4 fill-dg-yellow text-dg-yellow" aria-hidden />
      <span aria-hidden>{exibido}</span>
      <span className="sr-only" aria-live="polite">
        {anuncio} pontos
      </span>
    </div>
  )
}
