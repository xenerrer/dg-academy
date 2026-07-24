/**
 * Lado de marca da tela de acesso (split-screen no desktop; faixa no mobile).
 * Foto da equipe DG, com o logo por cima e o texto no rodapé.
 *
 * A foto entra sem filtro: é a equipe do cliente e precisa aparecer. O único
 * overlay é o gradiente do rodapé, que sobe até pouco menos da metade e some —
 * existe para apoiar a leitura do texto, não para escurecer a imagem.
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
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[60%_center]"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-dg-bg from-0% via-dg-bg/75 via-26% to-transparent to-52%" />

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
