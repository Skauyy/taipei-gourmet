const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const bib = JSON.parse(fs.readFileSync(path.join(root, 'data/bib-gourmand.json'), 'utf8'));
const photos = JSON.parse(fs.readFileSync(path.join(root, 'data/restaurant-photos.json'), 'utf8'));
const snapshot = JSON.parse(fs.readFileSync(path.join(root, 'presentation/guide-data.json'), 'utf8'));
const document = {
  documentElement: { setAttribute() {}, scrollHeight: 900, scrollTop: 0 },
  querySelector: () => null, querySelectorAll: () => [], getElementById: () => null, addEventListener() {},
};
const context = {
  document,
  window: { BIB_GUIDE: bib, RESTAURANT_PHOTOS: photos, matchMedia: () => ({ matches: true, addEventListener() {} }), addEventListener() {}, innerHeight: 900 },
  localStorage: { getItem: () => null, setItem() {} },
  setInterval() {}, setTimeout() {}, clearTimeout() {},
};
// Expose internals only in an isolated VM, without adding production globals.
vm.runInNewContext(source.replace(/\}\)\(\);\s*$/, 'globalThis.guide = { SHOPS, legacyNames, parseOpen, openState, taipeiTime, shopImage, matches, state, cardHTML }; })();'), context);
const guide = context.guide;
const hours = schedule => ({ _o: guide.parseOpen(schedule) });
const cardElement = shop => ({ getAttribute: key => ({ 'data-i': shop._i, 'data-z': shop.z, 'data-k': shop.k })[key] });
const reset = () => Object.assign(guide.state, { zone: {}, kind: {}, award: 'all', city: 'all', query: '', now: false });

test('preserves 88 legacy names and adds 106 nonduplicated Bib entries', () => {
  assert.equal(guide.legacyNames.length, 88);
  assert.equal(guide.SHOPS.length, 194);
  assert.equal(new Set(guide.SHOPS.map(shop => shop.n)).size, 194);
  assert.ok(guide.SHOPS.every(shop => shop.o ? shop._o && shop._o.length : shop._o === null));
  const counts = {};
  guide.SHOPS.forEach(shop => counts[shop.z] = (counts[shop.z] || 0) + 1);
  assert.deepEqual(counts, { arrival: 13, yt: 41, ntu: 22, other: 118 });
});

test('annual evidence covers each claimed year without interpolating awards', () => {
  assert.equal(bib.restaurants.length, 112);
  assert.equal(bib.restaurants.filter(row => row.bib.current).length, 55);
  assert.equal(bib.restaurants.filter(row => !row.bib.current).length, 57);
  for (const row of bib.restaurants) {
    const citedYears = new Set(row.bib.sources.flatMap(source => source.years));
    assert.ok(row.bib.years.every(year => citedYears.has(year)), row.n);
    assert.equal(row.bib.current, row.bib.years.includes(bib.latestEdition), row.n);
    assert.ok(row.bib.sources.every(source => new URL(source.url).protocol === 'https:'));
  }
  for (const year of bib.coverage) {
    const count = bib.restaurants.filter(row => row.city === year.city && row.bib.years.includes(year.year)).length;
    assert.equal(count, year.verifiedCount, `${year.city} ${year.year}`);
  }
});

test('does not award airport franchises or the unrelated Gongguan Jin Ji Yuan', () => {
  for (const name of ['小王煮瓜 桃園機場 T2', '雙月食品社 桃園機場 T2', '春水堂 桃園機場 T2', '金雞園']) {
    assert.equal(guide.SHOPS.find(shop => shop.n === name).bib, undefined, name);
  }
  const original = guide.SHOPS.find(shop => shop.n === '鼎泰豐 信義本店');
  const newer = guide.SHOPS.find(shop => shop.bibId === 'taipei-din-tai-fung-xinyi-road');
  assert.equal(original.bib.current, false);
  assert.deepEqual(Array.from(original.bib.years), [2018, 2019, 2020, 2021, 2022]);
  assert.ok(newer.a.includes('277'));
  assert.equal(newer.bib.current, true);
  assert.ok(newer.bib.years.every(year => year >= 2023));
});

test('new entries do not invent prices, ratings or opening hours', () => {
  const added = guide.SHOPS.filter(shop => !guide.legacyNames.includes(shop.n));
  assert.equal(added.length, 106);
  assert.ok(added.every(shop => shop.p === null && shop.r === null && shop.o === ''));
  assert.ok(added.every(shop => guide.openState(shop, new Date()) === 'unknown'));
  assert.ok(added.every(shop => !guide.cardHTML(shop).includes('NaN')));
});

