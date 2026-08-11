import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { cadastrar, entrar } from '@/lib/api'
import { cn } from '@/lib/utils'
import { PainelMarca } from '@/components/auth/PainelMarca'
import { FormEntrar } from '@/components/auth/FormEntrar'
import { FormCadastro } from '@/components/auth/FormCadastro'

type Aba = 'entrar' | 'cadastro'

/**
 * Área de acesso — casca (mockup) para o cliente ver login e cadastro.
 *
 * Split-screen no desktop (marca | formulário), empilhado no mobile. Duas abas:
 * Entrar e Criar acesso. A de cadastro mostra a escolha de SETOR e o que cada
 * área desbloqueia — o ponto que o Danilo quer ver.
 *
 * Tudo visual: a autenticação real é Supabase Auth (ver docs/06). O submit leva
 * ao onboarding só para o fluxo ficar navegável.
 */
export default function Login() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [aba, setAba] = useState<Aba>('entrar')

  /**
   * Abre a sessão e só então navega. O invalidate é o que faz o ProtectedRoute
   * enxergar o usuário — sem ele a rota de destino devolveria para /login.
   */
  async function acessar() {
    await entrar()
    await queryClient.invalidateQueries({ queryKey: ['usuario'] })
    navigate('/bem-vindo')
  }

  async function cadastrarEAcessar(dados: { nome: string; cargo: string; setorId: string }) {
    await cadastrar(dados)
    await queryClient.invalidateQueries({ queryKey: ['usuario'] })
    navigate('/bem-vindo')
  }

  return (
    <div className="min-h-[100dvh] bg-dg-bg lg:grid lg:grid-cols-[2fr_1fr]">
      <PainelMarca />

      <div className="flex items-center justify-center px-6 py-10 lg:px-12">
        <div className="w-full max-w-md">
          {/* abas */}
          <div className="mb-7 inline-flex rounded-control border border-dg-line bg-dg-card2 p-1">
            {(['entrar', 'cadastro'] as const).map((valor) => (
              <button
                key={valor}
                onClick={() => setAba(valor)}
                className={cn(
                  'min-h-9 rounded-[6px] px-5 text-label font-semibold transition',
                  aba === valor ? 'bg-dg-yellow text-dg-bg' : 'text-dg-muted hover:text-dg-text',
                )}
              >
                {valor === 'entrar' ? 'Entrar' : 'Criar acesso'}
              </button>
            ))}
          </div>

          <h1 className="mb-1 font-display text-heading font-bold">
            {aba === 'entrar' ? 'Bem-vindo de volta' : 'Cadastrar colaborador'}
          </h1>
          <p className="mb-6 text-label text-dg-muted">
            {aba === 'entrar'
              ? 'Entre para continuar sua jornada na DG Academy.'
              : 'O RH cadastra a pessoa e escolhe o setor — isso define a trilha dela.'}
          </p>

          {aba === 'entrar' ? (
            <FormEntrar onEntrar={acessar} />
          ) : (
            <FormCadastro onCadastrar={cadastrarEAcessar} />
          )}

          <p className="mt-6 text-caption text-dg-muted">
            Casca em desenvolvimento — autenticação real entra com o Supabase.
          </p>
        </div>
      </div>
    </div>
  )
}
