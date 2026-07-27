import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { MessageCircle, Send } from 'lucide-react'
import { criarComentario, listarColaboradores, listarComentarios } from '@/lib/api'
import type { Profile } from '@/types/database'

interface ComentariosProps {
  aulaId: string
  usuario: Profile
}

function formatarQuando(iso: string) {
  const dias = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
  if (dias <= 0) return 'hoje'
  if (dias === 1) return 'ontem'
  return `há ${dias} dias`
}

function iniciaisDe(nome: string) {
  return nome
    .split(' ')
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
}

/**
 * Comentários por aula — V1.1 no escopo (docs/02-ESCOPO-V1.md), mas a tela e a
 * tabela já nascem juntas: é baixo risco e o protótipo já previa o espaço.
 *
 * Autor resolvido via listarColaboradores() porque Comentario só guarda
 * user_id (como no banco); nome/foto vêm de outra query, igual aconteceria
 * com um join no Supabase.
 */
export function Comentarios({ aulaId, usuario }: ComentariosProps) {
  const queryClient = useQueryClient()
  const [texto, setTexto] = useState('')

  const { data: comentarios = [], isPending } = useQuery({
    queryKey: ['comentarios', aulaId],
    queryFn: () => listarComentarios(aulaId),
  })

  const { data: colaboradores = [] } = useQuery({
    queryKey: ['colaboradores'],
    queryFn: listarColaboradores,
  })

  const { mutate: enviar, isPending: enviando } = useMutation({
    mutationFn: (texto: string) => criarComentario({ aula_id: aulaId, texto }),
    onSuccess: () => {
      setTexto('')
      queryClient.invalidateQueries({ queryKey: ['comentarios', aulaId] })
    },
  })

  function autorDe(userId: string) {
    if (userId === usuario.id) return { nome: usuario.nome, foto_url: usuario.foto_url }
    const colaborador = colaboradores.find((c) => c.user_id === userId)
    return { nome: colaborador?.nome ?? 'Colaborador', foto_url: colaborador?.foto_url ?? null }
  }

  function aoSubmeter(e: React.FormEvent) {
    e.preventDefault()
    const limpo = texto.trim()
    if (!limpo || enviando) return
    enviar(limpo)
  }

  return (
    <div className="mt-10 border-t border-dg-line pt-8">
      <div className="mb-5 flex items-center gap-2">
        <MessageCircle className="h-4 w-4 text-dg-yellow" />
        <h3 className="font-display text-[17px] font-bold">
          Comentários {comentarios.length > 0 && <span className="text-dg-muted">({comentarios.length})</span>}
        </h3>
      </div>

      <form onSubmit={aoSubmeter} className="mb-7 flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-dg-line bg-dg-card2 font-display text-[12px] font-bold text-dg-yellow">
          {iniciaisDe(usuario.nome)}
        </div>
        <div className="flex-1">
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Deixe uma dúvida ou comentário sobre esta aula…"
            rows={2}
            className="w-full resize-none rounded-xl border border-dg-line bg-dg-card2 p-3 text-[13.5px] text-dg-text placeholder:text-dg-muted focus:border-dg-yellow/50 focus:outline-none"
          />
          <div className="mt-2 flex justify-end">
            <button
              type="submit"
              disabled={!texto.trim() || enviando}
              className="flex h-9 items-center gap-1.5 rounded-control bg-dg-yellow px-4 text-[13px] font-bold text-[#111] transition disabled:pointer-events-none disabled:opacity-40"
            >
              {enviando ? 'Enviando…' : 'Comentar'}
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </form>

      {isPending ? (
        <p className="text-[13px] text-dg-muted">Carregando comentários…</p>
      ) : comentarios.length === 0 ? (
        <p className="text-[13px] text-dg-muted">
          Nenhum comentário ainda — seja o primeiro a comentar nesta aula.
        </p>
      ) : (
        <ul className="space-y-5">
          {comentarios.map((c) => {
            const autor = autorDe(c.user_id)
            return (
              <li key={c.id} className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-dg-line bg-dg-card2 font-display text-[12px] font-bold text-dg-yellow">
                  {autor.foto_url ? (
                    <img src={autor.foto_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    iniciaisDe(autor.nome)
                  )}
                </div>
                <div className="flex-1 rounded-xl border border-dg-line bg-dg-card p-3.5">
                  <div className="mb-1 flex items-baseline gap-2">
                    <span className="text-[13px] font-bold text-dg-text">{autor.nome}</span>
                    <span className="text-[11px] text-dg-muted">{formatarQuando(c.criado_em)}</span>
                  </div>
                  <p className="text-[13.5px] leading-relaxed text-[#C9C9C4]">{c.texto}</p>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
