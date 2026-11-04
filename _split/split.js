const fs = require('fs');
const path = require('path');

const SRC = 'index.html';
const lines = fs.readFileSync(SRC, 'utf8').split('\n');

function expect(n, re) {
  const l = lines[n - 1];
  if (l === undefined || !re.test(l)) {
    console.error('Mismatch op L' + n + ': ' + JSON.stringify((l || '').slice(0, 90)));
    console.error('Er is niets geschreven.');
    process.exit(1);
  }
}

const STYLE_OPEN = /^\s*<style>\s*$/;
const STYLE_CLOSE = /^\s*<\/style>\s*$/;
const SCRIPT_OPEN = /^\s*<script>\s*$/;
const SCRIPT_CLOSE = /^\s*<\/script>\s*$/;

/* 1. Controleer alle blokgrenzen voordat er iets wordt geschreven. */
expect(33, STYLE_OPEN);   expect(765, STYLE_CLOSE);
expect(778, STYLE_OPEN);  expect(899, STYLE_CLOSE);
expect(900, STYLE_OPEN);  expect(903, STYLE_CLOSE);
expect(1356, SCRIPT_OPEN); expect(3154, SCRIPT_CLOSE);
expect(3155, SCRIPT_OPEN); expect(3492, SCRIPT_CLOSE);
expect(3493, SCRIPT_OPEN); expect(3850, SCRIPT_CLOSE);
expect(3851, SCRIPT_OPEN); expect(4090, SCRIPT_CLOSE);
expect(4091, SCRIPT_OPEN); expect(4117, SCRIPT_CLOSE);
expect(4118, SCRIPT_OPEN); expect(4197, SCRIPT_CLOSE);
expect(1357, /^ {4}const MENU_DATA = \[$/);
expect(1670, /^ {4}\];$/);
expect(1672, /^ {4}\(function \(\) \{$/);
expect(3153, /^ {4}\}\)\(\);$/);

/* 2. Inhoud van een blok (zonder de open- en sluittag). Regelnummers zijn 1-gebaseerd en inclusief. */
function inner(first, last) {
  return lines.slice(first - 1, last);
}

/* Haal de 4 spaties inspringing van de <script>/<style> weg. Bevat het blok een template literal
   (backtick), dan blijft het ongewijzigd, omdat de inspringing daar deel van een string kan zijn. */
function dedent(block) {
  if (block.join('\n').includes('`')) return { block, dedented: false };
  return { block: block.map((l) => (l.startsWith('    ') ? l.slice(4) : l)), dedented: true };
}

const files = [
  { out: 'css/main.css',      first: 34,   last: 764 },
  { out: 'css/scrub.css',     first: 779,  last: 898 },
  { out: 'css/tailwind.css',  first: 901,  last: 902 },
  { out: 'js/menu-data.js',   first: 1357, last: 1670 },
  { out: 'js/app.js',         first: 1672, last: 3153 },
  { out: 'js/scrub.js',       first: 3156, last: 3491 },
  { out: 'js/intro-gate.js',  first: 3494, last: 3849 },
  { out: 'js/smooth-scroll.js', first: 3852, last: 4089 },
  { out: 'js/zoom-lock.js',   first: 4092, last: 4116 },
  { out: 'js/router.js',      first: 4119, last: 4196 }
];

files.forEach((f) => {
  const { block, dedented } = dedent(inner(f.first, f.last));
  fs.mkdirSync(path.dirname(f.out), { recursive: true });
  fs.writeFileSync(f.out, block.join('\n') + '\n', 'utf8');
  console.log('wrote ' + f.out + ' (' + block.length + ' regels, ' + (dedented ? 'ingesprongen -4' : 'inspringing behouden') + ')');
});

/* 3. Vervang de blokken in index.html door <link>/<script defer>. Van onder naar boven, zodat regelnummers kloppen. */
const reps = [
  { s: 33,   e: 765,  out: ['  <link rel="stylesheet" href="css/main.css">'] },
  { s: 778,  e: 899,  out: ['  <link rel="stylesheet" href="css/scrub.css">'] },
  { s: 900,  e: 903,  out: ['  <link rel="stylesheet" href="css/tailwind.css">'] },
  { s: 1356, e: 3154, out: ['  <script defer src="js/menu-data.js"></script>', '  <script defer src="js/app.js"></script>'] },
  { s: 3155, e: 3492, out: ['  <script defer src="js/scrub.js"></script>'] },
  { s: 3493, e: 3850, out: ['  <script defer src="js/intro-gate.js"></script>'] },
  { s: 3851, e: 4090, out: ['  <script defer src="js/smooth-scroll.js"></script>'] },
  { s: 4091, e: 4117, out: ['  <script defer src="js/zoom-lock.js"></script>'] },
  { s: 4118, e: 4197, out: ['  <script defer src="js/router.js"></script>'] }
];
reps.sort((a, b) => b.s - a.s).forEach((r) => {
  lines.splice(r.s - 1, r.e - r.s + 1, ...r.out);
});
fs.writeFileSync(SRC, lines.join('\n'), 'utf8');

/* 4. Rapport */
const out = fs.readFileSync(SRC, 'utf8');
console.log('index.html: ' + out.split('\n').length + ' regels, ' + out.length + ' tekens');
console.log('resterende <style> tags: ' + (out.match(/<style\b/g) || []).length + ' (verwacht 1, de noscript-stijl)');
console.log('resterende inline <script> tags: ' + (out.match(/<script>/g) || []).length + ' (verwacht 2, thema en scrub-on in de head)');
console.log('<script defer src>: ' + (out.match(/<script defer src=/g) || []).length + ' (verwacht 7)');