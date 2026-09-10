#!/usr/bin/env python3
"""Validate reviewed source records and emit local browser data bundles."""
import argparse
import json
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('--verified-on', required=True, help='Date the sources were checked, YYYY-MM-DD; building does not reverify sources')
args = parser.parse_args()
inputs = [json.loads((ROOT / 'data/research' / filename).read_text())
          for filename in ['taipei-bib.json', 'new-taipei-bib.json']]
latest = {data['latestEdition'] for data in inputs}
assert len(latest) == 1
latest = latest.pop()
restaurants, coverage, limitations = [], [], []
ids, aliases = set(), set()
for data in inputs:
    current_count = sum(bool(row['bib']['current']) for row in data['restaurants'])
    assert current_count == data['currentExpected'], (data['city'], current_count)
    for row in data['restaurants']:
        assert row['id'] not in ids, row['id']
        ids.add(row['id'])
        assert row['k'] in ('food', 'drink', 'dessert')
        assert row['city'] == data['city']
        years = row['bib']['years']
        assert years and years == sorted(set(years)), row['id']
        assert all(2018 <= year <= latest for year in years)
        assert bool(row['bib']['current']) == (latest in years), row['id']
        supported = set()
        for source in row['bib']['sources']:
            assert urlparse(source['url']).scheme == 'https', source['url']
            assert source['title'] and source['years']
            supported.update(source['years'])
        assert set(years) <= supported, row['id']
        if row.get('michelinUrl'):
            assert urlparse(row['michelinUrl']).hostname == 'guide.michelin.com'
        for alias in row.get('aliases', []):
            assert alias not in aliases, f'Duplicate legacy branch mapping: {alias}'
            aliases.add(alias)
        restaurants.append(row)
    for row in data['coverage']:
        coverage.append({**row, 'city': data['city']})
    limitations.extend(data.get('limitations', []))
coverage.sort(key=lambda row: (row['year'], row['city']))
output = {
    'latestEdition': latest,
    'verifiedOn': args.verified_on,
    'scope': ['Taipei', 'New Taipei'],
    'coverageNote': '台北、新北按米其林年度名單及具日期的完整報導逐項核對；部分歷史年度未取得完整官方原始表，下方列明實際來源。「完整年份名單已核對」指年度名單與數量已核對，不表示全部來源均為官方原表。入選年份只列有證據者，不由首末年份推算連續獲獎。歷史店家可能搬遷、改名或結業；未列年份不表示未獲獎。',
    'coverage': coverage,
    'restaurants': restaurants,
    'limitations': limitations,
}
text = json.dumps(output, ensure_ascii=False, indent=2) + '\n'
(ROOT / 'data/bib-gourmand.json').write_text(text)
(ROOT / 'data/bib-gourmand.js').write_text('window.BIB_GUIDE = ' + text.rstrip() + ';\n')
photos = json.loads((ROOT / 'data/restaurant-photos.json').read_text())
for name, photo in photos.items():
    assert photo['venue'] == name and photo['sourceUrl'] and photo['licenseUrl']
    assert (ROOT / photo['src']).is_file()
(ROOT / 'data/restaurant-photos.js').write_text('window.RESTAURANT_PHOTOS = ' + json.dumps(photos, ensure_ascii=False, indent=2) + ';\n')
print(f'{len(restaurants)} verified Bib Gourmand records; {sum(row["bib"]["current"] for row in restaurants)} current; {len(photos)} licensed venue photographs')
