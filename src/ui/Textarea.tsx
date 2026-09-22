import type { TextareaHTMLAttributes } from 'react'

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }

export function Textarea({ label, id, className = '', ...props }: Props) {
  const areaId = id ?? props.name
  return (
    <label className="flex flex-col gap-1.5 text-sm font-semibold" htmlFor={areaId}>
      {label}
      <textarea
        id={areaId}
        rows={3}
        className={`resize-y rounded-xl border border-[var(--color-line)] bg-[var(--color-bg)] px-3 py-2.5 text-base font-normal text-[var(--color-ink)] transition-colors duration-150 hover:border-[var(--color-muted)] focus:border-[var(--color-gold)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/20 ${className}`}
        {...props}
      />
    </label>
  )
}
