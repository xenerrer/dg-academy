/**
 * Lado de marca da tela de acesso (split-screen no desktop; faixa no mobile).
 * Foto da equipe DG, com o logo por cima e o texto no rodapé.
 *
 * O escurecimento aqui é bem mais leve que o do backdrop anterior: aquele era
 * textura e podia sumir, esta é a equipe do cliente e precisa ser reconhecível.
 * Quem garante a leitura do texto é o gradiente de baixo, não um filtro na
 * imagem inteira.
 *
 * object-position em 60% porque as duas pessoas ficam à direita do centro da
 * foto — no recorte vertical do painel, centralizar cortaria a mulher.
 */
export function PainelMarca() {
  return (
    <div className="relative flex min-h-[200px] flex-col justify-between overflow-hidden bg-dg-bg p-8 lg:min-h-[100dvh] lg:p-12">
      <img
        src="/equipe-dgtech.jpg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[60%_center] brightness-[0.62] contrast-[1.04] saturate-[0.92]"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_46%_at_50%_30%,rgb(var(--dg-yellow)/0.10),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-dg-bg via-dg-bg/55 to-dg-bg/10" />

      <div className="relative">
        <img src="/logo-dgtech.png" alt="DG Tech" className="h-11 w-auto object-contain lg:h-14" />
      </div>

      <div className="relative hidden lg:block">
        <p className="dg-eyebrow mb-4">Plataforma de integração e treinamentos</p>
        <h2 className="max-w-sm font-display text-heading font-bold leading-tight">
          O onboarding que <span className="text-dg-yellow">energiza</span> sua equipe desde o
          primeiro dia.
        </h2>
        <p className="mt-4 max-w-xs text-label text-dg-muted">
          Assista, responda, evolua. Cada colaborador vê a trilha do seu setor.
        </p>
      </div>
    </div>
  )
}
