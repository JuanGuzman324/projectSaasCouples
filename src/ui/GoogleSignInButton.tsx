import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { Button } from './Button'

// Sin VITE_GOOGLE_AUTH_ENABLED=true (desarrollo local, o antes de tener
// las credenciales OAuth reales configuradas en el proyecto Supabase), el
// botón no se muestra — evita ofrecer un login que fallaría porque el
// provider "google" todavía no está activado en Authentication → Providers
// (ver README, sección "Login con Google").
export const isGoogleAuthEnabled = import.meta.env.VITE_GOOGLE_AUTH_ENABLED === 'true'

export function GoogleSignInButton() {
  const { t } = useTranslation('auth')

  if (!isGoogleAuthEnabled) return null

  async function onClick() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
  }

  return (
    <Button type="button" variant="ghost" onClick={onClick} className="w-full">
      {t('login.google')}
    </Button>
  )
}
