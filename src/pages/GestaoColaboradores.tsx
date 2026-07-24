import { useQuery } from '@tanstack/react-query'
import { listarColaboradores, listarSetores } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function GestaoColaboradores() {
  const { data: colaboradores = [] } = useQuery({
    queryKey: ['colaboradores'],
    queryFn: listarColaboradores,
  })
  const { data: setores = [] } = useQuery({ queryKey: ['setores'], queryFn: listarSetores })

  return (
    <div className="mx-auto max-w-[900px] px-6 pb-20 pt-10">
      <h1 className="dg-secao mb-1.5">colaboradores</h1>
      <p className="mb-7 text-[13.5px] text-dg-muted">
        Cadastro e definição de setor. O setor determina quais trilhas o colaborador enxerga.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Equipe</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {colaboradores.map((colaborador) => (
            <div
              key={colaborador.user_id}
              className="flex items-center justify-between border-b border-dg-line pb-3 text-sm"
            >
              <div>
                <b className="block">{colaborador.nome}</b>
                <small className="text-dg-muted">{colaborador.cargo}</small>
              </div>
              <span className="font-mono text-[11.5px] text-dg-muted">
                {setores.find((s) => s.id === colaborador.setor_id)?.nome ?? 'sem setor'}
              </span>
            </div>
          ))}
          <Button variant="outline" className="mt-4">
            + Adicionar colaborador
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
