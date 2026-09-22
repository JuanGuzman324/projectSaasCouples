import type { InputHTMLAttributes } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }

export function TextField({ label, error, id, className = '', ...props }: Props) {
  const inputId = id ?? props.name
  return (
    <label className="flex flex-col gap-1.5 text-sm font-semibold" htmlFor={inputId}>
      {label}
      <input
        id={inputId}
        className={`rounded-xl border border-[var(--color-line)] bg-[var(--color-bg)] px-3 py-2.5 text-base font-normal text-[var(--color-ink)] ${className}`}
        {...props}
      />
      {error && <span className="text-xs font-medium text-[var(--color-danger)]">{error}</span>}
    </label>
  )
}
