import { useQuery } from '@tanstack/react-query'
import { listarModulos, obterTrilha } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminConteudo() {
  const { data: trilha } = useQuery({ queryKey: ['trilha'], queryFn: obterTrilha })
  const { data: modulos = [] } = useQuery({ queryKey: ['modulos'], queryFn: listarModulos })

  return (
    <div className="mx-auto max-w-[900px] px-6 pb-20 pt-10">
      <h1 className="dg-secao mb-1.5">conteúdo</h1>
      <p className="mb-7 text-[13.5px] text-dg-muted">
        Trilhas, módulos e aulas. O ID do vídeo no Panda é colado no cadastro da aula — a duração
        vem da API do Panda, nunca é digitada.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>{trilha?.nome ?? 'Trilha'}</CardTitle>
          <p className="mt-1 text-[12.5px] text-dg-muted">{trilha?.descricao}</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {modulos.map((modulo) => (
            <div
              key={modulo.id}
              className="flex items-center gap-4 border-b border-dg-line pb-3 text-sm"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-dg-yellow/40 font-mono text-xs text-dg-yellow">
                {modulo.numero}
              </span>
              <b className="flex-1">{modulo.titulo}</b>
              <span className="font-mono text-[11px] text-dg-muted">sem vídeo</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
