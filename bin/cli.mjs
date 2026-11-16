#!/usr/bin/env node
// The package's own command, so npx needs only its name:
//
//   npx @alloyhtml/css skill [--to folder]   copy the Claude skill into this project
//   npx @alloyhtml/css check [paths...]      the same as alloy-check
//
// The skill lands in .claude/skills/alloy-css, where Claude Code finds it.
// It is two plain Markdown files, so any other AI tool can read them too.

import { cpSync, existsSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const [command, ...rest] = process.argv.slice(2);

if (command === 'check') {
  process.argv = [process.argv[0], join(here, 'check.mjs'), ...rest];
  await import('./check.mjs');
} else if (command === 'skill') {
  const toFlag = rest.indexOf('--to');
  const target = toFlag >= 0 && rest[toFlag + 1] ? rest[toFlag + 1] : join('.claude', 'skills', 'alloy-css');
  const replaced = existsSync(target);
  cpSync(join(here, '..', 'ai', 'alloy-css'), target, { recursive: true });
  const shown = relative(process.cwd(), target) || '.';
  console.log(`${replaced ? 'Updated' : 'Added'} the Alloy CSS skill in ${shown}/`);
  console.log('Claude Code uses it from your next session.');
  console.log(`Other AI tools: point your AGENTS.md or rules file at ${shown}/SKILL.md.`);
} else {
  console.log('usage:');
  console.log('  npx @alloyhtml/css skill [--to folder]   add the Claude skill to this project');
  console.log('  npx @alloyhtml/css check [paths...]      list classes the kit does not define');
  process.exit(command ? 1 : 0);
}
