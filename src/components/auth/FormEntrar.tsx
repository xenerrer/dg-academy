import { useState } from 'react'
import { LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

/**
 * Aba "Entrar" — valida contra as contas de teste liberadas para o cliente
 * (ver CONTAS_TESTE em src/lib/api.ts). Quando o Supabase entrar, a checagem
 * de credenciais some daqui e vira signInWithPassword.
 */
export function FormEntrar({ onEntrar }: { onEntrar: (email: string, senha: string) => Promise<void> }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)
    setEnviando(true)
    try {
      await onEntrar(email, senha)
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Não foi possível entrar.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <label className="block">
        <span className="mb-1.5 block text-label text-dg-muted">E-mail</span>
        <Input
          type="email"
          placeholder="voce@dgtech.com.br"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-label text-dg-muted">Senha</span>
        <Input
          type="password"
          placeholder="sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
      </label>

      {erro && <p className="text-label text-dg-danger">{erro}</p>}

      <div className="pt-2">
        <Button type="submit" size="lg" className="w-full" disabled={enviando}>
          {enviando ? 'Entrando...' : 'Entrar'}
          <LogIn className="h-4 w-4" />
        </Button>
      </div>

      <p className="pt-1 text-center text-caption text-dg-muted">
        Esqueceu a senha? Fale com o RH da sua empresa.
      </p>
    </form>
  )
}
