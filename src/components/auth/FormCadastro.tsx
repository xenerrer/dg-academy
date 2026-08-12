import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Check,
  HardHat,
  Calculator,
  Building2,
  BadgeCheck,
  Warehouse,
  ShieldAlert,
  Users,
  UserPlus,
} from 'lucide-react'
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
const TRILHAS_PADRAO = ['Integração DG (com Regras da Casa)', 'Missão, visão e valores', 'Códigos de conduta']

const SETORES = [
  {
    id: 'setor-campo',
    nome: 'Obras',
    icone: HardHat,
    treinamentos: [
      'NR10 e todas as normas pertinentes ao seu trabalho em campo',
      'EPIs e procedimentos de obra',
      'Ferramentas e instalações',
      'Padrão de qualidade DG Tech em obras',
      'Acesso ao Acura',
      'Acesso ao Kaizen',
      'Solicitação correta de lista de material',
    ],
  },
  {
    id: 'setor-orcamentos',
    nome: 'Orçamentos',
    icone: Calculator,
    treinamentos: [
      'Levantamento e composição de custos',
      'Normas técnicas aplicadas a orçamento',
      'Relacionamento com o cliente',
      'Acesso ao Acura',
      'Acesso ao Kaizen',
      'Como fazer um orçamento padrão DG Tech',
    ],
  },
  {
    id: 'setor-adm',
    nome: 'Administrativo',
    icone: Building2,
    treinamentos: [
      'Cultura e Políticas',
      'Integração',
      'Gestão Documental',
      'Gestão Contratual',
      'Gerenciamento de Sistemas Terceiros',
      'Gestão de Patrimônio',
      'Endomarketing',
      'Suporte Financeiro',
    ],
  },
  {
    id: 'setor-qualidade',
    nome: 'Qualidade',
    icone: BadgeCheck,
    treinamentos: ['Acesso ao Acura', 'Acesso ao Kaizen', 'Funções e atribuições do Eng. de Qualidade'],
  },
  {
    id: 'setor-suprimentos',
    nome: 'Suprimentos',
    icone: Warehouse,
    treinamentos: [
      'Acesso ao Acura',
      'Acesso ao Kaizen',
      'Como realizar uma correta solicitação de orçamento aos nossos parceiros',
      'Conferência e double check na lista de material',
      'Organização do depósito',
      'Organização e separação do material do depósito para envio para obra',
      'Logística e entrega do material em obras',
    ],
  },
  {
    id: 'setor-tst',
    nome: 'TST',
    icone: ShieldAlert,
    treinamentos: [
      'Normas gerais',
      'NR01 e demais normas relacionadas à DG Tech',
      'Como se portar em uma obra DG Tech',
      'O papel do TST na DG Tech — responsabilidade em obras',
    ],
  },
  {
    id: 'setor-dp',
    nome: 'DP',
    icone: Users,
    treinamentos: [
      'Cultura e Políticas',
      'Integração',
      'Ciclo do Colaborador',
      'Gestão Documental',
      'Gestão Contratual',
      'Atendimento ao Colaborador',
      'Recrutamento',
    ],
  },
]

interface FormCadastroProps {
  onCadastrar: (dados: { nome: string; cargo: string; setorId: string }) => void
}

export function FormCadastro({ onCadastrar }: FormCadastroProps) {
  const [nome, setNome] = useState('')
  const [cargo, setCargo] = useState('')
  const [setorId, setSetorId] = useState<string | null>(null)
  const setor = SETORES.find((s) => s.id === setorId)

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        if (!setorId) return
        onCadastrar({ nome, cargo, setorId })
      }}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-label text-dg-muted">Nome</span>
          <Input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome do colaborador"
            required
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-label text-dg-muted">Cargo</span>
          <Input
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
            placeholder="Ex.: Eletricista Jr."
            required
          />
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
