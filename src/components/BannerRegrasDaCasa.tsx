import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Zap } from 'lucide-react'
import { listarAulasDoModulo, listarConclusoes, obterUsuarioAtual } from '@/lib/api'
import { PANDA_EMBED_HOST } from '@/components/PandaPlayer'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const MODULO_ID = 'mod-regras-casa'

/**
 * Banner de lançamento do módulo "Regras da Casa" — some sozinho assim que a
 * pessoa concluir o módulo (é aviso de novidade, não decoração permanente).
 * Vídeo de fundo é mudo e em loop, só ilustrativo: o clique no banner inteiro
 * leva direto pro módulo. Fixo no 4º vídeo da playlist (índice 3) por
 * variedade em relação ao 1º, que já abre a playlist em si.
 *
 * `autoplay`+`muted` na URL do embed é o mecanismo oficial do Panda pra
 * autoplay silencioso — não dá pra confirmar visualmente em navegador
 * automatizado (política de autoplay do próprio harness de teste bloqueia
 * mesmo com play() chamado na mão via SDK), mas é padrão suportado nos
 * navegadores reais. Se algum navegador bloquear mesmo assim, o pôster do
 * vídeo (primeiro frame) já é uma imagem de marca real, não uma tela preta.
 */
export function BannerRegrasDaCasa() {
  const navigate = useNavigate()

  const { data: usuario } = useQuery({ queryKey: ['usuario'], queryFn: obterUsuarioAtual })
  const { data: conclusoes = [] } = useQuery({
    queryKey: ['conclusoes', usuario?.id],
    queryFn: () => listarConclusoes(usuario!.id),
    enabled: !!usuario,
  })
  const { data: aulas = [] } = useQuery({
    queryKey: ['aulas', MODULO_ID],
    queryFn: () => listarAulasDoModulo(MODULO_ID),
  })

  const concluido = conclusoes.some((c) => c.modulo_id === MODULO_ID)
  const videoId = (aulas[3] ?? aulas[0])?.panda_video_id

  if (!usuario || concluido || !videoId) return null

  const src = `${PANDA_EMBED_HOST}/embed/?v=${videoId}&autoplay=true&muted=true&restartAfterEnd=true`

  return (
    <button
      onClick={() => navigate(`/aula/${MODULO_ID}`)}
      className="group relative mb-8 block h-[300px] w-full overflow-hidden rounded-surface border border-dg-line text-left sm:h-[280px]"
    >
      {/* vídeo fonte é vertical (9:16); escala grande + origem no topo cobre a
          largura toda do banner recortando corpo/fundo, não o rosto */}
      <iframe
        src={src}
        title=""
        tabIndex={-1}
        aria-hidden="true"
        style={{ border: 'none' }}
        className="pointer-events-none absolute inset-0 h-full w-full origin-top scale-[2.6] transition duration-slow ease-out-dg group-hover:scale-[2.7]"
        allow="autoplay"
      />

      {/* overlay: lavagem preta geral (leitura em qualquer ponto) + gradiente
          mais forte à esquerda, onde o texto fica */}
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-dg-bg via-dg-bg/40 to-transparent" />

      <div className="relative flex h-full max-w-xl flex-col justify-center gap-3 px-6 sm:px-10">
        <span className="dg-eyebrow w-fit rounded-[6px] bg-dg-bg/70 px-2 py-1 text-dg-yellow backdrop-blur">
          Módulo 02 · liberado
        </span>

        <h1 className="font-display text-display font-bold leading-tight text-dg-text">
          As Regras da Casa já estão <span className="text-dg-yellow">liberadas</span>.
        </h1>

        <h2 className="max-w-md text-body-lg leading-relaxed text-dg-muted">
          9 vídeos curtos que energizam o dia a dia da equipe — sempre disponíveis, sem cadeado.
        </h2>

        <span className={cn(buttonVariants({ size: 'lg' }), 'mt-1 w-fit')}>
          Assistir agora
          <Zap className="h-4 w-4" />
        </span>
      </div>
    </button>
  )
}
