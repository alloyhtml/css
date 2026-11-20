// scss/ -> dist/: the kit and each theme, readable and minified.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { compile } from 'sass';

const files = {
  alloy: 'scss/index.scss',
  'themes/dark': 'scss/themes/dark.scss',
  'themes/midnight': 'scss/themes/midnight.scss',
};

mkdirSync('dist/themes', { recursive: true });
for (const [name, entry] of Object.entries(files)) {
  for (const style of ['expanded', 'compressed']) {
    const { css } = compile(entry, { style, loadPaths: ['scss'] });
    writeFileSync(`dist/${name}${style === 'compressed' ? '.min' : ''}.css`, css + '\n');
  }
}

// The example loads this exact version from jsDelivr, so a new release is a
// new address and no browser keeps showing it an old cached copy ("@1"
// stays cached for up to 7 days).
const { version } = JSON.parse(readFileSync('package.json', 'utf8'));
const example = readFileSync('example.html', 'utf8');
writeFileSync('example.html', example.replace(/@alloyhtml\/css@[^/]+\//g, `@alloyhtml/css@${version}/`));
console.log(`built dist/, example.html on ${version}`);
