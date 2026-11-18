/**
 * paper.ts — the geometry engine.
 *
 * A single pure function `buildPaper(config)` turns a paper configuration into a
 * flat list of drawing primitives expressed in millimetres with a top-left
 * origin (y grows downward — the convention shared by SVG and jsPDF).
 *
 * Both renderers consume these primitives:
 *   - usePaperRenderer → SVG string (used for the live preview AND baked into
 *     prerendered template pages, so previews need zero client JS).
 *   - usePaperPdf → jsPDF vector calls (client-side download).
 *
 * Keeping one geometry source means the PDF is always a pixel-faithful copy of
 * what the user sees on screen.
 */

export type PaperType =
  | 'graph'
  | 'dot'
  | 'isometric'
  | 'hexagon'
  | 'lined'
  | 'cornell'
  | 'music'
  | 'coordinate'
  | 'polar'
  | 'engineering'
  | 'log'
  | 'triangle'
  | 'brick'
  | 'perspective'
  | 'handwriting'
  | 'seyes'
  | 'crossstitch'
  | 'knitting'
  | 'guitartab'
  | 'semilog'
  | 'numberline'
  | 'sudoku'
  | 'goban'
  | 'storyboard'
  | 'calligraphy'
  | 'ternary'
  | 'clockface'
  | 'perspective2'
  | 'battlemap'
  | 'chessboard'
  | 'hexmap'
  | 'quilting'
  | 'genkoyoshi'
  | 'tianzige'
  | 'basstab'
  | 'chorddiagram'
  | 'peyote'
  | 'crossword'
  | 'comic'

/** Paper-size families used to group the size picker / templates filter. */
export type SizeSeriesId = 'us' | 'iso-a' | 'iso-b' | 'iso-c'
export type Orientation = 'portrait' | 'landscape'
export type LineColorId = 'light' | 'gray' | 'blue' | 'black' | 'red'
export type ThicknessId = 'thin' | 'normal' | 'bold'
export type MarginId = 'none' | 'small' | 'medium' | 'large'

export interface HeaderOptions {
  title?: boolean
  name?: boolean
  date?: boolean
}

export interface PaperConfig {
  paperType: PaperType
  paperSize: PaperSizeId
  orientation: Orientation
  /** Primary grid spacing in millimetres. */
  spacing: number
  margin: MarginId
  lineColor: LineColorId
  lineThickness: ThicknessId
  header?: HeaderOptions
  /** Lined paper only: draw a vertical (red) margin rule. */
  marginLine?: boolean
}

/* ------------------------------------------------------------------ */
/* Constants                                                          */
/* ------------------------------------------------------------------ */

export const INCH = 25.4

export interface PaperSizeInfo {
  w: number
  h: number
  label: string
  series: SizeSeriesId
}

/**
 * Physical page sizes in millimetres (portrait). Keys are the URL slugs used in
 * template paths (e.g. /graph-paper/a3). `PaperSizeId` is derived from these keys.
 */
export const PAPER_SIZES = {
  // US / Imperial
  letter: { w: 215.9, h: 279.4, label: 'US Letter', series: 'us' },
  legal: { w: 215.9, h: 355.6, label: 'US Legal', series: 'us' },
  tabloid: { w: 279.4, h: 431.8, label: 'Tabloid (Ledger)', series: 'us' },
  executive: { w: 184.15, h: 266.7, label: 'Executive', series: 'us' },
  'junior-legal': { w: 127, h: 203.2, label: 'Junior Legal', series: 'us' },
  'half-letter': { w: 139.7, h: 215.9, label: 'Half Letter', series: 'us' },
  'ansi-c': { w: 431.8, h: 558.8, label: 'ANSI C', series: 'us' },
  'ansi-d': { w: 558.8, h: 863.6, label: 'ANSI D', series: 'us' },
  'ansi-e': { w: 863.6, h: 1117.6, label: 'ANSI E', series: 'us' },
  'arch-a': { w: 228.6, h: 304.8, label: 'Arch A', series: 'us' },
  'arch-b': { w: 304.8, h: 457.2, label: 'Arch B', series: 'us' },
  'arch-c': { w: 457.2, h: 609.6, label: 'Arch C', series: 'us' },
  'arch-d': { w: 609.6, h: 914.4, label: 'Arch D', series: 'us' },
  'arch-e': { w: 914.4, h: 1219.2, label: 'Arch E', series: 'us' },
  // ISO A series
  a0: { w: 841, h: 1189, label: 'A0', series: 'iso-a' },
  a1: { w: 594, h: 841, label: 'A1', series: 'iso-a' },
  a2: { w: 420, h: 594, label: 'A2', series: 'iso-a' },
  a3: { w: 297, h: 420, label: 'A3', series: 'iso-a' },
  a4: { w: 210, h: 297, label: 'A4', series: 'iso-a' },
  a5: { w: 148, h: 210, label: 'A5', series: 'iso-a' },
  a6: { w: 105, h: 148, label: 'A6', series: 'iso-a' },
  a7: { w: 74, h: 105, label: 'A7', series: 'iso-a' },
  a8: { w: 52, h: 74, label: 'A8', series: 'iso-a' },
  a9: { w: 37, h: 52, label: 'A9', series: 'iso-a' },
  a10: { w: 26, h: 37, label: 'A10', series: 'iso-a' },
  // ISO B series
  b0: { w: 1000, h: 1414, label: 'B0', series: 'iso-b' },
  b1: { w: 707, h: 1000, label: 'B1', series: 'iso-b' },
  b2: { w: 500, h: 707, label: 'B2', series: 'iso-b' },
  b3: { w: 353, h: 500, label: 'B3', series: 'iso-b' },
  b4: { w: 250, h: 353, label: 'B4', series: 'iso-b' },
  b5: { w: 176, h: 250, label: 'B5', series: 'iso-b' },
  b6: { w: 125, h: 176, label: 'B6', series: 'iso-b' },
  b7: { w: 88, h: 125, label: 'B7', series: 'iso-b' },
  b8: { w: 62, h: 88, label: 'B8', series: 'iso-b' },
  b9: { w: 44, h: 62, label: 'B9', series: 'iso-b' },
  b10: { w: 31, h: 44, label: 'B10', series: 'iso-b' },
  // ISO C series
  c0: { w: 917, h: 1297, label: 'C0', series: 'iso-c' },
  c1: { w: 648, h: 917, label: 'C1', series: 'iso-c' },
  c2: { w: 458, h: 648, label: 'C2', series: 'iso-c' },
  c3: { w: 324, h: 458, label: 'C3', series: 'iso-c' },
  c4: { w: 229, h: 324, label: 'C4', series: 'iso-c' },
  c5: { w: 162, h: 229, label: 'C5', series: 'iso-c' },
  c6: { w: 114, h: 162, label: 'C6', series: 'iso-c' },
  c7: { w: 81, h: 114, label: 'C7', series: 'iso-c' },
  c8: { w: 57, h: 81, label: 'C8', series: 'iso-c' },
  c9: { w: 40, h: 57, label: 'C9', series: 'iso-c' },
  c10: { w: 28, h: 40, label: 'C10', series: 'iso-c' },
} satisfies Record<string, PaperSizeInfo>

export type PaperSizeId = keyof typeof PAPER_SIZES

/** Size families in display order, for the templates filter and size pickers. */
export const SIZE_SERIES: { id: SizeSeriesId; label: string }[] = [
  { id: 'us', label: 'US / Imperial' },
  { id: 'iso-a', label: 'ISO A Series' },
  { id: 'iso-b', label: 'ISO B Series' },
  { id: 'iso-c', label: 'ISO C Series' },
]

/** All size ids belonging to a series, in registry order. */
export function sizesInSeries(series: SizeSeriesId): PaperSizeId[] {
  return (Object.keys(PAPER_SIZES) as PaperSizeId[]).filter((id) => PAPER_SIZES[id].series === series)
}

export const LINE_COLORS: Record<LineColorId, { hex: string; label: string }> = {
  light: { hex: '#cdd5e0', label: 'Light gray' },
  gray: { hex: '#9aa3b2', label: 'Gray' },
  blue: { hex: '#7ba4d6', label: 'Blue' },
  black: { hex: '#3a3f47', label: 'Black' },
  red: { hex: '#d99a9a', label: 'Red' },
}

/** Stroke widths in millimetres. */
export const THICKNESS: Record<ThicknessId, number> = {
  thin: 0.16,
  normal: 0.28,
  bold: 0.45,
}

