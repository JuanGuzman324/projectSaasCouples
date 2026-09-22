import type { ButtonHTMLAttributes } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost'
}

export function Button({ variant = 'primary', className = '', ...props }: Props) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 font-semibold transition duration-150 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]'
  const styles =
    variant === 'primary'
      ? 'bg-[var(--color-gold)] text-[var(--color-on-gold)] border border-[var(--color-gold)] hover:brightness-105 shadow-sm hover:shadow'
      : 'bg-transparent text-[var(--color-ink)] border border-[var(--color-line)] hover:border-[var(--color-muted)] hover:bg-[var(--color-surface-2)]'
  return <button className={`${base} ${styles} ${className}`} {...props} />
}
