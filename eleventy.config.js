import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import nunjucks from 'nunjucks';
import { checkShared, loadUnit, loadUH, loadCommon } from './scripts/shared-source.mjs';
const project = path.dirname(fileURLToPath(import.meta.url));
const sourceDir = path.join(project, 'src');
export default function(eleventyConfig) {
const sharedRoot = checkShared();
const sharedDir = path.join(sharedRoot, 'src');
const sharedIncludes = path.join(sharedDir, 'includes');
eleventyConfig.addPlugin(async config => {
const { configurePrivacy } = await import(pathToFileURL(path.join(sharedRoot, 'scripts/unit-site/privacy.mjs')).href);
configurePrivacy(config);
});
const environment = new nunjucks.Environment(new nunjucks.FileSystemLoader([sharedIncludes, sharedDir, path.join(sourceDir, 'includes')], { noCache: true }), { autoescape: false });
eleventyConfig.setLibrary('njk', environment);
const eventDate = createRequire(import.meta.url)(path.join(sharedIncludes, 'layouts/events/event-date.cjs'));
eleventyConfig.addFilter('eventDate', eventDate);
eleventyConfig.addFilter('contactFaculty', people => people.filter(person => person.contactOrder).sort((a, b) => a.contactOrder - b.contactOrder));
eleventyConfig.addFilter('telephone', value => String(value || '').replace(/[^\d+]/g, ''));
eleventyConfig.addFilter('navIconColor', name => {
const palette = { blue: 'var(--color-blue)', gold: 'var(--color-gold)', teal: 'var(--color-teal)', purple: 'var(--color-purple)', gray: 'var(--mid-gray)' };
if (!palette[name]) throw new Error(`Unknown navigation icon color: ${name}`);
return palette[name];
});
eleventyConfig.addGlobalData('common', () => loadCommon());
eleventyConfig.addGlobalData('uh', () => loadUH());
eleventyConfig.addGlobalData('eleventyComputed', {
canonicalUrl: data => (data.site.canonicalSections || []).some(prefix => data.page.url.startsWith(prefix)) ? data.site.url + data.page.url : undefined
});
for (const key of Object.keys(loadUnit())) eleventyConfig.addGlobalData(key, () => loadUnit()[key]);
// Preserve established page variable names while filenames become descriptive.
eleventyConfig.addGlobalData('students', () => loadUnit().graduate_students);
eleventyConfig.addGlobalData('lectures', () => loadUnit().events);
eleventyConfig.setUseGitIgnore(false);
eleventyConfig.addWatchTarget(path.relative(project, sharedDir).split(path.sep).join('/'), { resetConfig: true });
eleventyConfig.addWatchTarget('src/**/*.css');
eleventyConfig.on('eleventy.before', async () => {
checkShared();
// Resolve source-relative assets to copied public paths, including project-prefix-safe CSS URLs.
await build({
absWorkingDir: project,
stdin: {
contents: `@import ${JSON.stringify(path.join(sharedDir, 'css/common.css'))};\n@import "./css/geo.css";`,
resolveDir: sourceDir,
sourcefile: 'department-bundle.css',
loader: 'css'
},
outfile: path.join(project, '_site/geo.css'),
bundle: true,
minify: true,
charset: 'utf8',
logLevel: 'info',
plugins: [{
name: 'copied-public-assets',
setup(builder) {
builder.onResolve({ filter: /.*/ }, args => {
if (args.kind !== 'url-token') return;
if (/^(?:[a-z][a-z\d+.-]*:|\/|#)/i.test(args.path)) return { path: args.path, external: true };
const split = args.path.search(/[?#]/);
const assetPath = split < 0 ? args.path : args.path.slice(0, split);
const suffix = split < 0 ? '' : args.path.slice(split);
const absolute = path.resolve(args.resolveDir, assetPath);
if (!fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) throw new Error(`Missing CSS asset: ${absolute}`);
const owner = [sharedDir, sourceDir].find(root => absolute.startsWith(root + path.sep));
if (!owner) throw new Error(`CSS asset is outside shared and department source: ${absolute}`);
const relative = path.relative(owner, absolute).split(path.sep).join('/');
if (!/^(?:assets|media)\//.test(relative)) throw new Error(`CSS assets must live under assets or media: ${relative}`);
return { path: './' + relative + suffix, external: true };
});
}
}]
});
});
// Publish images/fonts/scripts only; JSON, templates and helper modules stay private to the build.
for (const root of [sharedDir, sourceDir]) {
for (const folder of ['assets', 'media']) {
if (fs.existsSync(path.join(root, folder))) eleventyConfig.addPassthroughCopy({ [path.relative(project, path.join(root, folder)).split(path.sep).join('/')]: folder }, { filter: relative => !/(?:^|[\\/])(?:\.DS_Store|\._[^/]*|README\.md)$/.test(relative) });
}
}
return {
pathPrefix: process.env.SITE_PATH_PREFIX || '/',
dir: { input: 'src', includes: 'includes', layouts: path.relative(sourceDir, sharedIncludes).split(path.sep).join('/'), data: 'data', output: '_site' },
htmlTemplateEngine: 'njk',
markdownTemplateEngine: 'njk',
templateFormats: ['html', 'njk', 'md']
};
}
