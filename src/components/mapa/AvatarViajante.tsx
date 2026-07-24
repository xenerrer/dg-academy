import { useEffect } from 'react'
import { animate, motion, useMotionValue, useReducedMotion } from 'framer-motion'
import type { PontoCasa } from '@/lib/mapa'

const TAMANHO = 56
/** O avatar flutua acima da casa, como um pino — a casa continua legível. */
const FLUTUACAO = 46

interface AvatarViajanteProps {
  fotoUrl: string | null
  iniciais: string
  /**
   * Caminho a percorrer. Um ponto só = parado ali; vários = viagem em
   * keyframes (amostrados por comprimento de arco → velocidade constante).
   */
  caminho: PontoCasa[]
  /** Segundos da viagem completa. */
  duracao: number
  onChegada?: () => void
}

const px = (p: PontoCasa) => p.x - TAMANHO / 2
const py = (p: PontoCasa) => p.y - TAMANHO / 2 - FLUTUACAO

/**
 * A foto do colaborador é o elemento móvel do mapa.
 *
 * A posição é dirigida por motion values IMPERATIVOS (animate(x, keyframes)),
 * não por keyframes na prop `animate`. O jeito declarativo trava quando o valor
 * corrente já é igual ao primeiro keyframe (a casa de origem) — o framer
 * entende "sem mudança" e não anima. A forma imperativa sempre dispara.
 *
 * O bob de flutuação vive num wrapper interno: transforms em elementos
 * separados se compõem; no mesmo elemento, o último sobrescreve.
 */
export function AvatarViajante({ fotoUrl, iniciais, caminho, duracao, onChegada }: AvatarViajanteProps) {
  const reduzir = useReducedMotion()
  const inicio = caminho[0] ?? { x: TAMANHO / 2, y: TAMANHO / 2 + FLUTUACAO }
  const x = useMotionValue(px(inicio))
  const y = useMotionValue(py(inicio))

  useEffect(() => {
    if (caminho.length === 0) return

    // parado: só posiciona
    if (caminho.length === 1) {
      x.set(px(caminho[0]))
      y.set(py(caminho[0]))
      return
    }

    // viagem: keyframes imperativos por eixo; onComplete no y avisa a chegada
    const dur = reduzir ? 0 : duracao
    const ax = animate(x, caminho.map(px), { duration: dur, ease: 'easeInOut' })
    const ay = animate(y, caminho.map(py), {
      duration: dur,
      ease: 'easeInOut',
      onComplete: () => onChegada?.(),
    })
    return () => {
      ax.stop()
      ay.stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caminho])

  if (caminho.length === 0) return null

  return (
    <motion.div className="absolute left-0 top-0 z-10" style={{ x, y, width: TAMANHO, height: TAMANHO }}>
      <motion.div
        role="img"
        aria-label="Seu avatar na jornada"
        animate={reduzir ? undefined : { y: [0, -5, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-[3px] border-dg-yellow bg-dg-card2 font-display text-[15px] font-bold text-dg-yellow shadow-[0_10px_30px_rgba(0,0,0,0.55),0_0_24px_rgba(255,218,0,0.25)]"
      >
        {fotoUrl ? <img src={fotoUrl} alt="" className="h-full w-full object-cover" /> : iniciais}
      </motion.div>

      {/* seta de pino apontando para a casa */}
      <span
        aria-hidden
        className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-x-8 border-t-[10px] border-x-transparent border-t-dg-yellow"
      />
    </motion.div>
  )
}
