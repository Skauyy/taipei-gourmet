# Taiwan Gourmet / 台灣美食 presentation

Ten editable 16:9 slides for the Taipei and New Taipei edition. Text boxes, shapes, rules and photo crops remain native PowerPoint objects. The deck uses Liberation Serif, Noto Sans CJK TC and Inter; fonts are not embedded. Install them for the closest match to the inspected rendering.

## Build

From the repository root, with Python 3.10+:

```sh
python -m venv presentation/.venv
presentation/.venv/bin/pip install -r presentation/requirements.txt
presentation/.venv/bin/python presentation/build_deck.py --output /absolute/output/Taiwan-Gourmet.pptx
```

Inputs are the reviewed original 88-entry `guide-data.json` snapshot, `../data/bib-gourmand.json`, `../data/restaurant-photos.json` and the three allowlisted files under `../assets/restaurants/`. No network access is required. Exact-name and explicit-alias overlaps are merged before counting. Update selections, copy, notes and summaries together when changing the snapshot or award data.

## Validate and inspect

Rendering additionally needs LibreOffice Impress and the fonts above. The inspected build used LibreOffice 26.2.5.2.

```sh
presentation/.venv/bin/python presentation/validate_deck.py \
  /absolute/output/Taiwan-Gourmet.pptx \
  --report /absolute/output/Taiwan-Gourmet-validation.json \
  --preview /absolute/output/Taiwan-Gourmet-preview.png \
  --render-dir /absolute/scratch/taiwan-render
```

Omit `--preview` and `--render-dir` for structural validation only. The validator checks ZIP CRCs, XML, internal relationships, decoded images, ten slides and notes pages, 16:9 dimensions and off-slide shapes. It also verifies every embedded image's SHA-256 against the exact-venue photo allowlist and records Bib collection counts. Rendering produces an intermediate PDF, individual PNGs/text extracts and a contact sheet. Inspect every rendered slide: XML checks cannot establish absence of text clipping or guarantee every PowerPoint version's rendering.

## Slide structure

1. 台灣美食 / Taiwan Gourmet cover, with the dated Yongkang photograph.
2. Guide overview: 194 entries, 55 current Bib recipients, 57 former-only records and three verified photographs.
3. Four guide zones: arrival 13, Yuantong 41, NTU 22, other Taipei/New Taipei 118.
4. Suggested arrival sequence, without invented transit fares or timings or inherited airport-branch awards.
5. Four Yuantong selections, using a text-only editorial panel.
6. Four Gongguan/NTU selections; the photograph is explicitly attributed only to 藍家割包.
7. Current/former Bib methodology and three photographed historical recipients, with annual citations in notes.
8. Suggested food day: four original estimates total NT$380, excluding transport and extras.
9. Website award, city and other filters, sources and schedule caveats.
10. Practical caveats and source context.

## Evidence and limitations

- The collection has 112 distinct Bib venue/branch records: 94 Taipei and 18 New Taipei. The 2026 selection has 37 Taipei and 18 New Taipei recipients. After six overlaps with the original guide, the merged guide has 194 entries. These are guide entries, not a census of currently operating restaurants; markets and food courts can be single entries.
- Annual evidence comes from Michelin's lists and dated complete annual reporting. See [`data/research/taipei-bib-sources.md`](../data/research/taipei-bib-sources.md) and the source arrays in [`data/bib-gourmand.json`](../data/bib-gourmand.json). No missing award years are inferred; awards do not transfer automatically between brand branches. Historical inclusion does not establish current operation.
- Prices are original `p` per-person estimates, not verified live prices or dish quotes. NT$40–600 covers only original entries with price data; new unverified prices, ratings and schedules remain unknown. No live restaurant-status or Google-rating audit is claimed.
- The original four zone price ranges are NT$80–380, NT$40–320, NT$50–400 and NT$60–600 respectively. The final range excludes new unknown-price entries even though the zone count includes them.
- Original dorm recommendations partly came from the Dcard article 《#文長 給新生們-台北圓通雅筑宿舍攻略》 and comments. A verified article URL was not supplied, so none is invented. Editorial copy is not a claim of personal visits.
- All photographed slides use only the exact-venue, permission-checked images of 阜杭豆漿 (2024), 永康牛肉麵 (2006) and 藍家割包 (2007). No category or generic food photo stands in for a restaurant. Capture year, photographer, source, reuse terms and resize/crop notices are in editable notes. See the [photo attribution register](../assets/restaurants/README.md). The Yongkang adaptation remains CC BY-SA 4.0.
- Website open-now estimates use static schedules and Asia/Taipei time, not live restaurant reports. Search matches name, address and signature dishes. The map is an illustrative neighborhood diagram, not turn-by-turn navigation.

## Design

Ivory paper, vermilion, forest green and muted olive; editorial serif headings, readable Chinese, thin rules, generous spacing and restrained photo crops. All content except photographic pixels is editable. No flattened webpage screenshots or generic gradient panels.
