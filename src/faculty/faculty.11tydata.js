import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { sharedSource } from '../../scripts/shared-source.mjs';
const { resolveFacultyPerson } = await import(pathToFileURL(path.join(sharedSource(), 'scripts/unit-site/faculty-profiles.mjs')).href);
export default { eleventyComputed: { person: resolveFacultyPerson } };
