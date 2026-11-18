import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { buildPaper, renderPaperSvg, renderPaperPdf, PAPER_SIZES } from '../dist/index.js'

const TYPES = JSON.parse(readFileSync(new URL('../data/paper-types.json', import.meta.url), 'utf8'))

const base = {
  paperSize: 'a4',
  orientation: 'portrait',
  spacing: 5,
  margin: 'small',
  lineColor: 'light',
  lineThickness: 'thin',
}

test('A4 is 210 x 297 mm, which is what makes a print true to scale', () => {
  const { width, height } = buildPaper({ ...base, paperType: 'graph' })
  assert.equal(width, 210)
  assert.equal(height, 297)
})

test('a 5 mm grid really is 5 mm apart', () => {
  const { primitives } = buildPaper({ ...base, paperType: 'graph', margin: 'none' })
  const xs = [...new Set(primitives.filter((p) => p.kind === 'line' && p.x1 === p.x2).map((p) => p.x1))].sort(
    (a, b) => a - b,
  )
  assert.ok(xs.length > 20)
  for (let i = 1; i < xs.length; i++) {
    assert.ok(Math.abs(xs[i] - xs[i - 1] - 5) < 1e-6, `gap ${xs[i] - xs[i - 1]} is not 5 mm`)
  }
})

test('every documented paper type builds and renders', () => {
  for (const type of TYPES) {
    const built = buildPaper({ ...base, paperType: type.id })
    assert.ok(built.primitives.length > 0, `${type.id} drew nothing`)
    assert.match(renderPaperSvg({ ...base, paperType: type.id }).svg, /^<svg /)
  }
})

test('every documented paper type points at a page on the site', () => {
  for (const type of TYPES) {
    assert.match(type.freeGraphPaper, /^https:\/\/freegraphpaper\.net\/[a-z0-9-]+$/, type.id)
  }
})

test('every page size builds', () => {
  for (const size of Object.keys(PAPER_SIZES)) {
    const built = buildPaper({ ...base, paperType: 'graph', paperSize: size })
    assert.ok(built.primitives.length > 0, `${size} drew nothing`)
  }
})

test('the PDF is structurally valid and its xref offsets land on their objects', () => {
  const bytes = renderPaperPdf({ ...base, paperType: 'coordinate' }, 2)
  const pdf = Buffer.from(bytes).toString('latin1')
  assert.ok(pdf.startsWith('%PDF-1.4'))
  assert.ok(pdf.trimEnd().endsWith('%%EOF'))

  const startxref = Number(pdf.slice(pdf.lastIndexOf('startxref') + 9).trim().split('\n')[0])
  assert.equal(pdf.slice(startxref, startxref + 4), 'xref')

  const offsets = [...pdf.slice(startxref).matchAll(/^(\d{10}) 00000 n $/gm)].map((m) => Number(m[1]))
  assert.ok(offsets.length >= 6)
  offsets.forEach((offset, i) => {
    assert.ok(pdf.startsWith(`${i + 1} 0 obj`, offset), `object ${i + 1} is not at offset ${offset}`)
  })
  assert.match(pdf, /\/Type \/Pages \/Count 2 /)
})

test('landscape swaps the page dimensions', () => {
  const p = buildPaper({ ...base, paperType: 'graph', orientation: 'portrait' })
  const l = buildPaper({ ...base, paperType: 'graph', orientation: 'landscape' })
  assert.equal(p.width, l.height)
  assert.equal(p.height, l.width)
})
