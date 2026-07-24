import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useReducedMotion } from 'framer-motion'
import { amostrarSegmento, gerarTrilha, type PontoCasa } from '@/lib/mapa'
import type { AvancoPendente } from '@/hooks/use-avanco-mapa'
import { useEscalaMapa } from '@/hooks/use-escala-mapa'
import { CasaModulo } from './CasaModulo'
import { AvatarViajante } from './AvatarViajante'
import { SegmentoTrilha } from './SegmentoTrilha'
import { CanvasVitoria, type CanvasVitoriaHandle } from './CanvasVitoria'
import type { Modulo, Profile, StatusModulo } from '@/types/database'

const DURACAO_POR_SEGMENTO = 1.3

interface MapaJornadaProps {
  usuario: Profile
  modulos: Modulo[]
  status: Record<string, StatusModulo>
  /** Casa onde o avatar começa a visita (avanco.de, ou a atual se não há avanço). */
  casaInicial: number
  /** Avanço a animar; null = só reposiciona. */
  avanco: AvancoPendente | null
  /** Avisa o dono na chegada, para revelar card e contar os pontos. */
  onChegada: () => void
}

/**
 * A trilha em si: SVG procedural, casas, avatar e a coreografia da viagem.
 * Exibe o estado ANTIGO (segmentos acesos até casaInicial) durante a viagem e
 * só revela o novo na chegada — sincronizado com confete e contador (no dono).
 */
export function MapaJornada({
  usuario,
  modulos,
  status,
  casaInicial,
  avanco,
  onChegada,
}: MapaJornadaProps) {
  const navigate = useNavigate()
  const reduzir = useReducedMotion()

  const geo = gerarTrilha(modulos.length)
  const segmentoRefs = useRef<(SVGPathElement | null)[]>([])
  const casasRefs = useRef(new Map<number, HTMLButtonElement>())
  const confeteRef = useRef<CanvasVitoriaHandle>(null)
  const chegouRef = useRef(false)
  const scrollInicialRef = useRef(false)
  const { ref: medidaRef, escala } = useEscalaMapa()

  const [caminho, setCaminho] = useState<PontoCasa[] | null>(null)
  const [viajando, setViajando] = useState(false)
  const [chegou, setChegou] = useState(false)

  // posicionamento inicial do scroll — UMA vez, senão brigaria com o scroll do
  // usuário quando o avanço terminasse e re-disparasse
  useEffect(() => {
    if (scrollInicialRef.current) return
    scrollInicialRef.current = true
    casasRefs.current.get(casaInicial)?.scrollIntoView({ block: 'center', behavior: 'auto' })
  }, [casaInicial])

  // coreografia do avanço: assenta o mapa, amostra a trilha e viaja.
  //
  // Sem ref-guard de "já iniciou": como avanco é síncrono, este efeito roda no
  // mount, e o StrictMode o invoca duas vezes. Um ref que sobrevivesse ao
  // cleanup faria o 2º run abortar depois de o 1º ter limpado o timeout — e a
  // viagem nunca aconteceria. O clearTimeout do cleanup já garante execução
  // única; avanco é estável (useState), então o efeito não re-dispara sozinho.
  useEffect(() => {
    if (!avanco) return

    const iniciar = setTimeout(() => {
      const pontos: PontoCasa[] = []
      for (let i = avanco.de; i < avanco.para; i++) {
        const path = segmentoRefs.current[i]
        if (path) pontos.push(...amostrarSegmento(path))
      }
      if (pontos.length === 0) {
        aoChegar()
        return
      }
      casasRefs.current
        .get(avanco.para)
        ?.scrollIntoView({ block: 'center', behavior: reduzir ? 'auto' : 'smooth' })
      setViajando(true)
      setCaminho(pontos)
    }, 700)

    return () => clearTimeout(iniciar)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [avanco])

  function aoChegar() {
    // ref, não o state chegou: aoChegar pode ser chamado pela chegada da
    // animação e pelo ramo de path-vazio; o state estaria stale no closure
    if (chegouRef.current) return
    chegouRef.current = true
    if (avanco) {
      const rect = casasRefs.current.get(avanco.para)?.getBoundingClientRect()
      if (rect) confeteRef.current?.disparar(rect.left + rect.width / 2, rect.top + rect.height / 2)
    }
    // viajando e chegou trocam no mesmo render: a corrente estática já cobre o
    // trecho que o motion.path deixa de animar — sem frame escuro no meio
    setViajando(false)
    setChegou(true)
    setCaminho(null)
    onChegada()
  }

  // até onde a corrente está acesa de forma estática
  const acesoAte = chegou && avanco ? avanco.para : casaInicial
  const casaAvatar = chegou && avanco ? avanco.para : casaInicial
  const posAvatar = viajando && caminho ? caminho : [geo.casas[casaAvatar]]
  const iniciais = usuario.nome
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')

  return (
    <div
      ref={medidaRef}
      className="mx-auto w-full max-w-[430px] overflow-hidden"
      style={{ height: geo.altura * escala }}
    >
      <div
        className="relative"
        style={{ width: geo.largura, height: geo.altura, transform: `scale(${escala})`, transformOrigin: 'top left' }}
      >
        <svg className="absolute inset-0" width={geo.largura} height={geo.altura} aria-hidden>
          {geo.segmentos.map((d, i) => (
            <SegmentoTrilha
              key={i}
              d={d}
              aceso={i + 1 <= acesoAte}
              animando={!!(viajando && avanco && i >= avanco.de && i < avanco.para)}
              duracao={DURACAO_POR_SEGMENTO * (avanco ? avanco.para - avanco.de : 1)}
              registrarRef={(el) => {
                segmentoRefs.current[i] = el
              }}
            />
          ))}
        </svg>

        {modulos.map((modulo, i) => (
          <CasaModulo
            key={modulo.id}
            modulo={modulo}
            status={status[modulo.id]}
            pos={geo.casas[i]}
            ordem={i}
            ehTopo={i === modulos.length - 1}
            celebrar={chegou && avanco?.para === i}
            onAbrir={(m) => navigate(`/aula/${m.id}`)}
            registrarRef={(el) => {
              if (el) casasRefs.current.set(i, el)
              else casasRefs.current.delete(i)
            }}
          />
        ))}

        <AvatarViajante
          fotoUrl={usuario.foto_url}
          iniciais={iniciais}
          caminho={posAvatar}
          duracao={DURACAO_POR_SEGMENTO * (avanco ? avanco.para - avanco.de : 1)}
          onChegada={aoChegar}
        />

        <CanvasVitoria ref={confeteRef} />
      </div>
    </div>
  )
}
