import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { syncShared } from './sync-shared.mjs';
const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
try {
syncShared();
const root = execFileSync('git', ['rev-parse', '--show-toplevel'], { cwd: project, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
if (fs.realpathSync(root) !== fs.realpathSync(project)) throw new Error('Run this inside the GEO repository root.');
const state = JSON.parse(fs.readFileSync(path.join(project, '.shared-state.json'), 'utf8'));
// Remove only generated shared mirrors from Git's index. Files remain on disk.
execFileSync('git', ['rm', '--cached', '--ignore-unmatch', '--', ...state.files.map(name => 'src/' + name)], { cwd: project, stdio: 'inherit' });
console.log('Shared mirrors are no longer unit-owned Git files. Review the changes in GitHub Desktop before committing.');
} catch (error) { console.error(error.message); process.exitCode = 1; }
