import { useEffect } from 'react'
import { App as CapacitorApp } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'
import { supabase } from './supabase'

// Empaquetado con Capacitor (BACKLOG P2/P3): sin esto, el botón físico de
// "atrás" en Android cierra la app en vez de navegar hacia atrás dentro de
// React Router. Solo se activa en plataforma nativa — en el navegador web
// normal ese botón no existe y @capacitor/app no tiene nada que escuchar.
//
// El signOut() antes de salir es deliberado: cierra sesión solo cuando la
// persona sale de verdad desde la pantalla raíz con este botón, no cuando
// manda la app a segundo plano con el botón de inicio (Capacitor no puede
// distinguir eso de forma confiable con backButton — para eso haría falta
// appStateChange, que dispara también con notificaciones o al cambiar de
// app un segundo, y sería más molesto que útil aquí).
export function useAndroidBackButton() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return

    const listener = CapacitorApp.addListener('backButton', async () => {
      if (window.history.length > 1) {
        window.history.back()
      } else {
        await supabase.auth.signOut()
        CapacitorApp.exitApp()
      }
    })

    return () => {
      listener.then((l) => l.remove())
    }
  }, [])
}
