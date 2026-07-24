import { motion } from 'framer-motion'

const BRILHO = { filter: 'drop-shadow(0 0 6px rgba(255,218,0,0.6))' }

interface SegmentoTrilhaProps {
  /** Path SVG do trecho. */
  d: string
  /** Aceso de forma estática (já percorrido). */
  aceso: boolean
  /** Acendendo agora, junto com o avatar. */
  animando: boolean
  /** Segundos da animação de acender. */
  duracao: number
  registrarRef: (el: SVGPathElement | null) => void
}

/**
 * Um trecho da trilha: o trilho apagado (sempre), a corrente acesa estática
 * (quando percorrido) e a corrente animada (durante a viagem). O ref é o trilho
 * apagado — é dele que o avatar amostra o caminho (getPointAtLength).
 */
export function SegmentoTrilha({ d, aceso, animando, duracao, registrarRef }: SegmentoTrilhaProps) {
  return (
    <g>
      <path d={d} ref={registrarRef} fill="none" stroke="#242424" strokeWidth={4} strokeLinecap="round" />
      {aceso && (
        <path d={d} fill="none" stroke="#FFDA00" strokeWidth={5} strokeLinecap="round" style={BRILHO} />
      )}
      {animando && (
        <motion.path
          d={d}
          fill="none"
          stroke="#FFDA00"
          strokeWidth={5}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: duracao, ease: 'easeInOut' }}
          style={BRILHO}
        />
      )}
    </g>
  )
}
