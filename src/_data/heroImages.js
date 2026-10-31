import { readdirSync } from "node:fs";
import { join } from "node:path";

// Hero Lab/Gallery only: discover available WebP images at build time.
// PSD, PNG, hidden files, and other source assets are intentionally excluded.
export default function () {
const directory = join(process.cwd(), "src", "_media", "heros");
return readdirSync(directory)
.filter(name => /^[a-z0-9][a-z0-9_-]*\.webp$/i.test(name))
.sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
}
