// Generates favicon.ico (16, 32, 48px) with transparent background from icon.svg
import { Resvg } from '@resvg/resvg-js';
import toIco from 'to-ico';
import fs from 'fs';
import path from 'path';

const svgPath = path.join(process.cwd(), 'app/icon.svg');
const svgContent = fs.readFileSync(svgPath, 'utf-8');

const pngs = [16, 32, 48].map(size => {
  const resvg = new Resvg(svgContent, {
    fitTo: { mode: 'width', value: size },
    background: 'rgba(0,0,0,0)',
  });
  return Buffer.from(resvg.render().asPng());
});

const ico = await toIco(pngs);
fs.writeFileSync(path.join(process.cwd(), 'app/favicon.ico'), ico);
console.log('favicon.ico generated (16/32/48px, transparent background)');