/** Page margins in millimetres. */
export const MARGINS: Record<MarginId, number> = {
  none: 0,
  small: 8,
  medium: 14,
  large: 22,
}

const DOT_RADIUS: Record<ThicknessId, number> = {
  thin: 0.32,
  normal: 0.45,
  bold: 0.62,
}

/** Option lists reused by the editor UI and data files. */
export const PAPER_TYPE_OPTIONS: { id: PaperType; label: string }[] = [
  { id: 'graph', label: 'Graph' },
  { id: 'dot', label: 'Dot Grid' },
  { id: 'isometric', label: 'Isometric' },
  { id: 'hexagon', label: 'Hexagon' },
  { id: 'lined', label: 'Lined' },
  { id: 'cornell', label: 'Cornell Notes' },
  { id: 'music', label: 'Music Staff' },
  { id: 'coordinate', label: 'Coordinate Grid' },
  { id: 'polar', label: 'Polar Grid' },
  { id: 'engineering', label: 'Engineering' },
  { id: 'log', label: 'Logarithmic' },
  { id: 'triangle', label: 'Triangle' },
  { id: 'brick', label: 'Brick' },
  { id: 'perspective', label: 'Perspective' },
  { id: 'handwriting', label: 'Handwriting' },
  { id: 'seyes', label: 'Séyès (French Ruled)' },
  { id: 'crossstitch', label: 'Cross Stitch' },
  { id: 'knitting', label: 'Knitting Graph' },
  { id: 'guitartab', label: 'Guitar Tab' },
  { id: 'semilog', label: 'Semi-Log' },
  { id: 'numberline', label: 'Number Line' },
  { id: 'sudoku', label: 'Sudoku' },
  { id: 'goban', label: 'Go Board' },
  { id: 'storyboard', label: 'Storyboard' },
  { id: 'calligraphy', label: 'Calligraphy' },
  { id: 'ternary', label: 'Ternary' },
  { id: 'clockface', label: 'Clock Face' },
  { id: 'perspective2', label: 'Two-Point Perspective' },
  { id: 'battlemap', label: 'Battle Map (1 in)' },
  { id: 'chessboard', label: 'Chessboard' },
  { id: 'hexmap', label: 'Hex Map' },
  { id: 'quilting', label: 'Quilting' },
  { id: 'genkoyoshi', label: 'Genkō Yōshi' },
  { id: 'tianzige', label: 'Tian Zi Ge' },
  { id: 'basstab', label: 'Bass Tab' },
  { id: 'chorddiagram', label: 'Guitar Chord' },
  { id: 'peyote', label: 'Peyote Bead' },
  { id: 'crossword', label: 'Crossword' },
  { id: 'comic', label: 'Comic Panel' },
]

export const SIZE_OPTIONS: { id: PaperSizeId; label: string }[] = [
  { id: 'a4', label: 'A4' },
  { id: 'letter', label: 'Letter' },
  { id: 'a5', label: 'A5' },
]

export const ORIENTATION_OPTIONS: { id: Orientation; label: string }[] = [
  { id: 'portrait', label: 'Portrait' },
  { id: 'landscape', label: 'Landscape' },
]

export const SPACING_OPTIONS: { id: string; label: string; mm: number }[] = [
  { id: '1mm', label: '1 mm', mm: 1 },
  { id: '2mm', label: '2 mm', mm: 2 },
  { id: '5mm', label: '5 mm', mm: 5 },
  { id: '10mm', label: '10 mm', mm: 10 },
  { id: 'eighth-inch', label: '1/8 inch', mm: INCH / 8 },
  { id: 'quarter-inch', label: '1/4 inch', mm: INCH / 4 },
  { id: 'half-inch', label: '1/2 inch', mm: INCH / 2 },
]

export const COLOR_OPTIONS: { id: LineColorId; label: string }[] = (
  Object.keys(LINE_COLORS) as LineColorId[]
).map((id) => ({ id, label: LINE_COLORS[id].label }))

export const THICKNESS_OPTIONS: { id: ThicknessId; label: string }[] = [
  { id: 'thin', label: 'Thin' },
  { id: 'normal', label: 'Normal' },
  { id: 'bold', label: 'Bold' },
]

export const MARGIN_OPTIONS: { id: MarginId; label: string }[] = [
  { id: 'none', label: 'None' },
  { id: 'small', label: 'Small' },
  { id: 'medium', label: 'Medium' },
  { id: 'large', label: 'Large' },
]

/* ------------------------------------------------------------------ */
/* Primitives                                                         */
/* ------------------------------------------------------------------ */

export interface LinePrim {
  kind: 'line'
  x1: number
  y1: number
  x2: number
  y2: number
  color: string
  w: number
}
export interface CirclePrim {
  kind: 'circle'
  cx: number
  cy: number
  r: number
  /** Filled dot when set. */
  fill?: string
  /** Outlined ring when set. */
  color?: string
  w?: number
}
export interface TextPrim {
  kind: 'text'
  x: number
  y: number
  text: string
  size: number
  color: string
  anchor: 'start' | 'middle' | 'end'
}
export type Primitive = LinePrim | CirclePrim | TextPrim

export interface BuiltPaper {
  width: number
  height: number
  primitives: Primitive[]
}

/* ------------------------------------------------------------------ */
/* Public entry point                                                 */
/* ------------------------------------------------------------------ */

const EPS = 1e-6
/** Safety valve so a pathological config can never lock up the browser. */
const MAX_PRIMITIVES = 60000

const HEADER_INK = '#64748b'

export function buildPaper(config: PaperConfig, override?: { width: number; height: number }): BuiltPaper {
  let width: number
  let height: number
  if (override) {
    width = override.width
    height = override.height
  } else {
    const size = PAPER_SIZES[config.paperSize] ?? PAPER_SIZES.a4
    width = size.w
    height = size.h
    if (config.orientation === 'landscape') {
      ;[width, height] = [height, width]
    }
  }

  const margin = MARGINS[config.margin] ?? 0
  const color = (LINE_COLORS[config.lineColor] ?? LINE_COLORS.gray).hex
  const w = THICKNESS[config.lineThickness] ?? THICKNESS.normal
  const s = resolveSpacing(config)

  const out: Primitive[] = []
  let x0 = margin
  let y0 = margin
  const x1 = width - margin
  const y1 = height - margin

  if (hasHeader(config.header)) {
    y0 = drawHeader(out, config.header as HeaderOptions, margin, y0, width)
  }

  const rect = { x0, y0, x1, y1 }
  switch (config.paperType) {
    case 'graph':
      graph(out, rect, s, color, w)
      break
    case 'dot':
      dotGrid(out, rect, s, color, config.lineThickness)
      break
    case 'lined':
      lined(out, rect, s, color, w, !!config.marginLine)
      break
    case 'isometric':
      isometric(out, rect, s, color, w)
      break
    case 'hexagon':
      hexagon(out, rect, s, color, w)
      break
    case 'cornell':
      cornell(out, rect, s, color, w)
      break
    case 'music':
      music(out, rect, s, color, w)
      break
    case 'coordinate':
      coordinate(out, rect, s, color, w)
      break
    case 'polar':
      polar(out, rect, s, color, w)
      break
    case 'engineering':
      engineering(out, rect, s, color, w)
      break
    case 'log':
      logPaper(out, rect, color, w)
      break
    case 'triangle':
      triangle(out, rect, s, color, w)
      break
    case 'brick':
      brick(out, rect, s, color, w)
      break
    case 'perspective':
      perspective(out, rect, s, color, w)
      break
    case 'handwriting':
      handwriting(out, rect, s, color, w)
      break
    case 'seyes':
      seyes(out, rect, s, color, w)
      break
    case 'crossstitch':
      crossStitch(out, rect, s, color, w)
      break
    case 'knitting':
      knitting(out, rect, s, color, w)
      break
    case 'guitartab':
      guitarTab(out, rect, s, color, w)
      break
    case 'semilog':
      semiLog(out, rect, s, color, w)
      break
    case 'numberline':
      numberLine(out, rect, s, color, w)
      break
    case 'sudoku':
      sudoku(out, rect, s, color, w)
      break
    case 'goban':
      goBoard(out, rect, s, color, w)
      break
    case 'storyboard':
      storyboard(out, rect, s, color, w)
      break
    case 'calligraphy':
      calligraphy(out, rect, s, color, w)
      break
    case 'ternary':
      ternary(out, rect, s, color, w)
      break
    case 'clockface':
      clockFace(out, rect, s, color, w)
      break
    case 'perspective2':
      perspective2(out, rect, s, color, w)
      break
    case 'battlemap':
      battleMap(out, rect, s, color, w)
      break
    case 'chessboard':
      chessBoard(out, rect, s, color, w)
      break
    case 'hexmap':
      hexMap(out, rect, s, color, w)
      break
    case 'quilting':
      quilting(out, rect, s, color, w)
      break
    case 'genkoyoshi':
      genkoYoshi(out, rect, s, color, w)
      break
    case 'tianzige':
      tianZiGe(out, rect, s, color, w)
      break
    case 'basstab':
      bassTab(out, rect, s, color, w)
      break
    case 'chorddiagram':
      chordDiagram(out, rect, s, color, w)
      break
    case 'peyote':
      peyote(out, rect, s, color, w)
      break
    case 'crossword':
      crossword(out, rect, s, color, w)
      break
    case 'comic':
      comic(out, rect, s, color, w)
      break
  }

  return { width, height, primitives: out }
}

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

