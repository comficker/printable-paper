# printable-paper

Les spécifications de 39 types de papier réglé, et un générateur sans dépendances qui les produit en SVG ou en PDF à l’échelle.

Les quadrillages sont décrits et tracés en millimètres : une feuille imprimée à 100 % mesure donc exactement ce qu’elle annonce — ce que la plupart des PDF de « papier millimétré gratuit » ratent discrètement. Le moteur géométrique est celui de [freegraphpaper.net](https://freegraphpaper.net/fr), où chaque papier se prévisualise et se télécharge depuis le navigateur.

```bash
npx printable-paper graph --size a4 --spacing 5mm --out grid.pdf
```

## Installation

```bash
npm install printable-paper
```

## Ligne de commande

```bash
printable-paper <type> [options]
printable-paper list types|sizes|spacings
```

`--size` `--orientation` `--spacing` `--margin` `--color` `--thickness` `--pages` `--format` `--out`
→ [English README](../README.md)

## Papier

Chaque ligne est une valeur de `<type>` et renvoie à la page qui l’imprime.

| Type | Papier | Sur le web |
|---|---|---|
| `graph` | Papier Millimétré | [Papier Millimétré](https://freegraphpaper.net/fr/papier-millimetre) |
| `dot` | Papier Pointillé | [Papier Pointillé](https://freegraphpaper.net/fr/papier-pointille) |
| `isometric` | Papier Isométrique | [Papier Isométrique](https://freegraphpaper.net/fr/papier-isometrique) |
| `hexagon` | Papier Hexagonal | [Papier Hexagonal](https://freegraphpaper.net/fr/papier-hexagonal) |
| `lined` | Papier Ligné | [Papier Ligné](https://freegraphpaper.net/fr/papier-ligne) |
| `cornell` | Papier de Prise de Notes Cornell | [Papier de Prise de Notes Cornell](https://freegraphpaper.net/fr/prise-de-notes-cornell) |
| `music` | Papier à Musique | [Papier à Musique](https://freegraphpaper.net/fr/papier-musique) |
| `coordinate` | Papier Repère Orthonormé | [Papier Repère Orthonormé](https://freegraphpaper.net/fr/papier-repere-orthonorme) |
| `polar` | Papier Polaire | [Papier Polaire](https://freegraphpaper.net/fr/papier-polaire) |
| `engineering` | Papier Technique | [Papier Technique](https://freegraphpaper.net/fr/papier-technique) |
| `log` | Papier Logarithmique | [Papier Logarithmique](https://freegraphpaper.net/fr/papier-logarithmique) |
| `triangle` | Papier Triangulaire | [Papier Triangulaire](https://freegraphpaper.net/fr/papier-triangulaire) |
| `brick` | Papier Brique | [Papier Brique](https://freegraphpaper.net/fr/papier-brique) |
| `perspective` | Papier Perspective | [Papier Perspective](https://freegraphpaper.net/fr/papier-perspective) |
| `handwriting` | Papier d’Apprentissage de l’Écriture | [Papier d’Apprentissage de l’Écriture](https://freegraphpaper.net/fr/papier-apprentissage-ecriture) |
| `seyes` | Papier Séyès | [Papier Séyès](https://freegraphpaper.net/fr/papier-seyes) |
| `crossstitch` | Papier Point de Croix | [Papier Point de Croix](https://freegraphpaper.net/fr/papier-point-de-croix) |
| `knitting` | Papier Quadrillé Tricot | [Papier Quadrillé Tricot](https://freegraphpaper.net/fr/papier-quadrille-tricot) |
| `guitartab` | Papier Tablature Guitare | [Papier Tablature Guitare](https://freegraphpaper.net/fr/papier-tablature-guitare) |
| `semilog` | Papier Semi-Logarithmique | [Papier Semi-Logarithmique](https://freegraphpaper.net/fr/papier-semi-logarithmique) |
| `numberline` | Papier Droite Numérique | [Papier Droite Numérique](https://freegraphpaper.net/fr/papier-droite-numerique) |
| `sudoku` | Papier Sudoku | [Papier Sudoku](https://freegraphpaper.net/fr/papier-sudoku) |
| `goban` | Papier Goban | [Papier Goban](https://freegraphpaper.net/fr/papier-goban) |
| `storyboard` | Papier Storyboard | [Papier Storyboard](https://freegraphpaper.net/fr/papier-storyboard) |
| `calligraphy` | Papier Calligraphie | [Papier Calligraphie](https://freegraphpaper.net/fr/papier-calligraphie) |
| `ternary` | Papier Diagramme Ternaire | [Papier Diagramme Ternaire](https://freegraphpaper.net/fr/papier-diagramme-ternaire) |
| `clockface` | Papier Cadrans d’Horloge | [Papier Cadrans d’Horloge](https://freegraphpaper.net/fr/papier-cadrans-horloge) |
| `perspective2` | Papier Perspective à Deux Points | [Papier Perspective à Deux Points](https://freegraphpaper.net/fr/papier-perspective-deux-points) |
| `battlemap` | Papier Carte de Bataille | [Papier Carte de Bataille](https://freegraphpaper.net/fr/papier-carte-de-bataille) |
| `chessboard` | Papier Échiquier | [Papier Échiquier](https://freegraphpaper.net/fr/papier-echiquier) |
| `hexmap` | Papier Carte Hexagonale | [Papier Carte Hexagonale](https://freegraphpaper.net/fr/papier-carte-hexagonale) |
| `quilting` | Papier Quadrillé Patchwork | [Papier Quadrillé Patchwork](https://freegraphpaper.net/fr/papier-quadrille-patchwork) |
| `genkoyoshi` | Papier Genkō Yōshi | [Papier Genkō Yōshi](https://freegraphpaper.net/fr/papier-genko-yoshi) |
| `tianzige` | Papier Tian Zi Ge | [Papier Tian Zi Ge](https://freegraphpaper.net/fr/papier-tian-zi-ge) |
| `basstab` | Papier Tablature Basse | [Papier Tablature Basse](https://freegraphpaper.net/fr/papier-tablature-basse) |
| `chorddiagram` | Papier Accords Guitare | [Papier Accords Guitare](https://freegraphpaper.net/fr/papier-accords-guitare) |
| `peyote` | Papier Perles Peyote | [Papier Perles Peyote](https://freegraphpaper.net/fr/papier-perles-peyote) |
| `crossword` | Papier Mots Croisés | [Papier Mots Croisés](https://freegraphpaper.net/fr/papier-mots-croises) |
| `comic` | Papier Bande Dessinée | [Papier Bande Dessinée](https://freegraphpaper.net/fr/papier-bande-dessinee) |

## Licence

Code : MIT. Données de `data/` : CC BY 4.0, en créditant « Spécifications de papier par Free Graph Paper (https://freegraphpaper.net) ».

---

[English](../README.md) · [Español](README.es.md) · [Deutsch](README.de.md) · [Português](README.pt.md)
