# Verified restaurant photographs

These three photographs are allowlisted in [`data/restaurant-photos.json`](../../data/restaurant-photos.json). Venue identity, the source's reuse terms, capture year and image were reviewed on 2026-09-10. They are historical photographs, not evidence of today's menu, portions, decor or operation. Other restaurant cards remain text-only until an exact-venue photo and permission can be verified.

## 阜杭豆漿: `fuhang.jpg`

- Photographer: **Hauskyg YWICAORP**.
- Capture: March 2024, Fu Hang Soy Milk in Huashan Market, Taipei.
- [Original source and description](https://commons.wikimedia.org/wiki/File:TW_TP_%E5%8F%B0%E5%8C%97_Taipei_%E8%8F%AF%E5%B1%B1%E5%B8%82%E5%A0%B4_HauShan_Market_Food_Court_%E9%98%9C%E6%9D%AD%E8%B1%86%E6%B5%86%E5%BA%97_Fu_Hang_Soy_Milk_Congee_Breakfast_shop_March_2024_R12S_132.jpg).
- License: [CC0 1.0](http://creativecommons.org/publicdomain/zero/1.0/deed.en).
- Identity evidence: the description names the market and restaurant; image and camera location corroborate it.
- Changes: resized; cropped by website and presentation layouts.

## 永康牛肉麵: `yongkang.jpg`

- Photographer: **Minghong**.
- Capture: 2006, Yong Kang Beef Noodle, Taipei.
- [Original source, photographer link and description](https://commons.wikimedia.org/wiki/File:Yong_Kang_Beef_Noodle_1.jpg).
- Chosen license: [Creative Commons Attribution-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-sa/4.0/).
- Identity evidence: the description names Yong Kang Beef Noodle and links the photographer's Flickr source; the recorded location is in the Yongkang/Jinshan South Road area.
- Changes: resized; cropped by website and presentation layouts. **The adapted image remains licensed under CC BY-SA 4.0.** Retain attribution, source, license and change notices when reusing it.

## 藍家割包: `lan-jia.jpg`

- Photographer: **竹筍弟弟 / JeanHavoc**.
- Capture: 2007, food provided by Gongguan Lan Jia Guabao.
- [Original source, identity statement and permission](https://commons.wikimedia.org/wiki/File:GeBao.JPG).
- License statement: **Copyrighted free use**, with unrestricted reuse explicitly granted on the source page.
- Identity evidence: the photographer states that the pictured snack was provided by 公館藍家割包.
- Changes: resized from the Commons preview; cropped by website and presentation layouts.

## Maintenance

Do not choose a restaurant photo from a category, filename, search keyword or visual similarity. Establish the exact venue/branch and reuse permission first, add a manifest entry with source and license links, then run `python scripts/build-data.py --verified-on <review-date>` and the tests. The review date records actual source verification, not merely a rebuild.

Website captions identify the restaurant, year, photographer, source, license and transformation. The PowerPoint keeps full attribution and source URLs in editable slide notes. Unverified legacy assets elsewhere in `assets/` are not part of this restaurant-photo allowlist or the PowerPoint; atmosphere illustrations must not be presented as a named restaurant.
