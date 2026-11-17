import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imgDir = path.join(__dirname, '..', 'public', 'images');

const files = [
  { src: 'portfolio-bridal.png',   out: 'portfolio-bridal-enhanced.jpg' },
  { src: 'portfolio-classics.png', out: 'portfolio-classics-enhanced.jpg' },
  { src: 'portfolio-family.png',   out: 'portfolio-family-enhanced.jpg' },
];

for (const f of files) {
  const meta = await sharp(path.join(imgDir, f.src)).metadata();
  console.log(`${f.src}: ${meta.width}x${meta.height}`);

  await sharp(path.join(imgDir, f.src))
    .resize(meta.width * 4, meta.height * 4, { kernel: 'lanczos3' })
    .sharpen({ sigma: 2.5, m1: 1.5, m2: 2.0 })
    .jpeg({ quality: 95, mozjpeg: true })
    .toFile(path.join(imgDir, f.out));

  const outMeta = await sharp(path.join(imgDir, f.out)).metadata();
  console.log(`  → ${f.out}: ${outMeta.width}x${outMeta.height}`);
}
console.log('Done!');
