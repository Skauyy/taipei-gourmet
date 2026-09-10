const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const documentElement = { setAttribute() {}, scrollHeight: 900, scrollTop: 0 };
const document = {
  documentElement,
  querySelector: () => null,
  querySelectorAll: () => [],
  getElementById: () => null,
  addEventListener() {},
};
const context = {
  document,
  window: { matchMedia: () => ({ matches: true, addEventListener() {} }), addEventListener() {}, innerHeight: 900 },
  localStorage: { getItem: () => null, setItem() {} },
  setInterval() {}, setTimeout() {}, clearTimeout() {},
};
// Expose pure internals only in this isolated VM, without adding production globals.
vm.runInNewContext(source.replace(/\}\)\(\);\s*$/, 'globalThis.guide = { SHOPS, ZONES, KINDS, parseOpen, openState, taipeiTime, shopImage, matches, state }; })();'), context);
const guide = context.guide;
const at = iso => new Date(iso);
const hours = schedule => ({ _o: guide.parseOpen(schedule) });

test('all 88 guide entries and their schedules survive the redesign', () => {
  assert.equal(guide.SHOPS.length, 88);
  assert.ok(guide.SHOPS.every(shop => shop.o ? shop._o && shop._o.length : shop._o === null));
  const counts = {};
  guide.SHOPS.forEach(shop => counts[shop.z] = (counts[shop.z] || 0) + 1);
  assert.deepEqual(counts, { arrival: 13, yt: 41, ntu: 22, other: 12 });
});

test('Taipei time is independent of the machine timezone and handles midnight', () => {
  const time = guide.taipeiTime(at('2025-01-06T16:05:00Z'));
  assert.equal(time.day, 2);
  assert.equal(time.hour, 0);
  assert.equal(time.minute, 5);
});

test('opening time is inclusive and closing time is exclusive', () => {
  const shop = hours('* 10:00-18:00');
  assert.equal(guide.openState(shop, at('2025-01-07T01:59:00Z')), 'closed');
  assert.equal(guide.openState(shop, at('2025-01-07T02:00:00Z')), 'open');
  assert.equal(guide.openState(shop, at('2025-01-07T09:59:00Z')), 'open');
  assert.equal(guide.openState(shop, at('2025-01-07T10:00:00Z')), 'closed');
});

test('overnight hours carry the opening weekday through midnight', () => {
  const shop = hours('2-6 17:00-01:00');
  assert.equal(guide.openState(shop, at('2025-01-07T16:30:00Z')), 'open');
  assert.equal(guide.openState(shop, at('2025-01-07T17:00:00Z')), 'closed');
  assert.equal(guide.openState(shop, at('2025-01-05T16:30:00Z')), 'closed');
});

test('split shifts, rest days and unknown schedules remain distinct', () => {
  const shop = hours('0-3/5-6 11:00-15:00,0-3/5-6 17:00-21:00');
  assert.equal(guide.openState(shop, at('2025-01-07T08:00:00Z')), 'closed');
  assert.equal(guide.openState(shop, at('2025-01-07T09:00:00Z')), 'open');
  assert.equal(guide.openState(shop, at('2025-01-09T09:00:00Z')), 'closed');
  assert.equal(guide.openState(hours(''), at('2025-01-07T09:00:00Z')), 'unknown');
});

test('every chosen card photograph exists locally', () => {
  guide.SHOPS.forEach(shop => {
    const image = path.join(root, 'assets', guide.shopImage(shop) + '.jpg');
    assert.ok(fs.existsSync(image), image);
  });
});

test('query and category filters intersect and match signature dishes', () => {
  const shop = guide.SHOPS.find(shop => shop.n === '藍家割包');
  const element = { getAttribute: key => ({ 'data-i': shop._i, 'data-z': shop.z, 'data-k': shop.k })[key] };
  guide.state.query = '瘦肉割包';
  guide.state.zone = { ntu: true };
  guide.state.kind = { food: true };
  assert.equal(guide.matches(element, new Date()), true);
  guide.state.zone = { yt: true };
  assert.equal(guide.matches(element, new Date()), false);
  guide.state.zone = {};
  guide.state.query = 'not-a-real-dish';
  assert.equal(guide.matches(element, new Date()), false);
});

test('PowerPoint snapshot matches the preserved restaurant data', () => {
  const snapshot = JSON.parse(fs.readFileSync(path.join(root, 'presentation', 'guide-data.json'), 'utf8'));
  const shops = snapshot.SHOPS || snapshot.shops;
  assert.ok(shops, 'Presentation snapshot contains shops');
  const normalize = items => Array.from(items, ({ _i, _o, ...shop }) => shop);
  assert.deepEqual(JSON.parse(JSON.stringify(normalize(guide.SHOPS))), normalize(shops));
});

test('local HTML resources and PowerPoint download resolve', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  for (const [, url] of html.matchAll(/(?:src|href)="([^"#][^"]*)"/g)) {
    if (/^(https?:|mailto:|data:)/.test(url)) continue;
    assert.ok(fs.existsSync(path.join(root, url)), `Missing local resource: ${url}`);
  }
  assert.ok(html.includes('prefers-reduced-motion') || source.includes('prefers-reduced-motion'));
  assert.ok(!html.includes('id="loader"'), 'No blocking loading screen');
});
