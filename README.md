# printable-paper

Specifications for 39 kinds of ruled paper, and a dependency-free generator that
turns them into true-to-scale SVG or PDF.

Grids are described in millimetres and drawn in millimetres, so a sheet printed
at 100% measures what it says it measures — the thing most "free graph paper"
PDFs quietly get wrong. The geometry engine here is the same one that runs on
[freegraphpaper.net](https://freegraphpaper.net), where every paper below can
also be previewed and downloaded in a browser.

```bash
npx printable-paper graph --size a4 --spacing 5mm --out grid.pdf
```

## Install

```bash
npm install printable-paper
```

Node 18 or newer. No runtime dependencies.

## Command line

```bash
printable-paper <type> [options]
printable-paper list types|sizes|spacings
```

| Option | Values | Default |
|---|---|---|
| `--size` | any id from `list sizes` (47 of them: A0–A10, B, C, US Letter, Legal, Tabloid, ANSI, Arch…) | `a4` |
| `--orientation` | `portrait`, `landscape` | `portrait` |
| `--spacing` | `1mm` `2mm` `5mm` `10mm` `eighth-inch` `quarter-inch` `half-inch`, or a number in mm | `5` |
| `--margin` | `none` (0 mm), `small` (8 mm), `medium` (14 mm), `large` (22 mm) | `small` |
| `--color` | `light`, `gray`, `blue`, `black`, `red` | `light` |
| `--thickness` | `thin` (0.16 mm), `normal` (0.28 mm), `bold` (0.45 mm) | `thin` |
| `--pages` | 1–50 identical sheets, PDF only | `1` |
| `--format` | `pdf`, `svg` | from `--out`, else `pdf` |
| `--out` | file path, or `-` for stdout | `paper.<format>` |

```bash
# A pad of 20 quarter-inch sheets on US Letter
printable-paper graph --size letter --spacing quarter-inch --pages 20 --out pad.pdf

# Numbered axes for a worksheet
printable-paper coordinate --size a4 --margin medium --out axes.pdf

# Dot grid straight into another tool
printable-paper dot --spacing 5mm --format svg --out - | your-tool
```

## Library

```js
import { buildPaper, renderPaperSvg, renderPaperPdf } from 'printable-paper'

const config = {
  paperType: 'isometric',
  paperSize: 'a4',
  orientation: 'portrait',
  spacing: 6,
  margin: 'small',
  lineColor: 'light',
  lineThickness: 'thin',
}

const { width, height, primitives } = buildPaper(config) // mm, top-left origin
const { svg } = renderPaperSvg(config)
const pdf = renderPaperPdf(config, 5) // Uint8Array, 5 sheets
```

`buildPaper` returns a flat list of primitives — `line`, `circle`, `text` — in
millimetres with a top-left origin. If you need a format this package does not
write, render those primitives yourself; it is about twenty lines.

## The papers

Each row is a `--type` value, and links to the page that prints it in a browser.

| Type | What it is | On the web |
|---|---|---|
| `graph` | Square grids in metric and imperial spacing for math, plotting and design. | [Printable graph paper](https://freegraphpaper.net/graph-paper) |
| `dot` | Calm dotted grids for bullet journals, sketching and lettering. | [Printable dot grid paper](https://freegraphpaper.net/dot-grid-paper) |
| `isometric` | Triangular 30° grids for 3D sketches, isometric drawing and CAD. | [Printable isometric paper](https://freegraphpaper.net/isometric-paper) |
| `hexagon` | Tessellated hex grids for games, organic chemistry and map design. | [Printable hexagon paper](https://freegraphpaper.net/hexagon-paper) |
| `lined` | Ruled writing paper, including college-ruled and wide-ruled. | [Printable lined paper](https://freegraphpaper.net/lined-paper) |
| `cornell` | Structured note layout with cue column and summary band. | [Printable cornell notes](https://freegraphpaper.net/cornell-notes-template) |
| `music` | Blank manuscript staves for composing and music theory. | [Printable music staff paper](https://freegraphpaper.net/music-staff-paper) |
| `coordinate` | Numbered X/Y axes through the centre for plotting functions. | [Printable coordinate paper](https://freegraphpaper.net/coordinate-graph-paper) |
| `polar` | Concentric circles and radial lines for polar coordinates. | [Printable polar graph paper](https://freegraphpaper.net/polar-graph-paper) |
| `engineering` | Subdivided grid with a heavier rule every five squares for technical work. | [Printable engineering paper](https://freegraphpaper.net/engineering-paper) |
| `log` | Log-log decades for exponential data, frequency response and pH plots. | [Printable logarithmic graph paper](https://freegraphpaper.net/log-graph-paper) |
| `triangle` | Equilateral triangular grid for tessellation, 3D sketches and quilting. | [Printable triangle paper](https://freegraphpaper.net/triangle-paper) |
| `brick` | Running-bond brick pattern for design mockups, lettering and patterns. | [Printable brick paper](https://freegraphpaper.net/brick-paper) |
| `perspective` | One-point perspective grid with a horizon line and vanishing point. | [Printable perspective paper](https://freegraphpaper.net/perspective-paper) |
| `handwriting` | Ruled practice paper with a dashed midline for penmanship and early writing. | [Printable handwriting paper](https://freegraphpaper.net/handwriting-paper) |
| `seyes` | French Séyès ruling — fine 2 mm lines with bold guides for cursive writing. | [Printable séyès paper (french ruled)](https://freegraphpaper.net/seyes-paper) |
| `crossstitch` | 10-count grid with bold blocks for designing cross-stitch and needlework charts. | [Printable cross stitch paper](https://freegraphpaper.net/cross-stitch-paper) |
| `knitting` | Stitch-proportioned grid (wider than tall) for knitting charts and colourwork. | [Printable knitting graph paper](https://freegraphpaper.net/knitting-graph-paper) |
| `guitartab` | Blank six-line tablature staves for guitar riffs, solos and transcription. | [Printable guitar tab paper](https://freegraphpaper.net/guitar-tab-paper) |
| `semilog` | One linear axis and one logarithmic axis for exponential data and pH plots. | [Printable semi-log paper](https://freegraphpaper.net/semi-log-paper) |
| `numberline` | Printable numbered number lines for arithmetic, fractions and early math. | [Printable number line paper](https://freegraphpaper.net/number-line-paper) |
| `sudoku` | Blank 9×9 sudoku grids with bold boxes, ready to fill in. | [Printable sudoku paper](https://freegraphpaper.net/sudoku-paper) |
| `goban` | A 19×19 Go board with star points for Go, Baduk and Weiqi. | [Printable go board paper](https://freegraphpaper.net/go-board-paper) |
| `storyboard` | 16:9 storyboard frames with caption lines for film and animation planning. | [Printable storyboard paper](https://freegraphpaper.net/storyboard-paper) |
| `calligraphy` | Ruled writing bands with 55° slant guides for calligraphy and hand lettering. | [Printable calligraphy paper](https://freegraphpaper.net/calligraphy-paper) |
| `ternary` | A triangular three-axis grid for three-component composition plots. | [Printable ternary graph paper](https://freegraphpaper.net/ternary-paper) |
| `clockface` | Blank analog clock faces for telling-time practice and worksheets. | [Printable clock face paper](https://freegraphpaper.net/clock-face-paper) |
| `perspective2` | A horizon with two vanishing points and fanned guides for perspective drawing. | [Printable two-point perspective paper](https://freegraphpaper.net/two-point-perspective-paper) |
| `battlemap` | A bold one-inch square grid for tabletop RPGs, D&D and miniatures. | [Printable battle map paper (1 inch)](https://freegraphpaper.net/battle-map-paper) |
| `chessboard` | A printable 8×8 checkerboard for chess, checkers and draughts. | [Printable chessboard paper](https://freegraphpaper.net/chessboard-paper) |
| `hexmap` | A pointy-top hexagonal map grid for wargaming and RPG maps. | [Printable hex map paper](https://freegraphpaper.net/hex-map-paper) |
| `quilting` | A square grid with cell diagonals for quilt blocks and patchwork design. | [Printable quilting graph paper](https://freegraphpaper.net/quilting-graph-paper) |
| `genkoyoshi` | Columns of character squares for Japanese writing practice. | [Printable genkō yōshi paper](https://freegraphpaper.net/genko-yoshi-paper) |
| `tianzige` | Character squares with dashed cross guides for Chinese handwriting practice. | [Printable tian zi ge paper (chinese)](https://freegraphpaper.net/tian-zi-ge-paper) |
| `basstab` | Blank four-line tablature staves for bass guitar transcription. | [Printable bass tab paper](https://freegraphpaper.net/bass-tab-paper) |
| `chorddiagram` | A grid of blank guitar chord diagrams for songwriting and chord charts. | [Printable guitar chord paper](https://freegraphpaper.net/guitar-chord-paper) |
| `peyote` | An offset bead grid for peyote and brick-stitch beadwork charts. | [Printable peyote bead paper](https://freegraphpaper.net/peyote-bead-paper) |
| `crossword` | A bold blank square grid for making crosswords and word puzzles. | [Printable crossword grid paper](https://freegraphpaper.net/crossword-grid-paper) |
| `comic` | Blank comic and manga panels with gutters for laying out pages. | [Printable comic panel paper](https://freegraphpaper.net/comic-panel-paper) |

## Data files

The specifications ship as plain JSON and can be used without the code —
`node_modules/printable-paper/data/`, or over a CDN:

```
https://cdn.jsdelivr.net/npm/printable-paper/data/paper-sizes.json
```

| File | Contents |
|---|---|
| `paper-types.json` | the 39 papers above, each with the page that prints it |
| `paper-sizes.json` | 47 page sizes in millimetres and inches, grouped by series |
| `spacings.json` | the standard grid spacings, metric and imperial |
| `styles.json` | line colours, stroke widths and margin widths in millimetres |
| `index.json` | a manifest of the above |

Sources for the measurements are listed in [SOURCES.md](SOURCES.md).

## Translations

[Español](i18n/README.es.md) · [Deutsch](i18n/README.de.md) · [Français](i18n/README.fr.md) · [Português](i18n/README.pt.md)

## Licence

Code: MIT. Data in `data/`: [CC BY 4.0](LICENSE-DATA) — use it anywhere, including
commercially, as long as the source is credited:

> Paper specifications by Free Graph Paper (https://freegraphpaper.net)

## Contributing

A measurement that looks wrong is worth an issue — these numbers are meant to be
printed and measured with a ruler, so they are falsifiable. Use the
[wrong value](.github/ISSUE_TEMPLATE/wrong-value.md) template and say which
paper, which spacing and what you measured.
