import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

export interface CanvasVitoriaHandle {
  /** Dispara a celebração a partir de um ponto em coordenadas de viewport. */
  disparar: (x: number, y: number) => void
}

interface Particula {
  x: number
  y: number
  vx: number
  vy: number
  tamanho: number
  rotacao: number
  vRotacao: number
  cor: string
  gravidade: number
  vida: number
  tipo: 'confete' | 'faisca'
}

/** Cores do confete do protótipo aprovado pelo cliente. */
const CORES = ['#FFDA00', '#FFE9B8', '#FFFFFF', '#3ED47A']

/**
 * Confete + faíscas da vitória. Física portada do protótipo do Guto
 * (fontes/artefato), adaptada para origem em ponto arbitrário — o burst nasce
 * na casa em que o avatar acabou de pousar, não no centro da tela.
 *
 * As "faíscas" radiais amarelas são os fogos de artifício na estética da
 * marca: eletricidade, não pólvora.
 */
export const CanvasVitoria = forwardRef<CanvasVitoriaHandle>(function CanvasVitoria(_, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef(0)

  useImperativeHandle(ref, () => ({
    disparar(x, y) {
      const canvas = canvasRef.current
      if (!canvas) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const particulas: Particula[] = [
        // confete: sobe e cai com gravidade, girando
        ...Array.from({ length: 90 }, (): Particula => ({
          x: x + (Math.random() - 0.5) * 40,
          y,
          vx: (Math.random() - 0.5) * 11,
          vy: -Math.random() * 12 - 4,
          tamanho: Math.random() * 6 + 3,
          rotacao: Math.random() * Math.PI,
          vRotacao: (Math.random() - 0.5) * 0.3,
          cor: CORES[(Math.random() * CORES.length) | 0],
          gravidade: 0.32 + Math.random() * 0.1,
          vida: 1,
          tipo: 'confete',
        })),
        // faíscas: burst radial curto, sempre amarelo
        ...Array.from({ length: 26 }, (): Particula => {
          const angulo = Math.random() * Math.PI * 2
          const forca = Math.random() * 7 + 3
          return {
            x,
            y,
            vx: Math.cos(angulo) * forca,
            vy: Math.sin(angulo) * forca,
            tamanho: Math.random() * 2 + 1,
            rotacao: angulo,
            vRotacao: 0,
            cor: '#FFDA00',
            gravidade: 0.06,
            vida: 1,
            tipo: 'faisca',
          }
        }),
      ]

      let quadro = 0
      cancelAnimationFrame(rafRef.current)

      const loop = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        for (const p of particulas) {
          p.x += p.vx
          p.y += p.vy
          p.vy += p.gravidade
          p.rotacao += p.vRotacao
          if (p.tipo === 'faisca') p.vida -= 0.03

          ctx.save()
          ctx.globalAlpha = Math.max(0, p.vida)
          ctx.translate(p.x, p.y)
          ctx.rotate(p.rotacao)
          ctx.fillStyle = p.cor
          if (p.tipo === 'confete') {
            ctx.fillRect(-p.tamanho / 2, -p.tamanho / 2, p.tamanho, p.tamanho * 0.6)
          } else {
            ctx.fillRect(0, -p.tamanho / 2, p.tamanho * 4, p.tamanho)
          }
          ctx.restore()
        }
        if (++quadro < 130) {
          rafRef.current = requestAnimationFrame(loop)
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
        }
      }
      loop()
    },
  }))

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-50"
    />
  )
})