interface Rect {
  x0: number
  y0: number
  x1: number
  y1: number
}

function resolveSpacing(config: PaperConfig): number {
  let s = config.spacing
  if (!Number.isFinite(s) || s <= 0) s = 5
  // A 1 mm dot grid would be ~60k dots on A4; clamp dots to a sane density.
  if (config.paperType === 'dot') s = Math.max(s, 2)
  return s
}

function hasHeader(h?: HeaderOptions): boolean {
  return !!h && (!!h.title || !!h.name || !!h.date)
}

function line(x1: number, y1: number, x2: number, y2: number, color: string, w: number): LinePrim {
  return { kind: 'line', x1, y1, x2, y2, color, w }
}

function capped(out: Primitive[]): boolean {
  return out.length >= MAX_PRIMITIVES
}

/**
 * Centre a run of tiled cells within [lo, hi]. Returns the x (or y) of the first
 * cell and how many whole cells fit, so patterns that don't divide the page
 * evenly (character squares, chord boxes, clock faces…) sit centred instead of
 * hugging the left edge with a gap on the right.
 */
function centeredCells(lo: number, hi: number, pitch: number, cell: number): { start: number; count: number } {
  const avail = hi - lo
  if (avail < cell - EPS) return { start: lo, count: 0 }
  const count = Math.floor((avail - cell) / pitch + EPS) + 1
  const used = (count - 1) * pitch + cell
  return { start: lo + (avail - used) / 2, count }
}

/* ---- Drawing routines ---- */

function graph(out: Primitive[], r: Rect, s: number, c: string, w: number) {
  for (let x = r.x0; x <= r.x1 + EPS && !capped(out); x += s) {
    out.push(line(x, r.y0, x, r.y1, c, w))
  }
  for (let y = r.y0; y <= r.y1 + EPS && !capped(out); y += s) {
    out.push(line(r.x0, y, r.x1, y, c, w))
  }
}

function dotGrid(out: Primitive[], r: Rect, s: number, c: string, thick: ThicknessId) {
  const rad = DOT_RADIUS[thick] ?? DOT_RADIUS.normal
  for (let x = r.x0; x <= r.x1 + EPS && !capped(out); x += s) {
    for (let y = r.y0; y <= r.y1 + EPS && !capped(out); y += s) {
      out.push({ kind: 'circle', cx: x, cy: y, r: rad, fill: c })
    }
  }
}

function lined(out: Primitive[], r: Rect, s: number, c: string, w: number, marginLine: boolean) {
  if (marginLine) {
    const mx = r.x0 + Math.min(28, (r.x1 - r.x0) * 0.18)
    out.push(line(mx, r.y0, mx, r.y1, LINE_COLORS.red.hex, w))
  }
  for (let y = r.y0 + s; y <= r.y1 + EPS && !capped(out); y += s) {
    out.push(line(r.x0, y, r.x1, y, c, w))
  }
}

function isometric(out: Primitive[], r: Rect, s: number, c: string, w: number) {
  // Three families at 90° (vertical), 30° and 150° form the triangular grid.
  parallelFamily(out, r, 90, s, c, w)
  parallelFamily(out, r, 30, s, c, w)
  parallelFamily(out, r, 150, s, c, w)
}

/**
 * Draw a family of parallel lines at `angleDeg`, with perpendicular spacing `t`,
 * each clipped to the rectangle. Works for any angle — the backbone of the
 * isometric grid.
 */
function parallelFamily(out: Primitive[], r: Rect, angleDeg: number, t: number, c: string, w: number) {
  const th = (angleDeg * Math.PI) / 180
  const nx = -Math.sin(th)
  const ny = Math.cos(th)
  const corners: [number, number][] = [
    [r.x0, r.y0],
    [r.x1, r.y0],
    [r.x1, r.y1],
    [r.x0, r.y1],
  ]
  let pmin = Infinity
  let pmax = -Infinity
  for (const [cx, cy] of corners) {
    const p = nx * cx + ny * cy
    if (p < pmin) pmin = p
    if (p > pmax) pmax = p
  }
  const start = Math.ceil(pmin / t) * t
  for (let p = start; p <= pmax + EPS && !capped(out); p += t) {
    const seg = clipInfiniteLine(nx, ny, p, r)
    if (seg) out.push(line(seg[0], seg[1], seg[2], seg[3], c, w))
  }
}

/** Intersect the infinite line {nx·x + ny·y = p} with a rectangle. */
function clipInfiniteLine(nx: number, ny: number, p: number, r: Rect): number[] | null {
  const pts: [number, number][] = []
  if (Math.abs(ny) > EPS) {
    for (const x of [r.x0, r.x1]) {
      const y = (p - nx * x) / ny
      if (y >= r.y0 - EPS && y <= r.y1 + EPS) pts.push([x, y])
    }
  }
  if (Math.abs(nx) > EPS) {
    for (const y of [r.y0, r.y1]) {
      const x = (p - ny * y) / nx
      if (x >= r.x0 - EPS && x <= r.x1 + EPS) pts.push([x, y])
    }
  }
  if (pts.length < 2) return null
  let best: number[] | null = null
  let bd = -1
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const dx = pts[i][0] - pts[j][0]
      const dy = pts[i][1] - pts[j][1]
      const d = dx * dx + dy * dy
      if (d > bd) {
        bd = d
        best = [pts[i][0], pts[i][1], pts[j][0], pts[j][1]]
      }
    }
  }
  return bd > EPS ? best : null
}

/** Liang–Barsky segment-to-rectangle clip. Returns null if fully outside. */
function clipSegment(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  r: Rect,
): number[] | null {
  let t0 = 0
  let t1 = 1
  const dx = x1 - x0
  const dy = y1 - y0
  const p = [-dx, dx, -dy, dy]
  const q = [x0 - r.x0, r.x1 - x0, y0 - r.y0, r.y1 - y0]
  for (let i = 0; i < 4; i++) {
    if (Math.abs(p[i]) < EPS) {
      if (q[i] < 0) return null
    } else {
      const t = q[i] / p[i]
      if (p[i] < 0) {
        if (t > t1) return null
        if (t > t0) t0 = t
      } else {
        if (t < t0) return null
        if (t < t1) t1 = t
      }
    }
  }
  return [x0 + t0 * dx, y0 + t0 * dy, x0 + t1 * dx, y0 + t1 * dy]
}

function hexagon(out: Primitive[], r: Rect, s: number, c: string, w: number) {
  const a = Math.max(s, 2) // flat-top hexagon side length
  const horiz = 1.5 * a
  const vert = Math.sqrt(3) * a
  const startCol = Math.floor((r.x0 - a) / horiz) - 1
  const endCol = Math.ceil((r.x1 + a) / horiz) + 1
  const verts: [number, number][] = []
  for (let k = 0; k < 6; k++) {
    const ang = (k * 60 * Math.PI) / 180
    verts.push([Math.cos(ang), Math.sin(ang)])
  }
  for (let col = startCol; col <= endCol && !capped(out); col++) {
    const cx = col * horiz
    const yOffset = Math.abs(col % 2) === 1 ? vert / 2 : 0
    const startRow = Math.floor((r.y0 - yOffset - a) / vert) - 1
    const endRow = Math.ceil((r.y1 - yOffset + a) / vert) + 1
    for (let row = startRow; row <= endRow && !capped(out); row++) {
      const cy = row * vert + yOffset
      // Each shared edge belongs to two hexagons; drawing only 3 consecutive
      // edges per hex covers every edge exactly once (no double-stroking).
      for (let k = 0; k < 3; k++) {
        const v0 = verts[k]
        const v1 = verts[(k + 1) % 6]
        const seg = clipSegment(cx + a * v0[0], cy + a * v0[1], cx + a * v1[0], cy + a * v1[1], r)
        if (seg) out.push(line(seg[0], seg[1], seg[2], seg[3], c, w))
      }
    }
  }
}

