import { Link, useLocation } from 'react-router-dom'
import { Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Profile } from '@/types/database'

interface AppNavProps {
  usuario: Profile | null
  pontos: number
}

const LINK_JORNADA = { href: '/', rotulo: '/minhaJornada' }
const LINKS_GESTAO = [
  { href: '/gestao', rotulo: '/gestãoRH' },
  { href: '/admin/conteudo', rotulo: '/conteúdo' },
]

export function AppNav({ usuario, pontos }: AppNavProps) {
  const { pathname } = useLocation()

  const ehGestao = usuario?.papel === 'gestor' || usuario?.papel === 'admin'
  const links = ehGestao ? [LINK_JORNADA, ...LINKS_GESTAO] : [LINK_JORNADA]

  const iniciais = usuario?.nome
    .split(' ')
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-dg-line bg-dg-bg/90 px-7 py-4 backdrop-blur">
      <div className="flex items-center gap-7">
        {/* min-h-11: alvo de toque de 44px, o usuário pode estar de luva */}
        <Link to="/" className="flex min-h-11 items-center">
          <img src="/logo-dgtech.png" alt="DG Tech" className="h-10 w-auto object-contain" />
        </Link>
        <div className="hidden gap-5 text-[13.5px] font-semibold md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                'transition hover:text-dg-yellow',
                pathname === link.href ? 'text-dg-yellow' : 'text-dg-muted',
              )}
            >
              {link.rotulo}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3.5">
        <div className="flex items-center gap-1.5 font-mono text-[13px] font-bold">
          <Zap className="h-3.5 w-3.5 fill-dg-yellow text-dg-yellow" />
          {pontos}
        </div>
        <Link
          to="/perfil"
          className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border-2 border-dg-yellow bg-dg-card2 font-display text-[13px] font-bold text-dg-yellow"
        >
          {usuario?.foto_url ? (
            <img src={usuario.foto_url} alt="" className="h-full w-full object-cover" />
          ) : (
            iniciais
          )}
        </Link>
      </div>
    </nav>
  )
}
