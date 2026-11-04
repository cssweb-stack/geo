import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { syncShared } from './scripts/sync-shared.mjs';

const project = path.dirname(fileURLToPath(import.meta.url));
const sourceDir = path.join(project, 'src');

export default function(eleventyConfig) {
const sharedRoot = syncShared();
const eventDate = createRequire(import.meta.url)('./src/_includes/components/event-date.cjs');
eleventyConfig.addFilter('eventDate', eventDate);
eleventyConfig.addFilter('telephone', value => String(value || '').replace(/[^\d+]/g, ''));
eleventyConfig.setUseGitIgnore(false);
eleventyConfig.addWatchTarget(sharedRoot + '/src');
eleventyConfig.addWatchTarget('src/**/*.css');
eleventyConfig.on('eleventy.beforeWatch', () => syncShared());

// Synchronize first, then bundle shared CSS followed by department CSS.
eleventyConfig.on('eleventy.before', async () => {
syncShared();
await build({
absWorkingDir: project,
stdin: {
contents: '@import "./common.css";\n@import "./geo.css";',
resolveDir: sourceDir,
sourcefile: 'department-bundle.css',
loader: 'css'
},
outfile: path.join(project, '_site', 'geo.css'),
bundle: true,
minify: true,
charset: 'utf8',
logLevel: 'info',
plugins: [{
name: 'preserve-copied-assets',
setup(builder) {
builder.onResolve({ filter: /.*/ }, args => {
if (args.kind !== 'url-token') return;
if (/^(?:[a-z][a-z\d+.-]*:|\/|#)/i.test(args.path)) {
return { path: args.path, external: true };
}
const split = args.path.search(/[?#]/);
const assetPath = split < 0 ? args.path : args.path.slice(0, split);
const suffix = split < 0 ? '' : args.path.slice(split);
const relative = path.relative(sourceDir, path.resolve(args.resolveDir, assetPath)).split(path.sep).join('/');
return { path: './' + relative + suffix, external: true };
});
}
}]
});
});

// CSS is generated above. Fonts, icons, scripts, and images are copied.
eleventyConfig.addPassthroughCopy({ 'src/_includes/icons': 'assets/icons' });
eleventyConfig.addPassthroughCopy({ 'src/_media': '_media' });
eleventyConfig.addPassthroughCopy({ 'src/assets': 'assets' });

return {
pathPrefix: process.env.SITE_PATH_PREFIX || '/',
dir: { input: 'src', includes: '_includes', data: '_data', output: '_site' },
htmlTemplateEngine: 'njk',
markdownTemplateEngine: 'njk',
templateFormats: ['html', 'njk', 'md']
};
}
