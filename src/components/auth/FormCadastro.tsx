import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, HardHat, Calculator, Building2, Truck, UserPlus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

/**
 * Aba "Criar acesso" — mockup (casca) para o cliente ver como será o cadastro
 * e, principalmente, como o SETOR define o conteúdo que a pessoa recebe. É o
 * pedido do Danilo: "o João é engenheiro de campo, o José é orçamentista" —
 * cada um vê a trilha do seu setor.
 *
 * Ao escolher um setor, a prévia separa o que TODO mundo recebe do que é
 * específico daquela área. Conteúdo ilustrativo — a lista real vem do que o RH
 * cadastrar por setor.
 */

/**
 * Trilhas que toda pessoa recebe, qualquer que seja o setor. No banco são as
 * trilhas sem vínculo em trilha_setores — por isso ficam visíveis a todos.
 */
const TRILHAS_PADRAO = [
  'Integração DG',
  'Missão, visão e valores',
  'Códigos de conduta',
  'Regras da DG',
]

const SETORES = [
  {
    id: 'campo',
    nome: 'Engenharia de Campo',
    icone: HardHat,
    treinamentos: ['NR-10 — Segurança em eletricidade', 'EPIs e procedimentos de obra', 'Ferramentas e instalações'],
  },
  {
    id: 'orcamentos',
    nome: 'Orçamentos',
    icone: Calculator,
    treinamentos: ['Levantamento e composição de custos', 'Normas técnicas aplicadas a orçamento', 'Relacionamento com o cliente'],
  },
  {
    id: 'adm',
    nome: 'Administrativo',
    icone: Building2,
    treinamentos: ['Processos internos e sistemas', 'Atendimento e comunicação'],
  },
  {
    id: 'fornecedores',
    nome: 'Fornecedores',
    icone: Truck,
    treinamentos: ['Homologação e documentação', 'Padrões de qualidade e entrega', 'Segurança no acesso às obras'],
  },
]

export function FormCadastro({ onCadastrar }: { onCadastrar: () => void }) {
  const [setorId, setSetorId] = useState<string | null>(null)
  const setor = SETORES.find((s) => s.id === setorId)

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        onCadastrar()
      }}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-label text-dg-muted">Nome</span>
          <Input placeholder="Nome do colaborador" required />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-label text-dg-muted">Cargo</span>
          <Input placeholder="Ex.: Eletricista Jr." required />
        </label>
      </div>
      <label className="block">
        <span className="mb-1.5 block text-label text-dg-muted">E-mail</span>
        <Input type="email" placeholder="colaborador@dgtech.com.br" required />
      </label>

      <div>
        <span className="mb-2 block text-label text-dg-muted">Setor — define a trilha que a pessoa recebe</span>
        <div className="grid grid-cols-2 gap-2">
          {SETORES.map((s) => {
            const Icone = s.icone
            const ativo = setorId === s.id
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSetorId(s.id)}
                aria-pressed={ativo}
                className={cn(
                  'flex min-h-11 flex-col items-start gap-1.5 rounded-control border p-3 text-left transition',
                  ativo
                    ? 'border-dg-yellow bg-dg-yellow/[0.08]'
                    : 'border-dg-line bg-dg-card2 hover:border-dg-yellow/50',
                )}
              >
                <Icone className={cn('h-4 w-4', ativo ? 'text-dg-yellow' : 'text-dg-muted')} />
                <span className={cn('text-label font-semibold leading-tight', ativo ? 'text-dg-yellow' : 'text-dg-text')}>
                  {s.nome}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* prévia: o que aquele setor desbloqueia */}
      {setor && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.2, 0.7, 0.2, 1] }}
          className="rounded-control border border-dg-yellow/20 bg-dg-yellow/[0.04] p-4"
        >
          <p className="mb-3 font-mono text-eyebrow uppercase tracking-[0.2em] text-dg-yellow">
            Com esse acesso, a pessoa verá
          </p>

          <p className="mb-1.5 font-mono text-eyebrow uppercase tracking-[0.16em] text-dg-muted">
            Padrão para todos
          </p>
          <ul className="mb-3 space-y-1.5">
            {TRILHAS_PADRAO.map((t) => (
              <li key={t} className="flex items-center gap-2 text-label text-dg-text">
                <Check className="h-3.5 w-3.5 shrink-0 text-dg-success" strokeWidth={3} />
                {t}
              </li>
            ))}
          </ul>

          <p className="mb-1.5 border-t border-dg-yellow/15 pt-3 font-mono text-eyebrow uppercase tracking-[0.16em] text-dg-muted">
            Do setor — {setor.nome}
          </p>
          <ul className="space-y-1.5">
            {setor.treinamentos.map((t) => (
              <li key={t} className="flex items-center gap-2 text-label text-dg-text">
                <Check className="h-3.5 w-3.5 shrink-0 text-dg-success" strokeWidth={3} />
                {t}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      <div className="pt-1">
        <Button type="submit" size="lg" className="w-full" disabled={!setorId}>
          Criar acesso
          <UserPlus className="h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}
