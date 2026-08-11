import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Check, Lock, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Modulo, StatusModulo } from '@/types/database'
import type { PontoCasa } from '@/lib/mapa'

const TAMANHO = 64

interface CasaModuloProps {
  modulo: Modulo
  status: StatusModulo
  pos: PontoCasa
  /** Índice para o stagger de entrada. */
  ordem: number
  /** A última casa é a certificação — ganha o raio DG em vez do check. */
  ehTopo: boolean
  /** Pulsa a casa na chegada do avatar. */
  celebrar: boolean
  onAbrir: (modulo: Modulo) => void
  registrarRef: (el: HTMLButtonElement | null) => void
}

/**
 * Uma casa da trilha. 64px de toque (regra dos 44px com folga — luva).
 *
 * A caixa é posicionada por left/top explícitos, SEM classes translate:
 * o Framer Motion escreve `transform` inline e atropelaria qualquer
 * -translate-x-1/2 do Tailwind no mesmo elemento.
 *
 * O pulso de chegada (`celebrar`) roda no BOTÃO, não num wrapper: o botão está
 * centrado na própria posição, então scale pulsa no lugar. Num wrapper de
 * altura zero, o transform-origin cairia no topo do mapa e a casa "voaria".
 *
 * O rótulo fica do lado oposto ao desvio da serpente para não cruzar o traço.
 */
export function CasaModulo({
  modulo,
  status,
  pos,
  ordem,
  ehTopo,
  celebrar,
  onAbrir,
  registrarRef,
}: CasaModuloProps) {
  const reduzir = useReducedMotion()
  const [tremendo, setTremendo] = useState(false)
  const bloqueada = status === 'bloqueado'
  const rotuloADireita = pos.x <= 215

  function clicar() {
    if (bloqueada) {
      setTremendo(true)
      setTimeout(() => setTremendo(false), 400)
      return
    }
    onAbrir(modulo)
  }

  return (
    <motion.div
      className="absolute"
      style={{
        left: pos.x - TAMANHO / 2,
        top: pos.y - TAMANHO / 2,
        width: TAMANHO,
        height: TAMANHO,
      }}
      initial={reduzir ? false : { opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={reduzir ? { duration: 0 } : { delay: ordem * 0.07, type: 'spring', stiffness: 260, damping: 22 }}
    >
      <motion.button
        ref={registrarRef}
        onClick={clicar}
        animate={celebrar && !reduzir ? { scale: [1, 1.18, 1] } : { scale: 1 }}
        transition={{ duration: 0.5 }}
        aria-label={`Módulo ${modulo.numero} — ${modulo.titulo} (${
          status === 'concluido'
            ? 'energizado'
            : status === 'atual'
              ? 'atual'
              : status === 'disponivel'
                ? 'disponível'
                : 'bloqueado'
        })`}
        aria-disabled={bloqueada}
        // scroll-margin: foco por teclado não revela a casa rente à borda,
        // atrás do HUD (topo) ou do card (base) fixos
        className={cn(
          'relative flex h-full w-full scroll-mb-40 scroll-mt-24 items-center justify-center rounded-full border-2',
          status === 'concluido' &&
            'border-dg-yellow bg-dg-yellow shadow-[0_0_28px_rgba(255,218,0,0.35)]',
          status === 'atual' && 'border-dg-yellow bg-dg-card2',
          status === 'disponivel' && 'border-dg-yellow/40 bg-dg-card2',
          bloqueada && 'border-dg-line bg-dg-card opacity-60',
          tremendo && 'animate-shake motion-reduce:animate-none',
        )}
      >
        {status === 'atual' && (
          <span
            aria-hidden
            className="absolute -inset-1.5 animate-respira rounded-full border-2 border-dg-yellow motion-reduce:animate-none"
          />
        )}

        {status === 'concluido' ? (
          ehTopo ? (
            <Zap className="h-7 w-7 fill-[#111] text-[#111]" />
          ) : (
            <Check className="h-7 w-7 text-[#111]" strokeWidth={3} />
          )
        ) : bloqueada ? (
          <Lock className="h-5 w-5 text-dg-muted" />
        ) : (
          <span className="font-display text-xl font-bold text-dg-yellow">{modulo.numero}</span>
        )}
      </motion.button>

      <span
        className={cn(
          'pointer-events-none absolute top-1/2 w-[128px] -translate-y-1/2 text-[12px] font-semibold leading-tight',
          rotuloADireita ? 'left-[76px] text-left' : 'right-[76px] text-right',
          status === 'concluido' && 'text-dg-text',
          status === 'atual' && 'text-dg-yellow',
          status === 'disponivel' && 'text-dg-text',
          bloqueada && 'text-dg-muted',
        )}
      >
        {modulo.titulo}
      </span>
    </motion.div>
  )
}