function cornell(out: Primitive[], r: Rect, s: number, c: string, w: number) {
  const cueX = r.x0 + Math.min(60, (r.x1 - r.x0) * 0.3)
  const summaryY = r.y1 - Math.min(55, (r.y1 - r.y0) * 0.22)
  const faint = LINE_COLORS.light.hex
  const faintW = Math.max(0.12, w * 0.6)
  const rule = s < 4 ? 8 : s // keep note rules readable regardless of spacing
  for (let y = r.y0 + rule; y <= summaryY - EPS && !capped(out); y += rule) {
    out.push(line(r.x0, y, r.x1, y, faint, faintW))
  }
  // Structural lines on top
  out.push(line(cueX, r.y0, cueX, summaryY, c, w))
  out.push(line(r.x0, summaryY, r.x1, summaryY, c, w))
  // Outer border
  out.push(line(r.x0, r.y0, r.x1, r.y0, c, w))
  out.push(line(r.x0, r.y1, r.x1, r.y1, c, w))
  out.push(line(r.x0, r.y0, r.x0, r.y1, c, w))
  out.push(line(r.x1, r.y0, r.x1, r.y1, c, w))
}

function music(out: Primitive[], r: Rect, s: number, c: string, w: number) {
  // Spacing controls the gap between the five staff lines.
  const gap = Math.min(Math.max(s >= 5 ? 2 : s, 1.5), 3)
  const staffH = gap * 4
  const between = gap * 6
  let y = r.y0 + gap
  while (y + staffH <= r.y1 + EPS && !capped(out)) {
    for (let i = 0; i < 5; i++) {
      out.push(line(r.x0, y + i * gap, r.x1, y + i * gap, c, w))
    }
    y += staffH + between
  }
}

function coordinate(out: Primitive[], r: Rect, s: number, c: string, w: number) {
  const axisColor = '#334155'
  const cxIndex = Math.round((r.x0 + r.x1) / 2 / s - r.x0 / s)
  const cyIndex = Math.round((r.y0 + r.y1) / 2 / s - r.y0 / s)
  // Vertical lines
  let i = 0
  for (let x = r.x0; x <= r.x1 + EPS && !capped(out); x += s, i++) {
    const fromCenter = i - cxIndex
    const isAxis = fromCenter === 0
    const isMajor = fromCenter % 5 === 0
    out.push(line(x, r.y0, x, r.y1, isAxis ? axisColor : c, isAxis ? w * 2.1 : isMajor ? w * 1.7 : w))
  }
  // Horizontal lines
  let j = 0
  for (let y = r.y0; y <= r.y1 + EPS && !capped(out); y += s, j++) {
    const fromCenter = j - cyIndex
    const isAxis = fromCenter === 0
    const isMajor = fromCenter % 5 === 0
    out.push(line(r.x0, y, r.x1, y, isAxis ? axisColor : c, isAxis ? w * 2.1 : isMajor ? w * 1.7 : w))
  }
  // Axis number labels at every 5th major line
  const axisX = r.x0 + cxIndex * s
  const axisY = r.y0 + cyIndex * s
  const fontMm = Math.min(Math.max(s * 0.5, 2.2), 3)
  i = 0
  for (let x = r.x0; x <= r.x1 + EPS; x += s, i++) {
    const n = i - cxIndex
    if (n !== 0 && n % 5 === 0) {
      out.push({ kind: 'text', x, y: axisY + fontMm + 1.2, text: String(n), size: fontMm, color: axisColor, anchor: 'middle' })
    }
  }
  j = 0
  for (let y = r.y0; y <= r.y1 + EPS; y += s, j++) {
    const n = cyIndex - j // y grows downward, so flip sign for math axis
    if (n !== 0 && n % 5 === 0) {
      out.push({ kind: 'text', x: axisX - 1.4, y: y + fontMm * 0.35, text: String(n), size: fontMm, color: axisColor, anchor: 'end' })
    }
  }
  out.push({ kind: 'text', x: axisX - 1.4, y: axisY + fontMm + 1.2, text: '0', size: fontMm, color: axisColor, anchor: 'end' })
}

function polar(out: Primitive[], r: Rect, s: number, c: string, w: number) {
  const cx = (r.x0 + r.x1) / 2
  const cy = (r.y0 + r.y1) / 2
  const maxR = Math.min(r.x1 - r.x0, r.y1 - r.y0) / 2
  for (let rr = s; rr <= maxR + EPS && !capped(out); rr += s) {
    out.push({ kind: 'circle', cx, cy, r: rr, color: c, w })
  }
  for (let deg = 0; deg < 360 && !capped(out); deg += 15) {
    const th = (deg * Math.PI) / 180
    const strong = deg % 90 === 0
    out.push(line(cx, cy, cx + maxR * Math.cos(th), cy + maxR * Math.sin(th), c, strong ? w * 1.8 : w))
  }
}

/** Subdivided grid: faint minor squares with a heavier rule every 5th line. */
function engineering(out: Primitive[], r: Rect, s: number, c: string, w: number) {
  const faint = LINE_COLORS.light.hex
  const minorW = Math.max(0.1, w * 0.55)
  const sub = 5
  let i = 0
  for (let x = r.x0; x <= r.x1 + EPS && !capped(out); x += s, i++) {
    const major = i % sub === 0
    out.push(line(x, r.y0, x, r.y1, major ? c : faint, major ? w * 1.5 : minorW))
  }
  let j = 0
  for (let y = r.y0; y <= r.y1 + EPS && !capped(out); y += s, j++) {
    const major = j % sub === 0
    out.push(line(r.x0, y, r.x1, y, major ? c : faint, major ? w * 1.5 : minorW))
  }
}

/** Log-log paper: decade boundaries with logarithmically-spaced minor lines. */
function logPaper(out: Primitive[], r: Rect, c: string, w: number) {
  const faint = LINE_COLORS.light.hex
  const minorW = Math.max(0.1, w * 0.55)
  const boldW = w * 1.6
  const decX = Math.max(1, Math.round((r.x1 - r.x0) / 45))
  const decY = Math.max(1, Math.round((r.y1 - r.y0) / 45))
  const dx = (r.x1 - r.x0) / decX
  const dy = (r.y1 - r.y0) / decY
  for (let d = 0; d < decX && !capped(out); d++) {
    const base = r.x0 + d * dx
    out.push(line(base, r.y0, base, r.y1, c, boldW))
    for (let k = 2; k <= 9; k++) {
      const x = base + dx * Math.log10(k)
      out.push(line(x, r.y0, x, r.y1, faint, minorW))
    }
  }
  out.push(line(r.x1, r.y0, r.x1, r.y1, c, boldW))
  for (let d = 0; d < decY && !capped(out); d++) {
    const base = r.y0 + d * dy
    out.push(line(r.x0, base, r.x1, base, c, boldW))
    for (let k = 2; k <= 9; k++) {
      const y = base + dy * Math.log10(k)
      out.push(line(r.x0, y, r.x1, y, faint, minorW))
    }
  }
  out.push(line(r.x0, r.y1, r.x1, r.y1, c, boldW))
}

/** Equilateral triangular grid — three line families at 0°, 60° and 120°. */
function triangle(out: Primitive[], r: Rect, s: number, c: string, w: number) {
  const t = (s * Math.sqrt(3)) / 2
  parallelFamily(out, r, 0, t, c, w)
  parallelFamily(out, r, 60, t, c, w)
  parallelFamily(out, r, 120, t, c, w)
}

