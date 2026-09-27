import { useEffect } from 'react'
import { App as CapacitorApp } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'

// Empaquetado con Capacitor (BACKLOG P2/P3): sin esto, el botón físico de
// "atrás" en Android cierra la app en vez de navegar hacia atrás dentro de
// React Router. Solo se activa en plataforma nativa — en el navegador web
// normal ese botón no existe y @capacitor/app no tiene nada que escuchar.
export function useAndroidBackButton() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return

    const listener = CapacitorApp.addListener('backButton', () => {
      if (window.history.length > 1) {
        window.history.back()
      } else {
        CapacitorApp.exitApp()
      }
    })

    return () => {
      listener.then((l) => l.remove())
    }
  }, [])
}
