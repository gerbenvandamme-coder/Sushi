const fs = require('fs');
const lines = fs.readFileSync('index.html', 'utf8').split('\n');

console.log('--- route-menu / #kaart / navbar refs in CSS ---');
lines.forEach((l, i) => {
  const n = i + 1;
  if (n <= 903 && /route-menu|#kaart|header|fixed|z-50|top-3|inset-x-3/.test(l)) {
    console.log('L' + n + ': ' + l.trim().slice(0, 200));
  }
});

console.log('--- selectCategory / data-cat click handling ---');
lines.forEach((l, i) => {
  const n = i + 1;
  if (n >= 2540 && n <= 2900 && /data-cat|selectCat|setCategory|aria-pressed|activeCat|filter/.test(l)) {
    console.log('L' + n + ': ' + l.trim().slice(0, 140));
  }
});

console.log('--- #signature / #info section boundaries ---');
lines.forEach((l, i) => {
  const n = i + 1;
  if (/id="(signature|info)"|<\/section>/.test(l) && n >= 1029 && n <= 1160) {
    console.log('L' + n + ': ' + l.trim().slice(0, 160));
  }
});