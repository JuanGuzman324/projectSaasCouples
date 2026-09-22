// Falla si algún idioma le falta o le sobra una clave respecto al español
// (que es el idioma de referencia, según el flujo de traducción del plan).
// Uso: node scripts/check-locales.mjs
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const base = join(import.meta.dirname, '..', 'src', 'locales')
const langs = readdirSync(base).filter((f) => !f.startsWith('.'))
const REF = 'es'
if (!langs.includes(REF)) {
  console.error(`No existe el idioma de referencia "${REF}"`)
  process.exit(1)
}

function keysOf(lang) {
  const dir = join(base, lang)
  const files = readdirSync(dir).filter((f) => f.endsWith('.json'))
  const map = {}
  for (const f of files) {
    const ns = f.replace(/\.json$/, '')
    const data = JSON.parse(readFileSync(join(dir, f), 'utf-8'))
    map[ns] = new Set(Object.keys(data))
  }
  return map
}

const ref = keysOf(REF)
let hasError = false

for (const lang of langs) {
  if (lang === REF) continue
  const cur = keysOf(lang)
  for (const ns of Object.keys(ref)) {
    const refKeys = ref[ns]
    const curKeys = cur[ns] ?? new Set()
    const missing = [...refKeys].filter((k) => !curKeys.has(k))
    const extra = [...curKeys].filter((k) => !refKeys.has(k))
    if (missing.length) {
      hasError = true
      console.error(`[${lang}/${ns}] faltan: ${missing.join(', ')}`)
    }
    if (extra.length) {
      hasError = true
      console.error(`[${lang}/${ns}] sobran: ${extra.join(', ')}`)
    }
  }
}

if (hasError) {
  console.error('\nHay claves de traducción desincronizadas.')
  process.exit(1)
} else {
  console.log(`OK — los ${langs.length} idiomas tienen las mismas claves que "${REF}".`)
}
