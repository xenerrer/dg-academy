import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { listarConclusoes, listarSetores, obterUsuarioAtual, sair } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Perfil() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: usuario } = useQuery({ queryKey: ['usuario'], queryFn: obterUsuarioAtual })
  const { data: setores = [] } = useQuery({ queryKey: ['setores'], queryFn: listarSetores })
  const { data: conclusoes = [] } = useQuery({
    queryKey: ['conclusoes', usuario?.id],
    queryFn: () => listarConclusoes(usuario!.id),
    enabled: !!usuario,
  })

  /** Encerra a sessão e limpa o cache — sem o clear, a próxima tela ainda leria o usuário antigo. */
  async function encerrarSessao() {
    await sair()
    queryClient.clear()
    navigate('/login')
  }

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

      <div className="mt-6 flex justify-end">
        <Button variant="outline" onClick={encerrarSessao}>
          Sair
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
