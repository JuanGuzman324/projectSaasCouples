import type { HTMLAttributes } from 'react'

export function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5 shadow-sm transition-shadow duration-150 ${className}`}
      {...props}
    />
  )
}
