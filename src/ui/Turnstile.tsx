import { useEffect, useRef } from 'react'

// Widget de Cloudflare Turnstile (BACKLOG P0 legal: protección contra
// registros automatizados). Se usa en Login y Register porque activar
// captcha en Authentication → Attack Protection del panel de Supabase lo
// exige en ambos endpoints (signInWithPassword y signUp), no solo en el
// registro.
//
// Sin VITE_TURNSTILE_SITE_KEY (desarrollo local sin claves propias) el
// widget simplemente no se renderiza y onVerify nunca se llama; el
// captcha solo es obligatorio quien tenga `auth.captcha.enabled = true`
// en el proyecto real (ver supabase/config.toml).
declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: { sitekey: string; callback: (token: string) => void; 'expired-callback'?: () => void }
      ) => string
      reset: (widgetId?: string) => void
    }
  }
}

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined

export const isTurnstileConfigured = !!SITE_KEY

let scriptPromise: Promise<void> | null = null
function loadScript(): Promise<void> {
  if (scriptPromise) return scriptPromise
  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`)
    if (existing) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = SCRIPT_SRC
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('turnstile_script_failed'))
    document.head.appendChild(script)
  })
  return scriptPromise
}

export function Turnstile({ onVerify, onExpire }: { onVerify: (token: string) => void; onExpire?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!SITE_KEY) return
    let widgetId: string | undefined
    let cancelled = false
    loadScript().then(() => {
      if (cancelled || !containerRef.current || !window.turnstile) return
      widgetId = window.turnstile.render(containerRef.current, {
        sitekey: SITE_KEY,
        callback: onVerify,
        'expired-callback': onExpire,
      })
    })
    return () => {
      cancelled = true
      if (widgetId && window.turnstile) window.turnstile.reset(widgetId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!SITE_KEY) return null
  return <div ref={containerRef} />
}
