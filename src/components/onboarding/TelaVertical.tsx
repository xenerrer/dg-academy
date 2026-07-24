import { cn } from '@/lib/utils'

interface TelaVerticalProps {
  passo: number
  totalPassos: number
  /** Conteúdo do topo — contexto e identidade, nunca ação. */
  children: React.ReactNode
  /** Zona do polegar: tudo que precisa ser tocado mora aqui. */
  acoes: React.ReactNode
  comBackdrop?: boolean
}

/**
 * Casca 9:16 das telas de entrada.
 *
 * Regras estruturais de docs/09-ONBOARDING-E-UX.md §3.1:
 * - referência 390×844, coluna travada em 430px e centrada no desktop
 * - 100dvh, não 100vh: no celular a barra do navegador come o vh
 * - ação primária sempre na zona do polegar (rodapé), contexto no topo
 * - área segura inferior respeitada via env(safe-area-inset-bottom)
 *
 * O traço de progresso é um circuito energizando, não uma barra: os passos
 * concluídos ficam acesos, o atual pulsa, os futuros ficam apagados.
 */
export function TelaVertical({
  passo,
  totalPassos,
  children,
  acoes,
  comBackdrop = false,
}: TelaVerticalProps) {
  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-dg-bg">
      {comBackdrop && (
        <div className="pointer-events-none absolute inset-0">
          <img
            src="/hero-backdrop.jpg"
            alt=""
            aria-hidden
            className="h-full w-full animate-kenburns object-cover brightness-[0.22] contrast-[1.06] saturate-[0.8] motion-reduce:animate-none"
          />
          <div className="absolute inset-0 bg-[radial-gradient(60%_46%_at_50%_30%,rgba(255,218,0,0.10),transparent_70%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-dg-bg/85 via-dg-bg/45 to-dg-bg" />
        </div>
      )}

      <div
        className="relative mx-auto flex min-h-[100dvh] w-full max-w-[430px] flex-col px-6 pt-7"
        style={{ paddingBottom: 'max(34px, env(safe-area-inset-bottom))' }}
      >
        {/* traço de progresso */}
        <div className="mb-8 flex gap-1.5" role="progressbar" aria-valuenow={passo} aria-valuemax={totalPassos}>
          {Array.from({ length: totalPassos }, (_, i) => (
            <span
              key={i}
              className={cn(
                'h-[3px] flex-1 rounded-full transition-colors duration-500',
                i < passo && 'bg-dg-yellow',
                i === passo && 'animate-respira bg-dg-yellow motion-reduce:animate-none',
                i > passo && 'bg-dg-line',
              )}
            />
          ))}
        </div>

        <div className="flex flex-1 flex-col">{children}</div>

        <div className="mt-8 shrink-0 space-y-3">{acoes}</div>
      </div>
    </div>
  )
}
