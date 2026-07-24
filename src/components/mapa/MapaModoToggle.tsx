import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

const MODOS = [
  { to: '/mapa', rotulo: 'Mapa' },
  { to: '/mapa/animado', rotulo: 'Mapa animado' },
] as const

/**
 * Alterna entre a arte estática (padrão) e a versão interativa com avatar.
 * Usada no header do desktop (ao lado do título) e, no mobile — onde o header
 * não tem espaço sobrando —, solta no topo do corpo da página.
 */
export function MapaModoToggle({ className }: { className?: string }) {
  const { pathname } = useLocation()

  return (
    <nav className={cn('inline-flex rounded-control border border-dg-line bg-dg-card2 p-1', className)}>
      {MODOS.map((modo) => (
        <Link
          key={modo.to}
          to={modo.to}
          aria-current={pathname === modo.to ? 'page' : undefined}
          className={cn(
            'flex min-h-9 items-center rounded-[6px] px-4 text-label font-semibold transition',
            pathname === modo.to ? 'bg-dg-yellow text-dg-bg' : 'text-dg-muted hover:text-dg-text',
          )}
        >
          {modo.rotulo}
        </Link>
      ))}
    </nav>
  )
}