/** Running-bond brick pattern: horizontal courses with half-offset head joints. */
function brick(out: Primitive[], r: Rect, s: number, c: string, w: number) {
  const bh = Math.max(s, 2)
  const bw = bh * 2
  for (let y = r.y0; y <= r.y1 + EPS && !capped(out); y += bh) {
    const yy = Math.min(y, r.y1)
    out.push(line(r.x0, yy, r.x1, yy, c, w))
  }
  out.push(line(r.x0, r.y1, r.x1, r.y1, c, w))
  let row = 0
  for (let y = r.y0; y < r.y1 - EPS && !capped(out); y += bh, row++) {
    const yTop = y
    const yBot = Math.min(y + bh, r.y1)
    const offset = row % 2 ? bw / 2 : 0
    for (let x = r.x0 + offset; x <= r.x1 + EPS && !capped(out); x += bw) {
      out.push(line(x, yTop, x, yBot, c, w))
    }
  }
  out.push(line(r.x0, r.y0, r.x0, r.y1, c, w))
  out.push(line(r.x1, r.y0, r.x1, r.y1, c, w))
}

/** One-point perspective grid: faint square base, horizon and radiating guides. */
function perspective(out: Primitive[], r: Rect, s: number, c: string, w: number) {
  const faint = LINE_COLORS.light.hex
  const minorW = Math.max(0.1, w * 0.55)
  const vx = (r.x0 + r.x1) / 2
  const vy = (r.y0 + r.y1) / 2
  for (let x = r.x0; x <= r.x1 + EPS && !capped(out); x += s) {
    out.push(line(x, r.y0, x, r.y1, faint, minorW))
  }
  for (let y = r.y0; y <= r.y1 + EPS && !capped(out); y += s) {
    out.push(line(r.x0, y, r.x1, y, faint, minorW))
  }
  out.push(line(r.x0, vy, r.x1, vy, c, w * 1.6))
  const reach = Math.hypot(r.x1 - r.x0, r.y1 - r.y0)
  for (let deg = 0; deg < 360 && !capped(out); deg += 15) {
    const th = (deg * Math.PI) / 180
    const seg = clipSegment(vx, vy, vx + Math.cos(th) * reach, vy + Math.sin(th) * reach, r)
    if (seg) out.push(line(seg[0], seg[1], seg[2], seg[3], c, w))
  }
  out.push({ kind: 'circle', cx: vx, cy: vy, r: Math.max(0.6, w * 3), fill: c })
}

/** Primary handwriting practice: solid top line, dashed midline, solid baseline per row. */
function handwriting(out: Primitive[], r: Rect, s: number, c: string, w: number) {
  const h = Math.max(s, 7)
  const step = h * 1.9
  const faint = LINE_COLORS.light.hex
  const dash = 3
  const gapd = 2.4
  for (let top = r.y0 + 2; top + h <= r.y1 + EPS && !capped(out); top += step) {
    const mid = top + h / 2
    const base = top + h
    out.push(line(r.x0, top, r.x1, top, faint, w))
    for (let x = r.x0; x < r.x1 - EPS && !capped(out); x += dash + gapd) {
      out.push(line(x, mid, Math.min(x + dash, r.x1), mid, c, Math.max(0.1, w * 0.7)))
    }
    out.push(line(r.x0, base, r.x1, base, c, w * 1.1))
  }
}

/** Séyès (French ruled): faint 2 mm sub-lines with a bold main line every 8 mm,
 *  a faint vertical grid and a red margin. */
function seyes(out: Primitive[], r: Rect, s: number, c: string, w: number) {
  const major = Math.max(s, 8)
  const minor = major / 4
  const faint = LINE_COLORS.light.hex
  const minorW = Math.max(0.1, w * 0.55)
  for (let x = r.x0; x <= r.x1 + EPS && !capped(out); x += major) {
    out.push(line(x, r.y0, x, r.y1, faint, minorW))
  }
  let i = 0
  for (let y = r.y0; y <= r.y1 + EPS && !capped(out); y += minor, i++) {
    const isMajor = i % 4 === 0
    out.push(line(r.x0, y, r.x1, y, isMajor ? c : faint, isMajor ? w : minorW))
  }
  const mx = r.x0 + Math.min(28, (r.x1 - r.x0) * 0.18)
  out.push(line(mx, r.y0, mx, r.y1, LINE_COLORS.red.hex, w))
}

/** Cross-stitch grid: faint squares with a heavier rule every 10th (block) line. */
function crossStitch(out: Primitive[], r: Rect, s: number, c: string, w: number) {
  const faint = LINE_COLORS.light.hex
  const minorW = Math.max(0.1, w * 0.5)
  const block = 10
  let i = 0
  for (let x = r.x0; x <= r.x1 + EPS && !capped(out); x += s, i++) {
    const major = i % block === 0
    out.push(line(x, r.y0, x, r.y1, major ? c : faint, major ? w * 1.4 : minorW))
  }
  let j = 0
  for (let y = r.y0; y <= r.y1 + EPS && !capped(out); y += s, j++) {
    const major = j % block === 0
    out.push(line(r.x0, y, r.x1, y, major ? c : faint, major ? w * 1.4 : minorW))
  }
}

/** Knitting graph: cells shorter than wide (stitch gauge ≈ 0.72), bold every 10. */
function knitting(out: Primitive[], r: Rect, s: number, c: string, w: number) {
  const faint = LINE_COLORS.light.hex
  const minorW = Math.max(0.1, w * 0.5)
  const sx = s
  const sy = Math.max(2, s * 0.72)
  const block = 10
  let i = 0
  for (let x = r.x0; x <= r.x1 + EPS && !capped(out); x += sx, i++) {
    const major = i % block === 0
    out.push(line(x, r.y0, x, r.y1, major ? c : faint, major ? w * 1.4 : minorW))
  }
  let j = 0
  for (let y = r.y0; y <= r.y1 + EPS && !capped(out); y += sy, j++) {
    const major = j % block === 0
    out.push(line(r.x0, y, r.x1, y, major ? c : faint, major ? w * 1.4 : minorW))
  }
}

/** Guitar tablature: repeating six-line TAB staves. */
function guitarTab(out: Primitive[], r: Rect, s: number, c: string, w: number) {
  const gap = Math.min(Math.max(s >= 5 ? 3 : s, 2), 4)
  const staffH = gap * 5
  const between = gap * 4
  let y = r.y0 + gap
  while (y + staffH <= r.y1 + EPS && !capped(out)) {
    for (let i = 0; i < 6; i++) out.push(line(r.x0, y + i * gap, r.x1, y + i * gap, c, w))
    y += staffH + between
  }
}

/** Semi-log paper: a linear vertical grid and logarithmic horizontal decades. */
function semiLog(out: Primitive[], r: Rect, s: number, c: string, w: number) {
  const faint = LINE_COLORS.light.hex
  const minorW = Math.max(0.1, w * 0.55)
  const boldW = w * 1.6
  let i = 0
  for (let x = r.x0; x <= r.x1 + EPS && !capped(out); x += s, i++) {
    const major = i % 5 === 0
    out.push(line(x, r.y0, x, r.y1, major ? c : faint, major ? w * 1.3 : minorW))
  }
  const decY = Math.max(1, Math.round((r.y1 - r.y0) / 45))
  const dy = (r.y1 - r.y0) / decY
  for (let d = 0; d < decY && !capped(out); d++) {
    const base = r.y0 + d * dy
    out.push(line(r.x0, base, r.x1, base, c, boldW))
    for (let k = 2; k <= 9; k++) {
      out.push(line(r.x0, base + dy * Math.log10(k), r.x1, base + dy * Math.log10(k), faint, minorW))
    }
  }
  out.push(line(r.x0, r.y1, r.x1, r.y1, c, boldW))
}

/** Number lines: evenly spaced horizontal lines with numbered ticks. */
function numberLine(out: Primitive[], r: Rect, s: number, c: string, w: number) {
  const tick = Math.max(s, 8)
  const rowGap = Math.max(tick * 2.4, 20)
  const tickH = 2.2
  const fontMm = Math.min(Math.max(tick * 0.35, 2.4), 3.2)
  for (let y = r.y0 + 8; y <= r.y1 + EPS && !capped(out); y += rowGap) {
    out.push(line(r.x0, y, r.x1, y, c, w))
    let n = 0
    for (let x = r.x0; x <= r.x1 + EPS && !capped(out); x += tick, n++) {
      out.push(line(x, y - tickH, x, y + tickH, c, w))
      out.push({ kind: 'text', x, y: y + tickH + fontMm + 0.6, text: String(n), size: fontMm, color: c, anchor: 'middle' })
    }
  }
}

