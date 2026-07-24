interface CartaoExtra {
  eyebrow: string
  titulo: string
  imagem: string
}

/**
 * Seção "/paraVoce" — conteúdo extra liberado (portada do protótipo aprovado).
 * As capas são imagens geradas no estilo DG (escuro + âmbar, tema de campo).
 *
 * Grid uniforme: todos os cards têm a mesma altura (align stretch) e a mesma
 * capa 16:9 — padrão consistente. A ordem pode variar por nivel_experiencia
 * no futuro; aqui é fixa.
 */
const CARTOES: CartaoExtra[] = [
  {
    eyebrow: 'Dicas de campo',
    titulo: '5 hábitos dos eletricistas mais requisitados da DG',
    imagem: '/paravoce/dicas-de-campo.jpg',
  },
  {
    eyebrow: 'NR-10 Express',
    titulo: 'O essencial da norma em 4 minutos, direto ao ponto',
    imagem: '/paravoce/nr10.jpg',
  },
  {
    eyebrow: 'Ferramentas',
    titulo: 'O kit que todo colaborador DG recebe — e como cuidar dele',
    imagem: '/paravoce/ferramentas.jpg',
  },
]

export function ParaVoce() {
  return (
    <section className="mb-14">
      <div className="mb-5 flex flex-wrap items-baseline gap-3.5">
        <h2 className="dg-secao">paraVoce</h2>
        <span className="text-label text-dg-muted">Conteúdo liberado — assista quando quiser</span>
      </div>

      <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CARTOES.map((cartao) => (
          <article
            key={cartao.eyebrow}
            className="group flex flex-col overflow-hidden rounded-surface border border-dg-line bg-dg-card transition duration-base ease-out-dg hover:-translate-y-1 hover:border-dg-yellow/40"
          >
            <div className="relative aspect-video shrink-0 overflow-hidden">
              <img
                src={cartao.imagem}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition duration-slow ease-out-dg group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dg-card via-dg-card/20 to-transparent" />
              <span className="absolute left-3 top-3 rounded-[6px] bg-dg-bg/70 px-2 py-1 font-mono text-eyebrow uppercase tracking-[0.2em] text-dg-yellow backdrop-blur">
                {cartao.eyebrow}
              </span>
            </div>
            <p className="flex-1 p-4 text-label leading-relaxed text-dg-text">{cartao.titulo}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
