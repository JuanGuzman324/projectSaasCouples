import type { SelectHTMLAttributes } from 'react'

type Props = SelectHTMLAttributes<HTMLSelectElement> & { label: string }

export function Select({ label, id, className = '', children, ...props }: Props) {
  const selectId = id ?? props.name
  return (
    <label className="flex flex-col gap-1.5 text-sm font-semibold" htmlFor={selectId}>
      {label}
      <select
        id={selectId}
        className={`rounded-xl border border-[var(--color-line)] bg-[var(--color-bg)] px-3 py-2.5 text-base font-normal text-[var(--color-ink)] transition-colors duration-150 hover:border-[var(--color-muted)] focus:border-[var(--color-gold)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/20 ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  )
}
