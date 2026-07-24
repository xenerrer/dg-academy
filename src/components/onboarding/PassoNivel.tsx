import { Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { TelaVertical } from './TelaVertical'
import type { NivelExperiencia } from '@/types/database'

interface PassoNivelProps {
  selecionado: NivelExperiencia | null
  onSelecionar: (nivel: NivelExperiencia) => void
  onConcluir: () => void
}

const OPCOES: {
  valor: NivelExperiencia
  titulo: string
  descricao: string
  rotacao: string
}[] = [
  {
    valor: 'iniciante',
    titulo: 'Começando agora',
    descricao: 'Primeiros passos na elétrica',
    rotacao: '-rotate-6',
  },
  {
    valor: 'intermediario',
    titulo: 'Alguns anos de campo',
    descricao: 'Já peguei obra de tudo que é tipo',
    rotacao: 'rotate-0',
  },
  {
    valor: 'veterano',
    titulo: 'Veterano',
    descricao: 'Década de estrada, no mínimo',
    rotacao: 'rotate-6',
  },
]

/**
 * Passo 3 — "Quanto de estrada você já tem?".
 *
 * O que esta resposta muda: tom das mensagens e ordem do conteúdo OPCIONAL.
 * O que ela não muda: nada do conteúdo obrigatório. Ver 0004_onboarding.sql.
 *
 * Composição (§3.3): cartões em LEQUE, sobrepostos, com rotações de -6°/0°/+6°.
 * O selecionado vem para a frente e desrotaciona. Três retângulos iguais em
 * coluna seriam a resposta óbvia — e a monótona.
 */
export function PassoNivel({ selecionado, onSelecionar, onConcluir }: PassoNivelProps) {
  return (
    <TelaVertical
      passo={2}
      totalPassos={3}
      acoes={
        <Button
          size="lg"
          className="h-14 w-full"
          disabled={!selecionado}
          onClick={onConcluir}
        >
          {selecionado ? (
            <>
              Entrar na jornada
              <Zap className="h-4 w-4" />
            </>
          ) : (
            'Escolha uma opção'
          )}
        </Button>
      }
    >
      <p className="dg-eyebrow mb-7">Última pergunta</p>

      <h2 className="mb-2 font-display text-[30px] font-bold leading-[1.05]">
        Quanto de <span className="text-dg-yellow">estrada</span>
        <br />
        você já tem?
      </h2>
      <p className="mb-10 max-w-[290px] text-[13.5px] leading-relaxed text-dg-muted">
        Isso ajusta o tom das mensagens e a ordem do conteúdo extra. Os treinamentos obrigatórios
        são os mesmos para todo mundo.
      </p>

      <div className="flex flex-1 flex-col justify-center gap-3.5 pb-4">
        {OPCOES.map((opcao) => {
          const ativo = selecionado === opcao.valor

          return (
            <button
              key={opcao.valor}
              onClick={() => onSelecionar(opcao.valor)}
              aria-pressed={ativo}
              className={cn(
                'min-h-[76px] rounded-2xl border p-4 text-left transition-all duration-300',
                'origin-left',
                ativo
                  ? 'z-10 scale-[1.03] rotate-0 border-dg-yellow bg-dg-yellow/[0.08] shadow-[0_14px_40px_rgba(255,218,0,0.16)]'
                  : cn(opcao.rotacao, 'border-dg-line bg-dg-card'),
                selecionado && !ativo && 'opacity-45',
              )}
            >
              <b
                className={cn(
                  'block font-display text-[17px] font-bold leading-tight',
                  ativo ? 'text-dg-yellow' : 'text-dg-text',
                )}
              >
                {opcao.titulo}
              </b>
              <span className="mt-1 block text-[12.5px] leading-snug text-dg-muted">
                {opcao.descricao}
              </span>
            </button>
          )
        })}
      </div>
    </TelaVertical>
  )
}
