# Taipei Gourmet · 圓通食堂

A bilingual food field guide for the Yuantong dorm and NTU neighborhoods. The website is plain HTML, CSS and JavaScript; no build step or production dependencies.

## Preview locally

```sh
python -m http.server 4173
```

Open `http://localhost:4173`.

## Website

- Paper-and-ink editorial layout with food-photo collages and four neighborhood shortcuts.
- All 88 original guide entries, with intersecting multi-select area/category filters, text search, price/recommendation sorting and nine-at-a-time browsing.
- Search covers restaurant names, addresses and signature dishes.
- Open-now badges estimate availability from the stored schedule in **Asia/Taipei**, regardless of the visitor's timezone. They are not live store-status reports.
- Keyboard-accessible address links and map selections. A map selection clears incompatible filters and reveals/focuses the requested entry.
- Light/dark themes, a persistent animation-pause control, and live support for the system's reduced-motion preference. The page never waits behind a loading overlay.

`app.js` owns the restaurant data. The hero statistics and area counts derive from that data. Fonts use Google Fonts with local serif/CJK fallbacks; photos and other website assets are local. Without JavaScript, editorial content, arrival notes and the PowerPoint download remain available, but interactive listings require JavaScript.

## PowerPoint

[Download the editable 10-slide deck](presentation/Taipei-Gourmet.pptx).

The deck is also linked from the website. It uses native editable text, shapes and photographs, rather than screenshots. See [presentation instructions](presentation/README.md) to regenerate it or validate/render slides. Commit an updated `presentation/Taipei-Gourmet.pptx` whenever rebuilding the published download.

## Checks

Node.js 18+; no package installation needed:

```sh
node --check app.js
node --test tests/*.test.cjs
TZ=America/Los_Angeles node --test tests/*.test.cjs
```

The tests cover retained guide data, Taipei clock semantics, overnight hours, split shifts, search/filter intersections, image paths, the presentation snapshot and local download links.

For browser regression checks:

1. Check the initial nine cards, load more, search, no-result state and reset.
2. Combine areas/categories and reverse both price and recommendation sorting.
3. With search and open-now filters active, jump to a restaurant from the map. It must become visible and receive focus.
4. Check the menu at narrow widths: navigation, Escape, focus leaving the menu and desktop resize must close it.
5. Reload both theme and animation settings. Changing system reduced motion while the page is open must stop decorative motion.
6. Check widths 320, 390, 768, 1024 and 1440 px. Only the small-screen map should scroll sideways, not the page.
7. Run accessibility checks in light and dark themes and verify visible keyboard focus.

## Data and images

Existing restaurant descriptions, prices, schedules and recommendation scores are retained, not freshly researched. Scores are guide opinions, not live Google ratings. Check current shop details before traveling. The original guide credits some dorm recommendations to the Dcard article named in the website footer.

Existing photographs are reused as **illustrations**, not authenticated images of every listed restaurant. Original photo authorship/licensing was not supplied; verify usage rights before redistribution. The map is a neighborhood diagram, not turn-by-turn navigation.
