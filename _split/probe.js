const fs = require('fs');
const lines = fs.readFileSync('index.html', 'utf8').split('\n');

console.log('--- url( in CSS ranges (33-765, 778-899) ---');
lines.forEach((l, i) => {
  const n = i + 1;
  if (((n >= 33 && n <= 765) || (n >= 778 && n <= 899)) && /url\(/.test(l)) {
    console.log('L' + n + ': ' + l.trim().slice(0, 200));
  }
});

console.log('--- @import / @font-face in CSS ---');
lines.forEach((l, i) => {
  const n = i + 1;
  if (n <= 903 && /@import|@font-face/.test(l)) console.log('L' + n + ': ' + l.trim().slice(0, 200));
});

console.log('--- inline handlers in HTML (906-1355) ---');
lines.forEach((l, i) => {
  const n = i + 1;
  if (n >= 906 && n <= 1355 && /\son(click|load|error|change|input|submit|keydown)=/i.test(l)) {
    console.log('L' + n + ': ' + l.trim().slice(0, 200));
  }
});

console.log('--- 4-space top level lines in script 1356-3154 ---');
lines.forEach((l, i) => {
  const n = i + 1;
  if (n >= 1356 && n <= 3154 && /^ {4}\S/.test(l)) console.log('L' + n + ': ' + l.trim().slice(0, 120));
});

console.log('--- MENU_DATA usage outside its script ---');
lines.forEach((l, i) => {
  const n = i + 1;
  if ((n < 1356 || n > 3154) && /MENU_DATA/.test(l)) console.log('L' + n + ': ' + l.trim().slice(0, 120));
});

console.log('--- script/style tag lines with attributes ---');
lines.forEach((l, i) => {
  if (/<(script|style)\b[^>]+>/i.test(l)) console.log('L' + (i + 1) + ': ' + l.trim().slice(0, 200));
});

console.log('--- external <script src> ---');
lines.forEach((l, i) => {
  if (/<script[^>]+src=/i.test(l)) console.log('L' + (i + 1) + ': ' + l.trim().slice(0, 200));
});