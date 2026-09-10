# Taipei Gourmet / 圓通食堂 presentation

Ten editable 16:9 slides with native PowerPoint text boxes, shapes, rules and photo crops. English display typography uses Liberation Serif; Traditional Chinese uses Noto Sans CJK TC; small Latin labels use Inter. Fonts are not embedded. Install these fonts for the closest match to the inspected rendering.

## Build

Run from the repository root with Python 3.10+:

```sh
python -m venv presentation/.venv
presentation/.venv/bin/pip install -r presentation/requirements.txt
presentation/.venv/bin/python presentation/build_deck.py --output /absolute/output/Taipei-Gourmet.pptx
```

The script reads `presentation/guide-data.json`, the reviewed snapshot of the original `app.js` `SHOPS`, `ZONES` and `KINDS` arrays, and embeds photographs from `../assets/`. It does not change the website or require network access. Keep the snapshot to reproduce this editorial edition. Do not replace it silently when website data changes: update selections, copy, notes and numeric summaries together, then repeat validation.

## Validate and render

For the optional rendering step install LibreOffice Impress, Liberation fonts, Noto CJK fonts and Inter. On Debian/Ubuntu, `libreoffice-impress fonts-liberation fonts-noto-cjk` supply the first three; Inter can be installed separately. The inspected build used LibreOffice 26.2.5.2.

```sh
presentation/.venv/bin/python presentation/validate_deck.py \
  /absolute/output/Taipei-Gourmet.pptx \
  --report /absolute/output/Taipei-Gourmet-validation.json \
  --preview /absolute/output/Taipei-Gourmet-preview.png \
  --render-dir /absolute/scratch/taipei-render
```

Omit `--preview` and `--render-dir` for ZIP/XML validation only. The validator checks ZIP CRCs, parses every XML part, resolves every internal OOXML relationship, decodes all embedded images, confirms ten slides and ten notes pages, checks 16:9 dimensions and off-slide shapes, and counts native text runs. Rendering writes a temporary PDF plus individual PNGs/text extracts in the specified scratch directory and a two-column contact sheet at the requested preview path. Review every slide after changing layout. XML checks alone cannot establish absence of text clipping or guarantee rendering in every PowerPoint version.

## Slide structure

1. Cover: Taipei Gourmet / 圓通食堂
2. Guide overview: 88 entries; 63 food, 15 drink, 10 dessert; NT$40–600 estimated per-person range
3. Four guide zones: arrival 13, Yuantong 41, NTU 22, other Taipei 12
4. Suggested arrival sequence, without unverified transit fares or timings
5. Yuantong neighborhood: four editorial selections
6. Gongguan / NTU: four editorial selections
7. Taipei classics: three editorial selections
8. Suggested food day: explicit editorial proposal; four estimates total NT$380, excluding transport and extras
9. Website use: filters, sorting, finding a name, address links, estimated open-now state, neighborhood map
10. Practical caveats and source context

## Verified snapshot statistics

| Guide zone | Entries | Per-person estimate range |
| --- | ---: | ---: |
| 到埗美食 | 13 | NT$80–380 |
| 圓通宿舍美食 | 41 | NT$40–320 |
| 台大美食 | 22 | NT$50–400 |
| 其他 | 12 | NT$60–600 |

The counts were independently checked by evaluating the array declarations with Node and by counting the JSON snapshot in Python. These are guide entries, not a census of currently operating independent restaurants. A market or food court can be one entry. Classifications follow the original guide, even when a drinks venue also serves meals.

## Editorial and source constraints

- Prices are `p` per-person guide estimates, not verified current menu prices or quotes for the listed dishes. No live restaurant-status, review or Google rating lookup was performed.
- Source notes are editable on every slide. Relevant footers repeat the estimate/non-live-data warning. The itinerary is a suggestion, not a tested transport or opening-hours plan.
- Original `index.html` attributed some dorm-area recommendations to the Dcard article 《#文長 給新生們-台北圓通雅筑宿舍攻略》 and its comments. The original project did not provide a verified article URL, so none is invented.
- Website functionality: multi-select zone/kind filters, per-person/recommendation sorting, static-schedule open-now estimates in Asia/Taipei, clickable map addresses and an interactive neighborhood diagram. Search matches name `n`, address `a` and signature dishes `s`. No favorites feature is claimed.
- All repository JPGs were visually reviewed as a contact sheet before choosing photographs. Filename-to-place mappings are not trusted. Used assets show a night-market scene (`nm-shilin`), braised pork rice (`cat-luroufan`), bubble tea (`cat-bubble-tea`), a food stall (`nightmarket-wide`), a filled bun (`r-guabao`), taro balls (`s-taro`), a dining hall (`cat-soy-milk`), beef soup noodles (`r-muji`) and soup dumplings (`r-dintaifung`). Every photographed slide labels its images as illustrative, not evidence of the named venue. The original photos remain editable/croppable images, not flattened slides.
- Original image authorship and licensing were not supplied or verified. Check rights before public distribution. No invented deployment URLs, map coordinates, ratings or exact transit claims are included.

## Design

Warm ivory `#F5F1E8`, vermilion `#DE4932`, deep forest `#183E35` and muted olive `#777D59`; editorial serif headings, readable Chinese, spacious grid, thin rules and large photo crops. All slide content is editable except the photographic pixels. No screenshots, gradients or browser automation were used.