/** Sudoku paper: tiled 9×9 grids — thin cells, bold 3-box and 9-box borders. */
function sudoku(out: Primitive[], r: Rect, s: number, c: string, w: number) {
  const faint = LINE_COLORS.light.hex
  const minorW = Math.max(0.1, w * 0.5)
  let i = 0
  for (let x = r.x0; x <= r.x1 + EPS && !capped(out); x += s, i++) {
    const box9 = i % 9 === 0
    const box3 = i % 3 === 0
    out.push(line(x, r.y0, x, r.y1, box9 || box3 ? c : faint, box9 ? w * 1.9 : box3 ? w * 1.1 : minorW))
  }
  let j = 0
  for (let y = r.y0; y <= r.y1 + EPS && !capped(out); y += s, j++) {
    const box9 = j % 9 === 0
    const box3 = j % 3 === 0
    out.push(line(r.x0, y, r.x1, y, box9 || box3 ? c : faint, box9 ? w * 1.9 : box3 ? w * 1.1 : minorW))
  }
}

/** A single centred 19×19 Go board with star points (hoshi). */
function goBoard(out: Primitive[], r: Rect, _s: number, c: string, w: number) {
  const N = 19
  const size = Math.min(r.x1 - r.x0, r.y1 - r.y0) * 0.96
  const cell = size / (N - 1)
  const ox = (r.x0 + r.x1) / 2 - size / 2
  const oy = (r.y0 + r.y1) / 2 - size / 2
  for (let i = 0; i < N; i++) {
    const lw = i === 0 || i === N - 1 ? w * 1.6 : w
    out.push(line(ox + i * cell, oy, ox + i * cell, oy + size, c, lw))
    out.push(line(ox, oy + i * cell, ox + size, oy + i * cell, c, lw))
  }
  const star = [3, 9, 15]
  for (const a of star) {
    for (const b of star) {
      out.push({ kind: 'circle', cx: ox + a * cell, cy: oy + b * cell, r: Math.max(0.8, cell * 0.14), fill: c })
    }
  }
}

/** Storyboard: rows of 16:9 frames, each with two faint caption lines. */
function storyboard(out: Primitive[], r: Rect, _s: number, c: string, w: number) {
  const faint = LINE_COLORS.light.hex
  const cols = 2
  const gap = 8
  const capH = 12
  const fw = (r.x1 - r.x0 - gap * (cols - 1)) / cols
  const fh = (fw * 9) / 16
  const rowH = fh + capH + gap
  for (let y = r.y0; y + fh <= r.y1 + EPS && !capped(out); y += rowH) {
    for (let col = 0; col < cols; col++) {
      const x = r.x0 + col * (fw + gap)
      out.push(line(x, y, x + fw, y, c, w))
      out.push(line(x, y + fh, x + fw, y + fh, c, w))
      out.push(line(x, y, x, y + fh, c, w))
      out.push(line(x + fw, y, x + fw, y + fh, c, w))
      out.push(line(x, y + fh + 5, x + fw, y + fh + 5, faint, Math.max(0.1, w * 0.6)))
      out.push(line(x, y + fh + 9.5, x + fw, y + fh + 9.5, faint, Math.max(0.1, w * 0.6)))
    }
  }
}

/** Calligraphy practice: ruled writing bands with 55° slant guides. */
function calligraphy(out: Primitive[], r: Rect, s: number, c: string, w: number) {
  const band = Math.max(s, 10)
  const step = band * 1.7
  const faint = LINE_COLORS.light.hex
  const minorW = Math.max(0.1, w * 0.6)
  const dx = band / Math.tan((55 * Math.PI) / 180)
  const slantGap = band * 0.9
  for (let top = r.y0 + 2; top + band <= r.y1 + EPS && !capped(out); top += step) {
    const base = top + band
    out.push(line(r.x0, top, r.x1, top, faint, minorW))
    out.push(line(r.x0, base, r.x1, base, c, w))
    for (let x = r.x0; x <= r.x1 + EPS && !capped(out); x += slantGap) {
      const seg = clipSegment(x, base, x + dx, top, r)
      if (seg) out.push(line(seg[0], seg[1], seg[2], seg[3], faint, minorW))
    }
  }
}

/** Ternary (triangular three-axis) graph: an equilateral triangle with three
 *  families of gridlines parallel to its sides. */
function ternary(out: Primitive[], r: Rect, _s: number, c: string, w: number) {
  const N = 10
  const size = Math.min(r.x1 - r.x0, (r.y1 - r.y0) / (Math.sqrt(3) / 2)) * 0.94
  const h = (size * Math.sqrt(3)) / 2
  const cx = (r.x0 + r.x1) / 2
  const topY = (r.y0 + r.y1) / 2 - h / 2
  const A: [number, number] = [cx, topY]
  const B: [number, number] = [cx - size / 2, topY + h]
  const C: [number, number] = [cx + size / 2, topY + h]
  const faint = LINE_COLORS.light.hex
  const lerp = (P: [number, number], Q: [number, number], t: number): [number, number] => [
    P[0] + (Q[0] - P[0]) * t,
    P[1] + (Q[1] - P[1]) * t,
  ]
  for (let i = 1; i < N; i++) {
    const t = i / N
    let p1 = lerp(A, B, t)
    let p2 = lerp(A, C, t)
    out.push(line(p1[0], p1[1], p2[0], p2[1], faint, w * 0.7))
    p1 = lerp(B, A, t)
    p2 = lerp(B, C, t)
    out.push(line(p1[0], p1[1], p2[0], p2[1], faint, w * 0.7))
    p1 = lerp(C, B, t)
    p2 = lerp(C, A, t)
    out.push(line(p1[0], p1[1], p2[0], p2[1], faint, w * 0.7))
  }
  out.push(line(A[0], A[1], B[0], B[1], c, w * 1.4))
  out.push(line(B[0], B[1], C[0], C[1], c, w * 1.4))
  out.push(line(C[0], C[1], A[0], A[1], c, w * 1.4))
}

/** Rows of blank analog clock faces for telling-time practice. */
function clockFace(out: Primitive[], r: Rect, s: number, c: string, w: number) {
  const rad = Math.max(s * 1.5, 12)
  const cell = rad * 2 + rad * 0.6
  const { start, count } = centeredCells(r.x0, r.x1, cell, rad * 2)
  for (let cy = r.y0 + rad + 2; cy + rad <= r.y1 + EPS && !capped(out); cy += cell) {
    let cx = start + rad
    for (let k = 0; k < count && !capped(out); k++, cx += cell) {
      out.push({ kind: 'circle', cx, cy, r: rad, color: c, w })
      for (let m = 0; m < 12; m++) {
        const a = (m / 12) * 2 * Math.PI - Math.PI / 2
        const major = m % 3 === 0
        const inner = rad - (major ? rad * 0.16 : rad * 0.09)
        out.push(line(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner, cx + Math.cos(a) * rad, cy + Math.sin(a) * rad, c, major ? w * 1.3 : w * 0.8))
      }
      out.push({ kind: 'circle', cx, cy, r: Math.max(0.6, w * 2), fill: c })
    }
  }
}

/** Two-point perspective: horizon with two vanishing points and fanned guides. */
function perspective2(out: Primitive[], r: Rect, s: number, c: string, w: number) {
  const faint = LINE_COLORS.light.hex
  const minorW = Math.max(0.1, w * 0.55)
  const vy = (r.y0 + r.y1) / 2
  const span = r.x1 - r.x0
  const vL: [number, number] = [r.x0 - span * 0.15, vy]
  const vR: [number, number] = [r.x1 + span * 0.15, vy]
  for (let x = r.x0; x <= r.x1 + EPS && !capped(out); x += s) {
    out.push(line(x, r.y0, x, r.y1, faint, minorW))
  }
  out.push(line(r.x0, vy, r.x1, vy, c, w * 1.6))
  const reach = Math.hypot(r.x1 - r.x0, r.y1 - r.y0) * 1.6
  for (const vp of [vL, vR]) {
    const toward = vp === vL ? 1 : -1
    for (let deg = -60; deg <= 60 && !capped(out); deg += 8) {
      const th = (deg * Math.PI) / 180
      const seg = clipSegment(vp[0], vp[1], vp[0] + toward * Math.cos(th) * reach, vp[1] + Math.sin(th) * reach, r)
      if (seg) out.push(line(seg[0], seg[1], seg[2], seg[3], c, w))
    }
  }
}

