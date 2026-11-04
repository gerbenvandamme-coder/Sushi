const fs = require('fs');
const vm = require('vm');
const src = fs.readFileSync('js/menu-data.js', 'utf8') + '\n;globalThis.__D = MENU_DATA;';
const ctx = {};
vm.createContext(ctx);
vm.runInContext(src, ctx);
const files = fs.readdirSync('Assets/Images').filter((f) => f.endsWith('.webp'));
const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '');
const bySlug = new Map(files.map((f) => [slug(f.replace(/\.[^.]+$/, '')), f]));
console.log('categories: ' + ctx.__D.length);
ctx.__D.forEach((c, i) => {
  const k = slug(c.category);
  console.log(i + ' ' + c.category + ' -> ' + (bySlug.get(k) || (k === 'udonnoedles' ? 'alias' : 'GEEN FOTO')) + ' (' + (c.items ? c.items.length : '?') + ' items)');
});