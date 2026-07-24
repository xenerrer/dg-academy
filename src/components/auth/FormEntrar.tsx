import { LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

/**
 * Aba "Entrar" — visual apenas (casca). A autenticação real é Supabase Auth.
 * O submit leva ao onboarding só para o cliente ver o fluxo.
 */
export function FormEntrar({ onEntrar }: { onEntrar: () => void }) {
  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault()
        onEntrar()
      }}
    >
      <label className="block">
        <span className="mb-1.5 block text-label text-dg-muted">E-mail</span>
        <Input type="email" placeholder="voce@dgtech.com.br" required />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-label text-dg-muted">Senha</span>
        <Input type="password" placeholder="sua senha" required />
      </label>

      <div className="pt-2">
        <Button type="submit" size="lg" className="w-full">
          Entrar
          <LogIn className="h-4 w-4" />
        </Button>
      </div>

      <p className="pt-1 text-center text-caption text-dg-muted">
        Esqueceu a senha? Fale com o RH da sua empresa.
      </p>
    </form>
  )
}
