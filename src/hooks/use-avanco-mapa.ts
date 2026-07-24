import { useEffect, useState } from 'react'
import { gravarVisto, lerVisto, type EstadoVisto } from '@/lib/mapa'

interface Entrada {
  /** Índice da casa atual segundo o dado (primeiro módulo não concluído). */
  casaAtual: number
  pontosAtuais: number
}

export interface AvancoPendente {
  de: number
  para: number
  pontosAntes: number
}

/**
 * Decide, UMA vez e de forma síncrona no mount, se há avanço a animar.
 *
 * A decisão é síncrona (initializer de useState) porque o componente que usa
 * este hook só é montado quando os dados já estão frescos — então casaAtual já
 * é definitivo no primeiro render. Ser síncrono importa: o dono da coreografia
 * precisa saber já no primeiro frame se deve exibir o estado ANTIGO (durante a
 * viagem) ou o novo. Se a decisão viesse de um efeito, haveria um frame com o
 * estado novo antes de cair pro antigo — o spoiler que queremos evitar.
 *
 * A leitura de sessionStorage no initializer é read-only (idempotente sob o
 * double-invoke do StrictMode). A ESCRITA (gravarVisto) fica no efeito, para o
 * render continuar puro:
 *   - sem viagem  → grava a posição atual já (o reposicionamento é imediato)
 *   - com viagem  → só grava na chegada (confirmarChegada), senão a próxima
 *     visita não repetiria a festa caso o usuário saia no meio.
 */
export function useAvancoMapa({ casaAtual, pontosAtuais }: Entrada) {
  const [decisao] = useState<{ casaInicial: number; avanco: AvancoPendente | null }>(() => {
    const visto: EstadoVisto | null = lerVisto()
    if (visto && visto.casa < casaAtual) {
      return {
        casaInicial: visto.casa,
        avanco: { de: visto.casa, para: casaAtual, pontosAntes: visto.pontos },
      }
    }
    return { casaInicial: casaAtual, avanco: null }
  })

  const [avanco, setAvanco] = useState<AvancoPendente | null>(decisao.avanco)

  useEffect(() => {
    if (!decisao.avanco) gravarVisto({ casa: casaAtual, pontos: pontosAtuais })
    // roda uma vez no mount; casaAtual/pontosAtuais são fixos para esta visita
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function confirmarChegada() {
    gravarVisto({ casa: casaAtual, pontos: pontosAtuais })
    setAvanco(null)
  }

  return {
    casaInicial: decisao.casaInicial,
    /** Avanço inicial, síncrono — para o dono decidir o estado exibido no 1º frame. */
    avancoInicial: decisao.avanco,
    /** Avanço corrente — vira null após a chegada. */
    avanco,
    confirmarChegada,
  }
}
