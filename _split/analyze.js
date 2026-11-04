const fs = require('fs');
const src = fs.readFileSync('index.html', 'utf8');
const lines = src.split(/\r?\n/);
console.log('lines:', lines.length, 'chars:', src.length, 'CRLF:', /\r\n/.test(src));

const tagRe = /<\/?(script|style)\b[^>]*>/gi;
lines.forEach((line, i) => {
  let m;
  tagRe.lastIndex = 0;
  while ((m = tagRe.exec(line)) !== null) {
    console.log('L' + (i + 1) + ' col' + m.index + ': ' + m[0].slice(0, 140));
  }
});

console.log('--- structure tags ---');
const structRe = /<(body|main|header|footer|nav|aside|section|dialog|template)\b[^>]*>/gi;
lines.forEach((line, i) => {
  let m;
  structRe.lastIndex = 0;
  while ((m = structRe.exec(line)) !== null) {
    console.log('L' + (i + 1) + ': ' + m[0].slice(0, 170));
  }
});

console.log('--- html comments in body ---');
lines.forEach((line, i) => {
  if (i > 905 && /<!--/.test(line)) console.log('L' + (i + 1) + ': ' + line.trim().slice(0, 120));
});

console.log('--- link/meta/head resources ---');
lines.slice(0, 40).forEach((line, i) => {
  if (/<link|src=|href=/.test(line)) console.log('L' + (i + 1) + ': ' + line.trim().slice(0, 200));
});