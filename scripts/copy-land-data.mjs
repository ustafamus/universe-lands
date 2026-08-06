// Copies the world-atlas land outline into public/ so the globe works offline.
import { copyFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const src = resolve(root, 'node_modules/world-atlas/land-110m.json');
const dest = resolve(root, 'public/land-110m.json');

try {
  await mkdir(dirname(dest), { recursive: true });
  await copyFile(src, dest);
  console.log('land-110m.json -> public/');
} catch (err) {
  console.warn('Could not copy land data:', err.message);
}
