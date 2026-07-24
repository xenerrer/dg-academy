import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { listarConclusoesSemana, listarRanking, listarSetores } from '@/lib/api'
import { aproveitamento, calcularDestaques, ordenarPorPontos, progresso } from '@/lib/ranking'
import { Podio } from '@/components/gestao/Podio'
import { DestaquesRow } from '@/components/gestao/DestaquesRow'
import { GraficoProgressoEquipe } from '@/components/gestao/GraficoProgressoEquipe'
import { GraficoRitmoSemanal } from '@/components/gestao/GraficoRitmoSemanal'
import { TabelaEquipe } from '@/components/gestao/TabelaEquipe'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { NumeroAnimado } from '@/components/ui/numero-animado'

export default function GestaoPainel() {
  const { data: ranking = [] } = useQuery({ queryKey: ['ranking'], queryFn: listarRanking })
  const { data: setores = [] } = useQuery({ queryKey: ['setores'], queryFn: listarSetores })
  const { data: semanas = [] } = useQuery({
    queryKey: ['conclusoes-semana'],
    queryFn: listarConclusoesSemana,
  })

  const ordenado = ordenarPorPontos(ranking)
  const destaques = calcularDestaques(ranking)

  const comRespostas = ranking.filter((c) => c.respostas_total > 0)
  const mediaAcertos = comRespostas.length
    ? Math.round(
        (comRespostas.reduce((soma, c) => soma + (aproveitamento(c) ?? 0), 0) /
          comRespostas.length) *
          100,
      )
    : 0
  const progressoMedio = ranking.length
    ? Math.round((ranking.reduce((soma, c) => soma + progresso(c), 0) / ranking.length) * 100)
    : 0
  const concluiram = ranking.filter((c) => c.modulos_concluidos >= c.modulos_totais).length
  const naoIniciaram = ranking.filter((c) => c.modulos_concluidos === 0).length

  const kpis = [
    { valor: ranking.length, sufixo: '', rotulo: 'Colaboradores' },
    { valor: progressoMedio, sufixo: '%', rotulo: 'Progresso médio da trilha' },
    { valor: mediaAcertos, sufixo: '%', rotulo: 'Aproveitamento médio' },
    { valor: concluiram, sufixo: '', rotulo: 'Concluíram a trilha' },
  ]

  return (
    <div className="mx-auto max-w-[1160px] px-6 pb-20 pt-10">
      <h1 className="dg-secao mb-1.5 text-[clamp(24px,3.6vw,34px)]">painelDeGestão</h1>
      <p className="max-w-2xl text-[13.5px] leading-relaxed text-dg-muted">
        Quem está estudando, quem está entregando e quem parou no caminho. Todo número aqui vem
        de visualização real — o vídeo não pode ser adiantado.
      </p>

      <div className="my-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.rotulo}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.28, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <Card className="p-5">
              <b className="mb-1 block font-mono text-2xl text-chart-mark">
                <NumeroAnimado valor={kpi.valor} sufixo={kpi.sufixo} />
              </b>
              <small className="block text-eyebrow uppercase leading-snug tracking-[0.08em] text-dg-muted">
                {kpi.rotulo}
              </small>
            </Card>
          </motion.div>
        ))}
      </div>

      {naoIniciaram > 0 && (
        <div className="mb-6 rounded-xl border border-dg-yellow/20 bg-dg-yellow/5 px-4 py-3 text-[12.5px] text-dg-muted">
          <b className="text-dg-text">
            {naoIniciaram} {naoIniciaram === 1 ? 'colaborador ainda não iniciou' : 'colaboradores ainda não iniciaram'}
          </b>{' '}
          a trilha. Vale um empurrão antes de cobrar prazo.
        </div>
      )}

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Pódio da trilha</CardTitle>
          <p className="mt-1 text-[12.5px] text-dg-muted">
            Ordenado por pontos — 30 por questão correta, acumulados ao longo dos módulos.
          </p>
        </CardHeader>
        <CardContent className="pt-4">
          <Podio top={ordenado.slice(0, 3)} />
        </CardContent>
      </Card>

      <div className="mb-4">
        <DestaquesRow destaques={destaques} />
      </div>

      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Progresso por colaborador</CardTitle>
            <p className="mt-1 text-[12.5px] text-dg-muted">% da trilha concluída</p>
          </CardHeader>
          <CardContent>
            <GraficoProgressoEquipe colaboradores={ranking} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ritmo da equipe</CardTitle>
            <p className="mt-1 text-[12.5px] text-dg-muted">
              Módulos concluídos por semana, time inteiro
            </p>
          </CardHeader>
          <CardContent>
            <GraficoRitmoSemanal semanas={semanas} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todos os colaboradores</CardTitle>
          <p className="mt-1 text-[12.5px] text-dg-muted">
            A planilha completa. Ritmo é a média de dias entre um módulo e o seguinte — mede
            constância, não velocidade de assistir.
          </p>
        </CardHeader>
        <CardContent>
          <TabelaEquipe colaboradores={ranking} setores={setores} />
        </CardContent>
      </Card>
    </div>
  )
}
