# 臺北市歷年必比登資料來源

`taipei-bib.json` 僅處理**臺北市**，不含新北市。最新版本為《臺灣米其林指南2026》。共 **94 筆分店／經營店家紀錄：37 筆現行、57 筆僅歷史獲獎**，合計425筆明確年度獎項。每個獎項年度都有 `bib.sources` 引用；沒有從首年與末年推算連續得獎。

## 年度覆蓋

| 年度 | 已核對臺北數量 | 完整名單來源 | 其他核對 |
|---|---:|---|---|
| 2018 | 36 | [米其林官方完整PDF](https://d3h1lg3ksw6i6b.cloudfront.net/media/pdf/Michelin%20Guide%20Taipei%202018%20Bib%20Gourmand%20Table.pdf) | [Vogue同期完整名單](https://www.vogue.com.tw/feature/content-39114)、[分店地址彙整](https://whitneyblog.com/post-45720471/) |
| 2019 | 58 | [年度完整名單及地址](https://whitneyblog.com/post-46620921/) | [官方24家夜市完整名單](https://guide.michelin.com/tw/zh_TW/article/news-and-views/michelin-guide-taipei-2019-bib-gourmand-selection-street-foods)、[官方12家新入選](https://guide.michelin.com/tw/zh_TW/article/news-and-views/taipei-michelin-guide-bib-2019-new-entrants) |
| 2020 | 54 | [聯合報同期完整名單](https://style.udn.com/style/story/8077/4772314) | [官方54家總數及7家新入選／遷址重新入選](https://guide.michelin.com/tw/zh_TW/article/dining-out/what-michelin-inspectors-said-about-the-7-new-bib-gourmand-eateries-in-taipei-2020) |
| 2021 | 58 | [聯合報同期完整名單](https://udn.com/news/story/11893/5665578) | [官方58家總數及6家新入選](https://guide.michelin.com/tw/zh_TW/article/news-and-views/michelin-guide-taipei-taichung-2021-bib-gourmand-selection) |
| 2022 | 57 | [米其林官方完整PDF，第1至3頁為臺北](https://robert-parker-michelin-global-prod.s3.amazonaws.com/media/pdf/FINAL_CN_MSR+TTTK_Bib+Gourmand+Press+Release-Bib+Full+List.pdf?utm_source=FB&utm_medium=Website&utm_campaign=TW+Bib+G+2022) | [Vogue同期完整名單](https://www.vogue.com.tw/lifestyle/article/michelin-guide-2022-bib-gourmand)；PDF連結由[官方評審員文章](https://guide.michelin.com/tw/zh_TW/article/dining-out/what-order-these-new-bib-gourmand-locations-taipei-taichung-according-michelin-inspectors-2022)中的下載連結取得 |
| 2023 | 45 | [年度完整名單及地址](https://whitneyblog.com/bib-gourmand-taipei-2023/) | [官方45家總數及3家新入選](https://guide.michelin.com/tw/zh_TW/article/michelin-guide-ceremony/michelin-guide-taiwan-2023-bib-gourmand-selection)；鼎泰豐地址更正見下 |
| 2024 | 43 | [年度完整名單及地址](https://whitneyblog.com/bib-gourmand-taipei-2024/) | [官方43家總數及6家新入選](https://guide.michelin.com/tw/zh_TW/article/michelin-guide-ceremony/michelin-guide-taiwan-2024-bib-gourmand-selection) |
| 2025 | 37 | [年度完整名單及地址](https://whitneyblog.com/bib-gourmand-taipei-2025/) | [官方37家總數及3家新入選](https://guide.michelin.com/tw/zh_TW/article/michelin-guide-ceremony/michelin-guide-taiwan-2025-bib-gourmand-selection) |
| 2026 | 37 | [官方現行列表第1頁](https://guide.michelin.com/tw/en/taipei-region/taipei/restaurants/bib-gourmand)、[第2頁](https://guide.michelin.com/en/tw/taipei-region/taipei/restaurants/bib-gourmand/page/2) | [官方37家總數、4家新入選](https://guide.michelin.com/tw/en/article/michelin-guide-ceremony/taiwan-2026-bib-gourmand-list)、[食尚玩家37家完整分區名單與地址](https://supertaste.tvbs.com.tw/pack/360513) |

2026官方搜尋「Taipei及周邊」共55家，不等於臺北市55家。第1頁48家之中35家在臺北、13家在新北；第2頁7家之中2家在臺北、5家在新北。臺北的第2頁店家是番紅花印度美饌及松竹園。37家現行店家均有已查到的精確米其林店頁URL，地址／菜系由店頁及同期完整名單核對。

`coverage.complete` 表示該年度的臺北獲獎名單已完整轉錄、數量一致，不表示所有歷史資料已取得原始指南，也不代表歷史店家今日仍營業。2019–2021及2023–2025仍缺完整官方原始表，使用上表年度來源；官方新聞稿僅對明確列名的店家作年度來源，不將總數新聞稿誤當作未列名店家的獎項證據。

## 分店與更名處理

### 鼎泰豐：194號與277號必須分開

[鼎泰豐官方逐年記事](https://www.dintaifung.com.tw/about.php)明確列出：

- 2018、2019、2020、2021、2022：**信義店**獲必比登。
- 2023、2024、2025：**新生店**獲必比登。
- [2026米其林店頁](https://guide.michelin.com/tw/en/taipei-region/taipei/restaurant/din-tai-fung-xinyi-road)仍名為 `Din Tai Fung (Xinyi Road)`，地址則是**信義路二段277號**；評語說明原本旗艦店現在僅外帶，新內用場所在馬路另一側。

因此資料拆為194號信義本店（2018–2022）與277號新生店（2023–2026）。2023年度地址彙整及部分媒體仍沿用194號，已以品牌官方記事及[同期新生店報導](https://supertaste.tvbs.com.tw/food/344733)更正；沒有把2023同時計入兩店。既有app的「鼎泰豐 信義本店」只對應194號的歷史紀錄。

### 好公道金雞園不是公館金雞園

2018官方表列 `Hao Gong Dao Jin Ji Yuan`，2022表列 `Hao Kung Tao Chin Chi Yuan (Da'an)`；同期地址一致指向**大安區永康街28之1號**。既有app的公館「金雞園」地址在羅斯福路三段，不能合併、不能套用獎項。

### 已明確證實的遷址／更名

- **松青潤餅 → 吾旺再季**：[官方2020文章](https://guide.michelin.com/tw/zh_TW/article/dining-out/what-michelin-inspectors-said-about-the-7-new-bib-gourmand-eateries-in-taipei-2020)明載更名搬遷，故同筆保留2019的松青潤餅獎項。
- **阿國切仔麵、陳董藥燉排骨**：同一篇官方2020文章明載遷至新址後再獲推介。
- **人和園、阿國切仔麵**：[官方2022文章](https://guide.michelin.com/tw/zh_TW/article/dining-out/what-order-these-new-bib-gourmand-locations-taipei-taichung-according-michelin-inspectors-2022)記錄2022搬遷，沒有視為新增品牌分店。
- **小王清湯瓜仔肉 → 小王煮瓜**：2019官方夜市名單及現行店頁都對應華西街17之4號153號攤；機場店不包含在內。
- **談話頭 → 巷子龍家常菜**：官方2021新入選文章明述前後名稱；英文名 `Talking Heads` 保留。
- **季風**：本檔僅記2023臺北文林路126號3樓舊址。2026官方公告另述季風在新竹縣重開並新獲必比登，那一筆不屬臺北。
- **御品元冰火湯圓**：2019官方夜市名單與[2022元宵湯圓專文](https://guide.michelin.com/tw/zh_TW/article/dining-out/glutinous-rice-ball-michelin-recommended-restaurants-taipei-taichung)均指通化／臨江街夜市，不套用到饒河等分店。

### 地址衝突及現行標誌

- 杭州小籠湯包：[官方頁](https://guide.michelin.com/tw/en/taipei-region/taipei/restaurant/hang-zhou-xiao-long-bao-da-an)列杭州南路二段**17及19號**。沒有採用2020／2021聯合報列的53之5號。
- 大橋頭米糕：[官方頁](https://guide.michelin.com/tw/en/taipei-region/taipei/restaurant/da-qiao-tou-tube-rice-pudding)列延平北路三段**41號**。沒有採用個別媒體列的重慶北路地址。
- 無名推車燒餅：[官方頁](https://guide.michelin.com/tw/en/taipei-region/taipei/restaurant/unnamed-clay-oven-roll)列中華路二段311巷**74號攤**；部分年度媒體列315巷5弄。地址欄優先採官方資料。
- 小品雅廚的部分語系頁仍帶必比登標誌，但2026官方完整37家列表及同期名單均未收錄。`bib.current` 以**年度完整名單**為準，而非可能仍顯示舊資料的個別店頁。

## 元資料與缺口

- 中英文名稱主要來自2018、2022官方雙語PDF，2019官方新入選與夜市名單，2021評審員文章，以及2024–2026官方公告／店頁；舊拼法保存在 `aliases`。英文名不是人工翻譯的品牌名稱。
- 2018原始店家地址來自[同期地址彙整](https://whitneyblog.com/post-45720471/)；其後歷史地址來自該店所列最後相關年度來源，或精確的官方店頁。林東芳所列322號是2018年度彙整於2019明記的新址，不宣稱是2018評選當刻地址。
- 每筆都有核實來源中的地址，但歷史資料不是即時營業名錄。尤其停業、更換經營者、搬遷後是否延續營運，不應單憑 `bib.current=false` 判斷。
- 不含價格、Google評分、主觀推薦指數、營業時間，也沒有未驗證地圖URL。
- 有些歷史官方店頁已下架；未找到精確可用頁面者 `michelinUrl` 留null。歷史獎項仍以年度來源證明。
- 既有app中機場小王煮瓜、雙月，以及春水堂，不因同品牌或附近店家得獎而獲附必比登標籤。

## 驗證

資料已檢查：94個ID唯一、全部 `city=Taipei`、37個 `bib.current=true`、每年數量36/58/54/58/57/45/43/37/37，且每一筆 `bib.years` 完全等於該筆來源中的明確年度聯集。
