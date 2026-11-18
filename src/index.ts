/**
 * printable-paper — ruled-paper specifications and a generator for them.
 *
 * The geometry engine in `paper.ts` is the one that runs on freegraphpaper.net,
 * so a sheet produced here is the sheet the site produces: same spacings, same
 * stroke widths, same true-to-scale millimetre geometry.
 */
export {
  buildPaper,
  renderPaperSvg,
  PAPER_SIZES,
  SIZE_SERIES,
  SPACING_OPTIONS,
  PAPER_TYPE_OPTIONS,
  LINE_COLORS,
  THICKNESS,
  MARGINS,
  INCH,
  sizesInSeries,
} from './paper.js'

export type {
  PaperConfig,
  PaperType,
  PaperSizeId,
  PaperSizeInfo,
  SizeSeriesId,
  Orientation,
  LineColorId,
  ThicknessId,
  MarginId,
  Primitive,
  LinePrim,
  CirclePrim,
  TextPrim,
  BuiltPaper,
} from './paper.js'

export { primitivesToPdf, type PdfMeta } from './pdf.js'

import { buildPaper, type PaperConfig } from './paper.js'
import { primitivesToPdf, type PdfMeta } from './pdf.js'

export const SITE = 'https://freegraphpaper.net'

const DEFAULT_META: PdfMeta = {
  title: 'Printable paper - freegraphpaper.net',
  author: 'freegraphpaper.net',
  creator: 'printable-paper (https://freegraphpaper.net)',
}

/** Build a print-ready PDF for a paper config. `pages` repeats the same sheet. */
export function renderPaperPdf(config: PaperConfig, pages = 1, meta?: PdfMeta): Uint8Array {
  const { width, height, primitives } = buildPaper(config)
  return primitivesToPdf(primitives, width, height, pages, { ...DEFAULT_META, ...meta })
}

export interface PaperTypeInfo {
  id: string
  name: string
  description: string
  /** The page on freegraphpaper.net that prints this kind of paper. */
  freeGraphPaper: string
}
