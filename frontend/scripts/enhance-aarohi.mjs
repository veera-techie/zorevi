import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imgDir = path.join(__dirname, '..', 'public', 'images');

const src = path.join(imgDir, 'aarohi-portrait.png');
const out = path.join(imgDir, 'aarohi-portrait-enhanced.jpg');

const meta = await sharp(src).metadata();
console.log(`Source: ${meta.width}x${meta.height}`);

await sharp(src)
  .resize(meta.width * 4, meta.height * 4, { kernel: 'lanczos3' })
  .sharpen({ sigma: 2.5, m1: 1.5, m2: 2.0 })
  .jpeg({ quality: 95, mozjpeg: true })
  .toFile(out);

const outMeta = await sharp(out).metadata();
console.log(`Enhanced: ${outMeta.width}x${outMeta.height} → ${out}`);
