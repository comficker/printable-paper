# Where the measurements come from

Every number in `data/` is a physical measurement, so it can be checked with a
ruler. This is what they are based on.

## Page sizes — `paper-sizes.json`

| Family | Standard | Notes |
|---|---|---|
| A0–A10 | ISO 216 | A0 is 841 × 1189 mm (1 m² at a 1:√2 ratio); each step halves the long side |
| B0–B10 | ISO 216 | geometric mean between neighbouring A sizes |
| C0–C10 | ISO 269 | envelope sizes, between A and B |
| US Letter, Legal, Tabloid, Executive, Junior Legal, Half Letter | North American trade sizes | defined in inches; stored here converted at 25.4 mm/in |
| ANSI A–E | ANSI/ASME Y14.1 | engineering drawing sheets |
| Arch A–E | ANSI/ASME Y14.1 | architectural sheets, e.g. Arch A = 9 × 12 in |

Imperial sizes are held in millimetres because the generator works in
millimetres throughout; `widthIn` / `heightIn` in the JSON are the exact
originals (8.5 × 11 in and so on), not rounded conversions back from metric.

## Grid spacings — `spacings.json`

Metric spacings (1, 2, 5, 10 mm) are the ones sold as school exercise paper
across Europe. Imperial spacings are the common American pad rulings: 1/8 inch
(3.175 mm), 1/4 inch (6.35 mm) and 1/2 inch (12.7 mm). The inch is taken as
exactly 25.4 mm, so these are exact, not approximations.

## Ruling conventions

A few of the papers follow a named convention rather than a plain grid:

- **Séyès** (French school ruling): a major horizontal line every 8 mm,
  subdivided into four 2 mm bands, with faint verticals at the major pitch and a
  red margin rule down the left.
- **Music staff**: five lines per staff, the gap between lines clamped to
  1.5–3 mm — the range used by printed manuscript paper — with a gap of six line
  spacings between staves.
- **Cornell notes**: a cue column on the left, a note area, and a summary band
  across the bottom.
- **Engineering paper**: a fine grid with a heavier rule every five squares.

Rulings like college-ruled and wide-ruled vary between manufacturers by a
fraction of a millimetre; the generator exposes the spacing directly so you can
set the exact pitch you want rather than relying on a label.

## Corrections

If a measurement is wrong, it is wrong in a way that can be demonstrated: print
the sheet at 100%, measure it, and open an issue saying what you measured.
