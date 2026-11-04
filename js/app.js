(function () {
  'use strict';

  /* ---------- Constants ---------- */
  const MIN_DELIVERY_CENTS = 2500;
  const MAX_QTY = 99;
  const STORAGE_KEY = 'sushidai.cart.v1';
  const TIME_ZONE = 'Europe/Brussels';
  const OPEN_MINUTES = 16 * 60;
  const CLOSE_MINUTES = 22 * 60;
  const CLOSED_WEEKDAY = 1; /* maandag */
  const STATUS_REFRESH_MS = 60 * 1000;
  const TOAST_MS = 2200;
  const SEARCH_DEBOUNCE_MS = 120;
  const MAIL = 'sushidaibar@gmail.com';
  const DAY_NAMES = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];
  const WEEKDAY_INDEX = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const MODES = {
    afhalen: { label: 'Afhalen', eta: '± 20 min' },
    levering: { label: 'Levering', eta: '± 35 min' }
  };

  /* ---------- Helpers ---------- */
  const $ = (id) => document.getElementById(id);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const money = new Intl.NumberFormat('nl-BE', { style: 'currency', currency: 'EUR' });
  const eur = (cents) => money.format(cents / 100);
  const hm = (minutes) => String(Math.floor(minutes / 60)).padStart(2, '0') + ':' + String(minutes % 60).padStart(2, '0');

  function esc(value) {
    const map = { '&': '&' + 'amp;', '<': '&' + 'lt;', '>': '&' + 'gt;', '"': '&' + 'quot;', "'": '&' + '#39;' };
    return String(value).replace(/[&<>"']/g, (c) => map[c]);
  }

  function norm(value) {
    return String(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function cap(value) {
    const text = String(value).trim();
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  /* Inline icon set (Lucide, ISC licence): only the icons this page uses, so no icon library has to be downloaded. */
  const SVG_ICONS = {
    "arrow-up-right": "<path d=\"M7 7h10v10\"/><path d=\"M7 17 17 7\"/>",
    "bike": "<circle cx=\"18.5\" cy=\"17.5\" r=\"3.5\"/><circle cx=\"5.5\" cy=\"17.5\" r=\"3.5\"/><circle cx=\"15\" cy=\"5\" r=\"1\"/><path d=\"M12 17.5V14l-3-3 4-3 2 3h2\"/>",
    "chevron-left": "<path d=\"m15 18-6-6 6-6\"/>",
    "chevron-right": "<path d=\"m9 18 6-6-6-6\"/>",
    "clock": "<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M12 6v6l4 2\"/>",
    "copy": "<rect width=\"14\" height=\"14\" x=\"8\" y=\"8\" rx=\"2\" ry=\"2\"/><path d=\"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2\"/>",
    "external-link": "<path d=\"M15 3h6v6\"/><path d=\"M10 14 21 3\"/><path d=\"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6\"/>",
    "film": "<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\"/><path d=\"M7 3v18\"/><path d=\"M3 7.5h4\"/><path d=\"M3 12h18\"/><path d=\"M3 16.5h4\"/><path d=\"M17 3v18\"/><path d=\"M17 7.5h4\"/><path d=\"M17 16.5h4\"/>",
    "flame": "<path d=\"M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4\"/>",
    "info": "<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M12 16v-4\"/><path d=\"M12 8h.01\"/>",
    "layout-grid": "<rect width=\"7\" height=\"7\" x=\"3\" y=\"3\" rx=\"1\"/><rect width=\"7\" height=\"7\" x=\"14\" y=\"3\" rx=\"1\"/><rect width=\"7\" height=\"7\" x=\"14\" y=\"14\" rx=\"1\"/><rect width=\"7\" height=\"7\" x=\"3\" y=\"14\" rx=\"1\"/>",
    "leaf": "<path d=\"M11 20a10 10 0 0010-10 25.9 25.9 0 00-1.04-7.281 1 1 0 00-1.755-.325C15.833 5.5 13 5.5 9.8 6.1A7 7 0 0011 20\"/><path d=\"M2 21a5 5 0 012.911-4.544C7.613 15.212 8.351 15.24 11 13\"/>",
    "mail": "<path d=\"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7\"/><rect x=\"2\" y=\"4\" width=\"20\" height=\"16\" rx=\"2\"/>",
    "map-pin": "<path d=\"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0\"/><circle cx=\"12\" cy=\"10\" r=\"3\"/>",
    "menu": "<path d=\"M4 5h16\"/><path d=\"M4 12h16\"/><path d=\"M4 19h16\"/>",
    "minus": "<path d=\"M5 12h14\"/>",
    "moon": "<path d=\"M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401\"/>",
    "package": "<path d=\"M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z\"/><path d=\"M12 22V12\"/><polyline points=\"3.29 7 12 12 20.71 7\"/><path d=\"m7.5 4.27 9 5.15\"/>",
    "phone": "<path d=\"M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384\"/>",
    "plus": "<path d=\"M5 12h14\"/><path d=\"M12 5v14\"/>",
    "receipt": "<path d=\"M12 17V7\"/><path d=\"M16 8h-6a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H8\"/><path d=\"M4 3a1 1 0 0 1 1-1 1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2 1 1 0 0 1-1-1z\"/>",
    "search": "<path d=\"m21 21-4.34-4.34\"/><circle cx=\"11\" cy=\"11\" r=\"8\"/>",
    "search-x": "<path d=\"m13.5 8.5-5 5\"/><path d=\"m8.5 8.5 5 5\"/><circle cx=\"11\" cy=\"11\" r=\"8\"/><path d=\"m21 21-4.3-4.3\"/>",
    "send": "<path d=\"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z\"/><path d=\"m21.854 2.147-10.94 10.939\"/>",
    "shopping-bag": "<path d=\"M16 10a4 4 0 0 1-8 0\"/><path d=\"M3.103 6.034h17.794\"/><path d=\"M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z\"/>",
    "sparkles": "<path d=\"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z\"/><path d=\"M20 2v4\"/><path d=\"M22 4h-4\"/><circle cx=\"4\" cy=\"20\" r=\"2\"/>",
    "store": "<path d=\"M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5\"/><path d=\"M17.774 10.31a1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.451 0 1.12 1.12 0 0 0-1.548 0 2.5 2.5 0 0 1-3.452 0 1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.77-3.248l2.889-4.184A2 2 0 0 1 7 2h10a2 2 0 0 1 1.653.873l2.895 4.192a2.5 2.5 0 0 1-3.774 3.244\"/><path d=\"M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05\"/>",
    "sun": "<circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 2v2\"/><path d=\"M12 20v2\"/><path d=\"m4.93 4.93 1.41 1.41\"/><path d=\"m17.66 17.66 1.41 1.41\"/><path d=\"M2 12h2\"/><path d=\"M20 12h2\"/><path d=\"m6.34 17.66-1.41 1.41\"/><path d=\"m19.07 4.93-1.41 1.41\"/>",
    "timer": "<line x1=\"10\" x2=\"14\" y1=\"2\" y2=\"2\"/><line x1=\"12\" x2=\"15\" y1=\"14\" y2=\"11\"/><circle cx=\"12\" cy=\"14\" r=\"8\"/>",
    "trash-2": "<path d=\"M10 11v6\"/><path d=\"M14 11v6\"/><path d=\"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6\"/><path d=\"M3 6h18\"/><path d=\"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\"/>",
    "utensils": "<path d=\"M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2\"/><path d=\"M7 2v20\"/><path d=\"M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7\"/>",
    "x": "<path d=\"M18 6 6 18\"/><path d=\"m6 6 12 12\"/>"
  };

  /* Replaces every <i data-lucide="name"> with its inline SVG. Call it after each DOM update that adds icons. */
  function refreshIcons() {
    document.querySelectorAll('i[data-lucide]').forEach((el) => {
      const name = el.getAttribute('data-lucide');
      const inner = SVG_ICONS[name];
      if (!inner) return;
      const holder = document.createElement('div');
      holder.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + '</svg>';
      const svg = holder.firstChild;
      Array.from(el.attributes).forEach((attr) => {
        if (attr.name !== 'data-lucide' && attr.name !== 'class') svg.setAttribute(attr.name, attr.value);
      });
      const cls = el.getAttribute('class');
      svg.setAttribute('class', 'lucide lucide-' + name + (cls ? ' ' + cls : ''));
      el.replaceWith(svg);
    });
  }

  /* ---------- Allergens ---------- */
  /* @allergen-data:start */
  /* Icon files: Assets/Images/Icon/allergens/<key>.png (128x128, transparent).
     The order of this object is the display order everywhere.
     An allergen list of [] means "no allergens known"; null means "no data yet, ask the staff". */
  const ALLERGEN_ICON_DIR = 'Assets/Images/Icon/allergens/';
  const ALLERGENS = {
    vis: { label: 'Vis', detail: 'Bevat vis of visproducten, zoals vissaus, surimi of visrogge.' },
    eieren: { label: 'Eieren', detail: 'Bevat ei, bijvoorbeeld in beslag, mayonaise of tamago.' },
    schaaldieren: { label: 'Schaaldieren', detail: 'Bevat schaaldieren, zoals scampi, ebi of krab.' },
    gluten: { label: 'Gluten', detail: 'Bevat tarwe, onder meer in beslag, panko en sauzen zoals sojasaus en teriyaki.' },
    mosterd: { label: 'Mosterd', detail: 'Bevat mosterd, bijvoorbeeld in pikante mayonaise en sauzen.' },
    weekdieren: { label: 'Weekdieren', detail: 'Bevat weekdieren, zoals schelpdieren of inktvis.' },
    sesam: { label: 'Sesam', detail: 'Bevat sesamzaad of sesamolie, bijvoorbeeld als topping of in dressings.' },
    lupine: { label: 'Lupine', detail: 'Bevat lupine of lupinemeel.' },
    pindas: { label: "Pinda's", detail: "Bevat pinda's, bijvoorbeeld in Pad Thai." },
    melk: { label: 'Melk', detail: 'Bevat melk of melkproducten, zoals Philadelphia roomkaas of room.' },
    noten: { label: 'Noten', detail: 'Bevat noten, zoals walnoten of cashewnoten.' },
    selderij: { label: 'Selderij', detail: 'Bevat selderij, bijvoorbeeld in bouillon en soepen.' },
    sulfieten: { label: 'Sulfieten', detail: 'Bevat sulfieten (SO\u2082), bijvoorbeeld in sauzen of gedroogde ingrediënten.' },
    mais: { label: 'Maïs', detail: 'Bevat maïs of maïsproducten.' },
    soja: { label: 'Soja', detail: 'Bevat soja, bijvoorbeeld in sojasaus, teriyakisaus en tofu.' },
    paddenstoelen: { label: 'Paddenstoelen', detail: 'Bevat paddenstoelen, zoals champignons of shiitake.' }
  };
  const ALLERGEN_ORDER = Object.keys(ALLERGENS);
  const ALLERGEN_MIX_BOOT = ['vis', 'schaaldieren', 'gluten', 'soja', 'sesam', 'eieren', 'mosterd'];

  /* Dishes with a fixed list, keyed by name (case and accents do not matter). */
  const ALLERGENS_BY_NAME_RAW = {
    /* Voorgerechten */
    'groenten soep': ['soja', 'selderij', 'gluten', 'sesam'],
    'Miso Soep': ['soja', 'gluten', 'vis', 'sesam'],
    'Kip-Soep': ['soja', 'selderij', 'gluten', 'sesam'],
    'Tomyum Soep': ['schaaldieren', 'vis', 'soja', 'selderij'],
    'Kokossoep': ['vis', 'soja', 'selderij'],
    'Wonton Soep': ['gluten', 'soja', 'sesam', 'schaaldieren'],
    'Loempia Kip': ['gluten', 'soja', 'sesam'],
    'Loempia Veggie': ['gluten', 'soja'],
    'Gyoza mix': ['gluten', 'soja', 'sesam', 'schaaldieren'],
    'Gyoza kip': ['gluten', 'soja', 'sesam'],
    'Gyoza varken': ['gluten', 'soja', 'sesam'],
    'Gyoza Scampi': ['gluten', 'schaaldieren', 'soja', 'sesam'],
    'Gyoza mix (12st)': ['gluten', 'soja', 'sesam', 'schaaldieren'],
    'Dim Sum mix': ['gluten', 'schaaldieren', 'soja', 'sesam', 'weekdieren'],
    'Dim Sum Kip': ['gluten', 'soja', 'sesam'],
    'Dim sum varken': ['gluten', 'soja', 'sesam'],
    'Dim sum scampi': ['gluten', 'schaaldieren', 'soja', 'sesam'],
    'Ebi Fry Tempura': ['gluten', 'schaaldieren', 'soja', 'eieren'],
    'Veggie Mix Tempura': ['gluten', 'soja', 'eieren'],
    'Kip Tempura': ['gluten', 'soja', 'eieren'],
    'Tatasuta Kip tempura': ['gluten', 'soja', 'eieren', 'sesam'],
    'Zalm Tempura': ['gluten', 'vis', 'soja', 'eieren'],
    'Yakitori Kip': ['soja', 'gluten', 'sesam'],
    'Edamame': ['soja'],
    'Wakame Salade': ['sesam', 'soja', 'gluten'],
    'Scampi Friti': ['gluten', 'schaaldieren', 'eieren', 'soja'],
    'Crispy chicken': ['gluten', 'eieren', 'soja', 'sesam'],
    'Gefrituurde Surimi': ['gluten', 'vis', 'schaaldieren', 'eieren', 'soja'],
    /* Sushi Combo's */
    'Nigiri Combo 15 Stuks': ['vis', 'schaaldieren', 'gluten', 'soja'],
    'Sashimi Combo 16 Stuks': ['vis', 'gluten', 'soja'],
    'Nigiri BBQ combo 16 stuks': ['vis', 'gluten', 'soja'],
    'Zalm Combo 16 Stuks': ['vis', 'schaaldieren', 'gluten', 'soja', 'sesam'],
    'Tonijn Combo 16 Stuks': ['vis', 'schaaldieren', 'gluten', 'soja', 'sesam'],
    'Zalm Tonijn Combo 16 Stuks': ['vis', 'schaaldieren', 'gluten', 'soja', 'sesam', 'eieren', 'mosterd'],
    'Veggie Mix Combo 24 Stuks': ['eieren', 'gluten', 'soja', 'sesam'],
    'Dai Combo 24 Stuks': ['vis', 'schaaldieren', 'gluten', 'soja'],
    'Merchtem Combo 26 Stuks': ALLERGEN_MIX_BOOT,
    'Gefrituurde Combo 28 Stuks': ['vis', 'schaaldieren', 'gluten', 'soja', 'eieren'],
    'Hoso Combo': ['vis', 'schaaldieren', 'eieren', 'soja'],
    'Sushi Dai combo Special 30 stuks': ALLERGEN_MIX_BOOT,
    /* Extra's, Kinder Menu, Warme gerechten */
    'Extra Gebakken Noedels': ['gluten', 'soja', 'eieren'],
    'Extra Gebakken Rijst': ['gluten', 'soja', 'eieren'],
    'Kippenvleugels': ['gluten', 'soja'],
    'Curry Worst met frietjes': ['gluten', 'eieren', 'soja'],
    'Fish Sticks met Frietjes': ['gluten', 'vis', 'eieren', 'soja'],
    'Kippen vingers': ['gluten', 'eieren', 'soja'],
    'Gebakken eend met noedels of rijst': ['gluten', 'soja', 'sesam'],
    'Kip snitzel met gebakken noedels of rijst': ['gluten', 'eieren', 'soja'],
    'Fish and Chips': ['gluten', 'vis', 'eieren', 'mosterd']
  };
  const ALLERGENS_BY_NAME = {};
  Object.keys(ALLERGENS_BY_NAME_RAW).forEach((name) => {
    ALLERGENS_BY_NAME[norm(name)] = ALLERGENS_BY_NAME_RAW[name];
  });

  /* Ingredient hints read from the dish name and description. */
  const ALLERGEN_PATTERNS = {
    fish: /zalm|tonijn|tuna|paling|zeebaars|surimi|krab|\bvis\b|fish/,
    roe: /masago|tobico|tobiko/,
    shell: /scampi|\bebi\b|krab|garnaal/,
    chicken: /kip|chicken/,
    egg: /tamago|omelet/,
    cream: /philadelphia/,
    bbq: /barbecue|bbq|unagi/,
    spicy: /pikant|spicy|kamikaze/,
    fried: /tempura|crunch|crispy|krispy|gefrituurd/
  };

  /* An ingredient named in the description always adds its allergen. */
  const ALLERGEN_MENTIONS = [
    { key: 'mais', re: /\bmais\b/ },
    { key: 'pindas', re: /pinda/ },
    { key: 'sesam', re: /sesam/ },
    { key: 'noten', re: /walnoot|walnoten|cashew|amandel|hazelnoot|notenmix/ },
    { key: 'melk', re: /philadelphia/ }
  ];

  function allergenFlags(item) {
    const text = norm(item.name + ' ' + item.desc);
    const flags = {};
    Object.keys(ALLERGEN_PATTERNS).forEach((key) => {
      flags[key] = ALLERGEN_PATTERNS[key].test(text);
    });
    return flags;
  }

  const allergenWhen = (condition, list) => (condition ? list : []);

  /* Per category: the base allergens plus the ones the ingredients add. */
  const ALLERGEN_RULES_RAW = {
    'Sashimi': () => ['vis', 'soja', 'gluten'],
    'Nigiri': (f) => (f.egg
      ? ['eieren', 'soja', 'gluten']
      : ['vis', 'soja', 'gluten'].concat(allergenWhen(f.shell, ['schaaldieren']))),
    'Hoso Maki': (f) => [].concat(
      allergenWhen(f.egg, ['eieren', 'soja']),
      allergenWhen(f.fish, ['vis']),
      allergenWhen(f.shell, ['schaaldieren'])
    ),
    'Hand Rolls': (f) => [].concat(
      allergenWhen(f.egg, ['eieren']),
      allergenWhen(f.fish, ['vis', 'soja', 'gluten']),
      allergenWhen(f.shell, ['schaaldieren'])
    ),
    'In Out Rolls': (f) => [].concat(
      ['sesam'],
      allergenWhen(f.chicken, ['gluten', 'soja']),
      allergenWhen(f.fish, ['vis', 'schaaldieren']),
      allergenWhen(f.roe, ['vis']),
      allergenWhen(f.shell, ['schaaldieren']),
      allergenWhen(f.cream, ['melk']),
      allergenWhen(f.egg, ['eieren']),
      allergenWhen(f.bbq, ['gluten', 'soja']),
      allergenWhen(f.spicy, ['eieren', 'mosterd'])
    ),
    'Futomaki Rolls': (f) => [].concat(
      allergenWhen(f.fish || f.roe, ['vis']),
      allergenWhen(f.shell, ['schaaldieren']),
      allergenWhen(f.fried || f.chicken || f.bbq, ['gluten', 'soja']),
      allergenWhen(f.spicy, ['eieren', 'mosterd']),
      allergenWhen(f.egg, ['eieren']),
      allergenWhen(f.cream, ['melk'])
    ),
    'Gefrituurde Rolls': (f) => ['gluten', 'eieren', 'soja'].concat(
      allergenWhen(f.shell, ['schaaldieren']),
      allergenWhen(f.fish, ['vis'])
    ),
    "Chef's Special Rolls": (f) => ['gluten', 'soja', 'eieren', 'mosterd'].concat(
      allergenWhen(f.fish || f.roe, ['vis']),
      allergenWhen(f.shell, ['schaaldieren']),
      allergenWhen(f.cream, ['melk'])
    ),
    'Mix Boot': () => ALLERGEN_MIX_BOOT,
    'Thai Curry': (f) => ['vis', 'soja', 'selderij', 'melk'].concat(allergenWhen(f.shell, ['schaaldieren'])),
    'Teriyaki': (f) => ['soja', 'gluten', 'sesam'].concat(
      allergenWhen(f.fish, ['vis']),
      allergenWhen(f.shell, ['schaaldieren'])
    ),
    'Wok': (f) => ['gluten', 'soja', 'sesam'].concat(allergenWhen(f.shell, ['schaaldieren'])),
    'Pad Thai': (f) => ['gluten', 'soja', 'sesam', 'eieren', 'pindas', 'vis'].concat(allergenWhen(f.shell, ['schaaldieren'])),
    'Poké Bowl': (f) => ['sesam', 'soja', 'gluten'].concat(
      allergenWhen(f.fish || f.roe, ['vis']),
      allergenWhen(f.shell, ['schaaldieren']),
      allergenWhen(f.chicken, ['eieren'])
    ),
    'Udon Noedles': (f) => ['gluten', 'soja', 'sesam'].concat(allergenWhen(f.shell, ['schaaldieren'])),
    'Sushi Sandwich': (f) => [].concat(
      allergenWhen(f.fish, ['vis']),
      allergenWhen(f.shell, ['schaaldieren']),
      allergenWhen(f.egg, ['eieren'])
    ),
    'Gefrituurde Sushi sandwich': (f) => ['gluten', 'eieren', 'soja', 'sesam'].concat(
      allergenWhen(f.fish, ['vis']),
      allergenWhen(f.shell, ['schaaldieren'])
    )
  };
  const ALLERGEN_RULES = {};
  Object.keys(ALLERGEN_RULES_RAW).forEach((category) => {
    ALLERGEN_RULES[norm(category)] = ALLERGEN_RULES_RAW[category];
  });

  /* Returns the allergen keys in display order, [] when none, or null when we have no data. */
  function allergensFor(item, category) {
    let list = ALLERGENS_BY_NAME[norm(item.name)];
    const rule = ALLERGEN_RULES[norm(category)];
    if (!list && rule) list = rule(allergenFlags(item));
    if (!list) return null;
    const text = norm(item.name + ' ' + item.desc);
    const found = list.slice();
    ALLERGEN_MENTIONS.forEach((mention) => {
      if (mention.re.test(text)) found.push(mention.key);
    });
    return ALLERGEN_ORDER.filter((key) => found.indexOf(key) !== -1);
  }
  /* @allergen-data:end */

  function allergenIconSrc(key) {
    return ALLERGEN_ICON_DIR + key + '.png';
  }

  /* Compact row under the dish name: icons only, tooltip on hover, one spoken label for screen readers. */
  function allergenIconsHtml(item) {
    if (!item.allergens || !item.allergens.length) return '';
    const names = item.allergens.map((key) => ALLERGENS[key].label).join(', ');
    return '<div class="allergen-row" role="img" aria-label="' + esc('Bevat: ' + names) + '">' +
      item.allergens.map((key) =>
        '<span class="allergen-chip" data-tip="' + esc('Bevat ' + ALLERGENS[key].label) + '">' +
        '<img src="' + allergenIconSrc(key) + '" width="22" height="22" alt="" loading="lazy" decoding="async" draggable="false">' +
        '</span>'
      ).join('') +
      '</div>';
  }

  /* ---------- Dish detail modal ---------- */
  const dishDetailEl = $('dish-detail');
  const dishDetailOverlay = $('dish-detail-overlay');
  const dishDetailClose = $('dish-detail-close');
  const dishDetailScroll = $('dish-detail-scroll');
  const dishDetailPhoto = $('dish-detail-photo');
  const dishDetailPlaceholder = $('dish-detail-placeholder');
  let dishDetailTrigger = null;

  function isDishDetailOpen() {
    return dishDetailEl.classList.contains('open');
  }

  function allergenDetailHtml(key, index) {
    const allergen = ALLERGENS[key];
    return '<li class="allergen-item" style="--i:' + index + '">' +
      '<img class="allergen-item__icon" src="' + allergenIconSrc(key) + '" width="44" height="44" alt="" decoding="async" draggable="false">' +
      '<div class="allergen-item__text"><strong>' + esc(allergen.label) + '</strong><span>' + esc(allergen.detail) + '</span></div>' +
      '</li>';
  }

  function renderDishAllergens(item) {
    const box = $('dish-detail-allergens');
    if (item.allergens === null) {
      box.innerHTML = '<p class="allergen-note">Voor dit gerecht is nog geen allergeneninformatie beschikbaar. Vraag het ons gerust voor je bestelt.</p>';
    } else if (!item.allergens.length) {
      box.innerHTML = '<p class="allergen-note">Voor dit gerecht zijn geen allergenen vermeld.</p>';
    } else {
      box.innerHTML = '<ul class="allergen-list">' + item.allergens.map(allergenDetailHtml).join('') + '</ul>';
    }
  }

  function showDishPhoto(item) {
    if (item.photo) {
      dishDetailPhoto.src = item.photo;
      dishDetailPhoto.alt = cap(item.name);
      dishDetailPhoto.hidden = false;
      dishDetailPlaceholder.hidden = true;
    } else {
      dishDetailPhoto.removeAttribute('src');
      dishDetailPhoto.alt = '';
      dishDetailPhoto.hidden = true;
      dishDetailPlaceholder.hidden = false;
    }
  }

  function openDishDetail(id, trigger) {
    const item = BY_ID.get(id);
    if (!item) return;
    dishDetailTrigger = trigger || document.activeElement;
    $('dish-detail-cat').textContent = MENU_DATA[item.ci].category;
    $('dish-detail-title').textContent = cap(item.name);
    const desc = $('dish-detail-desc');
    desc.textContent = item.desc;
    desc.hidden = !item.desc;
    $('dish-detail-tags').innerHTML = tagsHtml(item);
    $('dish-detail-price').textContent = eur(item.cents);
    dishDetailId = id;
    dishDetailQty = 1;
    updateDishBuy();
    showDishPhoto(item);
    renderDishAllergens(item);
    refreshIcons();
    dishDetailOverlay.classList.add('open');
    dishDetailEl.classList.add('open');
    document.body.classList.add('locked');
    dishDetailScroll.scrollTop = 0;
    dishDetailClose.focus({ preventScroll: true });
  }

  function closeDishDetail() {
    dishDetailOverlay.classList.remove('open');
    dishDetailEl.classList.remove('open');
    document.body.classList.remove('locked');
    const trigger = dishDetailTrigger;
    dishDetailTrigger = null;
    if (trigger && document.contains(trigger) && typeof trigger.focus === 'function') {
      trigger.focus({ preventScroll: true });
    }
  }

  let dishDetailId = null;
  let dishDetailQty = 1;

  function updateDishBuy() {
    const item = BY_ID.get(dishDetailId);
    if (!item) return;
    $('dish-detail-qty').textContent = String(dishDetailQty);
    $('dish-detail-minus').disabled = dishDetailQty <= 1;
    $('dish-detail-plus').disabled = dishDetailQty >= MAX_QTY;
    $('dish-detail-add-total').textContent = eur(item.cents * dishDetailQty);
  }

  $('dish-detail-minus').addEventListener('click', () => {
    dishDetailQty = Math.max(1, dishDetailQty - 1);
    updateDishBuy();
  });

  $('dish-detail-plus').addEventListener('click', () => {
    dishDetailQty = Math.min(MAX_QTY, dishDetailQty + 1);
    updateDishBuy();
  });

  $('dish-detail-add').addEventListener('click', () => {
    const item = BY_ID.get(dishDetailId);
    if (!item) return;
    setQty(dishDetailId, (state.cart[dishDetailId] || 0) + dishDetailQty);
    toast(dishDetailQty + '× ' + cap(item.name) + ' toegevoegd');
    bumpBadge();
    closeDishDetail();
  });

  function trapDishDetailFocus(e) {
    const nodes = Array.prototype.slice.call(
      dishDetailEl.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
    ).filter((el) => el.getClientRects().length > 0);
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  /* ---------- Menu data index ---------- */
  const ITEMS = [];
  const BY_ID = new Map();
  const CAT_INDEX = new Map();

  MENU_DATA.forEach((cat, ci) => {
    CAT_INDEX.set(cat.category, ci);
    cat.items.forEach((raw, ii) => {
      const tags = Array.isArray(raw.tags) ? raw.tags : [];
      const item = {
        id: 'c' + ci + '-i' + ii,
        ci: ci,
        name: raw.name,
        desc: raw.desc || '',
        cents: Math.round(Number(raw.price) * 100),
        veg: tags.indexOf('vegetarian') !== -1,
        spicy: tags.indexOf('spicy') !== -1,
        photo: typeof raw.photo === 'string' ? raw.photo : ''
      };
      item.allergens = allergensFor(item, cat.category);
      item.haystack = norm([item.name, item.desc, cat.category, item.veg ? 'vegetarisch' : '', item.spicy ? 'pikant' : ''].join(' '));
      ITEMS.push(item);
      BY_ID.set(item.id, item);
    });
  });

  /* ---------- State ---------- */
  const state = {
    cat: 'all',
    q: '',
    veg: false,
    spicy: false,
    mode: 'afhalen',
    cart: loadCart()
  };
  let shop = { dow: 0, open: false, text: '', note: '' };
  let lastFocus = null;
  let toastTimer = 0;
  let copyTimer = 0;
  let searchTimer = 0;

  /* ---------- DOM refs ---------- */
  const menuBtn = $('menu-btn');
  const mobileMenu = $('mobile-menu');
  const statusPill = $('status-pill');
  const statusText = $('status-text');
  const searchInput = $('menu-search');
  const vegBtn = $('filter-veg');
  const spicyBtn = $('filter-spicy');
  const catScroller = $('cat-scroller');
  const catPrev = $('cat-prev');
  const catNext = $('cat-next');
  const grid = $('menu-grid');
  const badge = $('cart-count');
  const fab = $('cart-fab');
  const fabTotal = $('fab-total');
  const toastEl = $('toast');
  const overlay = $('cart-overlay');
  const drawer = $('cart-drawer');
  const closeBtn = $('cart-close');
  const cartStatus = $('cart-status');
  const seg = $('mode-seg');
  const segButtons = Array.prototype.slice.call(seg.querySelectorAll('button[data-mode]'));
  const minBox = $('min-progress');
  const minText = $('min-text');
  const minTrack = $('min-track');
  const minBar = $('min-bar');
  const emptyBox = $('cart-empty');
  const browseBtn = $('cart-browse');
  const cartItems = $('cart-items');
  const clearBtn = $('cart-clear');
  const form = $('cart-form');
  const nameInput = $('f-name');
  const phoneInput = $('f-phone');
  const addressWrap = $('f-address-wrap');
  const addressInput = $('f-address');
  const noteInput = $('f-note');
  const boatNotice = $('boat-notice');
  const cartError = $('cart-error');
  const subtotalEl = $('cart-subtotal');
  const submitBtn = $('cart-submit');
  const submitLabel = $('cart-submit-label');
  const viewCart = $('view-cart');
  const viewSummary = $('view-summary');
  const summaryBack = $('summary-back');
  const summaryText = $('summary-text');
  const copyBtn = $('summary-copy');
  const copyLabel = $('summary-copy-label');
  const summaryMail = $('summary-mail');

  /* ---------- Cart storage ---------- */
  function loadCart() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      const out = {};
      if (!parsed || typeof parsed !== 'object') return out;
      Object.keys(parsed).forEach((id) => {
        const qty = Number(parsed[id]);
        if (BY_ID.has(id) && Number.isInteger(qty) && qty > 0) {
          out[id] = Math.min(qty, MAX_QTY);
        }
      });
      return out;
    } catch (err) {
      return {};
    }
  }

  function saveCart() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.cart));
    } catch (err) {
      /* Storage can be blocked (private mode); the cart still works in memory. */
    }
  }

  /* ---------- Toast ---------- */
  function toast(message) {
    toastEl.textContent = message;
    toastEl.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toastEl.classList.remove('show'), TOAST_MS);
  }

  /* ---------- Opening hours ---------- */
  function brusselsNow() {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: TIME_ZONE,
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23'
    }).formatToParts(new Date());
    const get = (type) => {
      const part = parts.find((p) => p.type === type);
      return part ? part.value : '';
    };
    const dow = WEEKDAY_INDEX[get('weekday').slice(0, 3)];
    return {
      dow: typeof dow === 'number' ? dow : 0,
      minutes: Number(get('hour')) * 60 + Number(get('minute'))
    };
  }

  function isOpenDay(dow) {
    return dow !== CLOSED_WEEKDAY;
  }

  function computeShop() {
    const now = brusselsNow();
    if (isOpenDay(now.dow) && now.minutes >= OPEN_MINUTES && now.minutes < CLOSE_MINUTES) {
      return { dow: now.dow, open: true, text: 'Nu open · tot ' + hm(CLOSE_MINUTES), note: '' };
    }
    let when = 'morgen';
    if (isOpenDay(now.dow) && now.minutes < OPEN_MINUTES) {
      when = 'vandaag';
    } else {
      for (let d = 1; d <= 7; d += 1) {
        const next = (now.dow + d) % 7;
        if (isOpenDay(next)) {
          when = d === 1 ? 'morgen' : DAY_NAMES[next];
          break;
        }
      }
    }
    const opens = 'opent ' + when + ' om ' + hm(OPEN_MINUTES);
    return {
      dow: now.dow,
      open: false,
      text: 'Gesloten · ' + opens,
      note: 'Sushi Dai is nu gesloten en ' + opens + '. Je kunt je mandje alvast samenstellen.'
    };
  }

  function updateStatus() {
    shop = computeShop();
    statusPill.className = 'status ' + (shop.open ? 'open' : 'closed');
    statusText.textContent = shop.text;
    document.querySelectorAll('#hours-list .hours-row[data-dow]').forEach((row) => {
      row.classList.toggle('today', Number(row.dataset.dow) === shop.dow);
    });
    cartStatus.textContent = shop.note;
    cartStatus.hidden = !shop.note;
  }

  /* ---------- Menu rendering ---------- */
  function tagsHtml(item) {
    const tags = [];
    if (item.veg) {
      tags.push('<span class="tag tag-veg"><i data-lucide="leaf" class="h-3 w-3"></i>Vegetarisch</span>');
    }
    if (item.spicy) {
      tags.push('<span class="tag tag-spicy"><i data-lucide="flame" class="h-3 w-3"></i>Pikant</span>');
    }
    return tags.length ? '<div class="mt-3 flex flex-wrap gap-1.5">' + tags.join('') + '</div>' : '';
  }

  function stepperHtml(id, qty, safeName) {
    return '<div class="stepper" role="group" aria-label="Aantal ' + safeName + '">' +
      '<button type="button" data-act="dec" data-id="' + id + '" aria-label="Minder ' + safeName + '"><i data-lucide="minus" class="h-4 w-4"></i></button>' +
      '<span aria-live="polite">' + qty + '</span>' +
      '<button type="button" data-act="inc" data-id="' + id + '" aria-label="Meer ' + safeName + '"><i data-lucide="plus" class="h-4 w-4"></i></button>' +
      '</div>';
  }

  /* Inline SVGs for the dish control, so it needs no icon font or extra request. */
  const QTY_SVG = 'width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true" focusable="false"';
  const QTY_ICONS = {
    plus: '<svg ' + QTY_SVG + '><path d="M12 5v14M5 12h14"/></svg>',
    minus: '<svg ' + QTY_SVG + '><path d="M5 12h14"/></svg>',
    gyoza: '<img src="Assets/Images/Icon/Sushicon-128.png" width="30" height="30" alt="" decoding="async" draggable="false">'
  };

  /* One markup for every state: data-qty="0" is the round button, anything else is the "− n +" pill.
     The number never renders "0", so no ghost text is left while the pill collapses. */
  function controlHtml(id) {
    const item = BY_ID.get(id);
    const qty = state.cart[id] || 0;
    const safeName = esc(cap(item.name));
    const off = qty ? '' : ' disabled';
    return '<div class="qty" data-qty="' + qty + '">' +
      '<div class="qty__pill">' +
      '<div class="qty__row" role="group" aria-label="Aantal ' + safeName + '">' +
      '<button type="button" class="qty__side" data-act="dec" data-id="' + id + '" aria-label="Minder ' + safeName + '"' + off + '>' + QTY_ICONS.minus + '</button>' +
      '<span class="qty__num" aria-live="polite">' + (qty || 1) + '</span>' +
      '<button type="button" class="qty__side" data-act="inc" data-id="' + id + '" aria-label="Meer ' + safeName + '"' + off + '>' + QTY_ICONS.plus + '</button>' +
      '</div>' +
      '<span class="qty__gyoza" aria-hidden="true">' + QTY_ICONS.gyoza + '</span>' +
      '<button type="button" class="qty__add" data-act="add" data-id="' + id + '" aria-label="Voeg ' + safeName + ' toe aan je mandje"' + (qty ? ' disabled' : '') + '>' + QTY_ICONS.plus + '</button>' +
      '</div>' +
      '</div>';
  }

  function itemHtml(item) {
    return '<li class="dish-card lift glass-soft flex flex-col justify-between gap-4 rounded-3xl p-5" data-dish="' + item.id + '">' +
      '<div>' +
      '<h4 class="text-base font-semibold leading-snug"><button type="button" class="dish-open" data-act="detail" data-id="' + item.id + '" aria-haspopup="dialog">' + esc(cap(item.name)) + '</button></h4>' +
      (item.desc ? '<p class="mt-1 text-sm leading-relaxed text-muted">' + esc(item.desc) + '</p>' : '') +
      tagsHtml(item) +
      '</div>' +
      '<div class="flex items-center justify-between gap-3">' +
      '<span class="dish-card-price">' + eur(item.cents) + '</span>' +
      '<div class="flex min-h-[42px] items-center" data-ctl="' + item.id + '">' + controlHtml(item.id) + '</div>' +
      '</div>' +
      '</li>';
  }

  function categoryMetaHtml(cat) {
    const desc = (cat.category_desc || '').trim();
    if (!desc) return '';
    if (desc.length <= 12) {
      return '<span class="badge">' + esc(cap(desc.toLowerCase())) + '</span>';
    }
    return '<p class="w-full text-sm text-muted">' + esc(desc) + '</p>';
  }

  function sectionHtml(ci, items) {
    const cat = MENU_DATA[ci];
    return '<section class="mb-12" aria-labelledby="cat-' + ci + '">' +
      '<div class="mb-5 flex flex-wrap items-center gap-x-3 gap-y-1">' +
      '<h3 id="cat-' + ci + '" class="text-2xl font-semibold tracking-tight">' + esc(cat.category) + '</h3>' +
      categoryMetaHtml(cat) +
      '</div>' +
      '<ul class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">' + items.map(itemHtml).join('') + '</ul>' +
      '</section>';
  }

  function emptyHtml() {
    return '<div class="glass-soft mx-auto max-w-md rounded-3xl px-6 py-12 text-center">' +
      '<span class="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white/10"><i data-lucide="search-x" class="h-6 w-6 text-muted"></i></span>' +
      '<p class="mt-4 text-lg font-semibold">Geen gerechten gevonden</p>' +
      '<p class="mt-1 text-sm text-muted">Pas je zoekopdracht of filters aan.</p>' +
      '<button type="button" data-act="reset" class="btn btn-glass btn-sm press mt-5">Filters wissen</button>' +
      '</div>';
  }

  function visibleItems() {
    const tokens = norm(state.q.trim()).split(/\s+/).filter(Boolean);
    const dietFilter = state.veg || state.spicy;
    return ITEMS.filter((item) => {
      if (state.cat !== 'all' && String(item.ci) !== state.cat) return false;
      /* Both diet chips active shows dishes that match either one. */
      if (dietFilter && !((state.veg && item.veg) || (state.spicy && item.spicy))) return false;
      return tokens.every((token) => item.haystack.indexOf(token) !== -1);
    });
  }

  function renderMenu() {
    const list = visibleItems();
    const groups = new Map();
    list.forEach((item) => {
      if (!groups.has(item.ci)) groups.set(item.ci, []);
      groups.get(item.ci).push(item);
    });
    let html = '';
    groups.forEach((items, ci) => {
      html += sectionHtml(ci, items);
    });
    grid.innerHTML = list.length ? html : emptyHtml();

    refreshIcons();
  }

  /* Restart a CSS animation class on an element. */
  function replay(el, cls) {
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
  }

  /* Update the existing control in place, so its CSS transitions and keyframes can play.
     0 -> 1 runs the poppy open, n -> n+1 bumps the number, 1 -> 0 collapses back to the round button. */
  function updateQtyControl(holder, id) {
    const root = holder.querySelector('.qty');
    if (!root) {
      holder.innerHTML = controlHtml(id);
      return;
    }
    const prev = Number(root.dataset.qty) || 0;
    const qty = state.cart[id] || 0;
    if (qty === prev) return;

    const num = root.querySelector('.qty__num');
    root.dataset.qty = String(qty);
    root.querySelector('[data-act="add"]').disabled = qty > 0;
    root.querySelector('[data-act="dec"]').disabled = qty === 0;
    root.querySelector('[data-act="inc"]').disabled = qty === 0;

    if (qty === 0) {
      /* Keep the last number while the row fades out (it is hidden), so "0" never flashes. */
      root.classList.remove('is-opening');
    } else {
      num.textContent = String(qty);
      if (prev === 0) replay(root, 'is-opening');
      else if (qty > prev) replay(num, 'is-bump');
    }
  }

  /* Update only the add/stepper controls so the grid does not re-render on each tap. */
  function syncControls(id) {
    document.querySelectorAll('[data-ctl="' + id + '"]').forEach((holder) => {
      updateQtyControl(holder, id);
    });
  }

  function syncAllControls() {
    document.querySelectorAll('[data-ctl]').forEach((holder) => {
      holder.innerHTML = controlHtml(holder.getAttribute('data-ctl'));
    });
  }

  /* ---------- Category cards ---------- */
  const IMAGE_DIR = 'Assets/Images/';
  /* Real filenames in Assets/Images. A browser cannot list a folder, so keep this list in sync with the folder. */
  const IMAGE_FILES = [
    'Chefs special rolls.webp', "Extra's.webp", 'Futomaki rolls.webp', 'Gefrituurde rolls.webp',
    'Gefrituurde Sushi Sandwich.webp', 'Hand Rolls.webp', 'Hoso Maki.webp', 'In Out Rolls.webp',
    'Kinder Menu.webp', 'Mix Boot.webp', 'Nigiri.webp', 'Pad Thai.webp', 'Poke Bowl.webp', 'sashimi.webp',
    'Sushi Combos.webp', 'Sushi Sandwich.webp', 'Teriyaki.webp', 'Thai Curry.webp', 'Udon Noodles.webp',
    'voorgerechten.webp', 'Warme Gerechten.webp', 'Wok.webp'
  ];
  /* Category slugs whose photo is named differently (menu says "Noedles", file says "Noodles"). */
  const IMAGE_ALIASES = { udonnoedles: 'udonnoodles' };
  const HUE_BASE = 8;
  const HUE_STEP = 7;
  const HUE_STEPS = 6;
  const NAV_EDGE_PX = 4;
  const SCROLL_PAGE_RATIO = 0.8;
  const DRAG_THRESHOLD_PX = 5;
  const IMAGE_BY_SLUG = new Map();

  function slug(value) {
    return norm(value).replace(/[^a-z0-9]+/g, '');
  }

  IMAGE_FILES.forEach((file) => {
    IMAGE_BY_SLUG.set(slug(file.replace(/\.[^.]+$/, '')), file);
  });

  function imageFor(categoryName) {
    const key = slug(categoryName);
    return IMAGE_BY_SLUG.get(key) || IMAGE_BY_SLUG.get(IMAGE_ALIASES[key]) || '';
  }

  function categoryCardHtml(cat, ci) {
    const file = imageFor(cat.category);
    const hue = (HUE_BASE + (ci % HUE_STEPS) * HUE_STEP) % 360;
    const img = file
      ? '<img class="cat-img" src="' + esc(IMAGE_DIR + encodeURIComponent(file)) + '" alt="" loading="lazy" decoding="async" draggable="false">'
      : '';
    return '<button type="button" class="cat-card' + (file ? '' : ' no-img') + '" data-cat="' + ci + '" aria-pressed="false" style="--h:' + hue + '">' +
      img +
      '<i data-lucide="utensils" class="cat-fallback h-5 w-5" aria-hidden="true"></i>' +
      '<span class="cat-title">' + esc(cat.category) + '</span>' +
      '</button>';
  }

  function buildCategoryCards() {
    /* The error event does not bubble, so listen in the capture phase before the images are inserted. */
    catScroller.addEventListener('error', (e) => {
      const img = e.target;
      if (!img || !img.classList || !img.classList.contains('cat-img')) return;
      const card = img.closest('.cat-card');
      if (card) card.classList.add('no-img');
      img.remove();
    }, true);

    let html = '<button type="button" class="cat-card cat-card--all" data-cat="all" aria-pressed="true">' +
      '<i data-lucide="layout-grid" class="cat-all-icon h-6 w-6" aria-hidden="true"></i>' +
      '<span class="cat-title">Alles</span>' +
      '</button>';
    MENU_DATA.forEach((cat, ci) => {
      html += categoryCardHtml(cat, ci);
    });
    catScroller.innerHTML = html;
    updateCategoryNav();
  }

  function updateCategoryNav() {
    const max = catScroller.scrollWidth - catScroller.clientWidth;
    catPrev.hidden = catScroller.scrollLeft <= NAV_EDGE_PX;
    catNext.hidden = catScroller.scrollLeft >= max - NAV_EDGE_PX;
  }

  function scrollCategories(direction) {
    catScroller.scrollBy({
      left: direction * catScroller.clientWidth * SCROLL_PAGE_RATIO,
      behavior: reduceMotion ? 'auto' : 'smooth'
    });
  }

  function updateCategoryCards(scrollIntoView) {
    catScroller.querySelectorAll('.cat-card').forEach((card) => {
      card.setAttribute('aria-pressed', String(card.dataset.cat === state.cat));
    });
    if (scrollIntoView) {
      const active = catScroller.querySelector('.cat-card[aria-pressed="true"]');
      if (active) {
        const left = active.offsetLeft - (catScroller.clientWidth - active.offsetWidth) / 2;
        catScroller.scrollTo({ left: Math.max(0, left), behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    }
  }

  function setCategory(value) {
    state.cat = value;
    updateCategoryCards(true);
    renderMenu();
  }

  function resetFilters() {
    state.q = '';
    state.veg = false;
    state.spicy = false;
    state.cat = 'all';
    searchInput.value = '';
    vegBtn.setAttribute('aria-pressed', 'false');
    spicyBtn.setAttribute('aria-pressed', 'false');
    updateCategoryCards(true);
    renderMenu();
  }

  function initCategoryScroller() {
    let drag = null;
    let dragged = false;

    catScroller.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      drag = { x: e.clientX, left: catScroller.scrollLeft };
      dragged = false;
    });

    window.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      if (!dragged && Math.abs(dx) > DRAG_THRESHOLD_PX) {
        dragged = true;
        catScroller.classList.add('dragging');
      }
      if (dragged) catScroller.scrollLeft = drag.left - dx;
    });

    const end = () => {
      if (!drag) return;
      drag = null;
      catScroller.classList.remove('dragging');
      /* Keep the flag set until the click that follows the drag has been ignored. */
      window.setTimeout(() => { dragged = false; }, 0);
    };
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);

    catScroller.addEventListener('click', (e) => {
      const card = e.target.closest('.cat-card');
      if (!card || dragged) return;
      setCategory(card.dataset.cat);
    });

    catScroller.addEventListener('scroll', updateCategoryNav, { passive: true });
    catPrev.addEventListener('click', () => scrollCategories(-1));
    catNext.addEventListener('click', () => scrollCategories(1));
    window.addEventListener('resize', updateCategoryNav);
  }

  /* ---------- Cart logic ---------- */
  function cartLines() {
    return ITEMS
      .filter((item) => state.cart[item.id])
      .map((item) => ({ item: item, qty: state.cart[item.id], total: item.cents * state.cart[item.id] }));
  }

  function lineHtml(line) {
    const safeName = esc(cap(line.item.name));
    return '<li class="flex items-start gap-3 rounded-2xl bg-white/5 p-3 ring-1 ring-white/10" data-id="' + line.item.id + '">' +
      '<div class="min-w-0 flex-1">' +
      '<p class="text-sm font-semibold leading-snug">' + safeName + '</p>' +
      '<p class="mt-0.5 text-xs text-muted">à ' + eur(line.item.cents) + '</p>' +
      '</div>' +
      '<div class="flex flex-col items-end gap-2">' +
      '<span class="text-sm font-semibold tabular-nums">' + eur(line.total) + '</span>' +
      stepperHtml(line.item.id, line.qty, safeName) +
      '</div>' +
      '</li>';
  }

  function isDrawerOpen() {
    return drawer.classList.contains('open');
  }

  function renderCart() {
    const lines = cartLines();
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = lines.reduce((n, l) => n + l.total, 0);
    const delivery = state.mode === 'levering';

    badge.textContent = String(count);
    badge.dataset.n = String(count);
    fabTotal.textContent = eur(subtotal);
    fab.classList.toggle('show', count > 0 && !isDrawerOpen());

    emptyBox.hidden = count > 0;
    clearBtn.hidden = count === 0;
    cartItems.innerHTML = lines.map(lineHtml).join('');

    seg.dataset.mode = state.mode;
    segButtons.forEach((btn) => btn.setAttribute('aria-pressed', String(btn.dataset.mode === state.mode)));
    addressWrap.hidden = !delivery;

    minBox.hidden = !delivery;
    if (delivery) {
      const missing = Math.max(0, MIN_DELIVERY_CENTS - subtotal);
      const pct = Math.min(100, Math.round((subtotal / MIN_DELIVERY_CENTS) * 100));
      minText.textContent = missing > 0
        ? 'Nog ' + eur(missing) + ' te gaan voor levering (minimum ' + eur(MIN_DELIVERY_CENTS) + ' in 1785 Merchtem).'
        : 'Minimum bereikt. Je bestelling kan geleverd worden in 1785 Merchtem.';
      minBar.style.width = pct + '%';
      minTrack.classList.toggle('done', missing === 0);
      minTrack.setAttribute('aria-valuenow', String(pct));
    }

    const hasBoat = lines.some((l) => MENU_DATA[l.item.ci].category === 'Mix Boot');
    boatNotice.hidden = !(delivery && hasBoat);

    subtotalEl.textContent = eur(subtotal);
    const belowMin = delivery && subtotal < MIN_DELIVERY_CENTS;
    submitBtn.disabled = count === 0 || belowMin;
    if (count === 0) {
      submitLabel.textContent = 'Je mandje is leeg';
    } else if (belowMin) {
      submitLabel.textContent = 'Minimaal ' + eur(MIN_DELIVERY_CENTS) + ' voor levering';
    } else {
      submitLabel.textContent = 'Bestelling afronden';
    }

    refreshIcons();
  }

  function setQty(id, qty) {
    const next = Math.max(0, Math.min(MAX_QTY, qty));
    if (next === 0) {
      delete state.cart[id];
    } else {
      state.cart[id] = next;
    }
    saveCart();
    syncControls(id);
    renderCart();
  }

  function bumpBadge() {
    badge.classList.remove('bump');
    void badge.offsetWidth;
    badge.classList.add('bump');
  }

  function restoreFocus(scope, id, act) {
    const holder = scope === grid
      ? grid.querySelector('[data-ctl="' + id + '"]')
      : cartItems.querySelector('li[data-id="' + id + '"]');
    /* Skip disabled buttons: the dish control disables whichever side is hidden. */
    let target = holder && (
      holder.querySelector('[data-act="' + act + '"]:not(:disabled)') ||
      holder.querySelector('[data-act="inc"]:not(:disabled)') ||
      holder.querySelector('[data-act="add"]:not(:disabled)')
    );
    if (!target && scope === cartItems) {
      target = cartItems.querySelector('[data-act]') || browseBtn;
    }
    if (target) target.focus({ preventScroll: true });
  }

  function changeQty(btn, scope) {
    const id = btn.dataset.id;
    const act = btn.dataset.act;
    const item = BY_ID.get(id);
    if (!item) return;
    const current = state.cart[id] || 0;
    if (act === 'add') {
      setQty(id, current + 1);
      toast(cap(item.name) + ' toegevoegd');
      bumpBadge();
    } else if (act === 'inc') {
      setQty(id, current + 1);
      bumpBadge();
    } else if (act === 'dec') {
      setQty(id, current - 1);
    } else {
      return;
    }
    restoreFocus(scope, id, act);
  }

  function clearCart() {
    state.cart = {};
    saveCart();
    syncAllControls();
    renderCart();
    toast('Mandje geleegd');
  }

  /* ---------- Drawer ---------- */
  function showView(name) {
    viewCart.hidden = name !== 'cart';
    viewSummary.hidden = name !== 'summary';
    if (name === 'summary') {
      summaryBack.focus({ preventScroll: true });
    }
  }

  function openCart() {
    lastFocus = document.activeElement;
    showView('cart');
    overlay.classList.add('open');
    drawer.classList.add('open');
    document.body.classList.add('locked');
    fab.classList.remove('show');
    closeBtn.focus({ preventScroll: true });
  }

  function closeCart() {
    overlay.classList.remove('open');
    drawer.classList.remove('open');
    document.body.classList.remove('locked');
    renderCart();
    if (lastFocus && document.contains(lastFocus) && typeof lastFocus.focus === 'function') {
      lastFocus.focus({ preventScroll: true });
    }
  }

  function trapFocus(e) {
    const nodes = Array.prototype.slice.call(
      drawer.querySelectorAll('a[href], button:not([disabled]), input, textarea, select')
    ).filter((el) => !el.closest('[hidden]') && el.getClientRects().length > 0);
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  /* ---------- Checkout ---------- */
  function showError(message) {
    cartError.textContent = message;
    cartError.hidden = false;
  }

  function hideError() {
    cartError.hidden = true;
    cartError.textContent = '';
  }

  function validateForm() {
    const values = {
      name: nameInput.value.trim(),
      phone: phoneInput.value.trim(),
      address: addressInput.value.trim(),
      note: noteInput.value.trim()
    };
    const problems = [];
    const digits = values.phone.replace(/\D/g, '');

    if (values.name.length < 2) {
      problems.push([nameInput, 'Vul je naam in.']);
    }
    if (!/^\+?[\d\s().\/-]+$/.test(values.phone) || digits.length < 8 || digits.length > 15) {
      problems.push([phoneInput, 'Vul een geldig telefoonnummer in.']);
    }
    if (state.mode === 'levering' && (values.address.length < 5 || !/\d/.test(values.address))) {
      problems.push([addressInput, 'Vul je leveringsadres in met straat en huisnummer.']);
    }

    [nameInput, phoneInput, addressInput].forEach((el) => el.removeAttribute('aria-invalid'));
    problems.forEach((p) => p[0].setAttribute('aria-invalid', 'true'));

    return {
      ok: problems.length === 0,
      values: values,
      first: problems.length ? problems[0][0] : null,
      message: problems.map((p) => p[1]).join(' ')
    };
  }

  function buildSummary(values) {
    const lines = cartLines();
    const subtotal = lines.reduce((n, l) => n + l.total, 0);
    const mode = MODES[state.mode];
    const out = [
      'Bestelling Sushi Dai Merchtem',
      '',
      'Type: ' + mode.label + ' (' + mode.eta + ')',
      'Naam: ' + values.name,
      'Telefoon: ' + values.phone
    ];
    if (state.mode === 'levering') out.push('Leveringsadres: ' + values.address);
    if (values.note) out.push('Opmerking: ' + values.note);
    out.push('', 'Gerechten:');
    lines.forEach((l) => {
      out.push(l.qty + 'x ' + cap(l.item.name) + ' (' + eur(l.item.cents) + ') = ' + eur(l.total));
    });
    out.push('', 'Subtotaal: ' + eur(subtotal));
    return out.join('\n');
  }

  function handleSubmit() {
    if (submitBtn.disabled) return;
    const result = validateForm();
    if (!result.ok) {
      showError(result.message);
      if (result.first) result.first.focus();
      return;
    }
    hideError();
    const text = buildSummary(result.values);
    summaryText.value = text;
    summaryMail.href = 'mailto:' + MAIL +
      '?subject=' + encodeURIComponent('Bestelling Sushi Dai - ' + result.values.name) +
      '&body=' + encodeURIComponent(text.replace(/\n/g, '\r\n'));
    showView('summary');
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        /* Fall through to the legacy copy path. */
      }
    }
    try {
      summaryText.focus();
      summaryText.select();
      summaryText.setSelectionRange(0, text.length);
      return document.execCommand('copy');
    } catch (err) {
      return false;
    }
  }

  /* ---------- Theme ---------- */
  const THEME_KEY = 'sushidai.theme';
  const THEME_COLORS = { dark: '#090A0E', light: '#F5F5F7' };

  function storedTheme() {
    try {
      const value = window.localStorage.getItem(THEME_KEY);
      return value === 'light' || value === 'dark' ? value : null;
    } catch (err) {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      window.localStorage.setItem(THEME_KEY, theme);
    } catch (err) {
      /* Storage can be blocked; the choice then lasts for this visit only. */
    }
  }

  function applyTheme(theme) {
    const light = theme === 'light';
    document.documentElement.setAttribute('data-theme', theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', THEME_COLORS[theme]);
    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
      btn.setAttribute('aria-label', light ? 'Donkere modus inschakelen' : 'Lichte modus inschakelen');
    });
    document.querySelectorAll('[data-theme-label]').forEach((el) => {
      el.textContent = light ? 'Donkere modus' : 'Lichte modus';
    });
  }

  function initTheme() {
    applyTheme(storedTheme() || 'dark');

    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        applyTheme(next);
        saveTheme(next);
      });
    });

    /* New visitors get the dark theme; only an explicit choice (stored) changes it. */
  }

  /* ---------- Mobile menu ---------- */
  function setMobileMenu(open) {
    mobileMenu.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Menu sluiten' : 'Menu openen');
    menuBtn.innerHTML = '<i data-lucide="' + (open ? 'x' : 'menu') + '" class="h-5 w-5"></i>';
    refreshIcons();
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
    els.forEach((el) => io.observe(el));
  }

  /* ---------- Event wiring ---------- */
  function bindEvents() {
    /* Menu search and filters */
    searchInput.addEventListener('input', () => {
      window.clearTimeout(searchTimer);
      searchTimer = window.setTimeout(() => {
        state.q = searchInput.value;
        renderMenu();
      }, SEARCH_DEBOUNCE_MS);
    });

    [vegBtn, spicyBtn].forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.kind === 'veg' ? 'veg' : 'spicy';
        state[key] = !state[key];
        btn.setAttribute('aria-pressed', String(state[key]));
        renderMenu();
      });
    });

    grid.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-act]');
      if (!btn) {
        /* A click on the empty part of a card opens the dish too. */
        const card = e.target.closest('[data-dish]');
        if (!card || e.target.closest('[data-ctl], a, button, input')) return;
        if (String(window.getSelection()).length) return;
        openDishDetail(card.dataset.dish, card.querySelector('.dish-open'));
        return;
      }
      if (btn.dataset.act === 'reset') {
        resetFilters();
        return;
      }
      if (btn.dataset.act === 'detail') {
        openDishDetail(btn.dataset.id, btn);
        return;
      }
      changeQty(btn, grid);
    });

    /* Dish detail modal */
    dishDetailClose.addEventListener('click', closeDishDetail);
    dishDetailOverlay.addEventListener('click', closeDishDetail);
    dishDetailPhoto.addEventListener('error', () => {
      dishDetailPhoto.hidden = true;
      dishDetailPlaceholder.hidden = false;
    });

    /* Cart drawer */
    cartItems.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-act]');
      if (btn) changeQty(btn, cartItems);
    });

    $('nav-cart').addEventListener('click', openCart);
    fab.addEventListener('click', openCart);
    closeBtn.addEventListener('click', closeCart);
    overlay.addEventListener('click', closeCart);
    browseBtn.addEventListener('click', () => {
      closeCart();
      $('kaart').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
    clearBtn.addEventListener('click', clearCart);

    segButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        state.mode = btn.dataset.mode === 'levering' ? 'levering' : 'afhalen';
        hideError();
        renderCart();
      });
    });

    form.addEventListener('input', (e) => {
      if (e.target && e.target.removeAttribute) e.target.removeAttribute('aria-invalid');
      hideError();
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleSubmit();
    });
    submitBtn.addEventListener('click', handleSubmit);
    summaryBack.addEventListener('click', () => showView('cart'));

    copyBtn.addEventListener('click', async () => {
      const ok = await copyText(summaryText.value);
      copyLabel.textContent = ok ? 'Gekopieerd!' : 'Kopiëren mislukt';
      toast(ok ? 'Overzicht gekopieerd' : 'Kopiëren mislukt');
      window.clearTimeout(copyTimer);
      copyTimer = window.setTimeout(() => { copyLabel.textContent = 'Kopieer overzicht'; }, 2000);
    });

    /* Mobile menu */
    menuBtn.addEventListener('click', () => setMobileMenu(mobileMenu.hidden));

    /* Links that jump to a category */
    document.addEventListener('click', (e) => {
      const goto = e.target.closest('[data-goto]');
      if (goto) {
        const index = CAT_INDEX.get(goto.dataset.goto);
        if (index !== undefined) {
          state.q = '';
          state.veg = false;
          state.spicy = false;
          searchInput.value = '';
          vegBtn.setAttribute('aria-pressed', 'false');
          spicyBtn.setAttribute('aria-pressed', 'false');
          state.cat = String(index);
          updateCategoryCards(true);
          renderMenu();
        }
      }
      if (e.target.closest('#mobile-menu a')) {
        setMobileMenu(false);
        return;
      }
      if (!mobileMenu.hidden) {
        const path = e.composedPath ? e.composedPath() : [];
        if (path.indexOf(mobileMenu) === -1 && path.indexOf(menuBtn) === -1) setMobileMenu(false);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (isDishDetailOpen()) {
          closeDishDetail();
        } else if (isDrawerOpen()) {
          closeCart();
        } else if (!mobileMenu.hidden) {
          setMobileMenu(false);
          menuBtn.focus();
        }
      } else if (e.key === 'Tab' && isDishDetailOpen()) {
        trapDishDetailFocus(e);
      } else if (e.key === 'Tab' && isDrawerOpen()) {
        trapFocus(e);
      }
    });

    window.addEventListener('load', () => {
      updateCategoryNav();
      refreshIcons();
    });

    initCategoryScroller();
  }

  /* ---------- Init ---------- */
  function init() {
    initTheme();
    $('year').textContent = String(new Date().getFullYear());

    document.querySelectorAll('[data-from]').forEach((el) => {
      const index = CAT_INDEX.get(el.dataset.from);
      if (index === undefined) return;
      const prices = ITEMS.filter((item) => item.ci === index).map((item) => item.cents);
      if (prices.length) el.textContent = 'Vanaf ' + eur(Math.min.apply(null, prices));
    });

    buildCategoryCards();
    renderMenu();

    updateStatus();
    window.setInterval(updateStatus, STATUS_REFRESH_MS);
    renderCart();
    bindEvents();
    initReveal();
    refreshIcons();
  }

  init();
})();
