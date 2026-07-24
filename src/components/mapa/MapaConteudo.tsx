import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useAvancoMapa } from '@/hooks/use-avanco-mapa'
import { MapaJornada } from './MapaJornada'
import { ContadorPontos } from './ContadorPontos'
import { CardModuloAtual } from './CardModuloAtual'
import { ResumoJornada } from './ResumoJornada'
import type { Modulo, Profile, StatusModulo } from '@/types/database'

interface MapaConteudoProps {
  usuario: Profile
  modulos: Modulo[]
  status: Record<string, StatusModulo>
  /** Casa atual segundo o dado fresco (primeiro módulo não concluído). */
  casaAtual: number
  pontosAtuais: number
  trilhaCompleta: boolean
}

/**
 * Dono da coreografia. Enquanto o avatar viaja, HUD e card mostram o estado
 * ANTIGO — a revelação do novo acontece na chegada.
 *
 * Layout responsivo:
 *  - mobile: HUD flutuante no topo, card fixo na zona do polegar (9:16).
 *  - desktop: top bar + duas colunas (trilha centrada + painel lateral fixo
 *    com resumo e card). A trilha continua vertical ("prumo do prédio"); o
 *    desktop preenche a largura com CONTEXTO, não esticando a trilha.
 */
export function MapaConteudo({
  usuario,
  modulos,
  status,
  casaAtual,
  pontosAtuais,
  trilhaCompleta,
}: MapaConteudoProps) {
  const navigate = useNavigate()
  const { casaInicial, avancoInicial, confirmarChegada } = useAvancoMapa({ casaAtual, pontosAtuais })

  const [chegou, setChegou] = useState(avancoInicial === null)
  const [pontosHud, setPontosHud] = useState(
    avancoInicial ? avancoInicial.pontosAntes : pontosAtuais,
  )

  const casaExibida = chegou ? casaAtual : (avancoInicial?.de ?? casaAtual)
  const moduloExibido = modulos[casaExibida]
  const mostrarCompleta = chegou && trilhaCompleta
  const concluidos = modulos.filter((m) => status[m.id] === 'concluido').length

  function aoChegar() {
    setChegou(true)
    confirmarChegada()
    setPontosHud(pontosAtuais)
  }

  const abrirModulo = () => navigate(`/aula/${moduloExibido.id}`)

  return (
    <div className="relative min-h-[100dvh] bg-dg-bg">
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
        </div>
        <ContadorPontos valor={pontosHud} />
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
          <ContadorPontos valor={pontosHud} />
        </div>
      </div>

      {/* corpo: mobile = trilha só; desktop = trilha + painel lateral */}
      <div className="mx-auto max-w-6xl px-0 pb-36 pt-20 lg:grid lg:grid-cols-[1fr_360px] lg:items-start lg:gap-10 lg:px-8 lg:pb-16 lg:pt-10">
        <MapaJornada
          usuario={usuario}
          modulos={modulos}
          status={status}
          casaInicial={casaInicial}
          avanco={avancoInicial}
          onChegada={aoChegar}
        />

        <aside className="hidden lg:sticky lg:top-28 lg:flex lg:flex-col lg:gap-4">
          <ResumoJornada concluidos={concluidos} total={modulos.length} pontos={pontosHud} />
          <div className="rounded-surface border border-dg-line bg-dg-card p-4">
            <CardModuloAtual
              modulo={moduloExibido}
              mostrarCompleta={mostrarCompleta}
              onContinuar={abrirModulo}
            />
          </div>
        </aside>
      </div>

      {/* card fixo na zona do polegar — só mobile */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[430px] px-4 lg:hidden"
        style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={mostrarCompleta ? 'fim' : moduloExibido.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1] }}
            className="rounded-surface border border-dg-line bg-dg-card/90 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] backdrop-blur"
          >
            <CardModuloAtual
              modulo={moduloExibido}
              mostrarCompleta={mostrarCompleta}
              onContinuar={abrirModulo}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
