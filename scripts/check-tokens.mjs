// Fails when design values are hard-coded outside the token source.
// Checks src/**/*.{ts,tsx,css} except src/styles/tokens.css (generated).
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const root = process.cwd();
const ALLOWED = new Set([join('src', 'styles', 'tokens.css')]);
const RULES = [
  {
    id: 'hex colour',
    re: /(?<![\w&/-])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b(?![\w-])/g,
  },
  { id: 'rgb()/hsl()/oklch() colour', re: /\b(?:rgba?|hsla?|oklch|oklab|lab|lch|hwb)\(/g },
  {
    id: 'named colour class',
    re: /\b(?:bg|text|border|ring|fill|stroke|outline|from|to|via|shadow|decoration|divide|placeholder|caret|accent)-(?:black|white|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)(?:-\d{2,3})?\b/g,
  },
  {
    id: 'arbitrary colour/size value',
    re: /\b(?:bg|text|border|ring|fill|stroke|outline|shadow|leading|tracking|rounded|font)-\[[^\]]*\]/g,
  },
  { id: 'pixel font size', re: /font-size\s*:\s*[\d.]+px|fontSize\s*:\s*['"]?[\d.]+(?:px)?['"]?/g },
  { id: 'raw line height', re: /line-height\s*:\s*[\d.]+px|lineHeight\s*:\s*['"]?[\d.]+px/g },
  { id: 'raw box-shadow', re: /box-shadow\s*:\s*(?!var\()[^;]*\d/g },
  { id: 'raw border-radius', re: /border-radius\s*:\s*[\d.]+(?:px|rem)/g },
];

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (/\.(tsx?|css)$/.test(name)) acc.push(p);
  }
  return acc;
}

const problems = [];
for (const file of walk(join(root, 'src'))) {
  const rel = relative(root, file);
  if (ALLOWED.has(rel)) continue;
  const lines = readFileSync(file, 'utf8').split(/\r?\n/);
  lines.forEach((line, i) => {
    for (const { id, re } of RULES) {
      re.lastIndex = 0;
      const m = re.exec(line);
      if (m) problems.push(`${rel.split(sep).join('/')}:${i + 1}  ${id}: ${m[0]}`);
    }
  });
}

if (problems.length) {
  console.error(
    `check:tokens found ${problems.length} hard-coded design value(s):\n` + problems.join('\n'),
  );
  console.error('\nUse a token from src/styles/tokens.css (see docs/design-system.md).');
  process.exit(1);
}
console.log('check:tokens: no hard-coded colours, font sizes, radii or shadows.');
