/**
 * Optional one-time photo import for GEO graduate students.
 * Run inside the existing project: node scripts/download-student-photos.mjs
 * Only rewrites photo paths after each download succeeds; safe to retry.
 * Requires Node 18+; no npm packages needed.
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const dataFile = path.join(root, 'src/_data/students.json');
const imageDir = path.join(root, '_media/students');
const records = JSON.parse(await fs.readFile(dataFile, 'utf8'));
await fs.mkdir(imageDir, { recursive: true });
let downloaded = 0;
let failed = 0;

for (const student of records) {
    const destination = path.join(imageDir, path.basename(student.localPhoto));
    try {
        let existing = false;
        try {
            existing = (await fs.stat(destination)).size > 0;
        } catch { /* not previously saved */ }
        if (!existing) {
            const response = await fetch(student.photo, {
                signal: AbortSignal.timeout(15000),
                headers: { 'User-Agent': 'Mozilla/5.0 GEO-Web-Archive/1.0' }
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            if (!(response.headers.get('content-type') || '').startsWith('image/')) {
                throw new Error('Response is not an image');
            }
            const buffer = Buffer.from(await response.arrayBuffer());
            if (buffer.length < 100) throw new Error('Image response too small');
            await fs.writeFile(destination, buffer);
        }
        student.photo = student.localPhoto;
        downloaded++;
        console.log(`OK  ${student.name}`);
    } catch (error) {
        failed++;
        console.warn(`SKIP  ${student.name}: ${error.message}`);
    }
}

await fs.writeFile(dataFile, JSON.stringify(records, null, 2) + '\n', 'utf8');
console.log(`Photo import: ${downloaded} local, ${failed} still using live source URLs.`);
