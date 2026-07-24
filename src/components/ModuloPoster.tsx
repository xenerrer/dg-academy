import { useState } from 'react'
import { Check, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Modulo, StatusModulo } from '@/types/database'

interface ModuloPosterProps {
  modulo: Modulo
  status: StatusModulo
  onAbrir: (modulo: Modulo) => void
}

/**
 * Card de módulo no formato pôster 2:3, herdado do protótipo aprovado.
 * As capas definitivas vêm do Carlos; enquanto isso, um gradiente por número.
 */
export function ModuloPoster({ modulo, status, onAbrir }: ModuloPosterProps) {
  const [tremendo, setTremendo] = useState(false)

  function clicar() {
    if (status === 'bloqueado') {
      setTremendo(true)
      setTimeout(() => setTremendo(false), 400)
      return
    }
    onAbrir(modulo)
  }

  const gradientes = [
    'from-[#2A2409] to-[#080806]',
    'from-[#0f2318] to-[#070d09]',
    'from-[#231027] to-[#0c080d]',
    'from-[#101c2b] to-[#080b0d]',
    'from-[#2b2410] to-[#0d0c08]',
    'from-[#1c1c1c] to-[#080808]',
  ]

  return (
    <button
      onClick={clicar}
      className={cn(
        'group relative aspect-[2/3] w-[218px] shrink-0 snap-start overflow-hidden rounded-[10px]',
        'border border-white/5 text-left transition duration-300',
        status === 'bloqueado' ? 'saturate-[0.55] brightness-[0.72]' : 'hover:scale-[1.045]',
        tremendo && 'animate-shake',
      )}
    >
      <div
        className={cn('absolute inset-0 bg-gradient-to-b', gradientes[(modulo.numero - 1) % 6])}
      />
      {/* capa do módulo; o gradiente atrás continua sendo o fundo quando não há capa */}
      {modulo.capa_url && (
        <img
          src={modulo.capa_url}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-[radial-gradient(50%_38%_at_50%_38%,rgba(255,218,0,0.22),transparent_70%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/35 to-black/85" />

      {status === 'bloqueado' && (
        <div className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/55 backdrop-blur">
          <Lock className="h-3.5 w-3.5 text-dg-muted" />
        </div>
      )}
      {status === 'concluido' && (
        <div className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-dg-success">
          <Check className="h-4 w-4 text-[#111]" strokeWidth={3} />
        </div>
      )}
      {status === 'atual' && (
        <div className="absolute right-4 top-0 rounded-b bg-dg-yellow px-1.5 py-2 text-[10px] font-extrabold tracking-[0.1em] text-[#111] [writing-mode:vertical-rl]">
          NOVO
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 px-3.5 pb-4 pt-5 text-center">
        <div className="font-cover text-[16.5px] font-semibold leading-tight text-white drop-shadow">
          {modulo.titulo}
        </div>
        <div className="mt-2 font-display text-[11.5px] font-semibold tracking-[0.34em] text-white/85">
          <span className="text-dg-yellow">/</span>MÓDULO&nbsp;{modulo.numero}
        </div>
      </div>
    </button>
  )
}
