[README.md](https://github.com/user-attachments/files/28443930/README.md)
# Images

Ce dossier accueille les visuels réels du site (photos, logo, images Open Graph).
Tant qu'ils ne sont pas ajoutés, les pages utilisent des **illustrations SVG intégrées**
(pas d'images externes), donc le site fonctionne sans ces fichiers.

## Fichiers attendus

| Fichier              | Usage                                  | Dimensions conseillées |
|----------------------|----------------------------------------|------------------------|
| `logo.png`           | Logo (JSON-LD `Organization`)          | 512 × 512              |
| `og-accueil.jpg`     | Open Graph — accueil                   | 1200 × 630             |
| `og-raquettes.jpg`   | Open Graph — comparatif raquettes      | 1200 × 630             |
| `og-carte.jpg`       | Open Graph — où jouer                  | 1200 × 630             |
| `og-regles.jpg`      | Open Graph — article règles            | 1200 × 630             |
| `og-histoire.jpg`    | Open Graph — article histoire          | 1200 × 630             |
| `og-terrain.jpg`     | Open Graph — article dimensions        | 1200 × 630             |

## Conseils

- Préférez le format **WebP** ou **JPEG** optimisé pour les photos, **SVG** pour les schémas.
- Compressez les images (TinyPNG, Squoosh) avant de les committer.
- Ajoutez toujours un attribut `alt` descriptif dans le HTML.
- Les images Open Graph doivent faire **1200 × 630 px** pour un bel aperçu sur les réseaux.
