import { useQuery } from '@tanstack/react-query'
import { Navigate } from 'react-router-dom'
import { obterUsuarioAtual } from '@/lib/api'
import type { PapelUsuario } from '@/types/database'

interface ProtectedRouteProps {
  children: React.ReactNode
  /** Se informado, só libera para quem tem um desses papéis — outros voltam para "/". */
  papeis?: PapelUsuario[]
}

export function ProtectedRoute({ children, papeis }: ProtectedRouteProps) {
  const { data: usuario, isPending } = useQuery({
    queryKey: ['usuario'],
    queryFn: obterUsuarioAtual,
  })

  if (isPending) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>
  }

  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  if (papeis && !papeis.includes(usuario.papel)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
