import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

// Complementa el botón físico de Android (useAndroidBackButton): dentro de
// la app también hace falta uno visible en pantalla, sobre todo en
// Android/iOS empaquetados donde no siempre hay un botón de navegador al
// que volver. No se muestra en Inicio ("/"), que es la raíz de la app.
//
// `to`: destino explícito en vez de retroceder por historial. Hace falta
// en Login/Register — son rutas standalone fuera del Shell de
// CoupleRoutes, y "atrás" ahí normalmente significa volver a la pantalla
// de bienvenida, no al historial del navegador (que puede estar vacío si
// es la primera pantalla que se abrió).
export function BackButton({ to }: { to?: string } = {}) {
  const { t } = useTranslation('common')
  const navigate = useNavigate()
  const location = useLocation()

  if (!to && location.pathname === '/') return null

  return (
    <button
      type="button"
      onClick={() => (to ? navigate(to) : navigate(-1))}
      aria-label={t('action.back')}
      className="flex h-9 w-9 items-center justify-center rounded-full text-lg text-[var(--color-ink)] transition-colors hover:bg-[var(--color-surface-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
    >
      ←
    </button>
  )
}
