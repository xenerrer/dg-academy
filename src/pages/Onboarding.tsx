import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { listarSetores, obterUsuarioAtual, salvarOnboarding } from '@/lib/api'
import { PassoCracha } from '@/components/onboarding/PassoCracha'
import { PassoConfirmacao } from '@/components/onboarding/PassoConfirmacao'
import { PassoNivel } from '@/components/onboarding/PassoNivel'
import type { NivelExperiencia } from '@/types/database'

/**
 * Primeiro acesso — 3 passos, menos de 60 segundos até a primeira aula.
 *
 * Princípio (docs/09-ONBOARDING-E-UX.md §2): nada é explicado antes de ser
 * necessário. Aqui não há tour, não há tela de "conheça os recursos" e não há
 * explicação de pontuação — a mecânica se ensina no primeiro uso dela.
 *
 * O passo 4 (revelação do mapa) entra quando a arte do Carlos chegar. Por
 * enquanto o fluxo termina na trilha.
 *
 * Em produção, o redirect para cá é condicionado a
 * profiles.onboarding_concluido_em ser nulo.
 */
export default function Onboarding() {
  const navigate = useNavigate()
  const [passo, setPasso] = useState(0)
  const [fotoUrl, setFotoUrl] = useState<string | null>(null)
  const [nivel, setNivel] = useState<NivelExperiencia | null>(null)

  const { data: usuario } = useQuery({ queryKey: ['usuario'], queryFn: obterUsuarioAtual })
  const { data: setores = [] } = useQuery({ queryKey: ['setores'], queryFn: listarSetores })

  if (!usuario) {
    return <div className="min-h-[100dvh] bg-dg-bg p-14 text-dg-muted">Carregando…</div>
  }

  const setor = setores.find((s) => s.id === usuario.setor_id)?.nome ?? 'Não definido'

  async function concluir() {
    await salvarOnboarding({ foto_url: fotoUrl, nivel_experiencia: nivel })
    navigate('/')
  }

  if (passo === 0) {
    return (
      <PassoCracha
        nome={usuario.nome}
        fotoUrl={fotoUrl}
        onFoto={setFotoUrl}
        onAvancar={() => setPasso(1)}
      />
    )
  }

  if (passo === 1) {
    return (
      <PassoConfirmacao
        nome={usuario.nome}
        cargo={usuario.cargo ?? 'Não definido'}
        setor={setor}
        fotoUrl={fotoUrl}
        onConfirmar={() => setPasso(2)}
        onCorrigir={() => setPasso(0)}
      />
    )
  }

  return <PassoNivel selecionado={nivel} onSelecionar={setNivel} onConcluir={concluir} />
}
