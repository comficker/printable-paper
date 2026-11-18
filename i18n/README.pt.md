# printable-paper

Especificações de 39 tipos de papel pautado e um gerador sem dependências que os entrega em SVG ou PDF em escala real.

As malhas são descritas e desenhadas em milímetros, então uma folha impressa a 100 % mede exatamente o que promete — justamente o que quase todo PDF de "papel milimetrado grátis" erra em silêncio. O motor geométrico é o mesmo do [freegraphpaper.net](https://freegraphpaper.net/pt), onde cada papel pode ser visto e baixado pelo navegador.

```bash
npx printable-paper graph --size a4 --spacing 5mm --out grid.pdf
```

## Instalação

```bash
npm install printable-paper
```

## Linha de comando

```bash
printable-paper <type> [options]
printable-paper list types|sizes|spacings
```

`--size` `--orientation` `--spacing` `--margin` `--color` `--thickness` `--pages` `--format` `--out`
→ [English README](../README.md)

## Papel

Cada linha é um valor de `<tipo>` e leva à página que o imprime.

| Tipo | Papel | Na web |
|---|---|---|
| `graph` | Papel Milimetrado | [Papel Milimetrado](https://freegraphpaper.net/pt/papel-milimetrado) |
| `dot` | Papel Pontilhado | [Papel Pontilhado](https://freegraphpaper.net/pt/papel-pontilhado) |
| `isometric` | Papel Isométrico | [Papel Isométrico](https://freegraphpaper.net/pt/papel-isometrico) |
| `hexagon` | Papel Hexagonal | [Papel Hexagonal](https://freegraphpaper.net/pt/papel-hexagonal) |
| `lined` | Papel Pautado | [Papel Pautado](https://freegraphpaper.net/pt/papel-pautado) |
| `cornell` | Papel de Anotações Cornell | [Papel de Anotações Cornell](https://freegraphpaper.net/pt/anotacoes-cornell) |
| `music` | Papel de Música | [Papel de Música](https://freegraphpaper.net/pt/papel-de-musica) |
| `coordinate` | Papel do Plano Cartesiano | [Papel do Plano Cartesiano](https://freegraphpaper.net/pt/papel-plano-cartesiano) |
| `polar` | Papel Polar | [Papel Polar](https://freegraphpaper.net/pt/papel-polar) |
| `engineering` | Papel de Engenharia | [Papel de Engenharia](https://freegraphpaper.net/pt/papel-de-engenharia) |
| `log` | Papel Logarítmico | [Papel Logarítmico](https://freegraphpaper.net/pt/papel-logaritmico) |
| `triangle` | Papel Triangular | [Papel Triangular](https://freegraphpaper.net/pt/papel-triangular) |
| `brick` | Papel de Tijolos | [Papel de Tijolos](https://freegraphpaper.net/pt/papel-de-tijolos) |
| `perspective` | Papel de Perspectiva | [Papel de Perspectiva](https://freegraphpaper.net/pt/papel-de-perspectiva) |
| `handwriting` | Papel de Caligrafia Infantil | [Papel de Caligrafia Infantil](https://freegraphpaper.net/pt/papel-de-caligrafia-infantil) |
| `seyes` | Papel Séyès | [Papel Séyès](https://freegraphpaper.net/pt/papel-seyes) |
| `crossstitch` | Papel de Ponto Cruz | [Papel de Ponto Cruz](https://freegraphpaper.net/pt/papel-ponto-cruz) |
| `knitting` | Papel Quadriculado para Tricô | [Papel Quadriculado para Tricô](https://freegraphpaper.net/pt/papel-quadriculado-para-trico) |
| `guitartab` | Papel de Tablatura de Violão | [Papel de Tablatura de Violão](https://freegraphpaper.net/pt/papel-tablatura-violao) |
| `semilog` | Papel Monolog | [Papel Monolog](https://freegraphpaper.net/pt/papel-monolog) |
| `numberline` | Papel de Reta Numérica | [Papel de Reta Numérica](https://freegraphpaper.net/pt/papel-reta-numerica) |
| `sudoku` | Papel de Sudoku | [Papel de Sudoku](https://freegraphpaper.net/pt/papel-sudoku) |
| `goban` | Papel de Tabuleiro de Go | [Papel de Tabuleiro de Go](https://freegraphpaper.net/pt/papel-tabuleiro-de-go) |
| `storyboard` | Papel de Storyboard | [Papel de Storyboard](https://freegraphpaper.net/pt/papel-storyboard) |
| `calligraphy` | Papel de Caligrafia | [Papel de Caligrafia](https://freegraphpaper.net/pt/papel-caligrafia) |
| `ternary` | Papel de Diagrama Ternário | [Papel de Diagrama Ternário](https://freegraphpaper.net/pt/papel-diagrama-ternario) |
| `clockface` | Papel de Relógios | [Papel de Relógios](https://freegraphpaper.net/pt/papel-relogios) |
| `perspective2` | Papel de Perspectiva de Dois Pontos | [Papel de Perspectiva de Dois Pontos](https://freegraphpaper.net/pt/papel-perspectiva-dois-pontos) |
| `battlemap` | Papel de Mapa de Batalha | [Papel de Mapa de Batalha](https://freegraphpaper.net/pt/papel-mapa-de-batalha) |
| `chessboard` | Papel de Tabuleiro de Xadrez | [Papel de Tabuleiro de Xadrez](https://freegraphpaper.net/pt/papel-tabuleiro-de-xadrez) |
| `hexmap` | Papel de Mapa Hexagonal | [Papel de Mapa Hexagonal](https://freegraphpaper.net/pt/papel-mapa-hexagonal) |
| `quilting` | Papel Quadriculado para Patchwork | [Papel Quadriculado para Patchwork](https://freegraphpaper.net/pt/papel-quadriculado-para-patchwork) |
| `genkoyoshi` | Papel Genkō Yōshi | [Papel Genkō Yōshi](https://freegraphpaper.net/pt/papel-genko-yoshi) |
| `tianzige` | Papel Tian Zi Ge | [Papel Tian Zi Ge](https://freegraphpaper.net/pt/papel-tian-zi-ge) |
| `basstab` | Papel de Tablatura de Baixo | [Papel de Tablatura de Baixo](https://freegraphpaper.net/pt/papel-tablatura-baixo) |
| `chorddiagram` | Papel de Acordes de Violão | [Papel de Acordes de Violão](https://freegraphpaper.net/pt/papel-acordes-violao) |
| `peyote` | Papel de Miçangas Peyote | [Papel de Miçangas Peyote](https://freegraphpaper.net/pt/papel-micangas-peyote) |
| `crossword` | Papel de Palavras Cruzadas | [Papel de Palavras Cruzadas](https://freegraphpaper.net/pt/papel-palavras-cruzadas) |
| `comic` | Papel de Quadrinhos | [Papel de Quadrinhos](https://freegraphpaper.net/pt/papel-quadrinhos) |

## Licence

Código: MIT. Dados em `data/`: CC BY 4.0, creditando "Especificações de papel por Free Graph Paper (https://freegraphpaper.net)".

---

[English](../README.md) · [Español](README.es.md) · [Deutsch](README.de.md) · [Français](README.fr.md)
