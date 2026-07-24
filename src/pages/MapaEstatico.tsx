import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { calcularStatusModulos, listarConclusoes, listarModulos, obterUsuarioAtual } from '@/lib/api'
import { MapaHeader } from '@/components/mapa/MapaHeader'
import { ResumoJornada } from '@/components/mapa/ResumoJornada'
import { CardModuloAtual } from '@/components/mapa/CardModuloAtual'

/**
 * O Mapa da Jornada, versão padrão — a arte entregue pelo cliente
 * (public/mapa-jornada.jpg), sem interação própria. Substitui o carrossel do
 * protótipo agora que a arte chegou (ver docs/02-ESCOPO-V1.md, Bloco E): troca
 * de camada de apresentação, sem retrabalho estrutural.
 *
 * Sem coreografia de chegada — não há "casa anterior" para animar até a
 * atual, então mostra o estado corrente direto. A versão com avatar viajando
 * continua em /mapa/animado, um clique no toggle do MapaHeader.
 */
export default function MapaEstatico() {
  const navigate = useNavigate()
  const { data: usuario } = useQuery({ queryKey: ['usuario'], queryFn: obterUsuarioAtual })
  const { data: modulos = [], isPending: carregandoModulos } = useQuery({
    queryKey: ['modulos'],
    queryFn: listarModulos,
  })
  const { data: conclusoes = [], isPending: carregandoConclusoes } = useQuery({
    queryKey: ['conclusoes', usuario?.id],
    queryFn: () => listarConclusoes(usuario!.id),
    enabled: !!usuario,
  })

  const pronto = !!usuario && !carregandoModulos && !carregandoConclusoes && modulos.length > 0

  if (!pronto) {
    return <div className="min-h-[100dvh] bg-dg-bg p-14 text-dg-muted">Carregando o mapa…</div>
  }

  const status = calcularStatusModulos(modulos, conclusoes)
  const indiceAtual = modulos.findIndex((m) => status[m.id] === 'atual')
  const trilhaCompleta = indiceAtual === -1
  const moduloAtual = modulos[trilhaCompleta ? modulos.length - 1 : indiceAtual]
  const concluidos = modulos.filter((m) => status[m.id] === 'concluido').length
  const pontos = conclusoes.reduce((soma, c) => soma + c.pontos_ganhos, 0)

  const abrirModulo = () => navigate(`/aula/${moduloAtual.id}`)

  return (
    <div className="relative min-h-[100dvh] bg-dg-bg">
      <MapaHeader pontos={pontos} />

      {/* pt-32 no mobile abre espaço pras duas linhas do HUD fixo (voltar+pontos, toggle) */}
      <div className="mx-auto max-w-6xl px-0 pb-36 pt-32 lg:grid lg:grid-cols-[1fr_360px] lg:items-start lg:gap-10 lg:px-8 lg:pb-16 lg:pt-10">
        <div className="px-4 lg:px-0">
          <img
            src="/mapa-jornada.jpg"
            alt="Mapa da jornada DG Academy: trajeto sinuoso do início da integração até a certificação"
            className="w-full rounded-surface border border-dg-line"
          />
        </div>

        <aside className="hidden lg:sticky lg:top-28 lg:flex lg:flex-col lg:gap-4">
          <ResumoJornada concluidos={concluidos} total={modulos.length} pontos={pontos} />
          <div className="rounded-surface border border-dg-line bg-dg-card p-4">
            <CardModuloAtual
              modulo={moduloAtual}
              mostrarCompleta={trilhaCompleta}
              onContinuar={abrirModulo}
            />
          </div>
        </aside>
      </div>

      {/* card fixo na zona do polegar — só mobile, mesmo padrão do mapa animado */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[430px] px-4 lg:hidden"
        style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}
      >
        <div className="rounded-surface border border-dg-line bg-dg-card/90 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] backdrop-blur">
          <CardModuloAtual
            modulo={moduloAtual}
            mostrarCompleta={trilhaCompleta}
            onContinuar={abrirModulo}
          />
        </div>
      </div>
    </div>
  )
}
