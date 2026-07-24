import { useEffect, useRef, useState } from 'react'

/** Largura de referência do mapa (a mesma da coluna 9:16). */
const LARGURA_BASE = 430

/**
 * Escala o mapa para caber em telas mais estreitas que 430px (Android 360 é
 * comum). Tudo — casas, avatar, sampling do path — vive no espaço de 430; o
 * transform de escala no container resolve de uma vez, e getBoundingClientRect
 * (usado pelo confete) já devolve coordenadas pós-transform.
 *
 * ResizeObserver em vez de uma medição única: o container só existe depois que
 * os dados chegam, então medir no mount leria nada e a escala travaria em 1.
 */
export function useEscalaMapa() {
  const ref = useRef<HTMLDivElement>(null)
  const [escala, setEscala] = useState(1)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observador = new ResizeObserver(() => {
      setEscala(Math.min(1, el.clientWidth / LARGURA_BASE))
    })
    observador.observe(el)
    return () => observador.disconnect()
  }, [])

  return { ref, escala }
}
