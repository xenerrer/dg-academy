import { Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ResultadoModuloProps {
  tituloModulo: string
  acertos: number
  total: number
  pontos: number
  onFechar: () => void
}

export function ResultadoModulo({
  tituloModulo,
  acertos,
  total,
  pontos,
  onFechar,
}: ResultadoModuloProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(6,6,6,0.86)] p-5 backdrop-blur-lg">
      <div className="relative w-full max-w-[440px] rounded-[22px] border border-dg-yellow/30 bg-dg-card p-10 text-center">
        <div className="mx-auto mb-5 flex h-24 w-24 animate-seloIn items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#FFE85C,#FFDA00_62%,#D6B600)] shadow-[0_0_70px_rgba(255,218,0,0.35)]">
          <Zap className="h-10 w-10 fill-[#111] text-[#111]" />
        </div>

        <h2 className="mb-2 font-display text-[25px] font-bold">
          Módulo <span className="text-dg-yellow">energizado!</span>
        </h2>
        <p className="mb-6 text-[13.5px] leading-relaxed text-dg-muted">
          Você concluiu <b className="text-dg-text">{tituloModulo}</b> e desbloqueou o próximo
          trecho da jornada.
        </p>

        <div className="mb-6 flex justify-center gap-2.5">
          {[
            { valor: `${acertos}/${total}`, rotulo: 'Acertos' },
            { valor: `+${pontos}`, rotulo: 'Pontos' },
            { valor: '100%', rotulo: 'Assistido' },
          ].map((stat) => (
            <div key={stat.rotulo} className="flex-1 rounded-xl border border-dg-line bg-dg-card2 p-3">
              <b className="block font-mono text-lg text-dg-yellow">{stat.valor}</b>
              <small className="text-[9.5px] uppercase tracking-[0.1em] text-dg-muted">
                {stat.rotulo}
              </small>
            </div>
          ))}
        </div>

        <div className="mb-6 rounded-xl border border-dg-yellow/20 bg-dg-yellow/5 p-3.5 text-[11.5px] leading-relaxed text-dg-muted">
          <b className="text-dg-text">Relatório enviado ao gestor em tempo real:</b> visualização
          completa, desempenho no quiz e tempo de conclusão já estão no painel.
        </div>

        <Button onClick={onFechar} className="w-full">
          Continuar jornada
          <Zap className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
