/* ============================================================
   台北味 Taipei Bites — 互動腳本
   ============================================================ */
(function () {
  'use strict';

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ═══════════════════════════════════════
     資料
     ═══════════════════════════════════════ */

  const CATS = {
    noodle:   '牛肉麵',
    dumpling: '小籠包',
    boba:     '手搖飲',
    oyster:   '蚵仔煎',
    rice:     '滷肉飯',
    tofu:     '臭豆腐',
    fried:    '鹽酥雞',
    snack:    '銅板點心'
  };

  const RESTAURANTS = [
    {
      name: '穆記牛肉麵', en: 'MuJi Beef Noodles', cat: 'noodle',
      img: 'assets/r-muji.jpg', dist: '中正區 · 台北車站',
      rating: '4.7', price: '$$',
      desc: '番茄牛腩湯頭清甜回甘，紅燒則濃厚帶勁。兩派各有信徒，最好的方法是各來一碗。',
      tags: ['番茄牛肉麵', '紅燒牛腩', '近台北車站']
    },
    {
      name: '永康牛肉麵', en: 'Yongkang Beef Noodles', cat: 'noodle',
      img: 'assets/cat-beef-noodle.jpg', dist: '大安區 · 永康街',
      rating: '4.5', price: '$$',
      desc: '川味紅燒的老字號，牛腱心燉得軟透入味。配一碟酸菜，是標準吃法。',
      tags: ['紅燒牛肉麵', '川味', '老字號']
    },
    {
      name: '鼎泰豐 信義本店', en: 'Din Tai Fung', cat: 'dumpling',
      img: 'assets/r-dintaifung.jpg', dist: '大安區 · 信義路',
      rating: '4.6', price: '$$$',
      desc: '十八摺小籠包，皮薄而不破、湯清而鮮。透明廚房裡看得見師傅的手勁。',
      tags: ['小籠包', '元盅雞湯', '排隊名店']
    },
    {
      name: '杭州小籠湯包', en: 'Hangzhou Soup Dumpling', cat: 'dumpling',
      img: 'assets/cat-dumpling.jpg', dist: '大安區 · 東門',
      rating: '4.3', price: '$',
      desc: '皮薄餡多、汁水飽滿。蒸籠一掀白煙撲臉，是東門人的日常早餐。',
      tags: ['小籠湯包', '蒸餃', '現桿現蒸']
    },
    {
      name: '陳三鼎黑糖粉圓', en: 'Chen San Ding', cat: 'boba',
      img: 'assets/cat-bubble-tea.jpg', dist: '公館 · 羅斯福路',
      rating: '4.4', price: '$',
      desc: '現煮黑糖珍珠配上冰鎮鮮奶，甜度收得剛好。很多人的珍奶，是從這一杯開始的。',
      tags: ['黑糖珍奶', '現煮粉圓', '公館商圈']
    },
    {
      name: '公館藍家蚵仔煎', en: 'Lan Jia Oyster Omelette', cat: 'oyster',
      img: 'assets/cat-oyster.jpg', dist: '公館 · 汀州路',
      rating: '4.2', price: '$',
      desc: '粉漿煎到邊緣微焦，蚵仔肥美不腥。淋上甜辣醬，是唯一真理。',
      tags: ['蚵仔煎', '甜辣醬', '夜市小吃']
    },
    {
      name: '金峰滷肉飯', en: 'Jin Feng Lu Rou Fan', cat: 'rice',
      img: 'assets/cat-luroufan.jpg', dist: '中正區 · 南門市場',
      rating: '4.5', price: '$',
      desc: '手切滷肉肥瘦比例剛好，膠質黏唇。配一碗筍乾湯，就是台北人的日常。',
      tags: ['滷肉飯', '焢肉飯', '南門市場']
    },
    {
      name: '家鄉碳烤臭豆腐', en: 'Grilled Stinky Tofu', cat: 'tofu',
      img: 'assets/cat-stinky-tofu.jpg', dist: '士林 · 基河路',
      rating: '4.3', price: '$',
      desc: '先炸後烤，外酥內嫩。配上泡菜與蒜醬，那股味道會在嘴裡轉成香氣。',
      tags: ['碳烤臭豆腐', '泡菜', '士林夜市']
    },
    {
      name: '師大鹽酥雞', en: 'Shida Fried Chicken', cat: 'fried',
      img: 'assets/r-chicken.jpg', dist: '大安區 · 師大路',
      rating: '4.6', price: '$',
      desc: '現炸起鍋、瀝油徹底，九層塔與蒜末給得大方。記得趁熱吃。',
      tags: ['鹽酥雞', '九層塔', '現炸']
    },
    {
      name: '惡魔雞排', en: 'Demon Chicken Steak', cat: 'fried',
      img: 'assets/s-nugget.jpg', dist: '西門町 · 峨眉街',
      rating: '4.1', price: '$',
      desc: '比臉還大的厚切雞排，胡椒香氣層次分明，適合邊走邊啃。',
      tags: ['厚切雞排', '胡椒', '西門町']
    },
    {
      name: '阜杭豆漿', en: 'Fu Hang Soy Milk', cat: 'snack',
      img: 'assets/r-fuhang.jpg', dist: '中正區 · 華山市場',
      rating: '4.5', price: '$',
      desc: '厚燒餅油條是絕對招牌，炭烤香氣從二樓飄到一樓。值得為它早起。',
      tags: ['厚燒餅', '豆漿', '華山市場']
    },
    {
      name: '藍家刈包', en: 'Lan Jia Gua Bao', cat: 'snack',
      img: 'assets/r-guabao.jpg', dist: '公館 · 羅斯福路',
      rating: '4.2', price: '$',
      desc: '鬆軟刈包夾入滷得入味的五花肉，加花生粉與酸菜，一口就是滿足。',
      tags: ['刈包', '花生粉', '公館商圈']
    }
  ];

  const MARKETS = [
    {
      name: '士林夜市', en: 'Shilin Night Market', img: 'assets/nm-shilin.jpg',
      dist: '士林區', hours: '17:00 – 24:00',
      desc: '台北規模最大的夜市。從大香腸、大餅包小餅到豪大雞排，一條街絕對吃不完。',
      must: ['大香腸', '大餅包小餅', '豪大雞排', '碳烤臭豆腐']
    },
    {
      name: '饒河街夜市', en: 'Raohe Street Night Market', img: 'assets/nm-raohe.jpg',
      dist: '松山區', hours: '17:00 – 23:30',
      desc: '慈祐宮前的老街市。胡椒餅現烤出爐，藥燉排骨暖胃，逛完還能走到彩虹橋。',
      must: ['福州世祖胡椒餅', '藥燉排骨', '蚵仔麵線']
    },
    {
      name: '寧夏夜市', en: 'Ningxia Night Market', img: 'assets/nm-ningxia.jpg',
      dist: '大同區', hours: '17:00 – 23:00',
      desc: '最像「台北人廚房」的夜市。蚵仔煎、豬肝湯、麻油雞，全是老味道。',
      must: ['蚵仔煎', '豬肝湯', '麻油雞', '豬腳飯']
    },
    {
      name: '臨江街夜市', en: 'Linjiang Street Night Market', img: 'assets/nm-linjiang.jpg',
      dist: '大安區', hours: '17:00 – 23:00',
      desc: '在地人多於觀光客。地瓜球、蚵仔煎、豆花，散步一圈就能吃完一輪。',
      must: ['地瓜球', '豆花', '蚵仔煎', '海產粥']
    }
  ];

  /* 地圖座標以 SVG viewBox (1000 × 720) 為準 */
  const SPOTS = [
    {
      name: '士林夜市', en: 'Shilin Night Market', sx: 238, sy: 140,
      img: 'assets/nm-shilin.jpg', dist: '士林區 · 基河路',
      desc: '台北規模最大的夜市，攤位綿延數條街。建議空著肚子來，並且先從大香腸開始。',
      addr: '台北市士林區基河路 101 號', hours: '17:00 – 24:00',
      must: ['大香腸', '大餅包小餅', '豪大雞排'], mrt: '捷運劍潭站'
    },
    {
      name: '迪化街', en: 'Dihua Street', sx: 176, sy: 300,
      img: 'assets/s-tea.jpg', dist: '大同區 · 迪化街一段',
      desc: '南北貨、中藥材與老屋咖啡並存的老街。買完茶葉，轉角就有一碗杏仁露。',
      addr: '台北市大同區迪化街一段', hours: '店家各異 · 09:00 – 19:00',
      must: ['花生捲冰淇淋', '杏仁露', '烏龍茶'], mrt: '捷運大橋頭站'
    },
    {
      name: '寧夏夜市', en: 'Ningxia Night Market', sx: 288, sy: 358,
      img: 'assets/nm-ningxia.jpg', dist: '大同區 · 寧夏路',
      desc: '長度不長卻密度極高，幾乎每一攤都是二十年起跳的老字號。',
      addr: '台北市大同區寧夏路', hours: '17:00 – 23:00',
      must: ['蚵仔煎', '豬肝湯', '麻油雞'], mrt: '捷運雙連站'
    },
    {
      name: '西門町', en: 'Ximending', sx: 300, sy: 488,
      img: 'assets/s-corndog.jpg', dist: '萬華區 · 峨眉街一帶',
      desc: '年輕人的街區，也是老味道的根據地。麵線、胡椒餅、雞排，一次到齊。',
      addr: '台北市萬華區西門町商圈', hours: '11:00 – 23:00',
      must: ['阿宗麵線', '胡椒餅', '厚切雞排'], mrt: '捷運西門站'
    },
    {
      name: '阜杭豆漿', en: 'Fu Hang Soy Milk', sx: 452, sy: 336,
      img: 'assets/r-fuhang.jpg', dist: '中正區 · 華山市場二樓',
      desc: '華山市場二樓的排隊傳說。厚燒餅夾油條，炭烤香氣是一整棟樓的鬧鐘。',
      addr: '台北市中正區忠孝東路二段 80 號 2 樓', hours: '05:30 – 12:30（週一休）',
      must: ['厚燒餅油條', '鹹豆漿', '焦糖甜餅'], mrt: '捷運善導寺站'
    },
    {
      name: '穆記牛肉麵', en: 'MuJi Beef Noodles', sx: 408, sy: 414,
      img: 'assets/r-muji.jpg', dist: '中正區 · 台北車站周邊',
      desc: '番茄與紅燒雙湯頭各有擁護者。牛肋條燉到筷子一夾就散，湯頭可以喝到見底。',
      addr: '台北市中正區延平南路一帶', hours: '11:00 – 21:00',
      must: ['番茄牛肉麵', '紅燒牛腩麵', '小菜拼盤'], mrt: '捷運台北車站'
    },
    {
      name: '永康街', en: 'Yongkang Street', sx: 596, sy: 500,
      img: 'assets/yongkang.jpg', dist: '大安區 · 永康街',
      desc: '巷弄裡藏著牛肉麵、芒果冰與咖啡館。適合下午來，慢慢地從街頭吃到街尾。',
      addr: '台北市大安區永康街', hours: '11:00 – 22:30',
      must: ['永康牛肉麵', '芒果冰', '手工餅乾'], mrt: '捷運東門站'
    },
    {
      name: '饒河街夜市', en: 'Raohe Street Night Market', sx: 866, sy: 296,
      img: 'assets/nm-raohe.jpg', dist: '松山區 · 饒河街',
      desc: '入口的福州世祖胡椒餅永遠在排隊，窯烤香氣就是最好的招牌。',
      addr: '台北市松山區饒河街', hours: '17:00 – 23:30',
      must: ['胡椒餅', '藥燉排骨', '蚵仔麵線'], mrt: '捷運松山站'
    },
    {
      name: '信義商圈 · 台北 101', en: 'Xinyi · Taipei 101', sx: 648, sy: 566,
      img: 'assets/taipei101.jpg', dist: '信義區 · 市府路',
      desc: '購物與美食的一級戰區。從百貨地下街的鼎泰豐到巷內餐酒館，選擇多到令人困擾。',
      addr: '台北市信義區市府路 45 號', hours: '11:00 – 22:00',
      must: ['鼎泰豐', '百貨美食街', '夜景餐酒館'], mrt: '捷運台北101/世貿站'
    },
    {
      name: '臨江街夜市', en: 'Linjiang Night Market', sx: 516, sy: 646,
      img: 'assets/nm-linjiang.jpg', dist: '大安區 · 臨江街',
      desc: '又稱通化夜市，生活感十足。住附近的人穿拖鞋就下來買晚餐。',
      addr: '台北市大安區臨江街', hours: '17:00 – 23:00',
      must: ['地瓜球', '豆花', '海產粥'], mrt: '捷運信義安和站'
    }
  ];

  /* ═══════════════════════════════════════
     1. 精選餐廳 — 產生 + 篩選
     ═══════════════════════════════════════ */
  const cardsBox = $('#cards');
  const emptyBox = $('#cardsEmpty');

  if (cardsBox) {
    cardsBox.innerHTML = RESTAURANTS.map(function (r) {
      return (
        '<article class="card reveal" data-cat="' + r.cat + '" style="--i:' +
          (RESTAURANTS.indexOf(r) % 4) + '">' +
          '<div class="card__media">' +
            '<img src="' + r.img + '" alt="' + r.name + '" loading="lazy" />' +
            '<span class="card__cat">' + (CATS[r.cat] || '') + '</span>' +
            '<span class="card__rate">' + r.rating + '</span>' +
          '</div>' +
          '<div class="card__body">' +
            '<h3 class="card__name">' + r.name + '</h3>' +
            '<p class="card__en">' + r.en + '</p>' +
            '<p class="card__meta"><span>' + r.dist + '</span><i>·</i><span>' + r.price + '</span></p>' +
            '<p class="card__desc">' + r.desc + '</p>' +
            '<ul class="card__tags">' +
              r.tags.map(function (t) { return '<li>' + t + '</li>'; }).join('') +
            '</ul>' +
          '</div>' +
        '</article>'
      );
    }).join('');
  }

  function applyFilter(cat) {
    const cards = $$('.card', cardsBox);
    let shown = 0;

    cards.forEach(function (el) {
      const match = cat === 'all' || el.dataset.cat === cat;
      if (match) {
        shown++;
        el.classList.remove('is-gone');
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { el.classList.remove('is-out'); });
        });
      } else {
        el.classList.add('is-out');
        window.setTimeout(function () {
          if (el.classList.contains('is-out')) el.classList.add('is-gone');
        }, 340);
      }
    });

    if (emptyBox) emptyBox.hidden = shown !== 0;
  }

  const filters = $('#filters');
  if (filters) {
    filters.addEventListener('click', function (e) {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      $$('.chip', filters).forEach(function (c) {
        const on = c === chip;
        c.classList.toggle('is-on', on);
        c.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      applyFilter(chip.dataset.cat);
    });
  }

  /* 分類圖卡 → 捲到餐廳區並套用篩選 */
  $$('.cat').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const cat = btn.dataset.goto;
      const chip = $('.chip[data-cat="' + cat + '"]', filters);
      if (chip) chip.click();
      const target = $('#restaurants');
      if (target) target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });

  /* ═══════════════════════════════════════
     2. 夜市卡片
     ═══════════════════════════════════════ */
  const marketsBox = $('#markets');
  if (marketsBox) {
    marketsBox.innerHTML = MARKETS.map(function (m, i) {
      return (
        '<article class="market reveal" style="--i:' + i + '">' +
          '<img src="' + m.img + '" alt="' + m.name + '" loading="lazy" />' +
          '<span class="market__shade"></span>' +
          '<div class="market__body">' +
            '<div class="market__top">' +
              '<h3 class="market__name">' + m.name + '</h3>' +
              '<span class="market__en">' + m.en + '</span>' +
              '<span class="market__hours">' + m.hours + '</span>' +
            '</div>' +
            '<p class="market__desc">' + m.desc + '</p>' +
            '<ul class="market__must">' +
              m.must.map(function (t) { return '<li>' + t + '</li>'; }).join('') +
            '</ul>' +
          '</div>' +
        '</article>'
      );
    }).join('');
  }

  /* ═══════════════════════════════════════
     3. 互動地圖
     ═══════════════════════════════════════ */
  const markerBox  = $('#markers');
  const listBox    = $('#spotList');
  const detailBox  = $('#spotDetail');
  let currentSpot  = -1;

  if (markerBox && listBox && detailBox) {
    /* 標記 */
    markerBox.innerHTML = SPOTS.map(function (s, i) {
      return (
        '<button class="pin" data-i="' + i + '" ' +
          'style="left:' + (s.sx / 10) + '%;top:' + (s.sy / 7.2) + '%" ' +
          'aria-label="' + s.name + '">' +
          '<span class="pin__ring" aria-hidden="true"></span>' +
          '<span class="pin__hit" aria-hidden="true"></span>' +
          '<span class="pin__label">' + s.name + '</span>' +
        '</button>'
      );
    }).join('');

    /* 清單 */
    listBox.innerHTML = SPOTS.map(function (s, i) {
      return (
        '<button class="srow" data-i="' + i + '">' +
          '<span class="srow__no">' + (i + 1) + '</span>' +
          '<span class="srow__tx"><b>' + s.name + '</b><span>' + s.dist + '</span></span>' +
          '<span class="srow__go" aria-hidden="true">→</span>' +
        '</button>'
      );
    }).join('');

    function renderDetail(i) {
      const s = SPOTS[i];
      detailBox.innerHTML =
        '<article class="detail">' +
          '<div class="detail__media">' +
            '<img src="' + s.img + '" alt="' + s.name + '" loading="lazy" />' +
            '<span class="detail__dist">' + s.dist + '</span>' +
          '</div>' +
          '<div class="detail__body">' +
            '<h3 class="detail__name">' + s.name + '</h3>' +
            '<p class="detail__en">' + s.en + '</p>' +
            '<p class="detail__desc">' + s.desc + '</p>' +
            '<dl class="detail__rows">' +
              '<div><dt>地址</dt><dd>' + s.addr + '</dd></div>' +
              '<div><dt>時間</dt><dd>' + s.hours + '</dd></div>' +
              '<div><dt>捷運</dt><dd>' + s.mrt + '</dd></div>' +
            '</dl>' +
            '<ul class="detail__tags">' +
              s.must.map(function (t) { return '<li>' + t + '</li>'; }).join('') +
            '</ul>' +
          '</div>' +
        '</article>';
    }

    function selectSpot(i, scroll) {
      if (i === currentSpot) return;
      currentSpot = i;

      $$('.pin', markerBox).forEach(function (p) {
        p.classList.toggle('is-on', Number(p.dataset.i) === i);
      });
      $$('.srow', listBox).forEach(function (r) {
        const on = Number(r.dataset.i) === i;
        r.classList.toggle('is-on', on);
        if (on && scroll) {
          const box = r.parentElement;
          const horizontal = box.scrollWidth > box.clientWidth + 4;
          if (horizontal) {
            box.scrollTo({ left: r.offsetLeft - 20, behavior: reduceMotion ? 'auto' : 'smooth' });
          }
        }
      });

      renderDetail(i);

      if (scroll && window.innerWidth < 1024) {
        detailBox.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
      }
    }

    markerBox.addEventListener('click', function (e) {
      const pin = e.target.closest('.pin');
      if (pin) selectSpot(Number(pin.dataset.i), true);
    });

    listBox.addEventListener('click', function (e) {
      const row = e.target.closest('.srow');
      if (row) selectSpot(Number(row.dataset.i), false);
    });

    renderDetail(0);
    selectSpot(0, false);
    $$('.pin', markerBox)[0].classList.add('is-on');
  }

  /* ═══════════════════════════════════════
     4. 捲動揭示
     ═══════════════════════════════════════ */
  const revealIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add('is-in');
        revealIO.unobserve(en.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  function observeReveals() {
    $$('.reveal:not(.is-in)').forEach(function (el) { revealIO.observe(el); });
  }
  observeReveals();

  /* ═══════════════════════════════════════
     5. 數字跳動
     ═══════════════════════════════════════ */
  const statIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      statIO.unobserve(en.target);
      $$('b[data-count]', en.target).forEach(function (el) {
        const target = Number(el.dataset.count);
        if (reduceMotion) { el.textContent = target; return; }
        const dur = 1400;
        const t0 = performance.now();
        (function step(now) {
          const p = Math.min((now - t0) / dur, 1);
          const eased = 1 - Math.pow(2, -10 * p);
          el.textContent = Math.round(target * (p === 1 ? 1 : eased));
          if (p < 1) requestAnimationFrame(step);
        })(t0);
      });
    });
  }, { threshold: 0.4 });

  const statsEl = $('.stats');
  if (statsEl) statIO.observe(statsEl);

  /* ═══════════════════════════════════════
     6. 視差 + 進度條 + 導覽列狀態
     ═══════════════════════════════════════ */
  const nav = $('#nav');
  const bar = $('#progress');
  const paraEls = $$('[data-parallax]');
  const navLinks = $$('.nav__links a');
  const sections = ['categories', 'restaurants', 'night', 'map']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  let ticking = false;

  function onFrame() {
    ticking = false;
    const y = window.pageYOffset;
    const vh = window.innerHeight;

    /* 進度條 */
    if (bar) {
      const max = document.documentElement.scrollHeight - vh;
      bar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    }

    /* 導覽列陰影 */
    if (nav) nav.classList.toggle('is-stuck', y > 12);

    /* 視差 */
    if (!reduceMotion) {
      paraEls.forEach(function (el) {
        const rate = parseFloat(el.dataset.parallax) || 0.1;
        const rect = el.getBoundingClientRect();
        const mid = rect.top + rect.height / 2 - vh / 2;
        el.style.setProperty('--py', (-mid * rate).toFixed(2) + 'px');
      });
    }

    /* 捲動導覽列高亮 */
    let activeId = '';
    sections.forEach(function (sec) {
      if (sec.getBoundingClientRect().top <= vh * 0.35) activeId = sec.id;
    });
    navLinks.forEach(function (a) {
      a.classList.toggle('is-active', a.dataset.nav === activeId);
    });
  }

  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(onFrame); }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onFrame();

  /* ═══════════════════════════════════════
     7. 漢堡選單
     ═══════════════════════════════════════ */
  const burger = $('#burger');
  if (burger) {
    burger.addEventListener('click', function () {
      const open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    $$('#sheet a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ═══════════════════════════════════════
     8. Hero 大圖進場
     ═══════════════════════════════════════ */
  const stage = $('.stage');
  if (stage) {
    if (reduceMotion) {
      stage.classList.add('is-ready');
    } else {
      window.setTimeout(function () { stage.classList.add('is-ready'); }, 120);
    }
  }
})();
