import { BrowserRouter, Route, Routes, useLocation, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { listarConclusoes, obterUsuarioAtual } from '@/lib/api'
import { AppNav } from '@/components/AppNav'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import Trilha from '@/pages/Trilha'
import Aula from '@/pages/Aula'
import Login from '@/pages/Login'
import Onboarding from '@/pages/Onboarding'
import Mapa from '@/pages/Mapa'
import Perfil from '@/pages/Perfil'
import GestaoPainel from '@/pages/GestaoPainel'
import GestaoColaboradores from '@/pages/GestaoColaboradores'
import AdminConteudo from '@/pages/AdminConteudo'

const queryClient = new QueryClient()

function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation()
  const { data: usuario = null } = useQuery({ queryKey: ['usuario'], queryFn: obterUsuarioAtual })
  const { data: conclusoes = [] } = useQuery({
    queryKey: ['conclusoes', usuario?.id],
    queryFn: () => listarConclusoes(usuario!.id),
    enabled: !!usuario,
  })

  const pontos = conclusoes.reduce((soma, c) => soma + c.pontos_ganhos, 0)

  // login, onboarding e mapa são tela cheia 9:16 — sem nav
  if (pathname === '/login' || pathname === '/bem-vindo' || pathname === '/mapa') return <>{children}</>

  return (
    <>
      <AppNav usuario={usuario} pontos={pontos} />
      <main>{children}</main>
    </>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* Página pública */}
            <Route path="/login" element={<Login />} />

            {/* Rotas protegidas — redirecionam para login se não autenticado */}
            <Route path="/" element={<ProtectedRoute><Trilha /></ProtectedRoute>} />
            <Route path="/bem-vindo" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
            <Route path="/mapa" element={<ProtectedRoute><Mapa /></ProtectedRoute>} />
            <Route path="/aula/:moduloId" element={<ProtectedRoute><Aula /></ProtectedRoute>} />
            <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
            <Route path="/gestao" element={<ProtectedRoute><GestaoPainel /></ProtectedRoute>} />
            <Route path="/gestao/colaboradores" element={<ProtectedRoute><GestaoColaboradores /></ProtectedRoute>} />
            <Route path="/admin/conteudo" element={<ProtectedRoute><AdminConteudo /></ProtectedRoute>} />

            {/* Rota padrão — redireciona para login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
