import { useEffect, useRef, useState } from 'react'
import { animate, useInView, useReducedMotion } from 'framer-motion'

interface NumeroAnimadoProps {
  /** Valor final. */
  valor: number
  /** Sufixo colado ao número (ex.: "%"). */
  sufixo?: string
  /** Prefixo colado (ex.: "+"). */
  prefixo?: string
  duracao?: number
  className?: string
}

/**
 * Conta de 0 até `valor` quando entra na viewport — uma vez. Respeita
 * prefers-reduced-motion (mostra o valor final direto). Reutiliza o mesmo
 * animate() do framer usado no contador de pontos do mapa.
 */
export function NumeroAnimado({ valor, sufixo = '', prefixo = '', duracao = 1, className }: NumeroAnimadoProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const naTela = useInView(ref, { once: true, margin: '-40px' })
  const reduzir = useReducedMotion()
  const [exibido, setExibido] = useState(0)

  useEffect(() => {
    if (!naTela) return
    if (reduzir) {
      setExibido(valor)
      return
    }
    const controle = animate(0, valor, {
      duration: duracao,
      ease: 'easeOut',
      onUpdate: (v) => setExibido(Math.round(v)),
    })
    return () => controle.stop()
  }, [naTela, valor, duracao, reduzir])

  return (
    <span ref={ref} className={className}>
      {prefixo}
      {exibido}
      {sufixo}
    </span>
  )
}
