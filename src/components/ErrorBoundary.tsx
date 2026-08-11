import { Component, type ErrorInfo, type ReactNode } from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  comErro: boolean
}

/**
 * Rede de segurança geral: qualquer componente que quebrar em render (ex.: o
 * SDK de um player de vídeo de terceiro lançando um erro fora de qualquer
 * try/catch nosso) some a página inteira sem isso — React desmonta a árvore
 * toda e fica em branco, sem aviso pro usuário. Aqui, o resto do app continua
 * de pé e a pessoa só precisa recarregar a tela travada.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { comErro: false }

  static getDerivedStateFromError() {
    return { comErro: true }
  }

  componentDidCatch(erro: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', erro, info.componentStack)
  }

  render() {
    if (this.state.comErro) {
      return (
        <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-dg-bg px-6 text-center">
          <p className="font-display text-lg font-bold text-dg-text">Algo deu errado nessa tela</p>
          <p className="max-w-sm text-sm text-dg-muted">
            Foi um problema pontual de carregamento. Recarregar a página resolve.
          </p>
          <Button onClick={() => window.location.reload()}>
            Recarregar <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
