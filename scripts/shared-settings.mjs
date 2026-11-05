import { sharedSettings } from './shared-source.mjs';
const settings = sharedSettings();
console.log(`repository=${settings.repository}`);
console.log(`ref=${settings.ref}`);
