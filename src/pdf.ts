/**
 * A very small vector-PDF writer, just large enough for the three primitives the
 * geometry engine emits (line, circle, text).
 *
 * Why not a PDF library: the whole point of this package is that a grid printed
 * from it is the same grid freegraphpaper.net prints, and that is a property of
 * the geometry engine, not of the writer. Keeping the writer to ~200 lines keeps
 * the package dependency-free, which matters when it is run with `npx`.
 *
 * Coordinates arrive in millimetres with a top-left origin (y downwards). PDF
 * space is points with a bottom-left origin, so every y is flipped here.
 */
import type { Primitive } from './paper.js'

const PT_PER_MM = 72 / 25.4
/** Bezier handle length for a quarter circle, as a fraction of the radius. */
const KAPPA = 0.5522847498

/** Helvetica advance widths (AFM units, 1/1000 em) for printable ASCII. */
const HELVETICA_WIDTHS = [
  278, 278, 355, 556, 556, 889, 667, 191, 333, 333, 389, 584, 278, 333, 278, 278,
  556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 278, 278, 584, 584, 584, 556,
  1015, 667, 667, 722, 722, 667, 611, 778, 722, 278, 500, 667, 556, 833, 722, 778,
  667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 278, 278, 278, 469, 556,
  333, 556, 556, 500, 556, 556, 278, 556, 556, 222, 222, 500, 222, 833, 556, 556,
  556, 556, 333, 500, 278, 556, 500, 722, 500, 500, 500, 334, 260, 334, 584,
]

function textWidthMm(text: string, sizeMm: number): number {
  let units = 0
  for (const ch of text) {
    const code = ch.codePointAt(0) ?? 32
    units += code >= 32 && code <= 126 ? HELVETICA_WIDTHS[code - 32]! : 556
  }
  return (units / 1000) * sizeMm
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const num = parseInt(full, 16)
  return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255]
}

const n = (v: number) => (Math.round(v * 1000) / 1000).toString()

/** Escape for a PDF literal string, and drop anything outside WinAnsi ASCII. */
function pdfString(text: string): string {
  return text
    .replace(/[\\()]/g, (c) => '\\' + c)
    .replace(/[^\x20-\x7e]/g, '')
}

export interface PdfMeta {
  title?: string
  author?: string
  creator?: string
}

function contentStream(primitives: Primitive[], heightMm: number): string {
  const ops: string[] = ['1 J']
  const y = (v: number) => n((heightMm - v) * PT_PER_MM)
  const x = (v: number) => n(v * PT_PER_MM)
  let stroke = ''
  let fill = ''
  let width = ''

  const setStroke = (hex: string) => {
    const key = hex.toLowerCase()
    if (key === stroke) return
    stroke = key
    const [r, g, b] = hexToRgb(hex)
    ops.push(`${n(r)} ${n(g)} ${n(b)} RG`)
  }
  const setFill = (hex: string) => {
    const key = hex.toLowerCase()
    if (key === fill) return
    fill = key
    const [r, g, b] = hexToRgb(hex)
    ops.push(`${n(r)} ${n(g)} ${n(b)} rg`)
  }
  const setWidth = (mm: number) => {
    const key = n(mm * PT_PER_MM)
    if (key === width) return
    width = key
    ops.push(`${key} w`)
  }

  for (const p of primitives) {
    if (p.kind === 'line') {
      setStroke(p.color)
      setWidth(p.w)
      ops.push(`${x(p.x1)} ${y(p.y1)} m ${x(p.x2)} ${y(p.y2)} l S`)
    } else if (p.kind === 'circle') {
      const r = p.r * PT_PER_MM
      const cx = p.cx * PT_PER_MM
      const cy = (heightMm - p.cy) * PT_PER_MM
      const k = r * KAPPA
      const arc = [
        `${n(cx + r)} ${n(cy)} m`,
        `${n(cx + r)} ${n(cy + k)} ${n(cx + k)} ${n(cy + r)} ${n(cx)} ${n(cy + r)} c`,
        `${n(cx - k)} ${n(cy + r)} ${n(cx - r)} ${n(cy + k)} ${n(cx - r)} ${n(cy)} c`,
        `${n(cx - r)} ${n(cy - k)} ${n(cx - k)} ${n(cy - r)} ${n(cx)} ${n(cy - r)} c`,
        `${n(cx + k)} ${n(cy - r)} ${n(cx + r)} ${n(cy - k)} ${n(cx + r)} ${n(cy)} c`,
      ].join(' ')
      if (p.fill) {
        setFill(p.fill)
        ops.push(`${arc} f`)
      } else {
        setStroke(p.color ?? '#000000')
        setWidth(p.w || 0.2)
        ops.push(`${arc} S`)
      }
    } else if (p.kind === 'text') {
      setFill(p.color)
      const w = textWidthMm(p.text, p.size)
      const dx = p.anchor === 'middle' ? -w / 2 : p.anchor === 'end' ? -w : 0
      ops.push(
        `BT /F1 ${n(p.size * PT_PER_MM)} Tf ${x(p.x + dx)} ${y(p.y)} Td (${pdfString(p.text)}) Tj ET`,
      )
    }
  }
  return ops.join('\n')
}

