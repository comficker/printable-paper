/**
 * Regenerate everything in this package that is derived from the website.
 *
 *   bun scripts/sync-data.ts
 *
 * Two things are copied, never hand-edited:
 *   1. src/paper.ts   — the geometry engine, byte-for-byte from the site, so the
 *                       sheets this package prints are the same sheets the site
 *                       prints. The engine has no imports, so a plain copy works.
 *   2. data/*.json    — paper types, sizes and spacings, read out of the site's
 *                       own tables rather than retyped.
 *
 * This only runs where the website's source sits next to this package, so it is
 * a maintainer script: everything it produces is committed, and nobody needs to
 * run it to build or use the package.
 */
import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const PKG = join(HERE, '..')
const WEB = join(PKG, '..', 'freegraphpaper_web')
const SITE = 'https://freegraphpaper.net'

copyFileSync(join(WEB, 'app', 'utils', 'paper.ts'), join(PKG, 'src', 'paper.ts'))

const { PAPER_SIZES, SPACING_OPTIONS, LINE_COLORS, THICKNESS, MARGINS } = await import(
  join(WEB, 'app', 'utils', 'paper.ts')
)
const { CATEGORIES } = await import(join(WEB, 'app', 'data', 'templates.ts'))
const { STYLE_I18N } = await import(join(WEB, 'app', 'data', 'i18n', 'styles.ts'))

const LOCALES = ['es', 'de', 'fr', 'pt'] as const

const round = (n: number) => Math.round(n * 1000) / 1000

const types = CATEGORIES.map((c: any) => {
  const translations: Record<string, { name: string; url: string }> = {}
  for (const locale of LOCALES) {
    const entry = (STYLE_I18N as any)[locale]?.[c.id]
    if (entry) translations[locale] = { name: entry.noun, url: `${SITE}/${locale}/${entry.slug}` }
  }
  return {
    id: c.paperType,
    name: c.title,
    description: c.blurb,
    freeGraphPaper: SITE + c.path,
    translations,
  }
})

const sizes = Object.entries(PAPER_SIZES).map(([id, s]: [string, any]) => ({
  id,
  name: s.label,
  widthMm: s.w,
  heightMm: s.h,
  widthIn: round(s.w / 25.4),
  heightIn: round(s.h / 25.4),
  series: s.series,
}))

const spacings = SPACING_OPTIONS.map((s: any) => ({ id: s.id, name: s.label, mm: round(s.mm) }))

const styles = {
  lineColors: Object.entries(LINE_COLORS).map(([id, c]: [string, any]) => ({ id, name: c.label, hex: c.hex })),
  lineThicknessMm: THICKNESS,
  marginsMm: MARGINS,
}

mkdirSync(join(PKG, 'data'), { recursive: true })
const write = (name: string, value: unknown) =>
  writeFileSync(join(PKG, 'data', name), JSON.stringify(value, null, 2) + '\n')

write('paper-types.json', types)
write('paper-sizes.json', sizes)
write('spacings.json', spacings)
write('styles.json', styles)
write('index.json', {
  name: 'printable-paper data',
  source: SITE,
  license: 'CC BY 4.0',
  credit: `Paper specifications by Free Graph Paper (${SITE})`,
  files: {
    'paper-types.json': `${types.length} ruled-paper types, each with the page that prints it`,
    'paper-sizes.json': `${sizes.length} physical page sizes in millimetres and inches`,
    'spacings.json': `${spacings.length} standard grid spacings`,
    'styles.json': 'line colours, stroke widths and margin widths in millimetres',
  },
})

console.log(`synced: ${types.length} types, ${sizes.length} sizes, ${spacings.length} spacings`)
