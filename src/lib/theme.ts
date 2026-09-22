export type ThemePreference = 'system' | 'light' | 'dark'

const STORAGE_KEY = 'nh-web-theme'

export function getStoredTheme(): ThemePreference {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'light' || v === 'dark') return v
  } catch {
    // localStorage puede fallar (modo privado, storage bloqueado): nos
    // quedamos con la preferencia del sistema, no es crítico.
  }
  return 'system'
}

export function applyTheme(pref: ThemePreference) {
  if (pref === 'system') {
    document.documentElement.removeAttribute('data-theme')
  } else {
    document.documentElement.setAttribute('data-theme', pref)
  }
}

export function storeTheme(pref: ThemePreference) {
  applyTheme(pref)
  try {
    if (pref === 'system') localStorage.removeItem(STORAGE_KEY)
    else localStorage.setItem(STORAGE_KEY, pref)
  } catch {
    // Igual que arriba: como mucho no se recuerda entre visitas.
  }
}
