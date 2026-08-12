import { Button } from '@/components/ui/button'
import { TelaVertical } from './TelaVertical'

interface PassoConfirmacaoProps {
  nome: string
  cargo: string
  setor: string
  fotoUrl: string | null
  onConfirmar: () => void
  onCorrigir: () => void
}

const CAMPOS_OFFSET = ['ml-0', 'ml-7', 'ml-14']

/**
 * Passo 2 — "É você mesmo?".
 *
 * É confirmação, não pergunta: os dados vêm do cadastro do RH. O objetivo é
 * pegar erro de digitação antes de gerar a trilha errada — não fazer o
 * colaborador preencher formulário.
 *
 * Composição (§3.3): os três dados em ESCADA DIAGONAL, cada um deslocado do
 * anterior, com um traço de circuito conectando os três. Empilhados e
 * alinhados à esquerda seriam exatamente o grid monótono que queremos evitar.
 */
export function PassoConfirmacao({
  nome,
  cargo,
  setor,
  fotoUrl,
  onConfirmar,
  onCorrigir,
}: PassoConfirmacaoProps) {
  const campos = [
    { rotulo: 'Nome', valor: nome },
    { rotulo: 'Cargo', valor: cargo },
    { rotulo: 'Setor', valor: setor },
  ]

  return (
    <TelaVertical
      passo={1}
      totalPassos={2}
      acoes={
        <>
          <Button size="lg" className="h-14 w-full" onClick={onConfirmar}>
            Confirmar
          </Button>
          <button
            onClick={onCorrigir}
            className="h-11 w-full text-[12.5px] text-dg-muted underline-offset-4 hover:text-dg-yellow hover:underline"
          >
            Não sou eu / corrigir
          </button>
        </>
      }
    >
      {/* o avatar persiste entre os passos — é o fio de continuidade */}
      <div className="mb-8 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border-2 border-dg-yellow bg-dg-card2 font-display text-[12px] font-bold text-dg-yellow">
          {fotoUrl ? (
            <img src={fotoUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            nome
              .split(' ')
              .slice(0, 2)
              .map((p) => p[0])
              .join('')
          )}
        </span>
        <p className="dg-eyebrow">Conferência de cadastro</p>
      </div>

      <h2 className="mb-9 font-display text-[30px] font-bold leading-[1.05]">
        É <span className="text-dg-yellow">você</span>
        <br />
        mesmo?
      </h2>

      {/* escada diagonal com o traço ligando os degraus */}
      <div className="relative flex flex-1 flex-col justify-center pb-6">
        <svg
          className="pointer-events-none absolute left-[7px] top-1/2 h-[164px] w-[70px] -translate-y-[calc(50%+12px)]"
          viewBox="0 0 70 164"
          fill="none"
          aria-hidden
        >
          <path
            d="M2 10 L2 46 L30 74 L30 100 L58 128 L58 156"
            stroke="#FFDA00"
            strokeWidth="1.5"
            strokeOpacity="0.45"
            strokeLinecap="round"
          />
          {[10, 74, 128].map((cy, i) => (
            <circle key={cy} cx={2 + i * 28} cy={cy} r="3.5" fill="#FFDA00" />
          ))}
        </svg>

        <ul className="space-y-9">
          {campos.map((campo, i) => (
            <li
              key={campo.rotulo}
              className={`${CAMPOS_OFFSET[i]} animate-entraDaDireita pl-8 motion-reduce:animate-none`}
              style={{ animationDelay: `${i * 90}ms`, animationFillMode: 'backwards' }}
            >
              <span className="mb-0.5 block font-mono text-[9.5px] uppercase tracking-[0.24em] text-dg-muted">
                {campo.rotulo}
              </span>
              <b className="block font-display text-[19px] font-bold leading-tight text-dg-text">
                {campo.valor}
              </b>
            </li>
          ))}
        </ul>
      </div>
    </TelaVertical>
  )
}