/** Battle map: a bold one-inch square grid for tabletop RPGs (spacing ≈ 25.4 mm). */
function battleMap(out: Primitive[], r: Rect, s: number, c: string, w: number) {
  for (let x = r.x0; x <= r.x1 + EPS && !capped(out); x += s) out.push(line(x, r.y0, x, r.y1, c, w))
  for (let y = r.y0; y <= r.y1 + EPS && !capped(out); y += s) out.push(line(r.x0, y, r.x1, y, c, w))
  out.push(line(r.x0, r.y0, r.x1, r.y0, c, w * 1.6))
  out.push(line(r.x0, r.y1, r.x1, r.y1, c, w * 1.6))
  out.push(line(r.x0, r.y0, r.x0, r.y1, c, w * 1.6))
  out.push(line(r.x1, r.y0, r.x1, r.y1, c, w * 1.6))
}

/** A centred 8×8 chessboard with hatch-shaded dark squares. */
function chessBoard(out: Primitive[], r: Rect, _s: number, c: string, w: number) {
  const N = 8
  const size = Math.min(r.x1 - r.x0, r.y1 - r.y0) * 0.92
  const cell = size / N
  const ox = (r.x0 + r.x1) / 2 - size / 2
  const oy = (r.y0 + r.y1) / 2 - size / 2
  const hatchGap = cell / 4
  for (let row = 0; row < N && !capped(out); row++) {
    for (let col = 0; col < N; col++) {
      if ((row + col) % 2 === 1) {
        const x0 = ox + col * cell
        const y0 = oy + row * cell
        const cellRect: Rect = { x0, y0, x1: x0 + cell, y1: y0 + cell }
        for (let d = -cell; d <= cell + EPS; d += hatchGap) {
          const seg = clipSegment(x0 + d, y0, x0 + d + cell, y0 + cell, cellRect)
          if (seg) out.push(line(seg[0], seg[1], seg[2], seg[3], c, Math.max(0.1, w * 0.5)))
        }
      }
    }
  }
  for (let i = 0; i <= N; i++) {
    const lw = i === 0 || i === N ? w * 1.6 : w
    out.push(line(ox + i * cell, oy, ox + i * cell, oy + size, c, lw))
    out.push(line(ox, oy + i * cell, ox + size, oy + i * cell, c, lw))
  }
}

/** Pointy-top hexagonal map grid (distinct from the flat-top hexagon paper). */
function hexMap(out: Primitive[], r: Rect, s: number, c: string, w: number) {
  const a = Math.max(s, 2)
  const vert = 1.5 * a
  const horiz = Math.sqrt(3) * a
  const verts: [number, number][] = []
  for (let k = 0; k < 6; k++) {
    const ang = ((k * 60 + 30) * Math.PI) / 180
    verts.push([Math.cos(ang), Math.sin(ang)])
  }
  const startRow = Math.floor((r.y0 - a) / vert) - 1
  const endRow = Math.ceil((r.y1 + a) / vert) + 1
  for (let row = startRow; row <= endRow && !capped(out); row++) {
    const cy = row * vert
    const xOffset = Math.abs(row % 2) === 1 ? horiz / 2 : 0
    const startCol = Math.floor((r.x0 - xOffset - a) / horiz) - 1
    const endCol = Math.ceil((r.x1 - xOffset + a) / horiz) + 1
    for (let col = startCol; col <= endCol && !capped(out); col++) {
      const cx = col * horiz + xOffset
      for (let k = 0; k < 3; k++) {
        const v0 = verts[k]
        const v1 = verts[(k + 1) % 6]
        const seg = clipSegment(cx + a * v0[0], cy + a * v0[1], cx + a * v1[0], cy + a * v1[1], r)
        if (seg) out.push(line(seg[0], seg[1], seg[2], seg[3], c, w))
      }
    }
  }
}

/** Quilting grid: a square grid with faint diagonals through every cell. */
function quilting(out: Primitive[], r: Rect, s: number, c: string, w: number) {
  const faint = LINE_COLORS.light.hex
  const minorW = Math.max(0.1, w * 0.5)
  for (let x = r.x0; x < r.x1 - EPS && !capped(out); x += s) {
    for (let y = r.y0; y < r.y1 - EPS && !capped(out); y += s) {
      const x2 = Math.min(x + s, r.x1)
      const y2 = Math.min(y + s, r.y1)
      out.push(line(x, y, x2, y2, faint, minorW))
      out.push(line(x2, y, x, y2, faint, minorW))
    }
  }
  for (let x = r.x0; x <= r.x1 + EPS && !capped(out); x += s) out.push(line(x, r.y0, x, r.y1, c, w))
  for (let y = r.y0; y <= r.y1 + EPS && !capped(out); y += s) out.push(line(r.x0, y, r.x1, y, c, w))
}

/** Genkō yōshi: columns of Japanese character squares with a gap between columns. */
function genkoYoshi(out: Primitive[], r: Rect, s: number, c: string, w: number) {
  const cell = Math.max(s, 8)
  const colStep = cell + cell * 0.35
  const { start, count } = centeredCells(r.x0, r.x1, colStep, cell)
  let x = start
  for (let k = 0; k < count && !capped(out); k++, x += colStep) {
    let bottom = r.y0
    for (let y = r.y0; y + cell <= r.y1 + EPS; y += cell) {
      out.push(line(x, y, x + cell, y, c, w))
      bottom = y + cell
    }
    out.push(line(x, bottom, x + cell, bottom, c, w))
    out.push(line(x, r.y0, x, bottom, c, w))
    out.push(line(x + cell, r.y0, x + cell, bottom, c, w))
  }
}

/** Tian Zi Ge: Chinese character squares with a faint red cross guide. */
function tianZiGe(out: Primitive[], r: Rect, s: number, c: string, w: number) {
  const cell = Math.max(s, 10)
  const guide = LINE_COLORS.red.hex
  const gW = Math.max(0.1, w * 0.5)
  const { start, count } = centeredCells(r.x0, r.x1, cell, cell)
  let x = start
  for (let k = 0; k < count && !capped(out); k++, x += cell) {
    for (let y = r.y0; y + cell <= r.y1 + EPS && !capped(out); y += cell) {
      out.push(line(x, y, x + cell, y, c, w))
      out.push(line(x, y + cell, x + cell, y + cell, c, w))
      out.push(line(x, y, x, y + cell, c, w))
      out.push(line(x + cell, y, x + cell, y + cell, c, w))
      out.push(line(x, y + cell / 2, x + cell, y + cell / 2, guide, gW))
      out.push(line(x + cell / 2, y, x + cell / 2, y + cell, guide, gW))
    }
  }
}

/** Bass tablature: repeating four-line TAB staves. */
function bassTab(out: Primitive[], r: Rect, s: number, c: string, w: number) {
  const gap = Math.min(Math.max(s >= 5 ? 3.5 : s, 2.5), 5)
  const staffH = gap * 3
  const between = gap * 4
  let y = r.y0 + gap
  while (y + staffH <= r.y1 + EPS && !capped(out)) {
    for (let i = 0; i < 4; i++) out.push(line(r.x0, y + i * gap, r.x1, y + i * gap, c, w))
    y += staffH + between
  }
}

/** A grid of blank guitar chord diagrams (6 strings × 5 frets with a nut). */
function chordDiagram(out: Primitive[], r: Rect, s: number, c: string, w: number) {
  const strings = 6
  const frets = 5
  const boxW = Math.max(s * 2, 18)
  const cellW = boxW / (strings - 1)
  const fretH = cellW
  const boxH = fretH * frets
  const stepX = boxW + boxW * 0.55
  const stepY = boxH + 10 + boxW * 0.4
  const { start, count } = centeredCells(r.x0, r.x1, stepX, boxW)
  for (let y = r.y0 + 5; y + boxH <= r.y1 + EPS && !capped(out); y += stepY) {
    let x = start
    for (let k = 0; k < count && !capped(out); k++, x += stepX) {
      out.push(line(x, y, x + boxW, y, c, w * 2))
      for (let f = 1; f <= frets; f++) out.push(line(x, y + f * fretH, x + boxW, y + f * fretH, c, w))
      for (let si = 0; si < strings; si++) out.push(line(x + si * cellW, y, x + si * cellW, y + boxH, c, w))
    }
  }
}

