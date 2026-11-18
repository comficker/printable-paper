# printable-paper

Spezifikationen für 39 Arten von liniertem und kariertem Papier samt einem abhängigkeitsfreien Generator, der daraus maßstabsgetreues SVG oder PDF macht.

Die Raster werden in Millimetern beschrieben und in Millimetern gezeichnet. Ein bei 100 % gedrucktes Blatt misst also genau das, was draufsteht — woran die meisten PDFs mit "kostenlosem Millimeterpapier" stillschweigend scheitern. Die Geometrie stammt aus derselben Engine wie [freegraphpaper.net](https://freegraphpaper.net/de), wo sich jedes Papier im Browser ansehen und herunterladen lässt.

```bash
npx printable-paper graph --size a4 --spacing 5mm --out grid.pdf
```

## Installation

```bash
npm install printable-paper
```

## Kommandozeile

```bash
printable-paper <type> [options]
printable-paper list types|sizes|spacings
```

`--size` `--orientation` `--spacing` `--margin` `--color` `--thickness` `--pages` `--format` `--out`
→ [English README](../README.md)

## Papier

Jede Zeile ist ein `<typ>`-Wert und verlinkt auf die Seite, die dieses Papier druckt.

| Typ | Papier | Im Web |
|---|---|---|
| `graph` | Millimeterpapier | [Millimeterpapier](https://freegraphpaper.net/de/millimeterpapier) |
| `dot` | Punktraster-Papier | [Punktraster-Papier](https://freegraphpaper.net/de/punktraster-papier) |
| `isometric` | Isometrisches Papier | [Isometrisches Papier](https://freegraphpaper.net/de/isometrisches-papier) |
| `hexagon` | Hexagonpapier | [Hexagonpapier](https://freegraphpaper.net/de/hexagonpapier) |
| `lined` | Liniertes Papier | [Liniertes Papier](https://freegraphpaper.net/de/liniertes-papier) |
| `cornell` | Cornell-Notizpapier | [Cornell-Notizpapier](https://freegraphpaper.net/de/cornell-notizen) |
| `music` | Notenpapier | [Notenpapier](https://freegraphpaper.net/de/notenpapier) |
| `coordinate` | Koordinatenpapier | [Koordinatenpapier](https://freegraphpaper.net/de/koordinatenpapier) |
| `polar` | Polarpapier | [Polarpapier](https://freegraphpaper.net/de/polarpapier) |
| `engineering` | Technisches Zeichenpapier | [Technisches Zeichenpapier](https://freegraphpaper.net/de/technisches-zeichenpapier) |
| `log` | Logarithmenpapier | [Logarithmenpapier](https://freegraphpaper.net/de/logarithmenpapier) |
| `triangle` | Dreieckspapier | [Dreieckspapier](https://freegraphpaper.net/de/dreieckspapier) |
| `brick` | Ziegelpapier | [Ziegelpapier](https://freegraphpaper.net/de/ziegelpapier) |
| `perspective` | Perspektivpapier | [Perspektivpapier](https://freegraphpaper.net/de/perspektivpapier) |
| `handwriting` | Schreiblernpapier | [Schreiblernpapier](https://freegraphpaper.net/de/schreiblernpapier) |
| `seyes` | Séyès-Papier | [Séyès-Papier](https://freegraphpaper.net/de/seyes-papier) |
| `crossstitch` | Kreuzstich-Papier | [Kreuzstich-Papier](https://freegraphpaper.net/de/kreuzstich-papier) |
| `knitting` | Strickpapier | [Strickpapier](https://freegraphpaper.net/de/strickpapier) |
| `guitartab` | Gitarren-Tabulaturpapier | [Gitarren-Tabulaturpapier](https://freegraphpaper.net/de/gitarren-tabulaturpapier) |
| `semilog` | Einfachlogarithmisches Papier | [Einfachlogarithmisches Papier](https://freegraphpaper.net/de/einfachlogarithmisches-papier) |
| `numberline` | Zahlenstrahl-Papier | [Zahlenstrahl-Papier](https://freegraphpaper.net/de/zahlenstrahl-papier) |
| `sudoku` | Sudoku-Papier | [Sudoku-Papier](https://freegraphpaper.net/de/sudoku-papier) |
| `goban` | Go-Brett-Papier | [Go-Brett-Papier](https://freegraphpaper.net/de/go-brett-papier) |
| `storyboard` | Storyboard-Papier | [Storyboard-Papier](https://freegraphpaper.net/de/storyboard-papier) |
| `calligraphy` | Kalligraphie-Papier | [Kalligraphie-Papier](https://freegraphpaper.net/de/kalligraphie-papier) |
| `ternary` | Dreiecksdiagramm-Papier | [Dreiecksdiagramm-Papier](https://freegraphpaper.net/de/dreiecksdiagramm-papier) |
| `clockface` | Zifferblatt-Papier | [Zifferblatt-Papier](https://freegraphpaper.net/de/zifferblatt-papier) |
| `perspective2` | Zweipunktperspektive-Papier | [Zweipunktperspektive-Papier](https://freegraphpaper.net/de/zweipunktperspektive-papier) |
| `battlemap` | Battlemap-Papier | [Battlemap-Papier](https://freegraphpaper.net/de/battlemap-papier) |
| `chessboard` | Schachbrett-Papier | [Schachbrett-Papier](https://freegraphpaper.net/de/schachbrett-papier) |
| `hexmap` | Hexfeld-Kartenpapier | [Hexfeld-Kartenpapier](https://freegraphpaper.net/de/hexfeld-kartenpapier) |
| `quilting` | Patchwork-Karopapier | [Patchwork-Karopapier](https://freegraphpaper.net/de/patchwork-karopapier) |
| `genkoyoshi` | Genkō-Yōshi-Papier | [Genkō-Yōshi-Papier](https://freegraphpaper.net/de/genko-yoshi-papier) |
| `tianzige` | Tian-Zi-Ge-Papier | [Tian-Zi-Ge-Papier](https://freegraphpaper.net/de/tian-zi-ge-papier) |
| `basstab` | Bass-Tabulaturpapier | [Bass-Tabulaturpapier](https://freegraphpaper.net/de/bass-tabulaturpapier) |
| `chorddiagram` | Gitarrengriff-Papier | [Gitarrengriff-Papier](https://freegraphpaper.net/de/gitarrengriff-papier) |
| `peyote` | Peyote-Perlenpapier | [Peyote-Perlenpapier](https://freegraphpaper.net/de/peyote-perlenpapier) |
| `crossword` | Kreuzworträtsel-Papier | [Kreuzworträtsel-Papier](https://freegraphpaper.net/de/kreuzwortraetsel-papier) |
| `comic` | Comic-Panel-Papier | [Comic-Panel-Papier](https://freegraphpaper.net/de/comic-papier) |

## Licence

Code: MIT. Daten in `data/`: CC BY 4.0, mit dem Hinweis „Papierspezifikationen von Free Graph Paper (https://freegraphpaper.net)".

---

[English](../README.md) · [Español](README.es.md) · [Français](README.fr.md) · [Português](README.pt.md)
