# Design System — Token System

**Tema dark-only. Fonte única de verdade: CSS vars em `src/index.css` + nomes em `tailwind.config.ts`.**

---

## Cores

Todas as cores são **CSS custom properties** no `:root` de `src/index.css`, em formato RGB com canais:

```css
:root {
  --dg-yellow: 255 218 0;          /* #FFDA00 — marca */
  --dg-yellow-soft: 255 218 0;     /* 20% de opacidade para backgrounds */
  --dg-bg: 10 10 10;               /* #0A0A0A — fundo principal */
  --dg-card: 20 20 20;             /* #141414 — card */
  --dg-card2: 28 28 28;            /* #1C1C1C — card secundário */
  --dg-line: 44 44 44;             /* #2C2C2C — divisor, border */
  --dg-text: 255 255 255;          /* #FFFFFF — text principal */
  --dg-muted: 153 153 153;         /* #999999 — text secundário */
  --dg-success: 76 175 80;         /* #4CAF50 — resposta correta */
  --dg-danger: 244 67 54;          /* #F44336 — resposta errada */
  --dg-info: 33 150 243;           /* #2196F3 — informação */
  
  /* Chart ramp — ordinal (pódio, ranking) */
  --chart-mark: 255 215 0;         /* #FFD700 — 1º lugar */
  --chart-mark-2: 255 179 0;       /* #FFB300 — 2º lugar */
  --chart-mark-3: 255 149 0;       /* #FF9500 — 3º lugar */
  --chart-muted: 102 102 102;      /* #666666 — fundo */
  --chart-grid: 44 44 44;          /* #2C2C2C — grid */
}
```

### Como usar no Tailwind

```jsx
// BG
<div className="bg-dg-bg">              {/* #0A0A0A */}
<div className="bg-dg-card">            {/* #141414 */}
<div className="bg-dg-yellow/10">       {/* #FFDA00 com 10% opacidade */}

// Text
<p className="text-dg-text">Primary text</p>
<p className="text-dg-muted">Secondary text</p>

// Border
<div className="border border-dg-line">
```

### Paleta reduzida para referência

| Token | Hex | Uso |
|---|---|---|
| `dg-yellow` | #FFDA00 | Marca, ênfase, CTA, ícones |
| `dg-bg` | #0A0A0A | Fundo principal |
| `dg-card` | #141414 | Cards, overlays padrão |
| `dg-card2` | #1C1C1C | Card secundário, contraste |
| `dg-line` | #2C2C2C | Divisor, border |
| `dg-text` | #FFFFFF | Texto principal |
| `dg-muted` | #999999 | Texto secundário, disabled |
| `dg-success` | #4CAF50 | Resposta correta |
| `dg-danger` | #F44336 | Resposta errada |
| `dg-info` | #2196F3 | Informação |

---

## Tipografia

Escala semântica — **use nomes, não pixels soltos.**

```css
:root {
  --font-size-eyebrow: 10.5px;
  --font-size-caption: 11.5px;
  --font-size-label: 12.5px;
  --font-size-body: 14px;
  --font-size-body-lg: 15px;
  --font-size-subtitle: 17px;
  --font-size-title: 21px;
  --font-size-heading: 26px;
  --font-size-display: 30px;
}
```

### Usando no Tailwind

```jsx
<p className="text-eyebrow">Mini label</p>
<p className="text-caption">Legenda de foto</p>
<p className="text-label">Rótulo de input</p>
<p className="text-body">Parágrafo normal</p>
<p className="text-subtitle">Subtitle</p>
<h2 className="text-title">Heading 2</h2>
<h1 className="text-heading">Heading 1</h1>
<h1 className="text-display">Título de página</h1>
```

### Famílias de fonte

| Família | Uso | Fallback |
|---|---|---|
| Space Grotesk | Títulos, display, eyebrow | sans-serif |
| Inter | Body, captions (padrão) | system-ui |
| JetBrains Mono | Rótulos técnicos, labels, código | monospace |
| Montserrat | Capas de módulos | sans-serif |

### Aplicar no JSX

```jsx
<h1 className="font-display text-display">Página</h1>
<p className="font-sans text-body">Parágrafo</p>
<code className="font-mono text-label">//30 pontos</code>
<img src="capa.jpg" className="font-cover" alt="Módulo" />
```

---

## Raios (Border Radius)

Semânticos — use pela intenção, não pelo tamanho.

```css
:root {
  --radius-control: 8px;      /* Botões, inputs */
  --radius-poster: 12px;      /* Capas de módulos */
  --radius-surface: 12px;     /* Cards, containers */
  --radius-modal: 16px;       /* Modais */
}
```

