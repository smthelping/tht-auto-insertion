# tht-auto-insertion

Southern Machinery **THT auto insertion** product site — an Astro rebuild of the 30 single-file
landing pages that lived in `smthelping/smt-product-landing-html/tht-auto-insertion/`.

- **Live site:** https://smthelping.github.io/tht-auto-insertion/
- **Framework:** [Astro](https://astro.build) 7 (static output)
- **Starting point:** [AstroWind](https://github.com/arthelokyo/astrowind) (MIT)
- **Source repo (unchanged):** https://github.com/smthelping/smt-product-landing-html

The original repository is **not modified** by this project. This is a separate repository built
from a copy of its `tht-auto-insertion/` content.

---

## What was migrated

All **30 machine and line pages** were carried across, one for one:

| Group                | Pages | Examples                              |
| -------------------- | ----- | ------------------------------------- |
| Odd-form insertion   | 9     | S7900, S7000, odd-form solutions      |
| Radial insertion     | 9     | S3000, S3010A, radial series          |
| Axial insertion      | 5     | S4000, 60-station S4000 cell variants |
| Terminal insertion   | 2     | S7020T                                |
| Turnkey THT lines    | 4     | line design, whole-line solution      |
| PCB design guideline | 1     | auto-insertion DFM guideline          |

Content completeness is verified, not assumed:

| Element                  | Migrated                                |
| ------------------------ | --------------------------------------- |
| Specification tables     | 30 pages / 60 tables — all rendered     |
| FAQ items (`<details>`)  | 146 items — all rendered                |
| YouTube videos           | **136 / 136 ids (100 %)**               |
| Catalogue & manual links | all unique URLs present                 |
| Machine photographs      | rendered as a lightbox gallery per page |

Average page weight drops from **879 KB** (single-file original) to about **61 KB**, because the
shared layout, CSS and the seven-language dictionaries are no longer duplicated into every file.

## How the content is modelled

The source pages came from four different markup families, so instead of writing four templates
they were normalised once into a block model:

```
src/data/machines/<slug>.json   front matter + normalised blocks (nodes, tables, FAQs,
                                videos, gallery images, documents)
src/data/i18n/<slug>.json       the seven-language dictionary, kept verbatim, for the
                                pages that shipped one
```

Each text node keeps the `data-i18n` key it had in the original, which is what lets one block
list render in every language. `src/utils/machines.ts` holds the model types, the loader and the
translation helpers.

`src/components/machine/` renders that model: `MachinePage` (layout + SEO), `BlockRenderer`
(section router), `ProseNodes`, `VideoGrid`, `GalleryGrid`, `DownloadList`, `PaybackCalculator`,
`LanguagePicker`, `MachineHero`.

## Languages

Seven locales are supported: **en, es, pt, fr, ar, ru, zh**.

Where the original switched language client-side with `?lang=`, every locale is now a **real,
prerendered URL** (`/es/tht-auto-insertion/…`), so translations are crawlable and each gets its
own `hreflang` entry plus an `xhtml:link` alternate in the sitemap. Pages whose dictionary was not
shipped stay English-only rather than showing a half-translated page. Arabic renders RTL.

## Commands

| Command           | Action                                |
| ----------------- | ------------------------------------- |
| `npm install`     | Install dependencies (Node ≥ 22.22.3) |
| `npm run dev`     | Dev server on `localhost:4321`        |
| `npm run build`   | Build the static site to `./dist/`    |
| `npm run preview` | Preview the production build locally  |
| `npm run check`   | Astro, ESLint and Prettier checks     |

## Deployment

`.github/workflows/deploy.yml` builds with `withastro/action` and publishes with
`actions/deploy-pages` on every push to `main`. The site URL and sub-path live in
`src/config.yaml` (`site.site` / `site.base`); the astrowind integration injects them into the
Astro config, so there is no second place to update.

## Content discipline

Carried over from the source pages and worth keeping:

- Every technical figure must be traceable to a published document (machine manual or
  specification sheet). Anything unconfirmed is marked as such.
- Customer-identifying material must never be published.
- The payback estimator takes **all** of its inputs from the visitor; no machine price or labour
  rate is hard-coded.

## Credits

Built on [AstroWind](https://github.com/arthelokyo/astrowind) by Arthelokyo (MIT). See
`LICENSE.md`.
