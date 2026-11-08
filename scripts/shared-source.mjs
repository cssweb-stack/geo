import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export function sharedSettings() {
const config = JSON.parse(fs.readFileSync(path.join(project, 'shared.config.json'), 'utf8'));
if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(config.repository) || !/^[A-Za-z0-9][A-Za-z0-9_./-]*$/.test(config.ref) || typeof config.localPath !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(config.unit)) throw new Error('Invalid shared.config.json settings.');
return config;
}
export function sharedSource() {
return path.resolve(project, process.env.SHARED_SOURCE || sharedSettings().localPath);
}
export function loadUnit() {
const directory = path.join(sharedSource(), 'src/data/units', sharedSettings().unit);
const records = {};
for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
if (entry.isSymbolicLink()) throw new Error(`Unit data cannot be a symbolic link: ${entry.name}`);
if (entry.isFile() && entry.name.endsWith('.json')) records[entry.name.slice(0, -5).replaceAll('-', '_')] = JSON.parse(fs.readFileSync(path.join(directory, entry.name), 'utf8'));
}
if (!records.unit_details?.name || !Array.isArray(records.navigation)) throw new Error('Selected unit requires unit-details.json with a name and navigation.json with an array.');
const common = loadCommon();
records.site = {
...records.unit_details,
...records.site_settings,
search: records.search,
searchProvider: records.search?.provider,
ga4MeasurementId: records.analytics?.ga4MeasurementId || common.analytics?.ga4MeasurementId || "",
googleTagId: records.analytics?.googleTagId || records.analytics?.ga4MeasurementId || common.analytics?.googleTagId || common.analytics?.ga4MeasurementId || "",
analyticsHostnames: records.analytics?.allowedHostnames || common.analytics?.allowedHostnames || [],
searchConsoleVerificationToken: records.search_console?.verificationToken || "",
defaultHero: records.heroes?.defaultHero,
courseResources: [common.links.classAvailability, records.catalog_courses?.catalog, records.catalog_courses?.courseDescriptions].filter(Boolean)
};
for (const id of [common.analytics?.ga4MeasurementId, records.analytics?.ga4MeasurementId]) {
if (id && !/^G-[A-Z0-9]+$/.test(id)) throw new Error('Invalid GA4 measurement ID. Expected G- followed by uppercase letters or digits.');
}
if (records.site.googleTagId && !/^(?:G|GT|GTM)-[A-Z0-9]+$/.test(records.site.googleTagId)) throw new Error('Invalid Google tag ID.');
if (!Array.isArray(records.site.analyticsHostnames) || records.site.analyticsHostnames.some(host => typeof host !== 'string' || !/^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/.test(host))) throw new Error('Analytics allowedHostnames must contain production DNS hostnames.');
if (records.site.googleTagId && !records.site.analyticsHostnames.length) throw new Error('A configured Google tag requires production allowedHostnames.');
if (records.site.searchConsoleVerificationToken && !/^[A-Za-z0-9_-]+$/.test(records.site.searchConsoleVerificationToken)) throw new Error('Invalid Search Console verification token.');
if (records.advising?.people) records.advising = { ...records.advising, people: records.advising.people.map(reference => {
const person = records[reference.source]?.find(person => person.slug === reference.slug);
if (!person) throw new Error(`Unresolved advisor: ${reference.source}/${reference.slug}`);
// Only the requested role and contact details appear in the advising block.
return { name: person.name, photo: person.photo, email: person.email, ...(reference.source === 'faculty' ? { url: records.site.facultyBasePath + person.slug + '.html' } : {}), role: reference.role };
}) };
return records;
}
export function loadCommon() {
const directory = path.join(sharedSource(), 'src/data/common');
return Object.fromEntries(fs.readdirSync(directory).filter(name => name.endsWith('.json')).map(name => [name.slice(0, -5), JSON.parse(fs.readFileSync(path.join(directory, name), 'utf8'))]));
}
export function loadUH() {
const root = path.join(sharedSource(), 'src/data/uh');
return Object.fromEntries(['header', 'footer', 'languages'].map(key => [key, JSON.parse(fs.readFileSync(path.join(root, key + '.json'), 'utf8'))]));
}
function sourceFiles(directory, prefix = '') {
const result = [];
for (const entry of fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
if (entry.name === '.DS_Store' || entry.name.startsWith('._')) continue;
if (entry.isSymbolicLink()) throw new Error(`Shared source cannot contain symbolic links: ${prefix + entry.name}`);
if (entry.isDirectory()) result.push(...sourceFiles(path.join(directory, entry.name), prefix + entry.name + '/'));
else if (entry.isFile()) result.push(prefix + entry.name);
}
return result;
}
export function checkShared() {
const source = sharedSource();
if (source === project || source === path.join(project, 'src') || source.startsWith(path.join(project, 'src') + path.sep)) throw new Error('Shared source must be separate from department src. Use a sibling checkout or the ignored .shared-source checkout used by CI.');
const descriptor = path.join(source, 'shared.json');
if (!fs.existsSync(descriptor)) throw new Error(`Shared repository not found at ${source}. Keep css-shared beside GEO or set SHARED_SOURCE.`);
const definition = JSON.parse(fs.readFileSync(descriptor, 'utf8'));
if (definition.schemaVersion !== 2 || definition.sourceDirectory !== 'src' || definition.includesDirectory !== 'includes' || definition.dataDirectory !== 'data') throw new Error('This department requires the reorganized shared source (schema version 2).');
const sharedDir = path.join(source, 'src');
const files = sourceFiles(sharedDir);
for (const name of ['includes/base.njk', 'css/common.css', 'includes/layouts/branding/footer/footer.njk', 'includes/layouts/events/event-date.cjs']) if (!files.includes(name)) throw new Error(`Incomplete shared source: ${name}`);
loadUnit();
loadUH();
// Shared and local public assets may share a directory, but never a filename.
for (const name of files.filter(name => /^(?:assets|media)\//.test(name) && !name.endsWith('.md'))) {
if (fs.existsSync(path.join(project, 'src', name))) throw new Error(`Shared/local asset collision: ${name}. Use distinct filenames; do not overwrite one source with another.`);
}
for (const name of files.filter(name => name.startsWith('includes/'))) {
if (fs.existsSync(path.join(project, 'src', name))) throw new Error(`Shared/local template collision: ${name}`);
}
const hash = crypto.createHash('sha256');
for (const name of files) { hash.update(name); hash.update('\0'); hash.update(fs.readFileSync(path.join(sharedDir, name))); hash.update('\0'); }
let commit = null;
try { commit = execFileSync('git', ['-C', source, 'rev-parse', 'HEAD'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch {}
const state = JSON.stringify({ schemaVersion: 2, repository: sharedSettings().repository, unit: sharedSettings().unit, commit, contentHash: hash.digest('hex'), mode: 'direct-source', files }, null, 0) + '\n';
const target = path.join(project, '.shared-state.json');
if (!fs.existsSync(target) || fs.readFileSync(target, 'utf8') !== state) fs.writeFileSync(target, state);
return source;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
try { const source = checkShared(); console.log(`Shared source ready: ${source}; unit: ${sharedSettings().unit}. No files copied into src.`); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
