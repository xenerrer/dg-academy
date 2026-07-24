import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { ContadorPontos } from './ContadorPontos'
import { MapaModoToggle } from './MapaModoToggle'

interface MapaHeaderProps {
  pontos: number
}

/**
 * Header compartilhado pelas duas versões do mapa (estática e animada) —
 * extraído do que era markup duplicado dentro de MapaConteudo. Mesmo back
 * link, mesmo HUD de pontos; o toggle de modo é a única peça nova.
 *
 * O toggle é `fixed`, não parte do fluxo — em MapaJornada (animado) a página
 * se auto-rola até a casa atual assim que monta, e um toggle dentro do corpo
 * rolaria junto e sumiria de vista sem o usuário voltar ao topo. Fixo, fica
 * sempre alcançável, igual ao botão de voltar.
 */
export function MapaHeader({ pontos }: MapaHeaderProps) {
  return (
    <>
      {/* top bar do desktop — barra real, não overlay */}
      <header className="sticky top-0 z-40 hidden items-center justify-between border-b border-dg-line bg-dg-bg/90 px-8 py-4 backdrop-blur lg:flex">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            aria-label="Voltar para a trilha"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-dg-line text-dg-text transition hover:border-dg-yellow hover:text-dg-yellow"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="dg-secao text-subtitle">minhaJornada</h1>
          <MapaModoToggle className="ml-2" />
        </div>
        <ContadorPontos valor={pontos} />
      </header>

      {/* HUD flutuante do mobile — pointer-events-none para não bloquear casas */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-40 mx-auto flex max-w-[430px] items-center justify-between px-4 pt-4 lg:hidden">
        <Link
          to="/"
          aria-label="Voltar para a trilha"
          className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-dg-line bg-dg-bg/70 text-dg-text backdrop-blur transition hover:border-dg-yellow hover:text-dg-yellow"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="pointer-events-auto">
          <ContadorPontos valor={pontos} />
        </div>
      </div>

      {/* segunda linha fixa, só o toggle — sempre alcançável mesmo com o auto-scroll do mapa animado */}
      <div className="pointer-events-none fixed inset-x-0 top-[68px] z-40 flex justify-center px-4 lg:hidden">
        <div className="pointer-events-auto">
          <MapaModoToggle />
        </div>
      </div>
    </>
  )
}
