import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { listarConclusoes, obterUsuarioAtual } from '@/lib/api'
import { AppNav } from '@/components/AppNav'
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
            <Route path="/login" element={<Login />} />
            <Route path="/bem-vindo" element={<Onboarding />} />
            <Route path="/mapa" element={<Mapa />} />
            <Route path="/" element={<Trilha />} />
            <Route path="/aula/:moduloId" element={<Aula />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/gestao" element={<GestaoPainel />} />
            <Route path="/gestao/colaboradores" element={<GestaoColaboradores />} />
            <Route path="/admin/conteudo" element={<AdminConteudo />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
