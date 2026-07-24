import { useQuery } from '@tanstack/react-query'
import { listarConclusoes, listarSetores, obterUsuarioAtual } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Perfil() {
  const { data: usuario } = useQuery({ queryKey: ['usuario'], queryFn: obterUsuarioAtual })
  const { data: setores = [] } = useQuery({ queryKey: ['setores'], queryFn: listarSetores })
  const { data: conclusoes = [] } = useQuery({
    queryKey: ['conclusoes', usuario?.id],
    queryFn: () => listarConclusoes(usuario!.id),
    enabled: !!usuario,
  })

  if (!usuario) return <div className="p-14 text-dg-muted">Carregando…</div>

  const setor = setores.find((s) => s.id === usuario.setor_id)
  const pontos = conclusoes.reduce((soma, c) => soma + c.pontos_ganhos, 0)

  return (
    <div className="mx-auto max-w-[720px] px-6 pb-20 pt-10">
      <h1 className="dg-secao mb-7">meuPerfil</h1>

      <Card>
        <CardHeader>
          <CardTitle>{usuario.nome}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {[
            ['E-mail', usuario.email],
            ['Cargo', usuario.cargo ?? '—'],
            ['Setor', setor?.nome ?? '—'],
            ['Módulos concluídos', String(conclusoes.length)],
            ['Pontos acumulados', String(pontos)],
          ].map(([rotulo, valor]) => (
            <div key={rotulo} className="flex justify-between border-b border-dg-line pb-3">
              <span className="text-dg-muted">{rotulo}</span>
              <span className="font-semibold">{valor}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
