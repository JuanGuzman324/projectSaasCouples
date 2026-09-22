import { useEffect } from 'react'

export function Modal({
  title,
  onClose,
  children,
  wide = false,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
  wide?: boolean
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className={`mx-auto my-6 rounded-2xl bg-[var(--color-surface)] p-6 shadow-xl ${wide ? 'max-w-4xl' : 'max-w-lg'}`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="[font-family:var(--font-display)] text-2xl">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-2xl leading-none">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
