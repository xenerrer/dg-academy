import { useRef } from 'react'
import { Camera } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { TelaVertical } from './TelaVertical'

interface PassoCrachaProps {
  nome: string
  fotoUrl: string | null
  onFoto: (dataUrl: string) => void
  onAvancar: () => void
}

/**
 * Passo 1 — "Energize seu crachá".
 *
 * Composição (docs/09-ONBOARDING-E-UX.md §3.3): o círculo do avatar é grande e
 * DESCENTRADO à esquerda; o nome corre na vertical à direita, rotacionado, em
 * mono com tracking largo. Nada de retrato centralizado com legenda embaixo —
 * é justamente o arranjo que faz tudo parecer formulário.
 *
 * O anel respira enquanto está vazio (chama o toque) e acende girando quando a
 * foto entra. A foto é o dado que mais personaliza por menos esforço.
 */
export function PassoCracha({ nome, fotoUrl, onFoto, onAvancar }: PassoCrachaProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  function aoEscolher(evento: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = evento.target.files?.[0]
    if (!arquivo) return
    const leitor = new FileReader()
    leitor.onload = (e) => onFoto(e.target?.result as string)
    leitor.readAsDataURL(arquivo)
  }

  return (
    <TelaVertical
      passo={0}
      totalPassos={2}
      comBackdrop
      acoes={
        <>
          <Button
            size="lg"
            className="h-14 w-full"
            onClick={() => (fotoUrl ? onAvancar() : inputRef.current?.click())}
          >
            {fotoUrl ? 'Continuar' : 'Tirar foto'}
            {!fotoUrl && <Camera className="h-4 w-4" />}
          </Button>
          {fotoUrl && (
            <button
              onClick={() => inputRef.current?.click()}
              className="h-11 w-full text-[12.5px] text-dg-muted underline-offset-4 hover:text-dg-yellow hover:underline"
            >
              Trocar foto
            </button>
          )}
        </>
      }
    >
      <p className="dg-eyebrow mb-9">Primeiro acesso</p>

      {/* bloco descentrado: círculo à esquerda, nome vertical à direita */}
      <div className="flex flex-1 items-center gap-5">
        <button
          onClick={() => inputRef.current?.click()}
          className="relative h-[180px] w-[180px] shrink-0 -translate-x-1"
          aria-label="Enviar foto de perfil"
        >
          {fotoUrl ? (
            <span className="absolute -inset-1 animate-gira rounded-full bg-[conic-gradient(#FFDA00,#7a6800,#FFDA00)] motion-reduce:animate-none" />
          ) : (
            <span className="absolute -inset-1 animate-respira rounded-full border-2 border-dg-yellow motion-reduce:animate-none" />
          )}

          <span className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full border border-dg-line bg-dg-card2">
            {fotoUrl ? (
              <img src={fotoUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <Camera className="h-8 w-8 text-dg-muted" />
            )}
          </span>
        </button>

        <div className="min-w-0 flex-1">
          <h1
            className="font-mono text-[13px] font-bold uppercase leading-none tracking-[0.34em] text-dg-text"
            style={{ writingMode: 'vertical-rl' }}
          >
            {nome}
          </h1>
        </div>
      </div>

      <div className="mt-8">
        <h2
          className={cn(
            'font-display text-[30px] font-bold leading-[1.05]',
            'transition-opacity duration-500',
          )}
        >
          Energize
          <br />
          seu <span className="text-dg-yellow">crachá</span>
        </h2>
        <p className="mt-3 max-w-[280px] text-[13.5px] leading-relaxed text-dg-muted">
          {fotoUrl
            ? 'É assim que você vai aparecer na sua jornada.'
            : 'Sua foto vira o avatar que percorre a jornada com você.'}
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="user"
        className="hidden"
        onChange={aoEscolher}
      />
    </TelaVertical>
  )
}
