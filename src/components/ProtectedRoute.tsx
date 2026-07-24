import { useQuery } from '@tanstack/react-query'
import { Navigate } from 'react-router-dom'
import { obterUsuarioAtual } from '@/lib/api'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
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

  return <>{children}</>
}
