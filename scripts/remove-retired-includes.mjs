import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sharedSource } from './sync-shared.mjs';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const roots = [path.join(project, 'src'), path.join(sharedSource(), 'src')];
const retired = /{%[-]?\s*include\s+(['"])components\/(?:divider-(?:small|medium|large|white)|space-(?:small|medium|large))\.njk\1\s*[-]?%}/g;
const changes = [];

function scan(directory) {
for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
const target = path.join(directory, entry.name);
if (entry.isSymbolicLink()) continue;
if (entry.isDirectory()) {
scan(target);
continue;
}
if (!entry.isFile() || !/\.(?:html|njk|md)$/.test(entry.name)) continue;
const before = fs.readFileSync(target, 'utf8');
let count = 0;
const after = before.replace(retired, () => {
count++;
return '';
});
if (count) changes.push({ target, before, after, count });
}
}

try {
for (const root of new Set(roots)) {
if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) {
throw new Error(`Source folder not found: ${root}`);
}
scan(root);
}
// Finish reading before changing files; reject concurrent edits.
for (const change of changes) {
if (fs.readFileSync(change.target, 'utf8') !== change.before) {
throw new Error(`File changed during inspection: ${change.target}. Run this cleanup again.`);
}
}
for (const change of changes) {
fs.writeFileSync(change.target, change.after);
console.log(`Removed ${change.count} retired include(s): ${path.relative(project, change.target)}`);
}
console.log(`Complete: ${changes.reduce((sum, change) => sum + change.count, 0)} retired include calls removed from ${changes.length} files.`);
} catch (error) {
console.error(error.message);
process.exitCode = 1;
}