```jsx
<button className="rounded-control">Enviar</button>
<input className="rounded-control" />
<div className="rounded-poster">Capa do módulo</div>
<div className="rounded-surface">Card</div>
<div className="rounded-modal">Modal</div>
```

---

## Movimento (Transições e Durações)

Durações padronizadas:

```css
:root {
  --duration-fast: 180ms;
  --duration-base: 280ms;
  --duration-slow: 500ms;
  --duration-slower: 900ms;
  
  --ease-out-dg: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-spring-dg: cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
```

### Usando no Tailwind

```jsx
<div className="transition-all duration-base ease-out-dg">Anima</div>
<div className="transition-colors duration-fast">Cor muda rápido</div>
<button className="hover:scale-110 transition-transform duration-base ease-spring-dg">
  Clica aqui
</button>
```

### Com framer-motion

```jsx
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5, ease: 'easeOut' }}
/>
```

### Keyframes pré-definidos

```jsx
<div className="animate-bump">Bate</div>
<div className="animate-shake">Chacoalha</div>
<div className="animate-fadeUp">Entra subindo</div>
<div className="animate-seloIn">Selo aparece</div>
<div className="animate-kenburns">Zoom panorâmico</div>
<div className="animate-respira">Respira (halo vazio)</div>
<div className="animate-gira">Gira infinito</div>
<div className="animate-entraDaDireita">Entra da direita</div>
```

---

## Espaçamento

Padrão Tailwind com escala 4px.

```
p-0 = 0
p-1 = 4px
p-2 = 8px
p-3 = 12px
p-4 = 16px
p-6 = 24px
p-8 = 32px
... e assim vai
```

Nada de valores custom `p-[17px]` — fica fora do sistema.

---

## Ícones

**lucide-react**, nunca emoji.

```jsx
import { Zap, PlayCircle, CheckCircle, AlertCircle } from 'lucide-react'

<Zap className="text-dg-yellow" size={24} />        {/* Marca DG */}
<PlayCircle className="text-dg-yellow" />            {/* Play */}
<CheckCircle className="text-dg-success" />          {/* Resposta correta */}
<AlertCircle className="text-dg-danger" />           {/* Erro */}
```

---

## Assinaturas Visuais a Preservar

### Barra `/` antes de títulos de seção

```jsx
<div className="flex items-center gap-2">
  <div className="w-0.5 h-6 bg-dg-yellow"></div>
  <h2 className="text-title">Minha Jornada</h2>
</div>
```

### Rótulos `//` em JetBrains Mono

```jsx
<span className="font-mono text-label text-dg-muted">
  // 1.200 pontos
</span>
```

### Ícone `Zap` como marca recorrente

```jsx
import { Zap } from 'lucide-react'
<Zap className="text-dg-yellow" size={20} />
```

### Vocabulário

- "Módulo **energizado**" (não "concluído")
- "Minha **jornada**" (não "meus cursos")
- "**Mapa** 2D" (trilha visual)
- "**Aula**" (conteúdo de vídeo)
- "**Setor**" (departamento/área)

---

## Logo

- **Sempre inteira:** símbolo + "DGTECH" + "soluções corporativas"
- **Nunca recortada** (sem símbolo só, sem "soluções corporativas" só)
- Colocar em branco (#FFFFFF) sobre fundo escuro

```jsx
<img src="/logo-dgtech.png" alt="DG Tech Soluções Corporativas" />
```

---

## Exemplo completo de um Card

```jsx
<div className="bg-dg-card rounded-surface p-6 border border-dg-line">
  <div className="flex items-center gap-2 mb-4">
    <div className="w-0.5 h-5 bg-dg-yellow"></div>
    <h3 className="text-title font-display">Título</h3>
  </div>
  
  <p className="text-body text-dg-muted mb-4">
    Descrição aqui
  </p>
  
  <div className="flex items-center justify-between">
    <span className="font-mono text-label text-dg-yellow">
      // 30 pontos
    </span>
    <button className="px-4 py-2 rounded-control bg-dg-yellow text-dg-bg font-display text-label hover:brightness-110 transition-all duration-base">
      Começar
    </button>
  </div>
</div>
```

---

## Dark mode

Já está configurado como padrão (`darkMode: 'class'` no `tailwind.config.ts`). 

Se precisar suportar light mode no futuro (spoiler: não vai), usar:

```jsx
<div className="dark:bg-dg-bg">
```

Por agora, zero light mode.

---

## Validação de cores

Para gráficos e visualizações de dados, usar o validador do skill `dataviz`:

- Ordinal (pódio): use `chart-mark` / `chart-mark-2` / `chart-mark-3`
- Sequencial: derivar do amarelo DG com saturation/lightness
- Diverging: combinações de `dg-success` / `dg-danger`

Nunca inventar cores novas — tudo sai da paleta.
