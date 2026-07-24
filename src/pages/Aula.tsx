import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Check } from 'lucide-react'
import {
  concluirModulo,
  listarQuestoes,
  obterAulaDoModulo,
  obterModulo,
  obterProgressoAula,
  obterUsuarioAtual,
} from '@/lib/api'
import { PandaPlayer } from '@/components/PandaPlayer'
import { QuizCard } from '@/components/QuizCard'
import { ResultadoModulo } from '@/components/ResultadoModulo'
import { Button } from '@/components/ui/button'

type Fase = 'video' | 'quiz' | 'resultado'

export default function Aula() {
  const { moduloId = '' } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [fase, setFase] = useState<Fase>('video')
  const [videoTerminou, setVideoTerminou] = useState(false)
  const [resultado, setResultado] = useState({ acertos: 0, pontos: 0 })

  const { data: usuario } = useQuery({ queryKey: ['usuario'], queryFn: obterUsuarioAtual })
  const { data: modulo } = useQuery({ queryKey: ['modulo', moduloId], queryFn: () => obterModulo(moduloId) })
  const { data: aula } = useQuery({ queryKey: ['aula', moduloId], queryFn: () => obterAulaDoModulo(moduloId) })
  const { data: questoes = [] } = useQuery({
    queryKey: ['questoes', moduloId],
    queryFn: () => listarQuestoes(moduloId),
  })
  const { data: progresso } = useQuery({
    queryKey: ['progresso', usuario?.id, aula?.id],
    queryFn: () => obterProgressoAula(usuario!.id, aula!.id),
    enabled: !!usuario && !!aula,
  })

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
          <h2 className="font-display text-[26px] font-bold">Apresentação</h2>
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
            <Button
              variant={videoTerminou ? 'success' : 'ghost'}
              disabled={!videoTerminou || fase !== 'video'}
              onClick={() => setFase('quiz')}
              className="ml-auto"
            >
              {fase === 'video' ? 'Marcar como visto' : 'Visto'} <Check className="h-4 w-4" />
            </Button>
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
        </div>

        <aside className="self-start lg:sticky lg:top-24">
          <div className="rounded-2xl border border-dg-line bg-dg-card p-5">
            <h3 className="mb-4 font-display text-sm font-bold">Etapas do módulo</h3>
            <ol className="space-y-3 border-l border-dg-line pl-4 text-xs">
              <li className={fase === 'video' ? 'text-dg-yellow' : 'text-dg-success'}>
                1. Vídeo do módulo
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