/**
 * Build a PDF of `pages` identical sheets. Returns the raw bytes, ready to write
 * to disk or send as a response body.
 */
export function primitivesToPdf(
  primitives: Primitive[],
  widthMm: number,
  heightMm: number,
  pages = 1,
  meta: PdfMeta = {},
): Uint8Array {
  const count = Math.min(Math.max(Math.round(pages), 1), 50)
  const content = contentStream(primitives, heightMm)
  const mediaBox = `[0 0 ${n(widthMm * PT_PER_MM)} ${n(heightMm * PT_PER_MM)}]`

  // Object layout: 1 catalog, 2 pages, 3 font, 4 shared content stream,
  // then one page object per sheet.
  const pageIds = Array.from({ length: count }, (_, i) => 5 + i)
  const objects: string[] = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    `<< /Type /Pages /Count ${count} /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] >>`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    ...pageIds.map(
      () =>
        `<< /Type /Page /Parent 2 0 R /MediaBox ${mediaBox} /Resources << /Font << /F1 3 0 R >> >> /Contents 4 0 R >>`,
    ),
  ]
  const infoParts = [
    meta.title && `/Title (${pdfString(meta.title)})`,
    meta.author && `/Author (${pdfString(meta.author)})`,
    meta.creator && `/Creator (${pdfString(meta.creator)})`,
  ].filter(Boolean)
  if (infoParts.length) objects.push(`<< ${infoParts.join(' ')} >>`)
  const infoId = infoParts.length ? objects.length : 0

  const chunks: string[] = ['%PDF-1.4\n%\xe2\xe3\xcf\xd3\n']
  const offsets: number[] = []
  let position = chunks[0]!.length
  objects.forEach((body, i) => {
    const chunk = `${i + 1} 0 obj\n${body}\nendobj\n`
    offsets.push(position)
    position += chunk.length
    chunks.push(chunk)
  })

  const xrefStart = position
  const xref = [
    `xref\n0 ${objects.length + 1}\n`,
    '0000000000 65535 f \n',
    ...offsets.map((o) => `${o.toString().padStart(10, '0')} 00000 n \n`),
  ].join('')
  chunks.push(xref)
  chunks.push(
    `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R${infoId ? ` /Info ${infoId} 0 R` : ''} >>\n` +
      `startxref\n${xrefStart}\n%%EOF\n`,
  )

  const text = chunks.join('')
  const bytes = new Uint8Array(text.length)
  for (let i = 0; i < text.length; i++) bytes[i] = text.charCodeAt(i) & 0xff
  return bytes
}
