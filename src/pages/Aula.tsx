import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Check } from 'lucide-react'
import {
  concluirModulo,
  listarAulasAssistidas,
  listarAulasDoModulo,
  listarQuestoes,
  marcarAulaAssistida,
  obterModulo,
  obterProgressoAula,
  obterUsuarioAtual,
} from '@/lib/api'
import { PandaPlayer } from '@/components/PandaPlayer'
import { PlaylistAulas } from '@/components/PlaylistAulas'
import { QuizCard } from '@/components/QuizCard'
import { ResultadoModulo } from '@/components/ResultadoModulo'
import { Comentarios } from '@/components/Comentarios'
import { Button } from '@/components/ui/button'
import type { Aula as AulaType } from '@/types/database'

type Fase = 'video' | 'quiz' | 'resultado'

export default function Aula() {
  const { moduloId = '' } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [fase, setFase] = useState<Fase>('video')
  const [videoTerminou, setVideoTerminou] = useState(false)
  const [resultado, setResultado] = useState({ acertos: 0, pontos: 0 })
  const [aulaAtualId, setAulaAtualId] = useState<string | null>(null)

  const { data: usuario } = useQuery({ queryKey: ['usuario'], queryFn: obterUsuarioAtual })
  const { data: modulo } = useQuery({ queryKey: ['modulo', moduloId], queryFn: () => obterModulo(moduloId) })
  const { data: aulas = [] } = useQuery({
    queryKey: ['aulas', moduloId],
    queryFn: () => listarAulasDoModulo(moduloId),
  })
  const { data: assistidasArr = [] } = useQuery({
    queryKey: ['aulas-assistidas'],
    queryFn: listarAulasAssistidas,
  })
  const { data: questoes = [], isPending: questoesCarregando } = useQuery({
    queryKey: ['questoes', moduloId],
    queryFn: () => listarQuestoes(moduloId),
  })

  const ehPlaylist = aulas.length > 1
  const assistidas = new Set(assistidasArr)

  /**
   * Módulo com 1 aula só (a maioria): abre ela direto. Módulo com playlist
   * ("Regras da Casa"): abre o primeiro vídeo ainda não assistido, ou o
   * primeiro de todos se já foi tudo assistido antes.
   */
  const aula: AulaType | undefined =
    aulas.find((a) => a.id === aulaAtualId) ??
    (ehPlaylist ? aulas.find((a) => !assistidas.has(a.id)) ?? aulas[0] : aulas[0])

  const { data: progresso } = useQuery({
    queryKey: ['progresso', usuario?.id, aula?.id],
    queryFn: () => obterProgressoAula(usuario!.id, aula!.id),
    enabled: !!usuario && !!aula,
  })

  /** Trocou de vídeo dentro da playlist: a trava de "marcar como visto" reseta. */
  useEffect(() => {
    setVideoTerminou(false)
  }, [aula?.id])

  const todasAssistidas = aulas.length > 0 && aulas.every((a) => assistidas.has(a.id))

  /**
   * Playlist já assistida por completo antes desta visita (ex.: reabriu o
   * módulo depois de já ter marcado os 9 vídeos numa sessão anterior) — a fase
   * local nasce em 'video' mesmo assim, então sem isso o botão "Marcar como
   * visto" simplesmente some e não sobra caminho até o quiz.
   */
  useEffect(() => {
    if (ehPlaylist && todasAssistidas && fase === 'video') setFase('quiz')
  }, [ehPlaylist, todasAssistidas, fase])

  /**
   * Rede de segurança: se um módulo chegar à fase de quiz sem nenhuma questão
   * cadastrada, pular direto pra conclusão em vez de deixar a tela travada sem
   * quiz e sem popup — foi exatamente esse buraco que deixou 14 dos 15 módulos
   * inacessíveis até o quiz ser escrito para todos (só Código de Conduta tinha
   * questões). `questoesCarregando` evita disparar no instante em que a query
   * ainda não resolveu (array vazio momentâneo != módulo sem quiz de verdade).
   */
  useEffect(() => {
    if (fase !== 'quiz' || questoesCarregando || questoes.length > 0 || !modulo) return
    setResultado({ acertos: 0, pontos: 0 })
    setFase('resultado')
    concluirModulo({ modulo_id: modulo.id, acertos: 0, total: 0, pontos_ganhos: 0 }).then(() =>
      queryClient.removeQueries({ queryKey: ['conclusoes'] }),
    )
  }, [fase, questoesCarregando, questoes.length, modulo?.id])

  if (!modulo || !aula) {
    return <div className="p-14 text-dg-muted">Carregando…</div>
  }

  /**
   * Vira o POST de heartbeat para a Edge Function.
   * A decisão sobre conclusão é do servidor — aqui é só reporte.
   */
  function reportarProgresso(segundo: number) {
    if (import.meta.env.DEV && segundo % 10 === 0) {
      console.debug('[heartbeat]', { aula_id: aula!.id, segundo })
    }
  }

  /** Marca a aula atual como vista. Numa playlist, avança pro próximo vídeo em vez do quiz. */
  function marcarComoVisto() {
    if (!ehPlaylist) {
      setFase('quiz')
      return
    }

    marcarAulaAssistida(aula!.id).then(() => queryClient.invalidateQueries({ queryKey: ['aulas-assistidas'] }))
    const proxima = aulas.find((a) => a.id !== aula!.id && !assistidas.has(a.id))
    if (proxima) {
      setAulaAtualId(proxima.id)
    } else {
      setFase('quiz')
    }
  }

  return (
    <div className="mx-auto max-w-[1160px] px-6 pb-20 pt-6">
      <div className="mb-4 flex items-center gap-3.5">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')} aria-label="Voltar">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <span className="font-display text-sm text-dg-muted">
          /minhaJornada{' '}
          <b className="text-dg-text">
            · Módulo {String(modulo.numero).padStart(2, '0')} — {modulo.titulo}
          </b>
        </span>
      </div>

      <PandaPlayer
        pandaVideoId={aula.panda_video_id}
        duracaoSeg={aula.duracao_seg}
        seekLiberado={progresso?.seek_liberado ?? false}
        onProgresso={reportarProgresso}
        onConcluir={() => setVideoTerminou(true)}
      />

      <div className="mt-9 grid gap-11 lg:grid-cols-[1fr_300px]">
        <div>
          {ehPlaylist && (
            <PlaylistAulas
              aulas={aulas}
              assistidas={assistidas}
              aulaAtualId={aula.id}
              onSelecionar={(a) => setAulaAtualId(a.id)}
            />
          )}

          <h2 className="font-display text-[26px] font-bold">{ehPlaylist ? aula.titulo : 'Apresentação'}</h2>
          <div className="my-3 flex flex-wrap items-center gap-2 text-xs text-dg-muted">
            <span>Início</span>
            <span className="text-[#3a3a3a]">›</span>
            <span>DG Academy</span>
            <span className="text-[#3a3a3a]">›</span>
            <span className="text-dg-yellow">{modulo.titulo}</span>
          </div>

          {aula.descricao && (
            <p className="mb-6 text-[14.5px] leading-[1.75] text-[#C9C9C4]">{aula.descricao}</p>
          )}

          <div className="my-7 flex flex-wrap items-center gap-3 border-y border-dg-line py-4">
            {ehPlaylist && !todasAssistidas ? (
              <Button
                variant={videoTerminou ? 'success' : 'ghost'}
                disabled={!videoTerminou}
                onClick={marcarComoVisto}
                className="ml-auto"
              >
                Marcar como visto <Check className="h-4 w-4" />
              </Button>
            ) : !ehPlaylist ? (
              <Button
                variant={videoTerminou ? 'success' : 'ghost'}
                disabled={!videoTerminou || fase !== 'video'}
                onClick={marcarComoVisto}
                className="ml-auto"
              >
                {fase === 'video' ? 'Marcar como visto' : 'Visto'} <Check className="h-4 w-4" />
              </Button>
            ) : null}
          </div>

          {fase === 'quiz' && questoes.length > 0 && (
            <QuizCard
              questoes={questoes}
              onConcluir={(acertos, pontos) => {
                setResultado({ acertos, pontos })
                setFase('resultado')
                // registra a conclusão e REMOVE o cache de conclusões (não só
                // invalida): esta página não observa essa query, então um
                // invalidate não refaz o fetch — o /mapa serviria o valor stale
                // e não detectaria o avanço. Removendo, o /mapa entra em pending
                // e busca fresco, incluindo a conclusão recém-gravada.
                concluirModulo({
                  modulo_id: modulo.id,
                  acertos,
                  total: questoes.length,
                  pontos_ganhos: pontos,
                }).then(() => queryClient.removeQueries({ queryKey: ['conclusoes'] }))
              }}
            />
          )}

          {usuario && <Comentarios aulaId={aula.id} usuario={usuario} />}
        </div>

        <aside className="self-start lg:sticky lg:top-24">
          <div className="rounded-2xl border border-dg-line bg-dg-card p-5">
            <h3 className="mb-4 font-display text-sm font-bold">Etapas do módulo</h3>
            <ol className="space-y-3 border-l border-dg-line pl-4 text-xs">
              <li className={fase === 'video' ? 'text-dg-yellow' : 'text-dg-success'}>
                {ehPlaylist ? `1. Vídeos da playlist (${assistidas.size}/${aulas.length})` : '1. Vídeo do módulo'}
              </li>
              <li className={fase === 'quiz' ? 'text-dg-yellow' : 'text-dg-muted'}>
                2. Questões de desbloqueio
              </li>
              <li className={fase === 'resultado' ? 'text-dg-yellow' : 'text-dg-muted'}>
                3. Conclusão
              </li>
            </ol>
          </div>
          <Link
            to="/"
            className="mt-4 flex min-h-11 items-center justify-center gap-1.5 text-xs text-dg-muted hover:text-dg-yellow"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            voltar para a trilha
          </Link>
        </aside>
      </div>

      {fase === 'resultado' && (
        <ResultadoModulo
          tituloModulo={modulo.titulo}
          acertos={resultado.acertos}
          total={questoes.length}
          pontos={resultado.pontos}
          onFechar={() => navigate('/mapa')}
        />
      )}
    </div>
  )
}
