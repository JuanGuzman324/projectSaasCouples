import type { HTMLAttributes } from 'react'

type Props = HTMLAttributes<HTMLParagraphElement> & { tone?: 'danger' | 'success' | 'info' }

const TONE_STYLES: Record<NonNullable<Props['tone']>, string> = {
  danger: 'border-[var(--color-danger)]/30 bg-[var(--color-danger)]/10 text-[var(--color-danger)]',
  success: 'border-[var(--color-sage)]/30 bg-[var(--color-sage)]/10 text-[var(--color-sage)]',
  info: 'border-[var(--color-ink)]/15 bg-[var(--color-ink)]/5 text-[var(--color-ink)]',
}

// Caja de aviso reutilizable para errores/confirmaciones de formulario, en
// vez del texto rojo suelto que había repetido en cada pantalla.
export function Alert({ tone = 'danger', className = '', ...props }: Props) {
  return (
    <p
      role="alert"
      className={`rounded-xl border px-3.5 py-2.5 text-sm font-medium ${TONE_STYLES[tone]} ${className}`}
      {...props}
    />
  )
}
