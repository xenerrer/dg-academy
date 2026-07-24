import { useState } from 'react'
import { ArrowRight, Check, X, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { Questao } from '@/types/database'

interface QuizCardProps {
  questoes: Questao[]
  onConcluir: (acertos: number, pontos: number) => void
}

export function QuizCard({ questoes, onConcluir }: QuizCardProps) {
  const [indice, setIndice] = useState(0)
  const [escolhido, setEscolhido] = useState<number | null>(null)
  const [acertos, setAcertos] = useState(0)
  const [pontos, setPontos] = useState(0)

  const questao = questoes[indice]
  const respondeu = escolhido !== null
  const acertou = escolhido === questao.indice_correto

  function responder(opcao: number) {
    if (respondeu) return
    setEscolhido(opcao)
    if (opcao === questao.indice_correto) {
      setAcertos((n) => n + 1)
      setPontos((p) => p + questao.pontos)
    }
  }

  function avancar() {
    if (indice < questoes.length - 1) {
      setIndice((i) => i + 1)
      setEscolhido(null)
      return
    }
    onConcluir(acertos, pontos)
  }

  return (
    <div className="animate-fadeUp">
      <div className="mb-3 font-mono text-[10.5px] uppercase tracking-[0.28em] text-dg-yellow">
        // Questões de desbloqueio
      </div>

      <div className="rounded-2xl border border-dg-line bg-dg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="font-mono text-[11.5px] text-dg-muted">
            QUESTÃO {indice + 1} / {questoes.length}
          </span>
          <div className="flex gap-1.5">
            {questoes.map((q, i) => (
              <span
                key={q.id}
                className={cn(
                  'h-[7px] w-[7px] rounded-full border',
                  i === indice ? 'border-dg-yellow bg-dg-yellow' : 'border-dg-line bg-dg-card2',
                  i < indice && 'border-dg-success bg-dg-success',
                )}
              />
            ))}
          </div>
        </div>

        <h3 className="mb-5 font-display text-[17.5px] font-bold leading-snug">
          {questao.enunciado}
        </h3>

        <div className="space-y-2.5">
          {questao.alternativas.map((alternativa, i) => {
            const ehCorreta = i === questao.indice_correto
            const marcada = i === escolhido
            return (
              <button
                key={i}
                onClick={() => responder(i)}
                disabled={respondeu}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl border-[1.5px] p-3.5 text-left text-[13.5px] transition',
                  'border-dg-line bg-dg-card2',
                  !respondeu && 'hover:border-dg-yellow/50',
                  respondeu && ehCorreta && 'border-dg-success bg-dg-success/[0.07]',
                  respondeu && marcada && !ehCorreta && 'border-dg-danger bg-dg-danger/[0.06]',
                )}
              >
                <span
                  className={cn(
                    'flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-md border font-mono text-[11px] font-bold',
                    'border-dg-line bg-[#0c0c0c] text-dg-muted',
                    respondeu && ehCorreta && 'border-dg-success bg-dg-success text-[#111]',
                    respondeu && marcada && !ehCorreta && 'border-dg-danger bg-dg-danger text-[#111]',
                  )}
                >
                  {'ABCD'[i]}
                </span>
                <span>{alternativa}</span>
              </button>
            )
          })}
        </div>

        {respondeu && (
          <p className="mt-4 text-label leading-relaxed text-dg-muted">
            <b
              className={cn(
                'inline-flex items-center gap-1 align-middle',
                acertou ? 'text-dg-success' : 'text-dg-danger',
              )}
            >
              {acertou ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : <X className="h-3.5 w-3.5" strokeWidth={3} />}
              {acertou ? 'Correto!' : 'Não foi dessa vez.'}
            </b>{' '}
            {questao.feedback}
            {acertou && <b className="text-dg-yellow"> +{questao.pontos} pts</b>}
          </p>
        )}

        {respondeu && (
          <div className="mt-4 text-right">
            <Button onClick={avancar}>
              {indice < questoes.length - 1 ? (
                <>
                  Próxima
                  <ArrowRight className="h-4 w-4" />
                </>
              ) : (
                <>
                  Concluir módulo
                  <Zap className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
