# Lista de Componentes Esperados

---

## Autenticação

### LoginForm
- Inputs: e-mail, senha
- Botão "Entrar"
- Integrado ao Supabase Auth (`supabase.auth.signInWithPassword`)
- Tratamento de erro (e-mail inválido, senha errada)
- Redireciona automaticamente se já logado
- **Props:** `onSuccess?: () => void`

### OnboardingFlow
- Upload de foto (Supabase Storage)
- Select de nível_experiencia: ['iniciante', 'intermediario', 'veterano']
- Botão "Continuar"
- Salva em `profiles` + redireciona para home
- **Props:** `userId: string`

---

## Trilha / Home

### TrilhaCarrossel (MVP — versão atual)
- Lista de módulos em carrossel horizontal
- Cards com capa, título, estado (concluído/atual/bloqueado)
- Módulo "atual" com botão "Iniciar"
- Módulo "concluído" com botão "Revisar"
- Módulo "bloqueado" desabilitado
- **Props:** `modulos: Modulo[], statusModulos: Record<string, StatusModulo>, onClickModulo: (moduloId: string) => void`

### MapaJornada (v1.1 — quando arte chegar)
- SVG 2D da jornada (path sinuoso)
- Avatar do user posicionado na etapa atual (framer-motion)
- Animação ao avançar (avatar viaja até próximo ponto)
- Etapas numeradas
- Cor amarelo DG + fundo escuro
- Estética referência: Jornada Elevare (`fontes/referencias/`)
- **Props:** `modulos: Modulo[], moduloAtual: string, onClickModulo: (moduloId: string) => void`

### AvatarViajante
- Avatar (foto do perfil ou placeholder)
- Posicionado no SVG do mapa
- Animação de movimento com `framer-motion` (keyframes ao longo do path)
- Pulsação em hover
- **Props:** `fotoUrl?: string, posicaoModuloAtual: number, totalModulos: number`

### ModuloPoster
- Card vertical com capa (capa_url ou color placeholder)
- Título + descrição
- Badge de estado (energizado/atual/bloqueado)
- Número do módulo no canto
- Pontos totais da trilha (lado inferior)
- Botão de ação (Iniciar/Revisar/Bloqueado)
- **Props:** `modulo: Modulo, status: StatusModulo, onClick: () => void`

### ParaVoce
- Componente de recomendação (primeira linha da home)
- Baseado em rol + setor
- Texto como: "Olá, Marcos! Hoje é dia de Segurança & EPIs"
- Botão "Começar"
- **Props:** `usuario: Profile, moduloRecomendado: Modulo`

---

## Aula

### PandaPlayer
- Embed do Panda Video (iframe)
- Controles de seek **desabilitados** na 1ª visualização
- Velocidade **travada em 1×**
- Heartbeat a cada 10s (via API)
- Feedback visual: "Vídeo travado até completar a reprodução"
- Quando `seek_liberado = true`: player se desconfigura e libera controles
- **Props:** `pandaVideoId: string, duracao: number, onCompleted: () => void, seekLiberado: boolean`

### QuizCard
- Renderiza uma questão por vez
- Enunciado + 4 alternativas (botões)
- Feedback imediato após responder
- Indicador de progresso (1/3, 2/3, 3/3)
- Botão "Próxima" ou "Finalizar" (desabilitado até responder)
- **Props:** `questao: Questao, onResponder: (indiceEscolhido: number) => void, numeroPergunta: number, totalPerguntas: number`

### ResultadoModulo
- Confete (framer-motion ou animate.css)
- Texto: "Parabéns! Módulo concluído"
- Placar: "Acertos: 3/3" ou "Acertos: 2/3"
- Pontos ganhos: "+ 90 pontos"
- Botão "Ver Ranking" → `/gestao` ou `/perfil`
- Botão "Próximo Módulo" → `/aula/:proximoModuloId`
- **Props:** `acertos: number, total: number, pontos: number`

### ComentariosArvore (V1.1)
- Árvore de comentários (parent_id)
- Form de novo comentário
- Delete próprio comentário
- **Props:** `aulaId: string`

---

## Painel de Gestão

### PainelKPIs
- 4 cards com KPIs do tenant:
  1. Colaboradores em trilha (count)
  2. Média de acertos (%)
  3. Tempo médio de conclusão (horas)
  4. Última atividade (data)
- Refrescam com Realtime do Supabase
- **Props:** `kpis: KPIsTenant`

### TabelaProgresso
- Tabela com colunas:
  - Nome, Cargo, Setor
  - Aulas Concluídas / Total
  - Acertos %
  - Última Atividade
  - Ação (expandir detalhes)
- Ordenável por coluna
- Filtrável por setor
- Realtime (atualiza quando colaborador conclui algo)
- **Props:** `progresso: ProgressoColaborador[], onClickLinhaUsuario?: (userId: string) => void`

### CadastroColaborador
- Form: nome, e-mail, cargo, setor
- Botão "Criar"
- Sucesso: toast, limpa form
- Erro: mostra mensagem
- **Props:** `onCriado?: (profile: Profile) => void`

### UploadFoto
- Input file (imagem)
- Preview
- Botão "Salvar"
- Integrado ao Supabase Storage
- **Props:** `userId: string, onUpload?: (url: string) => void`

---

## Admin (CRUD)

### CRUDTrilhas
- Lista de trilhas (table ou cards)
- Botão "+ Nova Trilha"
- Modal: form com nome, descrição, ativa
- Aba "Setores": seletor multi-select de setores (trilha_setores)
- Delete com confirmação
- **Props:** `tenantId: string`