test('restaurant images require an exact venue, source and reuse licence', () => {
  const pictured = guide.SHOPS.filter(shop => guide.shopImage(shop));
  assert.equal(pictured.length, 3);
  for (const shop of pictured) {
    const photo = guide.shopImage(shop);
    assert.equal(photo.venue, shop.n);
    assert.ok(fs.existsSync(path.join(root, photo.src)));
    assert.ok(photo.sourceUrl && photo.licenseUrl && photo.author && photo.year);
    const html = guide.cardHTML(shop);
    assert.ok(html.includes(photo.sourceUrl) && html.includes(photo.licenseUrl));
  }
  const unverified = guide.SHOPS.find(shop => shop.n === '春水堂 桃園機場 T2');
  assert.equal(guide.shopImage(unverified), null);
  assert.ok(!guide.cardHTML(unverified).includes('<img'));
});

test('city, award, kind and search filters intersect', () => {
  reset();
  const shop = guide.SHOPS.find(shop => shop.n === '蔡家牛肉麵');
  const el = cardElement(shop);
  Object.assign(guide.state, { city: 'New Taipei', award: 'current', kind: { food: true }, query: '牛肉麵' });
  assert.equal(guide.matches(el, new Date()), true);
  guide.state.award = 'past';
  assert.equal(guide.matches(el, new Date()), false);
  guide.state.award = 'bib'; guide.state.city = 'Taipei';
  assert.equal(guide.matches(el, new Date()), false);
  guide.state.city = 'New Taipei'; guide.state.now = true;
  assert.equal(guide.matches(el, new Date()), false, 'Unknown schedule is not open-now');
  reset();
});

test('Taipei time is independent of the machine timezone and handles midnight', () => {
  const time = guide.taipeiTime(new Date('2025-01-06T16:05:00Z'));
  assert.equal(time.day, 2); assert.equal(time.hour, 0); assert.equal(time.minute, 5);
});

test('opening time is inclusive and closing time is exclusive', () => {
  const shop = hours('* 10:00-18:00');
  assert.equal(guide.openState(shop, new Date('2025-01-07T01:59:00Z')), 'closed');
  assert.equal(guide.openState(shop, new Date('2025-01-07T02:00:00Z')), 'open');
  assert.equal(guide.openState(shop, new Date('2025-01-07T10:00:00Z')), 'closed');
});

test('overnight hours carry the opening weekday through midnight', () => {
  const shop = hours('2-6 17:00-01:00');
  assert.equal(guide.openState(shop, new Date('2025-01-07T16:30:00Z')), 'open');
  assert.equal(guide.openState(shop, new Date('2025-01-07T17:00:00Z')), 'closed');
  assert.equal(guide.openState(shop, new Date('2025-01-05T16:30:00Z')), 'closed');
});

test('split shifts, rest days and unknown schedules remain distinct', () => {
  const shop = hours('0-3/5-6 11:00-15:00,0-3/5-6 17:00-21:00');
  assert.equal(guide.openState(shop, new Date('2025-01-07T08:00:00Z')), 'closed');
  assert.equal(guide.openState(shop, new Date('2025-01-07T09:00:00Z')), 'open');
  assert.equal(guide.openState(shop, new Date('2025-01-09T09:00:00Z')), 'closed');
  assert.equal(guide.openState(hours(''), new Date()), 'unknown');
});

test('PowerPoint base snapshot matches current legacy data', () => {
  const normalize = items => Array.from(items, ({ _i, _o, bib, bibId, michelinUrl, city, ...shop }) => shop);
  const legacy = guide.SHOPS.filter(shop => guide.legacyNames.includes(shop.n));
  assert.deepEqual(JSON.parse(JSON.stringify(normalize(legacy))), normalize(snapshot.shops));
});

test('local data bundles, images and renamed PowerPoint download resolve', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  for (const [, url] of html.matchAll(/(?:src|href)="([^"#][^"]*)"/g)) {
    if (/^(https?:|mailto:|data:)/.test(url)) continue;
    assert.ok(fs.existsSync(path.join(root, url)), `Missing local resource: ${url}`);
  }
  assert.ok(html.includes('<title>台灣美食'));
  assert.ok(!html.includes('圓通食堂'));
  assert.ok(html.includes('presentation/Taiwan-Gourmet.pptx'));
  for (const [file, key, expected] of [['bib-gourmand.js', 'BIB_GUIDE', bib], ['restaurant-photos.js', 'RESTAURANT_PHOTOS', photos]]) {
    const sandbox = { window: {} };
    vm.runInNewContext(fs.readFileSync(path.join(root, 'data', file), 'utf8'), sandbox);
    assert.deepEqual(JSON.parse(JSON.stringify(sandbox.window[key])), expected);
  }
});