/** Peyote / brick-stitch bead grid: columns of bead cells offset by half a bead. */
function peyote(out: Primitive[], r: Rect, s: number, c: string, w: number) {
  const bw = Math.max(s, 4)
  const bh = bw * 0.72
  const faint = LINE_COLORS.light.hex
  const minorW = Math.max(0.1, w * 0.5)
  let col = 0
  for (let x = r.x0; x <= r.x1 + EPS && !capped(out); x += bw, col++) {
    out.push(line(x, r.y0, x, r.y1, faint, minorW))
    const yOff = col % 2 ? bh / 2 : 0
    for (let y = r.y0 + yOff; y <= r.y1 + EPS && !capped(out); y += bh) {
      out.push(line(x, y, Math.min(x + bw, r.x1), y, c, w))
    }
  }
  out.push(line(r.x1, r.y0, r.x1, r.y1, faint, minorW))
}

/** Crossword: a bold square puzzle grid with a heavy border. */
function crossword(out: Primitive[], r: Rect, s: number, c: string, w: number) {
  for (let x = r.x0; x <= r.x1 + EPS && !capped(out); x += s) out.push(line(x, r.y0, x, r.y1, c, w * 1.1))
  for (let y = r.y0; y <= r.y1 + EPS && !capped(out); y += s) out.push(line(r.x0, y, r.x1, y, c, w * 1.1))
  out.push(line(r.x0, r.y0, r.x1, r.y0, c, w * 2))
  out.push(line(r.x0, r.y1, r.x1, r.y1, c, w * 2))
  out.push(line(r.x0, r.y0, r.x0, r.y1, c, w * 2))
  out.push(line(r.x1, r.y0, r.x1, r.y1, c, w * 2))
}

/** Comic / manga page: a 3×2 grid of blank panels with gutters. */
function comic(out: Primitive[], r: Rect, _s: number, c: string, w: number) {
  const rows = 3
  const cols = 2
  const gut = 6
  const pw = (r.x1 - r.x0 - gut * (cols - 1)) / cols
  const ph = (r.y1 - r.y0 - gut * (rows - 1)) / rows
  for (let ri = 0; ri < rows && !capped(out); ri++) {
    for (let ci = 0; ci < cols; ci++) {
      const x = r.x0 + ci * (pw + gut)
      const y = r.y0 + ri * (ph + gut)
      out.push(line(x, y, x + pw, y, c, w * 1.4))
      out.push(line(x, y + ph, x + pw, y + ph, c, w * 1.4))
      out.push(line(x, y, x, y + ph, c, w * 1.4))
      out.push(line(x + pw, y, x + pw, y + ph, c, w * 1.4))
    }
  }
}

function drawHeader(out: Primitive[], h: HeaderOptions, margin: number, top: number, width: number): number {
  const hx0 = Math.max(margin, 12)
  const hx1 = width - Math.max(margin, 12)
  const size = 3.4
  const lw = 0.3
  let y = top + 8
  if (h.title) {
    out.push({ kind: 'text', x: hx0, y, text: 'Title', size, color: HEADER_INK, anchor: 'start' })
    out.push(line(hx0 + 14, y + 0.6, hx1, y + 0.6, HEADER_INK, lw))
    y += 10
  }
  if (h.name || h.date) {
    if (h.name) {
      out.push({ kind: 'text', x: hx0, y, text: 'Name', size, color: HEADER_INK, anchor: 'start' })
      const nameEnd = h.date ? hx0 + (hx1 - hx0) * 0.55 : hx1
      out.push(line(hx0 + 16, y + 0.6, nameEnd, y + 0.6, HEADER_INK, lw))
    }
    if (h.date) {
      const dx = hx0 + (hx1 - hx0) * (h.name ? 0.62 : 0)
      out.push({ kind: 'text', x: dx, y, text: 'Date', size, color: HEADER_INK, anchor: 'start' })
      out.push(line(dx + 14, y + 0.6, hx1, y + 0.6, HEADER_INK, lw))
    }
    y += 10
  }
  return y + 4
}

/**
 * Coarse, low-element-count variant of a config for small thumbnails. Keeps the
 * grid visually representative while capping the number of primitives so listing
 * pages with many previews stay light (important for dot grids).
 */
export function thumbConfig(c: PaperConfig): PaperConfig {
  const targetDivisions = 14
  const w = (PAPER_SIZES[c.paperSize] ?? PAPER_SIZES.a4).w
  const minSpacing = w / targetDivisions
  return {
    ...c,
    spacing: Math.max(c.spacing, minSpacing),
    margin: 'none',
    header: undefined,
  }
}

/**
 * Filename (no extension) of the shared OG image for a config: one image per paper
 * *style*. The OG preview is a generic 1200×630 grid of that style, so every size
 * and spacing variant shares it (14 images total). Deterministic, so the generator
 * (scripts/generate-og.ts) and the page (og:image meta) agree.
 */
export function ogImageSlug(c: PaperConfig): string {
  return c.paperType
}

/** Paper sizes whose longest edge exceeds 550 mm (A0–A2, B0–B2, C0–C2, ANSI/Arch C–E). */
export function isLargeFormat(sizeId: PaperSizeId): boolean {
  const s = PAPER_SIZES[sizeId] ?? PAPER_SIZES.a4
  return Math.max(s.w, s.h) > 550
}

/** Dense paper types whose vector PDFs balloon to multiple MB on big sheets. */
const DENSE_PDF_TYPES = new Set<PaperType>([
  'dot', 'hexagon', 'brick', 'handwriting', 'calligraphy', 'numberline',
  'clockface', 'hexmap', 'quilting', 'genkoyoshi', 'tianzige', 'chorddiagram', 'peyote',
])

/**
 * Whether we pre-generate a static download PDF for this config. Dense grids on
 * large-format sheets are skipped (they'd be several MB each) — those pages fall
 * back to on-demand, in-browser download instead. Used by both the PDF generator
 * (what to write) and the template page (static link vs dynamic button).
 */
export function hasStaticPdf(config: PaperConfig): boolean {
  return !(DENSE_PDF_TYPES.has(config.paperType) && isLargeFormat(config.paperSize))
}

/* ------------------------------------------------------------------ */
/* SVG serialisation (pure; safe to run during SSR / prerender)       */
/* ------------------------------------------------------------------ */

function round(n: number): number {
  return Math.round(n * 1000) / 1000
}

function escapeXml(s: string): string {
  return s.replace(/[<>&'"]/g, (ch) =>
    ch === '<' ? '&lt;' : ch === '>' ? '&gt;' : ch === '&' ? '&amp;' : ch === "'" ? '&apos;' : '&quot;',
  )
}

export interface RenderedSvg {
  svg: string
  width: number
  height: number
}

/**
 * Serialise a built paper to a standalone SVG string. The viewBox is in
 * millimetres so stroke widths (also in mm) print true-to-size.
 */
export function renderPaperSvg(config: PaperConfig, opts?: { skipText?: boolean }): RenderedSvg {
  const { width, height, primitives } = buildPaper(config)
  const body: string[] = []
  body.push(`<rect x="0" y="0" width="${round(width)}" height="${round(height)}" fill="#ffffff"/>`)
  for (const p of primitives) {
    if (p.kind === 'line') {
      body.push(
        `<line x1="${round(p.x1)}" y1="${round(p.y1)}" x2="${round(p.x2)}" y2="${round(p.y2)}" stroke="${p.color}" stroke-width="${round(p.w)}" stroke-linecap="round"/>`,
      )
    } else if (p.kind === 'circle') {
      if (p.fill) {
        body.push(`<circle cx="${round(p.cx)}" cy="${round(p.cy)}" r="${round(p.r)}" fill="${p.fill}"/>`)
      } else {
        body.push(
          `<circle cx="${round(p.cx)}" cy="${round(p.cy)}" r="${round(p.r)}" fill="none" stroke="${p.color}" stroke-width="${round(p.w || 0.2)}"/>`,
        )
      }
    } else if (p.kind === 'text') {
      // Axis numbers / labels. Skipped for thumbnails: at card scale they render
      // as an illegible smear (e.g. "-55105-50") and, because the preview sits
      // inside a link, they leak into the anchor text and pollute it for SEO.
      if (opts?.skipText) continue
      body.push(
        `<text x="${round(p.x)}" y="${round(p.y)}" font-size="${round(p.size)}" fill="${p.color}" text-anchor="${p.anchor}" font-family="sans-serif">${escapeXml(p.text)}</text>`,
      )
    }
  }
  // The preview is always decorative — every place it appears has an adjacent
  // visible title / heading — so it is hidden from the a11y tree (and from anchor
  // accessible-name computation) rather than exposed as a labelled image.
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${round(width)} ${round(height)}" ` +
    `width="100%" height="100%" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">` +
    body.join('') +
    `</svg>`
  return { svg, width, height }
}
