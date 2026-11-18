import { sharedModule } from '../../scripts/shared-bootstrap.mjs';
const { resolveFacultyPerson } = await import(sharedModule('scripts/unit-site/faculty-profiles.mjs'));
export default { eleventyComputed: { person: resolveFacultyPerson } };
