// Genera REVISION_DE_FR.md: todas las claves de traducción, es/en de
// referencia junto al de/fr a revisar, agrupadas por namespace. No
// reemplaza una revisión nativa real (BACKLOG P1) — solo arma el material
// para que sea rápida cuando la haga alguien que hable el idioma de
// verdad. Uso: node scripts/gen-review-doc.mjs
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const base = join(import.meta.dirname, '..', 'src', 'locales')
const namespaces = readdirSync(join(base, 'es'))
  .filter((f) => f.endsWith('.json'))
  .map((f) => f.replace(/\.json$/, ''))
  .sort()

function load(lang, ns) {
  return JSON.parse(readFileSync(join(base, lang, `${ns}.json`), 'utf-8'))
}

let totalKeys = 0
const sections = []

for (const ns of namespaces) {
  const es = load('es', ns)
  const en = load('en', ns)
  const de = load('de', ns)
  const fr = load('fr', ns)
  const keys = Object.keys(es).sort()
  totalKeys += keys.length

  const rows = keys.map((k) => {
    const cell = (v) => (v ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ')
    return `| \`${k}\` | ${cell(es[k])} | ${cell(en[k])} | ${cell(de[k])} | ${cell(fr[k])} |`
  })

  sections.push(
    `## \`${ns}\` (${keys.length} claves)\n\n` +
      `| Clave | es (referencia) | en (referencia) | de (a revisar) | fr (a revisar) |\n` +
      `| --- | --- | --- | --- | --- |\n` +
      rows.join('\n') +
      '\n'
  )
}

const header = `# Revisión nativa de alemán y francés

Generado el ${new Date().toISOString().slice(0, 10)} directo del contenido
real de \`src/locales/\` (\`node scripts/gen-review-doc.mjs\`, no a mano —
si cambia el texto fuente, se vuelve a generar, no se edita este archivo
directamente).

**${totalKeys} claves** en **${namespaces.length} namespaces**. El español
y el inglés se muestran solo como referencia de qué dice cada texto — la
traducción de referencia es el español (\`src/locales/es/\`, idioma base
del proyecto); lo que hace falta revisar de verdad es la columna \`de\` y
la columna \`fr\`.

Qué buscar especialmente:
- Que suene natural, no traducido literalmente palabra por palabra.
- El tono cálido/romántico de la app (\`moments.json\`, \`home.json\`
  sobre todo) — fácil de volver robótico al traducir.
- Formalidad: \`fr\` usa **tuteo** (\`tu\`, no \`vous\`) en todo el proyecto,
  a propósito, por el tono cercano de la app. \`de\` usa **"du"**, no
  "Sie".
- Interpolaciones (\`{{count}}\`, \`{{word}}\`, etc.) y textos entre
  comillas dobles escapadas (\`\\"...\\"\`) deben conservarse igual, solo
  traduciendo alrededor.
- Que \`npm run check:locales\` siga en verde después de cualquier cambio
  (compara claves, no contenido — solo confirma que no falte ni sobre
  ninguna).

`

writeFileSync(join(import.meta.dirname, '..', 'REVISION_DE_FR.md'), header + sections.join('\n'))
// eslint-disable-next-line no-console
console.log(`REVISION_DE_FR.md generado: ${totalKeys} claves, ${namespaces.length} namespaces.`)
