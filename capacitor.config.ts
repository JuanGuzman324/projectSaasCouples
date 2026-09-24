import type { CapacitorConfig } from '@capacitor/cli'

// Empaqueta el mismo build web (`dist/`, generado por `npm run build`) como
// app Android — no hay código nativo separado que mantener. iOS queda
// documentado pero no armado: requiere macOS + Xcode, que no existen en
// este entorno (ver README, sección "Empaquetado con Capacitor").
const config: CapacitorConfig = {
  appId: 'app.nuestrahistoria.mobile',
  appName: 'Nuestra historia',
  webDir: 'dist',
}

export default config
