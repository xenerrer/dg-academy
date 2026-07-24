import { useQuery } from '@tanstack/react-query'
import { calcularStatusModulos, listarConclusoes, listarModulos, obterUsuarioAtual } from '@/lib/api'
import { MapaConteudo } from '@/components/mapa/MapaConteudo'

/**
 * O Mapa da Jornada — tela cheia, sem nav, estilo game.
 *
 * Esta página é só o portão de loading: enquanto as queries não resolvem,
 * mostra "Carregando". A coreografia inteira vive em MapaConteudo, que assim
 * só monta com dados frescos — os hooks de avanço decidem sobre o estado
 * definitivo, sem correr atrás de dado stale do cache.
 */
export default function Mapa() {
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
  const casaAtual = indiceAtual === -1 ? modulos.length - 1 : indiceAtual
  const pontosAtuais = conclusoes.reduce((soma, c) => soma + c.pontos_ganhos, 0)

  return (
    <MapaConteudo
      usuario={usuario}
      modulos={modulos}
      status={status}
      casaAtual={casaAtual}
      pontosAtuais={pontosAtuais}
      trilhaCompleta={indiceAtual === -1}
    />
  )
}
