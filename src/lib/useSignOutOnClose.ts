import { useEffect } from 'react'
import { supabase } from './supabase'

// Cierra la sesión cada vez que se cierra la pestaña/ventana. El evento
// 'pagehide' es el más confiable para esto (a diferencia de 'beforeunload',
// no bloquea el back/forward cache del navegador) — pero el navegador NO
// distingue "se cerró la ventana" de "se recargó la página" ni de
// "se navegó a otro sitio": las tres disparan 'pagehide' por igual, así
// que recargar (F5) también cierra la sesión con este hook activo.
export function useSignOutOnClose() {
  useEffect(() => {
    const onPageHide = () => {
      supabase.auth.signOut()
    }
    window.addEventListener('pagehide', onPageHide)
    return () => window.removeEventListener('pagehide', onPageHide)
  }, [])
}
