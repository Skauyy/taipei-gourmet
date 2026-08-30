/* ══════════════════════════════════════════════════════════
   圓通食堂 Yuantong Table — 互動腳本
   台大圓通雅筑國際學舍 · 生活美食指南
   ══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ══════════ 1. 主題（Dark / Light） ══════════ */
  var THEME_KEY = 'yuantong-theme';
  var root = document.documentElement;
  var themeBtn = $('#themeBtn');
  var themeLabel = $('#themeLabel');

  function applyTheme(mode) {
    root.setAttribute('data-theme', mode);
    if (themeLabel) themeLabel.textContent = (mode === 'dark') ? '深色' : '淺色';
    if (themeBtn) themeBtn.setAttribute('aria-pressed', String(mode === 'dark'));
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', (mode === 'dark') ? '#0b0b0d' : '#ffffff');
    try { localStorage.setItem(THEME_KEY, mode); } catch (e) {}
  }

  (function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
    if (saved !== 'dark' && saved !== 'light') {
      saved = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    applyTheme(saved);
  })();

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  }

  /* ══════════ 2. 資料：地區 × 種類 ══════════ */
  var ZONES = [
    { id: 'arrival', name: '到埗美食', color: '#ff9500', hint: '桃園機場 → 圓通宿舍沿線' },
    { id: 'life',    name: '近生活圈', color: '#2fa84a', hint: '圓通宿舍 · 中和 · 台大公館' },
    { id: 'other',   name: '其他',     color: '#8a5cf6', hint: '台北其餘必食' }
  ];

  var KINDS = [
    { id: 'food',    name: '嘢食', color: '#ff6a2c' },
    { id: 'drink',   name: '嘢飲', color: '#3b93c9' },
    { id: 'dessert', name: '甜品', color: '#e26aa8' }
  ];

  /* ─ 圖片池（依種類輪替） ─ */
  var IMG = {
    food: ['cat-beef-noodle','cat-luroufan','cat-dumpling','cat-oyster','cat-stinky-tofu',
           'cat-fried-chicken','cat-soy-milk','r-hotpot','r-chicken','r-guabao','r-fuhang',
           'r-dintaifung','s-skewer','s-nugget','s-corndog','nm-shilin','nm-raohe','nm-ningxia','r-muji'],
    drink:   ['cat-bubble-tea','s-tea','yongkang','nm-linjiang'],
    dessert: ['s-taro','s-pineapple','taipei101','hero-nightmarket']
  };

  /* ─ 店舖資料 ─
     n:店名  a:地址  h:營業時間  s:招牌推介  p:人均(台幣)  i:一句介紹
     z:地區(arrival|life|other)  k:種類(food|drink|dessert)  r:推薦指數(0-5) */
  var SHOPS = [
    /* ───── 到埗美食：桃園機場 → 圓通宿舍沿線 ───── */
    { n:'春水堂 桃園機場 T2', a:'第二航廈 4F', h:'07:00–18:00', s:'珍珠奶茶 · 牛肉麵套餐', p:350, z:'arrival', k:'drink', r:4.6, i:'喺機場都飲到正宗台式珍奶，坐低食餐正經飯先上機場捷運。' },
    { n:'興波咖啡 Simple Kaffa 桃園機場 T2', a:'第二航廈 4F', h:'05:00–21:00', s:'冠軍手沖 · 卡布奇諾', p:220, z:'arrival', k:'drink', r:4.7, i:'世界冠軍吳則霖嘅咖啡，紅眼機落地即刻有救。' },
    { n:'龜記茗品 桃園機場 T1', a:'第一航廈 B4', h:'06:00–22:00', s:'紅柚翡翠 · 水果茶', p:80, z:'arrival', k:'drink', r:4.4, i:'台灣在地手搖，落機第一杯先算真正開始。' },
    { n:'熊厚呷珍珠奶茶 桃園機場 T1', a:'第一航廈 B1', h:'10:00–22:00', s:'黑糖珍珠鮮奶', p:90, z:'arrival', k:'drink', r:4.2, i:'黑糖珍珠夠煙韌，甜度冰量都可以自己揀。' },
    { n:'日春木瓜牛奶 桃園機場 T2', a:'第二航廈 B2', h:'07:00–21:00', s:'木瓜牛奶 · 草莓牛奶', p:100, z:'arrival', k:'drink', r:4.3, i:'台灣古早味果汁攤，木瓜牛奶係不敗經典。' },
    { n:'小王煮瓜 桃園機場 T2', a:'第二航廈 3F', h:'06:00–23:00', s:'魯肉飯 · 焢肉飯', p:120, z:'arrival', k:'food', r:4.5, i:'米其林必比登推介嘅滷肉飯，機場價錢都算親民。' },
    { n:'老董牛肉麵 桃園機場 T2', a:'第二航廈 4F', h:'06:00–22:30', s:'清燉牛肉麵 · 番茄牛肉麵', p:380, z:'arrival', k:'food', r:4.3, i:'湯底清甜唔油膩、牛肉軟嫩，落機食碗熱湯麵最舒服。' },
    { n:'雙月食品社 桃園機場 T2', a:'第二航廈 4F', h:'06:00–21:30', s:'麻油雞湯 · 何首烏雞湯', p:300, z:'arrival', k:'food', r:4.7, i:'米其林必比登推介，冬天落機飲碗雞湯即刻回暖。' },
    { n:'萬芳冰室 桃園機場 T2', a:'第二航廈 4F', h:'06:00–21:00', s:'冰火菠蘿油 · 絲襪奶茶', p:260, z:'arrival', k:'food', r:4.2, i:'港式茶餐廳，蛋撻同乾炒牛河都做得似模似樣。' },
    { n:'仕紳品麵 桃園機場 T2', a:'第二航廈 4F', h:'06:00–22:00', s:'牛肉麵 · 小菜拼盤', p:320, z:'arrival', k:'food', r:4.1, i:'裝潢靚、坐得舒服，啱落機慢慢食一餐。' },
    { n:'台鐵便當 台北車站', a:'台北市中正區北平西路 3 號 · 台北車站 B1', h:'06:00–22:00', s:'排骨便當 · 雞腿便當', p:100, z:'arrival', k:'food', r:4.0, i:'A1 落車轉捷運前最平一站，NT$100 就食得飽。' },
    { n:'小南門豆花 桃園機場 T2', a:'第二航廈 B2', h:'07:30–22:30', s:'傳統豆花 · 薑汁豆花', p:90, z:'arrival', k:'dessert', r:4.4, i:'機場難得有傳統豆花，豆味濃、糖水唔死甜。' },
    { n:'一之軒時尚烘焙 桃園機場 T1', a:'第一航廈 B1', h:'07:00–21:00', s:'鳳凰酥 · 蛋黃酥', p:150, z:'arrival', k:'dessert', r:4.2, i:'買盒伴手禮帶返宿舍請室友，或者收埋做早餐。' },

    /* ───── 近生活圈：中和南勢角 · 華新街 ───── */
    { n:'南勢角陽春麵', a:'新北市中和區景新街 467 巷 6 號', h:'週二至六 17:00–01:00（週日、週一休）', s:'麻醬麵 · 餛飩湯', p:90, z:'life', k:'food', r:4.3, i:'南勢角宵夜王，半夜十二點仲要排隊。' },
    { n:'李家麵館刀削麵', a:'新北市中和區景新街 404 號', h:'11:00–15:00 / 17:00–22:30', s:'番茄牛肉刀削麵', p:130, z:'life', k:'food', r:4.4, i:'刀削麵夠厚身，番茄湯底酸香開胃。' },
    { n:'黃家大腸蚵仔麵線', a:'新北市中和區景新街 410 巷 6 號', h:'12:00–21:45（週日休）', s:'大腸蚵仔麵線', p:70, z:'life', k:'food', r:4.2, i:'蚵仔大粒、麵線滑溜，加蒜泥同辣油最正。' },
    { n:'鱻食堂龍蝦粥', a:'新北市中和區信義街 65 號', h:'18:00–00:00', s:'龍蝦粥 · 海鮮粥', p:250, z:'life', k:'food', r:4.5, i:'南勢角最有排頭嘅一餐，成煲龍蝦粥兩個人食啱啱好。' },
    { n:'珊珊臭豆腐', a:'新北市中和區景新街 467 巷 16 號', h:'19:00–03:00（週日休）', s:'脆皮臭豆腐 · 泡菜', p:80, z:'life', k:'food', r:4.1, i:'開到凌晨三點，寫完 essay 落街食啱啱好。' },
    { n:'滇城雲南美食', a:'新北市中和區華新街 78 號', h:'10:00–19:30（週四休）', s:'米線 · 涼拌豌豆粉', p:160, z:'life', k:'food', r:4.4, i:'華新街雲南幫嘅代表，酸辣湯底一試難忘。' },
    { n:'雲南口味', a:'新北市中和區華新街 48 號', h:'週五至日 07:00–13:00', s:'破酥包 · 米干', p:110, z:'life', k:'food', r:4.8, i:'Google 評價 4.8，只開週末朝早，晏起身就冇得食。' },
    { n:'藍天印度烤餅', a:'新北市中和區華新街 33 號', h:'07:00–16:00（週三休）', s:'印度烤餅 · 咖哩', p:180, z:'life', k:'food', r:4.3, i:'即叫即烤，甩餅甩到成條街都聞到香。' },
    { n:'阿薇緬甸小吃店', a:'新北市中和區景新街 27 號', h:'06:00–14:00（週三休）', s:'緬甸魚湯麵 · 椰奶麵', p:120, z:'life', k:'food', r:4.2, i:'中和緬甸街嘅老字號，早餐時段最多人。' },
    { n:'口福南洋風味', a:'新北市中和區華新街 35 號', h:'06:30–16:00（週四休）', s:'咖哩飯 · 椰漿飯', p:140, z:'life', k:'food', r:4.1, i:'平靚正嘅南洋飯，學生一個人食都唔肉赤。' },
    { n:'小檳城食堂', a:'新北市中和區華新街 112 號', h:'11:00–21:00（週五休）', s:'炒粿條 · 叻沙', p:170, z:'life', k:'food', r:4.3, i:'檳城風味還原度高，叻沙湯底濃到飲得晒。' },
    { n:'旺旺來亞洲咖哩屋', a:'新北市中和區華新街 23 號', h:'11:00–20:30（週四休）', s:'咖哩飯 · 海南雞飯', p:150, z:'life', k:'food', r:4.0, i:'一碗咖哩配白飯，最快解決一餐嘅方法。' },
    { n:'純檸檬泰式小吃', a:'新北市中和區和平街 16 號', h:'11:00–14:30 / 17:00–20:30', s:'打拋豬 · 酸辣海鮮湯', p:170, z:'life', k:'food', r:4.2, i:'酸辣到位，夏天冇胃口嘅時候最啱。' },
    { n:'知名度牛排 中和店', a:'新北市中和區忠孝街 141 號', h:'11:00–22:00', s:'沙朗牛排 · 鐵板麵', p:280, z:'life', k:'food', r:4.0, i:'台式平價牛排，附餐湯同飲品任飲。' },
    { n:'華新街印度拉茶', a:'新北市中和區華新街（掃街攤車）', h:'09:00–18:00', s:'印度拉茶 · 香料奶茶', p:60, z:'life', k:'drink', r:4.1, i:'南洋街掃街必飲，拉茶師傅手勢好睇過表演。' },

    /* ───── 近生活圈：台大 · 公館 ───── */
    { n:'陳三鼎黑糖粉圓', a:'台北市中正區公館羅斯福路三段 316 巷', h:'11:00–22:30', s:'黑糖粉圓鮮奶', p:55, z:'life', k:'drink', r:4.4, i:'公館地標級手搖，黑糖味濃、粉圓煙韌。' },
    { n:'可不可熟成紅茶 公館店', a:'台北市中正區羅斯福路三段', h:'10:30–22:00', s:'熟成紅茶 · 麗春', p:50, z:'life', k:'drink', r:4.1, i:'茶味夠濃唔死甜，公館學生嘅日常。' },
    { n:'麻古茶坊 公館店', a:'台北市中正區羅斯福路三段', h:'10:00–22:30', s:'楊枝甘露 · 芝芝芒果', p:70, z:'life', k:'drink', r:4.2, i:'水果茶選擇多，夏天排隊排到出街口。' },
    { n:'Mimi\'s Cafe 米米咖啡', a:'台北市中正區羅斯福路三段 284 巷 15 號', h:'09:00–21:00', s:'單品咖啡 · 早午餐', p:200, z:'life', k:'drink', r:4.0, i:'溫州街一帶嘅老咖啡店，坐得耐都唔會趕客。' },
    { n:'藍家割包', a:'台北市中正區羅斯福路三段 316 巷 8 弄 3 號', h:'11:00–22:30', s:'瘦肉割包 · 八寶麵', p:90, z:'life', k:'food', r:4.3, i:'公館排隊名店，割包皮鬆軟、花生粉給得闊佬。' },
    { n:'金雞園', a:'台北市中正區公館羅斯福路三段 316 巷', h:'11:00–14:00 / 17:00–21:00', s:'小籠包（8 顆 NT$80）· 油豆腐細粉', p:180, z:'life', k:'food', r:4.3, i:'1973 年開到而家，公館最老牌嘅小籠包。' },
    { n:'小鹿亭', a:'台北市中正區羅斯福路三段 277-1 號', h:'11:00–14:00 / 17:00–20:30', s:'日式定食 · 唐揚雞', p:260, z:'life', k:'food', r:4.4, i:'台大學生嘅平民日式食堂，飯同湯都任添。' },
    { n:'池先生 Kopitiam', a:'台北市中正區羅斯福路三段 284 巷 10 號', h:'11:00–21:00', s:'海南雞飯 · 叻沙', p:170, z:'life', k:'food', r:4.2, i:'馬來西亞華人家庭味，辣椒醬要記得另叫。' },
    { n:'鍋in 百元風味鍋', a:'台北市中正區汀州路三段 196 號', h:'11:00–23:45', s:'百元小火鍋 NT$150 起', p:200, z:'life', k:'food', r:4.1, i:'一個人打邊爐都唔尷尬，開到半夜仲有得食。' },
    { n:'公館胡椒餅（陳記燒餅）', a:'台北市中正區汀州路三段 181 號', h:'週一至六 12:00–20:00', s:'胡椒餅 · 燒餅', p:55, z:'life', k:'food', r:4.2, i:'出爐即刻食，小心燙嘴，肉汁會爆。' },
    { n:'指有雞飯', a:'台北市大安區溫州街 74 巷 5 弄 3 號', h:'11:30–14:00 / 17:00–20:30', s:'海南雞飯 · 雞油飯', p:160, z:'life', k:'food', r:4.2, i:'溫州街小巷入面嘅人氣雞飯，飯點必排。' },
    { n:'JODO 飯糰', a:'台北市中正區汀州路三段 131 號', h:'07:00–14:00', s:'飯糰 · 鮪魚飯糰', p:60, z:'life', k:'food', r:4.1, i:'趕早八嘅救星，一個飯糰加豆漿就夠。' },
    { n:'水源市場美食街', a:'台北市中正區羅斯福路四段 92 號', h:'10:00–21:00（各攤不同）', s:'自助餐 · 麵食 · 水煎包', p:100, z:'life', k:'food', r:4.0, i:'學餐級價錢，選擇多到揀唔落手。' },
    { n:'台大小福樓 · 小小福', a:'台北市大安區羅斯福路四段 1 號（台大校內）', h:'依各櫃位公告', s:'自助餐 · 便當 · 飲品', p:90, z:'life', k:'food', r:3.9, i:'落堂五分鐘就食到，最慳時間嘅選擇。' },
    { n:'靜壽司', a:'台北市中正區羅斯福路三段', h:'11:30–14:00 / 17:30–21:00', s:'握壽司 · 生魚片', p:400, z:'life', k:'food', r:4.2, i:'公館少有嘅平價日料，想食好少少嗰陣就嚟。' },
    { n:'YU POKE', a:'台北市大安區羅斯福路三段', h:'11:00–21:00', s:'夏威夷拌飯 · 鮭魚 Poke', p:230, z:'life', k:'food', r:4.1, i:'想食得健康啲嘅選擇，配料自己揀。' },
    { n:'壽司郎 公館店', a:'台北市中正區羅斯福路四段 68 號 2 樓', h:'11:00–22:00', s:'迴轉壽司 · 鮭魚', p:350, z:'life', k:'food', r:4.0, i:'想食壽司又唔想傷荷包，NT$40 起一碟。' },
    { n:'鴉片粉圓', a:'台北市中正區羅斯福路四段 52 巷 16 弄 4 號', h:'12:00–22:30', s:'粉圓冰 · 綜合冰', p:65, z:'life', k:'dessert', r:4.3, i:'公館甜品老字號，粉圓細粒但好煙韌。' },
    { n:'何太守港式菠蘿包', a:'台北市中正區汀州路三段 167 號', h:'13:00–21:00', s:'冰火菠蘿油 · 蛋撻', p:70, z:'life', k:'dessert', r:4.4, i:'熱菠蘿包夾凍牛油，罪惡但值得。' },
    { n:'怪舒芙 Monster Souffle', a:'台北市大安區羅斯福路三段', h:'12:00–21:00', s:'舒芙蕾 · 厚鬆餅', p:180, z:'life', k:'dessert', r:4.3, i:'IG 打卡聖地，上枱嗰陣舒芙蕾仲喺度「跳舞」。' },
    { n:'Quichez 派出所', a:'台北市大安區溫州街 74 巷 14 號', h:'09:00–21:30', s:'法式鹹派 · 乳酪蛋糕', p:160, z:'life', k:'dessert', r:4.2, i:'由舊派出所改建，鹹派同蛋糕都係自家製。' },
    { n:'公館龍潭豆花', a:'台北市中正區汀州路三段', h:'11:00–22:30', s:'傳統豆花 · 粉圓豆花', p:55, z:'life', k:'dessert', r:4.0, i:'平靚正嘅台式豆花，糖水甜度自選。' },

    /* ───── 其他：台北其餘必食 ───── */
    { n:'阜杭豆漿', a:'台北市中正區忠孝東路一段 108 號 2 樓（華山市場）', h:'05:30–12:30（週一休）', s:'厚燒餅油條 · 鹹豆漿', p:80, z:'other', k:'food', r:4.5, i:'米其林必比登，排一小時都值得，早起身就嚟。' },
    { n:'鼎泰豐 信義本店', a:'台北市大安區信義路二段 194 號', h:'10:00–21:00', s:'小籠包 · 元盅雞湯', p:600, z:'other', k:'food', r:4.6, i:'世界級小籠包，18 摺皮薄汁多，請屋企人食最穩陣。' },
    { n:'永康牛肉麵', a:'台北市大安區金山南路二段 31 巷 17 號', h:'11:00–21:00', s:'紅燒牛肉麵 · 粉蒸排骨', p:300, z:'other', k:'food', r:4.3, i:'永康街地標，湯頭濃郁帶花椒香。' },
    { n:'金峰滷肉飯', a:'台北市中正區羅斯福路一段 10 號', h:'08:00–01:00', s:'魯肉飯 · 焢肉飯', p:70, z:'other', k:'food', r:4.3, i:'開到凌晨，滷汁撈飯一流，宵夜都搵到佢。' },
    { n:'阿宗麵線', a:'台北市萬華區峨眉街 8-1 號', h:'09:00–22:30', s:'大腸麵線 · 肉羹麵線', p:70, z:'other', k:'food', r:4.2, i:'西門町站住食嘅經典，蒜泥烏醋自己加。' },
    { n:'豪大大雞排 士林夜市', a:'台北市士林區基河路 101 號（士林夜市）', h:'15:00–00:00', s:'超大雞排', p:80, z:'other', k:'food', r:4.0, i:'比塊面仲要大，兩個人分一塊就夠。' },
    { n:'福州世祖胡椒餅 饒河街夜市', a:'台北市松山區饒河街 249 號前', h:'16:00–23:30', s:'胡椒餅', p:65, z:'other', k:'food', r:4.4, i:'饒河街入口第一檔，永遠排長龍。' },
    { n:'劉芋仔 寧夏夜市', a:'台北市大同區寧夏路與民生西路口（寧夏夜市）', h:'15:00–23:00', s:'芋丸 · 蛋黃芋餅', p:60, z:'other', k:'dessert', r:4.3, i:'米其林必比登推介，外脆內綿，趁熱食。' },
    { n:'龍都冰果室', a:'台北市萬華區廣州街 168 號', h:'10:30–23:00', s:'八寶冰 · 芒果冰', p:120, z:'other', k:'dessert', r:4.1, i:'剉冰界嘅老舖，料多到滿瀉。' },
    { n:'雪王冰淇淋', a:'台北市中正區武昌街一段 52 號', h:'11:00–22:00', s:'怪味冰淇淋（麻油雞 · 豬腳 · 芹菜）', p:150, z:'other', k:'dessert', r:4.0, i:'世界罕見嘅怪味冰淇淋舖，膽大必試。' },
    { n:'咖啡小自由', a:'台北市大安區金華街 243 巷 1 號', h:'12:00–22:00', s:'單品手沖 · 冰滴咖啡', p:250, z:'other', k:'drink', r:4.2, i:'永康街一帶嘅文青咖啡名店，坐得舒服。' },
    { n:'老虎堂 黑糖專売 西門町店', a:'台北市萬華區西寧南路', h:'12:00–22:00', s:'黑糖珍奶 · 波霸厚鮮奶', p:65, z:'other', k:'drink', r:4.1, i:'黑糖味極濃，鍾意甜嘅一定會返轉頭。' }
  ];

  /* ───── 地圖聚落 ───── */
  var SPOTS = [
    { t:'圓通雅筑國際學舍', sx:130, sy:615, c:'#ff9500', g:'🏠',
      d:'新北市中和區工專路 26-38 號，台科大華夏校區對面 —— 你未來幾年嘅起點。',
      tags:['南勢角陽春麵','李家麵館刀削麵','JODO 飯糰'] },
    { t:'南勢角美食街', sx:212, sy:518, c:'#ff6a2c', g:'🍜',
      d:'景新街一帶，陽春麵、麵線、臭豆腐、龍蝦粥，行五分鐘就到。',
      tags:['南勢角陽春麵','黃家大腸蚵仔麵線','珊珊臭豆腐','鱻食堂龍蝦粥'] },
    { t:'華新街南洋街', sx:262, sy:556, c:'#e26aa8', g:'🌏',
      d:'全台南洋料理密度最高嘅一條街，雲南、緬甸、馬來、印度一次過食齊。',
      tags:['滇城雲南美食','雲南口味','小檳城食堂','藍天印度烤餅','華新街印度拉茶'] },
    { t:'景安站商圈', sx:340, sy:466, c:'#ff9500', g:'🛍',
      d:'轉環狀線嘅地方，興南夜市同平價牛排都喺附近。',
      tags:['知名度牛排 中和店','純檸檬泰式小吃'] },
    { t:'公館商圈', sx:702, sy:266, c:'#2fa84a', g:'🍚',
      d:'橘線轉綠線即到，台大嘅「校外飯堂」，由割包食到甜品。',
      tags:['藍家割包','陳三鼎黑糖粉圓','金雞園','小鹿亭'] },
    { t:'台大校區', sx:808, sy:222, c:'#5ac26a', g:'🎓',
      d:'小福樓、小小福、水源市場 —— 趕時間同慳錢嘅最佳選擇。',
      tags:['台大小福樓 · 小小福','水源市場美食街'] },
    { t:'溫州街', sx:836, sy:306, c:'#3b93c9', g:'☕',
      d:'咖啡店同小店集中，食完飯行街一流。',
      tags:['指有雞飯','Quichez 派出所',"Mimi's Cafe 米米咖啡"] },
    { t:'汀州路', sx:632, sy:238, c:'#ff6a2c', g:'🥘',
      d:'火鍋、胡椒餅、飯糰 —— 公館最平靚正嘅一條路。',
      tags:['鍋in 百元風味鍋','公館胡椒餅（陳記燒餅）','JODO 飯糰','公館龍潭豆花'] },
    { t:'台北車站 A1', sx:830, sy:96, c:'#8a5cf6', g:'🚉',
      d:'機場捷運落車位，轉捷運去南勢角；B1 有台鐵便當頂肚。',
      tags:['台鐵便當 台北車站'] }
  ];

  /* ══════════ 3. 工具 ══════════ */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (m) {
      return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[m];
    });
  }
  function zoneOf(id) { for (var i = 0; i < ZONES.length; i++) if (ZONES[i].id === id) return ZONES[i]; return ZONES[0]; }
  function kindOf(id) { for (var i = 0; i < KINDS.length; i++) if (KINDS[i].id === id) return KINDS[i]; return KINDS[0]; }
  function mapsUrl(q) { return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q); }
  function ytUrl(q)   { return 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q); }
  function openTab(u) { window.open(u, '_blank', 'noopener,noreferrer'); }

  /* 推薦指數星級（0–5，支援小數） */
  function starsHTML(r) {
    var pct = Math.max(0, Math.min(100, (r / 5) * 100));
    return '<span class="stars" role="img" aria-label="推薦指數 ' + r.toFixed(1) + ' / 5">' +
             '<span class="stars__bg">★★★★★</span>' +
             '<span class="stars__fg" style="width:' + pct.toFixed(1) + '%">★★★★★</span>' +
           '</span>';
  }

  /* ══════════ 4. 渲染：篩選 chips ══════════ */
  var state = { zone: {}, kind: {} };   // 多選：{ id: true }
  var counts = { zone: {}, kind: {} };

  SHOPS.forEach(function (d) {
    counts.zone[d.z] = (counts.zone[d.z] || 0) + 1;
    counts.kind[d.k] = (counts.kind[d.k] || 0) + 1;
  });

  function buildChips(host, list, axis, countsMap) {
    if (!host) return;
    var html = '<button class="chip is-on" type="button" data-axis="' + axis + '" data-id="__all">' +
                 '<span class="dot" style="--c:var(--accent)"></span>全部' +
                 '<span class="n">' + SHOPS.length + '</span></button>';
    list.forEach(function (o) {
      html += '<button class="chip" type="button" data-axis="' + axis + '" data-id="' + o.id + '">' +
                '<span class="dot" style="--c:' + o.color + '"></span>' + esc(o.name) +
                '<span class="n">' + (countsMap[o.id] || 0) + '</span></button>';
    });
    host.innerHTML = html;
  }
  buildChips($('#zoneChips'), ZONES, 'zone', counts.zone);
  buildChips($('#kindChips'), KINDS, 'kind', counts.kind);

  /* ══════════ 5. 渲染：店舖卡片 ══════════ */
  var grid = $('#cards');
  var emptyBox = $('#empty');
  var resultCount = $('#resultCount');
  var kindSeq = { food: 0, drink: 0, dessert: 0 };

  function cardHTML(d) {
    var z = zoneOf(d.z), k = kindOf(d.k);
    var pool = IMG[d.k] || IMG.food;
    var img = 'assets/' + pool[kindSeq[d.k]++ % pool.length] + '.jpg';
    var q = d.n + ' ' + d.a;
    var ytq = d.n + ' 美食 食記';

    return '' +
    '<article class="card" data-z="' + d.z + '" data-k="' + d.k + '" data-name="' + esc(d.n) + '">' +
      '<div class="card__media">' +
        '<img src="' + img + '" alt="' + esc(d.n) + '" loading="lazy" decoding="async" />' +
        '<span class="card__zone" style="--zc:' + z.color + '">' + esc(z.name) + '</span>' +
        '<span class="card__kind">' + esc(k.name) + '</span>' +
        '<span class="card__rate">' +
          '<span class="rv">' + d.r.toFixed(1) + '</span>' +
          '<span class="rl">推薦指數</span>' +
        '</span>' +
      '</div>' +

      '<div class="card__body">' +
        '<div class="card__title">' +
          '<h3 class="card__name" data-map="' + esc(q) + '" title="喺 Google Map 開啟">' + esc(d.n) + '</h3>' +
          '<span class="card__stars">' + starsHTML(d.r) + '</span>' +
        '</div>' +

        '<p class="card__addr" data-map="' + esc(q) + '" title="喺 Google Map 開啟">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
            '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" stroke-linejoin="round"/>' +
            '<circle cx="12" cy="10" r="2.6"/></svg>' +
          '<span>' + esc(d.a) + '</span>' +
        '</p>' +

        '<dl class="card__meta">' +
          '<div class="mbox"><dt>營業時間</dt><dd>' + esc(d.h) + '</dd></div>' +
          '<div class="mbox mbox--money"><dt>人均消費</dt><dd>NT$' + d.p + '</dd></div>' +
        '</dl>' +

        '<div class="card__sign"><span class="k">招牌</span><span class="v">' + esc(d.s) + '</span></div>' +
        '<p class="card__intro">' + esc(d.i) + '</p>' +
      '</div>' +

      '<div class="card__foot">' +
        '<a class="lk lk--map" href="' + mapsUrl(q) + '" target="_blank" rel="noopener noreferrer">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
            '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" stroke-linejoin="round"/>' +
            '<circle cx="12" cy="10" r="2.6"/></svg>Google Map</a>' +
        '<a class="lk lk--yt" href="' + ytUrl(ytq) + '" target="_blank" rel="noopener noreferrer">' +
          '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
            '<path d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77C22 15.2 22 12 22 12s0-3.2-.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z"/></svg>' +
          'YouTube 食評</a>' +
        '<a class="lk lk--full" href="' + mapsUrl(q) + '" target="_blank" rel="noopener noreferrer" aria-label="導航">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
            '<path d="M7 17 17 7M17 7H9M17 7v8" stroke-linecap="round" stroke-linejoin="round"/></svg></a>' +
      '</div>' +
    '</article>';
  }

  if (grid) grid.innerHTML = SHOPS.map(cardHTML).join('');
  var cardEls = $$('.card', grid);

  /* ══════════ 6. 雙軸篩選 ══════════ */
  var hideTimer = null;

  function matches(el) {
    var z = state.zone, k = state.kind;
    var zOK = true, kOK = true, key;
    for (key in z) { zOK = false; break; }
    if (!zOK) zOK = !!z[el.getAttribute('data-z')];
    for (key in k) { kOK = false; break; }
    if (!kOK) kOK = !!k[el.getAttribute('data-k')];
    return zOK && kOK;
  }

  function syncChips() {
    $$('.chip').forEach(function (c) {
      var axis = c.getAttribute('data-axis');
      var id = c.getAttribute('data-id');
      var on = (id === '__all') ? (Object.keys(state[axis]).length === 0) : !!state[axis][id];
      c.classList.toggle('is-on', on);
    });
  }

  function applyFilter(animate) {
    var shown = 0;
    cardEls.forEach(function (el) {
      var ok = matches(el);
      if (ok) shown++;
      if (ok) {
        el.classList.remove('is-gone');
        if (animate && !REDUCE) {
          requestAnimationFrame(function () {
            requestAnimationFrame(function () { el.classList.remove('is-out'); });
          });
        } else {
          el.classList.remove('is-out');
        }
      } else {
        el.classList.add('is-out');
      }
    });

    if (resultCount) {
      resultCount.innerHTML = '搵到 <b>' + shown + '</b> 間（共 ' + SHOPS.length + ' 間）';
    }
    if (emptyBox) emptyBox.hidden = (shown !== 0);

    clearTimeout(hideTimer);
    hideTimer = setTimeout(function () {
      cardEls.forEach(function (el) { el.classList.toggle('is-gone', !matches(el)); });
    }, animate && !REDUCE ? 460 : 0);
  }

  document.addEventListener('click', function (e) {
    var chip = e.target.closest ? e.target.closest('.chip') : null;
    if (chip) {
      var axis = chip.getAttribute('data-axis');
      var id = chip.getAttribute('data-id');
      if (id === '__all') state[axis] = {};
      else if (state[axis][id]) delete state[axis][id];
      else state[axis][id] = true;
      syncChips();
      applyFilter(true);
      return;
    }
    var rs = e.target.closest ? e.target.closest('[data-reset]') : null;
    if (rs) { resetAll(); return; }
  });

  function resetAll() {
    state.zone = {}; state.kind = {};
    syncChips(); applyFilter(true);
  }
  var resetBtn = $('#resetBtn');
  if (resetBtn) resetBtn.addEventListener('click', resetAll);

  /* 卡片：撳名／地址 → Google Map */
  if (grid) {
    grid.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-map]') : null;
      if (t) { e.preventDefault(); openTab(mapsUrl(t.getAttribute('data-map'))); }
    });
  }

  applyFilter(false);

  /* ══════════ 7. 地圖：標記 + 聚落 ══════════ */
  var markersHost = $('#markers');
  var spotList = $('#spotList');
  var spotDetail = $('#spotDetail');
  var activeSpot = -1;

  if (markersHost) {
    markersHost.innerHTML = SPOTS.map(function (s, i) {
      return '<button class="mk" type="button" data-i="' + i + '" style="left:' + (s.sx / 10) + '%;top:' + (s.sy / 7.2) + '%;--mc:' + s.c + '">' +
               '<span class="mk__pin">' + (i + 1) + '</span>' +
               '<span class="mk__label">' + esc(s.t) + '</span>' +
             '</button>';
    }).join('');
    markersHost.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('.mk') : null;
      if (b) selectSpot(parseInt(b.getAttribute('data-i'), 10), false);
    });
  }

  if (spotList) {
    spotList.innerHTML = SPOTS.map(function (s, i) {
      var n = (s.tags || []).filter(function (t) {
        return SHOPS.some(function (d) { return d.n === t; });
      }).length;
      return '<button class="spot" type="button" data-i="' + i + '" style="--sc:' + s.c + '">' +
               '<span class="spot__ico" aria-hidden="true">' + s.g + '</span>' +
               '<span class="spot__txt"><span class="spot__name">' + esc(s.t) + '</span>' +
               '<span class="spot__desc">' + esc(s.d.split('—')[0].split('——')[0].slice(0, 34)) + '…</span></span>' +
               '<span class="spot__n">' + n + '</span>' +
             '</button>';
    }).join('');
    spotList.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('.spot') : null;
      if (b) selectSpot(parseInt(b.getAttribute('data-i'), 10), true);
    });
  }

  function renderDetail(i) {
    if (!spotDetail) return;
    var s = SPOTS[i];
    var tags = (s.tags || []).map(function (t) {
      return '<span data-goto="' + esc(t) + '">' + esc(t) + '</span>';
    }).join('');
    spotDetail.innerHTML =
      '<h4 class="pd__title">' + esc(s.t) + '</h4>' +
      '<p class="pd__desc">' + esc(s.d) + '</p>' +
      '<div class="pd__tags">' + tags + '</div>' +
      '<div class="pd__go">' +
        '<a class="lk lk--map" href="' + mapsUrl(s.t) + '" target="_blank" rel="noopener noreferrer">Google Map</a>' +
      '</div>';
  }

  function selectSpot(i, scrollList) {
    activeSpot = i;
    $$('.mk').forEach(function (m, n) { m.classList.toggle('is-on', n === i); });
    $$('.spot').forEach(function (m, n) { m.classList.toggle('is-on', n === i); });
    renderDetail(i);
    if (scrollList && REDUCE === false) {
      var el = $$('.spot')[i];
      if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  /* 撳聚落入面嘅店名 → 跳去卡片並閃一下 */
  if (spotDetail) {
    spotDetail.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-goto]') : null;
      if (!t) return;
      var name = t.getAttribute('data-goto');
      var shop = null;
      SHOPS.forEach(function (d) { if (d.n === name) shop = d; });
      if (!shop) return;

      state.zone = {}; state.kind = {};
      syncChips(); applyFilter(false);

      var target = null;
      cardEls.forEach(function (el) { if (el.getAttribute('data-name') === name) target = el; });
      if (target) {
        target.scrollIntoView({ behavior: REDUCE ? 'auto' : 'smooth', block: 'center' });
        target.classList.add('is-flash');
        setTimeout(function () { target.classList.remove('is-flash'); }, 1600);
      }
    });
  }

  if (SPOTS.length) selectSpot(0, false);

  /* ══════════ 8. 捲動淡入 ══════════ */
  function observeReveals() {
    var els = $$('.reveal');
    if (REDUCE || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }
  observeReveals();

  /* ══════════ 9. 數字計數 ══════════ */
  function runCounters() {
    var nodes = $$('[data-count]');
    if (REDUCE) {
      nodes.forEach(function (el) {
        var v = parseFloat(el.getAttribute('data-count'));
        var dec = parseInt(el.getAttribute('data-dec') || '0', 10);
        el.textContent = (el.getAttribute('data-prefix') || '') + v.toFixed(dec);
      });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        io.unobserve(el);
        var end = parseFloat(el.getAttribute('data-count'));
        var dec = parseInt(el.getAttribute('data-dec') || '0', 10);
        var pre = el.getAttribute('data-prefix') || '';
        var dur = 1500, t0 = 0;
        function step(t) {
          if (!t0) t0 = t;
          var p = Math.min(1, (t - t0) / dur);
          var e = 1 - Math.pow(1 - p, 3);
          el.textContent = pre + (end * e).toFixed(dec);
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    nodes.forEach(function (el) { io.observe(el); });
  }
  runCounters();

  /* ══════════ 10. 捲動：進度條 / 視差 / 導覽 ══════════ */
  var nav = $('#nav');
  var progress = $('#progress');
  var stages = $$('.stage');
  var navLinks = $$('.nav__links a');
  var sections = ['route', 'shops', 'map', 'tips'].map(function (id) { return document.getElementById(id); });
  var ticking = false;

  function onFrame() {
    ticking = false;
    var y = window.pageYOffset || document.documentElement.scrollTop;
    var doc = document.documentElement.scrollHeight - window.innerHeight;
    var vh = window.innerHeight;

    if (progress) progress.style.width = (doc > 0 ? (y / doc) * 100 : 0) + '%';
    if (nav) nav.classList.toggle('is-stuck', y > 8);

    if (!REDUCE) {
      stages.forEach(function (st) {
        var r = st.getBoundingClientRect();
        if (r.bottom > -200 && r.top < vh + 200) {
          var p = (r.top + r.height / 2 - vh / 2) / vh;
          st.style.setProperty('--py', (p * 46).toFixed(1) + 'px');
        }
      });
    }

    var cur = '';
    sections.forEach(function (sec) {
      if (!sec) return;
      var r = sec.getBoundingClientRect();
      if (r.top <= vh * 0.42 && r.bottom >= vh * 0.32) cur = sec.id;
    });
    navLinks.forEach(function (a) {
      a.classList.toggle('is-active', a.getAttribute('data-nav') === cur);
    });
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(onFrame); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onFrame();

  /* ══════════ 11. 漢堡選單 ══════════ */
  var burger = $('#burger');
  var sheet = $('#sheet');
  if (burger && sheet) {
    burger.addEventListener('click', function () {
      var open = sheet.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('is-locked', open && window.innerWidth < 900);
    });
    sheet.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        sheet.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('is-locked');
      }
    });
  }

  /* ══════════ 12. 載入動畫 + Hero 進場 ══════════ */
  function boot() {
    var loader = $('#loader');
    if (loader) {
      setTimeout(function () { loader.classList.add('is-done'); }, REDUCE ? 0 : 520);
    }
    stages.forEach(function (st) {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { st.classList.add('is-ready'); });
      });
    });
    onFrame();
  }
  if (document.readyState === 'complete') boot();
  else window.addEventListener('load', boot);
  setTimeout(boot, 2600);   // 保險：圖片太慢都照樣收起載入畫面

})();
