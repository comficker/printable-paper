/**
 * Write i18n/README.<lang>.md from data/paper-types.json.
 *
 *   bun scripts/build-i18n-readme.ts
 *
 * The prose is hand-written per language below; only the 39-row table is
 * generated, so the translated names and URLs always match the site.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const PKG = join(dirname(fileURLToPath(import.meta.url)), '..')
const types: {
  id: string
  name: string
  translations: Record<string, { name: string; url: string }>
}[] = JSON.parse(readFileSync(join(PKG, 'data', 'paper-types.json'), 'utf8'))

interface Copy {
  label: string
  tagline: string
  body: string
  install: string
  tableHead: string
  tableIntro: string
  cli: string
  licence: string
}

const COPY: Record<string, Copy> = {
  es: {
    label: 'Español',
    tagline:
      'Especificaciones de 39 tipos de papel pautado y un generador sin dependencias que los convierte en SVG o PDF a escala real.',
    body:
      'Las cuadrículas se definen y se dibujan en milímetros, así que una hoja impresa al 100 % mide exactamente lo que dice medir: justo lo que fallan casi todos los PDF de "papel milimetrado gratis". El motor geométrico es el mismo que usa [freegraphpaper.net](https://freegraphpaper.net/es), donde cada papel se puede ver y descargar desde el navegador.',
    install: 'Instalación',
    tableIntro: 'Cada fila es un valor de `<tipo>` y enlaza a la página que lo imprime.',
    tableHead: '| Tipo | Papel | En la web |',
    cli: 'Línea de comandos',
    licence:
      'Código: MIT. Datos de `data/`: CC BY 4.0, citando «Especificaciones de papel por Free Graph Paper (https://freegraphpaper.net)».',
  },
  de: {
    label: 'Deutsch',
    tagline:
      'Spezifikationen für 39 Arten von liniertem und kariertem Papier samt einem abhängigkeitsfreien Generator, der daraus maßstabsgetreues SVG oder PDF macht.',
    body:
      'Die Raster werden in Millimetern beschrieben und in Millimetern gezeichnet. Ein bei 100 % gedrucktes Blatt misst also genau das, was draufsteht — woran die meisten PDFs mit "kostenlosem Millimeterpapier" stillschweigend scheitern. Die Geometrie stammt aus derselben Engine wie [freegraphpaper.net](https://freegraphpaper.net/de), wo sich jedes Papier im Browser ansehen und herunterladen lässt.',
    install: 'Installation',
    tableIntro: 'Jede Zeile ist ein `<typ>`-Wert und verlinkt auf die Seite, die dieses Papier druckt.',
    tableHead: '| Typ | Papier | Im Web |',
    cli: 'Kommandozeile',
    licence:
      'Code: MIT. Daten in `data/`: CC BY 4.0, mit dem Hinweis „Papierspezifikationen von Free Graph Paper (https://freegraphpaper.net)".',
  },
  fr: {
    label: 'Français',
    tagline:
      'Les spécifications de 39 types de papier réglé, et un générateur sans dépendances qui les produit en SVG ou en PDF à l’échelle.',
    body:
      'Les quadrillages sont décrits et tracés en millimètres : une feuille imprimée à 100 % mesure donc exactement ce qu’elle annonce — ce que la plupart des PDF de « papier millimétré gratuit » ratent discrètement. Le moteur géométrique est celui de [freegraphpaper.net](https://freegraphpaper.net/fr), où chaque papier se prévisualise et se télécharge depuis le navigateur.',
    install: 'Installation',
    tableIntro: 'Chaque ligne est une valeur de `<type>` et renvoie à la page qui l’imprime.',
    tableHead: '| Type | Papier | Sur le web |',
    cli: 'Ligne de commande',
    licence:
      'Code : MIT. Données de `data/` : CC BY 4.0, en créditant « Spécifications de papier par Free Graph Paper (https://freegraphpaper.net) ».',
  },
  pt: {
    label: 'Português',
    tagline:
      'Especificações de 39 tipos de papel pautado e um gerador sem dependências que os entrega em SVG ou PDF em escala real.',
    body:
      'As malhas são descritas e desenhadas em milímetros, então uma folha impressa a 100 % mede exatamente o que promete — justamente o que quase todo PDF de "papel milimetrado grátis" erra em silêncio. O motor geométrico é o mesmo do [freegraphpaper.net](https://freegraphpaper.net/pt), onde cada papel pode ser visto e baixado pelo navegador.',
    install: 'Instalação',
    tableIntro: 'Cada linha é um valor de `<tipo>` e leva à página que o imprime.',
    tableHead: '| Tipo | Papel | Na web |',
    cli: 'Linha de comando',
    licence:
      'Código: MIT. Dados em `data/`: CC BY 4.0, creditando "Especificações de papel por Free Graph Paper (https://freegraphpaper.net)".',
  },
}

mkdirSync(join(PKG, 'i18n'), { recursive: true })

for (const [locale, copy] of Object.entries(COPY)) {
  const others = Object.entries(COPY)
    .filter(([id]) => id !== locale)
    .map(([id, c]) => `[${c.label}](README.${id}.md)`)
  const rows = types
    .map((t) => {
      const tr = t.translations[locale]
      return tr ? `| \`${t.id}\` | ${tr.name} | [${tr.name}](${tr.url}) |` : ''
    })
    .filter(Boolean)

  const md = `# printable-paper

${copy.tagline}

${copy.body}

\`\`\`bash
npx printable-paper graph --size a4 --spacing 5mm --out grid.pdf
\`\`\`

## ${copy.install}

\`\`\`bash
npm install printable-paper
\`\`\`

## ${copy.cli}

\`\`\`bash
printable-paper <type> [options]
printable-paper list types|sizes|spacings
\`\`\`

\`--size\` \`--orientation\` \`--spacing\` \`--margin\` \`--color\` \`--thickness\` \`--pages\` \`--format\` \`--out\`
→ [English README](../README.md)

## ${copy.tableHead.split('|')[2]!.trim()}

${copy.tableIntro}

${copy.tableHead}
|---|---|---|
${rows.join('\n')}

## Licence

${copy.licence}

---

[English](../README.md) · ${others.join(' · ')}
`
  writeFileSync(join(PKG, 'i18n', `README.${locale}.md`), md)
}

console.log(`wrote ${Object.keys(COPY).length} translated READMEs`)
