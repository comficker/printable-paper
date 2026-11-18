# printable-paper

Especificaciones de 39 tipos de papel pautado y un generador sin dependencias que los convierte en SVG o PDF a escala real.

Las cuadrículas se definen y se dibujan en milímetros, así que una hoja impresa al 100 % mide exactamente lo que dice medir: justo lo que fallan casi todos los PDF de "papel milimetrado gratis". El motor geométrico es el mismo que usa [freegraphpaper.net](https://freegraphpaper.net/es), donde cada papel se puede ver y descargar desde el navegador.

```bash
npx printable-paper graph --size a4 --spacing 5mm --out grid.pdf
```

## Instalación

```bash
npm install printable-paper
```

## Línea de comandos

```bash
printable-paper <type> [options]
printable-paper list types|sizes|spacings
```

`--size` `--orientation` `--spacing` `--margin` `--color` `--thickness` `--pages` `--format` `--out`
→ [English README](../README.md)

## Papel

Cada fila es un valor de `<tipo>` y enlaza a la página que lo imprime.

| Tipo | Papel | En la web |
|---|---|---|
| `graph` | Papel Milimetrado | [Papel Milimetrado](https://freegraphpaper.net/es/papel-milimetrado) |
| `dot` | Papel Punteado | [Papel Punteado](https://freegraphpaper.net/es/papel-punteado) |
| `isometric` | Papel Isométrico | [Papel Isométrico](https://freegraphpaper.net/es/papel-isometrico) |
| `hexagon` | Papel Hexagonal | [Papel Hexagonal](https://freegraphpaper.net/es/papel-hexagonal) |
| `lined` | Papel Rayado | [Papel Rayado](https://freegraphpaper.net/es/papel-rayado) |
| `cornell` | Papel de Apuntes Cornell | [Papel de Apuntes Cornell](https://freegraphpaper.net/es/apuntes-cornell) |
| `music` | Papel Pautado | [Papel Pautado](https://freegraphpaper.net/es/papel-pautado) |
| `coordinate` | Papel con Ejes Coordenados | [Papel con Ejes Coordenados](https://freegraphpaper.net/es/papel-con-ejes) |
| `polar` | Papel Polar | [Papel Polar](https://freegraphpaper.net/es/papel-polar) |
| `engineering` | Papel de Ingeniería | [Papel de Ingeniería](https://freegraphpaper.net/es/papel-de-ingenieria) |
| `log` | Papel Logarítmico | [Papel Logarítmico](https://freegraphpaper.net/es/papel-logaritmico) |
| `triangle` | Papel Triangular | [Papel Triangular](https://freegraphpaper.net/es/papel-triangular) |
| `brick` | Papel de Ladrillos | [Papel de Ladrillos](https://freegraphpaper.net/es/papel-de-ladrillos) |
| `perspective` | Papel de Perspectiva | [Papel de Perspectiva](https://freegraphpaper.net/es/papel-de-perspectiva) |
| `handwriting` | Papel de Escritura | [Papel de Escritura](https://freegraphpaper.net/es/papel-de-escritura) |
| `seyes` | Papel Séyès | [Papel Séyès](https://freegraphpaper.net/es/papel-seyes) |
| `crossstitch` | Papel de Punto de Cruz | [Papel de Punto de Cruz](https://freegraphpaper.net/es/papel-punto-de-cruz) |
| `knitting` | Papel Cuadriculado para Punto | [Papel Cuadriculado para Punto](https://freegraphpaper.net/es/papel-cuadriculado-para-punto) |
| `guitartab` | Papel de Tablatura de Guitarra | [Papel de Tablatura de Guitarra](https://freegraphpaper.net/es/papel-tablatura-guitarra) |
| `semilog` | Papel Semilogarítmico | [Papel Semilogarítmico](https://freegraphpaper.net/es/papel-semilogaritmico) |
| `numberline` | Papel de Recta Numérica | [Papel de Recta Numérica](https://freegraphpaper.net/es/papel-recta-numerica) |
| `sudoku` | Papel de Sudoku | [Papel de Sudoku](https://freegraphpaper.net/es/papel-sudoku) |
| `goban` | Papel de Tablero de Go | [Papel de Tablero de Go](https://freegraphpaper.net/es/papel-tablero-de-go) |
| `storyboard` | Papel de Storyboard | [Papel de Storyboard](https://freegraphpaper.net/es/papel-storyboard) |
| `calligraphy` | Papel de Caligrafía | [Papel de Caligrafía](https://freegraphpaper.net/es/papel-caligrafia) |
| `ternary` | Papel Ternario | [Papel Ternario](https://freegraphpaper.net/es/papel-ternario) |
| `clockface` | Papel de Relojes | [Papel de Relojes](https://freegraphpaper.net/es/papel-relojes) |
| `perspective2` | Papel de Perspectiva a Dos Puntos | [Papel de Perspectiva a Dos Puntos](https://freegraphpaper.net/es/papel-perspectiva-dos-puntos) |
| `battlemap` | Papel de Mapa de Batalla | [Papel de Mapa de Batalla](https://freegraphpaper.net/es/papel-mapa-de-batalla) |
| `chessboard` | Papel de Tablero de Ajedrez | [Papel de Tablero de Ajedrez](https://freegraphpaper.net/es/papel-tablero-de-ajedrez) |
| `hexmap` | Papel de Mapa Hexagonal | [Papel de Mapa Hexagonal](https://freegraphpaper.net/es/papel-mapa-hexagonal) |
| `quilting` | Papel Cuadriculado para Patchwork | [Papel Cuadriculado para Patchwork](https://freegraphpaper.net/es/papel-patchwork) |
| `genkoyoshi` | Papel Genkō Yōshi | [Papel Genkō Yōshi](https://freegraphpaper.net/es/papel-genko-yoshi) |
| `tianzige` | Papel Tian Zi Ge | [Papel Tian Zi Ge](https://freegraphpaper.net/es/papel-tian-zi-ge) |
| `basstab` | Papel de Tablatura de Bajo | [Papel de Tablatura de Bajo](https://freegraphpaper.net/es/papel-tablatura-bajo) |
| `chorddiagram` | Papel de Acordes de Guitarra | [Papel de Acordes de Guitarra](https://freegraphpaper.net/es/papel-acordes-guitarra) |
| `peyote` | Papel de Abalorios Peyote | [Papel de Abalorios Peyote](https://freegraphpaper.net/es/papel-abalorios-peyote) |
| `crossword` | Papel de Crucigramas | [Papel de Crucigramas](https://freegraphpaper.net/es/papel-crucigramas) |
| `comic` | Papel de Cómic | [Papel de Cómic](https://freegraphpaper.net/es/papel-comic) |

## Licence

Código: MIT. Datos de `data/`: CC BY 4.0, citando «Especificaciones de papel por Free Graph Paper (https://freegraphpaper.net)».

---

[English](../README.md) · [Deutsch](README.de.md) · [Français](README.fr.md) · [Português](README.pt.md)
