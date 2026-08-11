import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Zap } from 'lucide-react'
import { calcularStatusModulos, listarConclusoes, listarModulos, obterUsuarioAtual } from '@/lib/api'
import { BannerRegrasDaCasa } from '@/components/BannerRegrasDaCasa'
import { ModuloPoster } from '@/components/ModuloPoster'
import { ParaVoce } from '@/components/ParaVoce'
import { Progress } from '@/components/ui/progress'

export default function Trilha() {
  const navigate = useNavigate()

  const { data: usuario } = useQuery({ queryKey: ['usuario'], queryFn: obterUsuarioAtual })
  const { data: modulos = [], isPending: carregandoModulos } = useQuery({
    queryKey: ['modulos'],
    queryFn: listarModulos,
  })
  const { data: conclusoes = [], isPending: carregandoConclusoes } = useQuery({
    queryKey: ['conclusoes', usuario?.id],
    queryFn: () => listarConclusoes(usuario!.id),
    enabled: !!usuario,
  })

  /**
   * As duas queries chegam em momentos diferentes. Sem esta guarda, existe um
   * quadro em que as conclusões já carregaram e os módulos não — e a tela
   * anuncia "2 de 0 módulos energizados". Progresso só aparece quando as duas
   * pontas do cálculo existem.
   */
  const carregando = carregandoModulos || carregandoConclusoes

  const status = calcularStatusModulos(modulos, conclusoes)
  const concluidos = conclusoes.length
  const percentual = modulos.length ? Math.round((concluidos / modulos.length) * 100) : 0

  return (
    <div className="px-[5vw] py-14">
      <BannerRegrasDaCasa />

      <section className="mb-14">
        <div className="mb-5 flex flex-wrap items-baseline gap-3.5">
          <h1 className="dg-secao">minhaJornada</h1>
          {usuario && (
            <span className="text-[12.5px] text-dg-muted">
              {usuario.nome} · {usuario.cargo}
            </span>
          )}
        </div>

        <div className="mb-6 flex h-5 items-center gap-3">
          {!carregando && (
            <>
              <Progress valor={percentual} className="max-w-[340px] flex-1" />
              <span className="font-mono text-[11.5px] text-dg-muted">
                <b className="text-dg-yellow">{percentual}%</b> · {concluidos} de {modulos.length}{' '}
                módulos energizados
              </span>
              <Link
                to="/mapa"
                className="ml-auto flex min-h-11 items-center gap-1.5 text-label font-semibold text-dg-yellow underline-offset-4 hover:underline"
              >
                Ver no mapa
                <Zap className="h-3.5 w-3.5" />
              </Link>
            </>
          )}
        </div>

        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 pt-1.5">
          {modulos.map((modulo) => (
            <ModuloPoster
              key={modulo.id}
              modulo={modulo}
              status={status[modulo.id]}
              onAbrir={(m) => navigate(`/aula/${m.id}`)}
            />
          ))}
        </div>
      </section>

      <ParaVoce />

      <footer className="flex flex-wrap justify-between gap-3.5 border-t border-dg-line pt-7 text-caption text-dg-muted">
        <span>
          © 2026 <span className="text-dg-yellow">DG Tech</span> Soluções Corporativas · DG Academy
        </span>
        <span>Casca em desenvolvimento · dados de exemplo</span>
      </footer>
    </div>
  )
}
