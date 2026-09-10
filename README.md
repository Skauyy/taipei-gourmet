# 台灣美食 · Taiwan Gourmet

A bilingual Taipei/New Taipei food guide, including Yuantong/NTU daily eats and current and former Bib Gourmand recipients. Plain HTML, CSS and JavaScript; no runtime build step or production dependencies.

## Website

Published with GitHub Pages from the root of `main`:

https://skauyy.github.io/taipei-gourmet/

The display name is 台灣美食. The repository and existing URL are intentionally unchanged.

For a local preview:

```sh
python -m http.server 4173
```

Open `http://localhost:4173`.

- **194 entries**: 88 original guide entries plus 106 additional, nonduplicated Bib Gourmand records.
- **112 Bib Gourmand venue records** across Taipei/New Taipei: 55 in the 2026 selection and 57 former-only within this geographic scope.
- Independently combine award status, city, neighborhood, food/drink/dessert and name/address/signature search.
- Nine-at-a-time browsing, price/recommendation sorting, accessible address links and neighborhood map. Unknown prices/ratings sort last in either direction.
- Open-now is an **Asia/Taipei schedule estimate**, not live availability. New entries without verified schedules stay unknown and are excluded from open-now results.
- Paper-and-ink visual design, deliberate motion, persistent light/dark and motion settings, and live system reduced-motion support.

## Award evidence and branch matching

`data/research/taipei-bib.json` and `new-taipei-bib.json` contain reviewed records. `data/bib-gourmand.json` is the combined public dataset; the adjacent `.js` file loads it without network APIs, including when opened locally.

Coverage: Taipei editions 2018–2026; New Taipei 2025–2026, starting with its inaugural selection. Each listed award year has a citation. The [research notes](data/research/taipei-bib-sources.md) distinguish official annual lists from dated complete reporting and document address/branch decisions.

Important constraints:

- Award years are not interpolated between first and latest appearances.
- A chain's award does not apply to every branch. The airport 小王煮瓜 and 雙月 entries are not marked Bib Gourmand.
- 公館金雞園 is not the awarded 永康街好公道金雞園.
- 鼎泰豐194號信義本店 (2018–2022) and 277號新生店 (2023–2026) are separate records. The old flagship is now takeaway-only.
- Historical inclusion does not establish present operation. Taipei records that moved outside the scope are not marked current in Taipei/New Taipei.
- Existing guide prices and subjective scores are labelled as estimates, not Michelin scores. Missing data on newly researched entries is left unknown, not fabricated.

To regenerate reviewed data bundles:

```sh
python scripts/build-data.py --verified-on 2026-09-10
```

This command validates records but does **not** recheck web sources. Change the verification date only after actually checking the sources. Update research, branch mappings, tests and the deck together when adding an edition.

## Restaurant photos

There is no keyword/category image fallback. `data/restaurant-photos.json` explicitly maps three verified, reusable photographs to **阜杭豆漿、永康牛肉麵、藍家割包**. Each carries its source, author, licence, capture year and modification notice. Photo credits are visible on the cards; historical photos are labelled with their dates.

Every other restaurant is text-only until a photograph's exact venue/branch and reuse rights are verified. Existing neighborhood/atmosphere illustrations are clearly separated from restaurant records. See [image licences](assets/restaurants/README.md). The PowerPoint uses only the verified photo allowlist.

## PowerPoint

[Download the editable 10-slide deck](presentation/Taiwan-Gourmet.pptx).

See [presentation instructions](presentation/README.md) for rebuilding, validation and fonts. Commit the generated deck when changing the published download.

## Tests

Node.js 18+, no package installation:

```sh
node --check app.js
node --test tests/*.test.cjs
TZ=America/Los_Angeles node --test tests/*.test.cjs
```

Tests cover annual counts/citations, branch exclusions, deduplication, photo allowlisting, unknown data, combined filters, schedule edge cases, the presentation snapshot and local links. Browser regression checks should additionally cover pagination, sorting unknown values, source disclosure, theme/motion persistence, menu keyboard behavior and widths 320/390/768/1024/1440px.

Fonts use Google Fonts with local serif/CJK fallbacks. Editorial content, arrival notes, source-data links and the PowerPoint remain available without JavaScript; interactive listings require it.