### CRUDModulos
- Seletor de trilha (dropdown)
- Lista de módulos da trilha selecionada
- Botão "+ Novo Módulo"
- Modal: form com numero, titulo, descricao, capa_url (upload)
- Reorder (drag-drop)
- Delete com confirmação
- **Props:** `trilhaId: string`

### CRUDAulas
- Seletor de módulo (dropdown)
- Lista de aulas do módulo
- Botão "+ Nova Aula"
- Modal: form com titulo, descricao, panda_video_id (input), duracao_seg (auto-fetch do Panda)
- Delete com confirmação
- **Props:** `moduloId: string`

### CRUDQuestoes
- Seletor de módulo (dropdown)
- Lista de questões do módulo
- Botão "+ Nova Questão"
- Modal: form com
  - Enunciado (textarea)
  - 4 alternativas (inputs)
  - Radio de resposta correta
  - Feedback (textarea)
  - Pontos (number)
- Delete com confirmação
- **Props:** `moduloId: string`

---

## UI Geral (shadcn/ui)

### AppNav
- Barra de navegação (top)
- Logo DG Tech
- Avatar do user (foto)
- Menu dropdown: Perfil, Logout
- Links de navegação (colaborador: Home, Perfil | gestor: Gestão, Admin)
- **Props:** Auto-detecta rol via `obterUsuarioAtual()`

### Modal
- Overlay + card
- Header com título
- Body com conteúdo
- Footer com botões (Cancel, OK)
- Fecha ao clicar Escape ou Cancel
- **Props:** `open: boolean, onOpenChange: (open) => void, title: string, children: ReactNode`

### Button
- Variantes: primary (amarelo), secondary (cinza), danger (vermelho)
- Estados: default, hover, disabled, loading
- Tamanhos: sm, md, lg
- **Props:** `variant?: 'primary' | 'secondary' | 'danger', disabled?: boolean, loading?: boolean, onClick: () => void, children: ReactNode`

### Input
- Text, email, password, number
- Placeholder
- Label
- Error message
- Integrado com react-hook-form
- **Props:** `type, placeholder, label, error, {...register()}`

### Select
- Dropdown
- Opções
- Placeholder
- Multi (para trilha_setores)
- Integrado com react-hook-form
- **Props:** `options: Array<{label, value}>, placeholder, multi?, {...register()}`

### Card
- Container com padding, border, border-radius
- Sombra suave (dg-card)
- **Props:** `children: ReactNode, className?: string`

### Table
- Header + body
- Linhas ordenáveis
- Filtros por coluna
- Paginação (se muitos resultados)
- **Props:** `columns: Array<{key, label, sortable}>, data: Array, onRowClick?: (row) => void`

### Toast
- Notificação curta (sucesso, erro, info)
- Auto-desaparece em 3s
- Posição: bottom-right
- **Props:** `type: 'success' | 'error' | 'info', message: string, duration?: number`

### Spinner/Loading
- Ícone giratório
- Overlay opaco em modal
- **Props:** `size?: 'sm' | 'md' | 'lg'`

### Confete (animação)
- Framer-motion ou animate.css
- Papéis caindo do topo
- Cores: amarelo DG, branco
- Dispara ao concluir módulo
- **Props:** `triggerKey: string` (para re-disparar)

---

## Padrões de Componente

### Todos devem:
- ✅ Ter TypeScript
- ✅ Ser funcionais (não classes)
- ✅ Usar hooks (useState, useEffect, useQuery)
- ✅ Respeitar tokens de design (cores, tipografia, raios)
- ✅ Tailwind inline (sem CSS Modules)
- ✅ Máx ~150 linhas (split grandes em sub-componentes)
- ✅ Exports nomeados, sem barrel files
- ✅ Props com interface TypeScript

### Exemplo de padrão

```typescript
// src/components/MeuComponente.tsx
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/Button'
import { listarAlgo } from '@/lib/api'

interface MeuComponenteProps {
  id: string
  onSuccess?: () => void
}

export function MeuComponente({ id, onSuccess }: MeuComponenteProps) {
  const { data, error, isPending } = useQuery({
    queryKey: ['algo', id],
    queryFn: () => listarAlgo(id),
  })

  if (isPending) return <div>Carregando...</div>
  if (error) return <div className="text-dg-danger">Erro: {error.message}</div>

  return (
    <div className="space-y-4">
      <h2 className="text-title font-display">Meu Componente</h2>
      {/* Renderizar data */}
      <Button onClick={onSuccess}>Pronto</Button>
    </div>
  )
}
```

---

## Checklist de Implementação

- [ ] Autenticação (LoginForm + OnboardingFlow)
- [ ] Home (TrilhaCarrossel ou MapaJornada + ModuloPoster)
- [ ] Aula (PandaPlayer + QuizCard + ResultadoModulo)
- [ ] Perfil (dados + progresso)
- [ ] Painel de Gestão (PainelKPIs + TabelaProgresso + CadastroColaborador)
- [ ] Admin (CRUD de trilhas, módulos, aulas, questões)
- [ ] AppNav + rotas
- [ ] UI base (Button, Input, Select, Modal, Card, Toast)
- [ ] Testes com dados mock
- [ ] Ligar ao Supabase (trocar implementação de api.ts)
- [ ] Configurar Realtime
- [ ] Deploy em Vercel/Netlify
