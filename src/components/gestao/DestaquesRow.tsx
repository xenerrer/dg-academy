import { Award, Gauge, Target } from 'lucide-react'
import { iniciais, type Destaque } from '@/lib/ranking'
import { Card } from '@/components/ui/card'

const ICONES = {
  aproveitamento: Target,
  entrega: Award,
  ritmo: Gauge,
} as const

/**
 * Os três recortes que o gestor pergunta separadamente: quem acerta mais, quem
 * entrega mais, quem mantém ritmo. São stat tiles — o número é a figura, não
 * cabe gráfico aqui.
 */
export function DestaquesRow({ destaques }: { destaques: Destaque[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {destaques.map((destaque) => {
        const Icone = ICONES[destaque.chave]

        return (
          <Card key={destaque.chave} className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <Icone className="h-3.5 w-3.5 text-chart-mark" />
              <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-dg-muted">
                {destaque.rotulo}
              </span>
            </div>

            {destaque.colaborador ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-dg-line bg-dg-card2 font-display text-[11px] font-bold text-dg-muted">
                    {iniciais(destaque.colaborador.nome)}
                  </div>
                  <div className="min-w-0">
                    <b className="block truncate text-sm text-dg-text">
                      {destaque.colaborador.nome}
                    </b>
                    <small className="block truncate text-[11px] text-dg-muted">
                      {destaque.colaborador.cargo}
                    </small>
                  </div>
                  <span className="ml-auto font-mono text-lg font-bold text-dg-text">
                    {destaque.valorFormatado}
                  </span>
                </div>
                <p className="mt-3 text-[11px] leading-relaxed text-dg-muted">
                  {destaque.explicacao}
                </p>
              </>
            ) : (
              <p className="text-[12px] text-dg-muted">
                Ainda sem dados suficientes para destacar alguém.
              </p>
            )}
          </Card>
        )
      })}
    </div>
  )
}
