// Render an HTML animation to MP4, frame by frame.
// The page must expose window.seek(t) (seconds) that draws the frame at time t.
// Usage: node scripts/render-html.mjs <page.html> <out.mp4> [seconds=3] [fps=30] [WxH=1280x720]
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { launch } from './browser.mjs';

const [input, output, secs = '3', fpsArg = '30', size = '1280x720'] = process.argv.slice(2);
if (!input || !output) {
  console.error('usage: render-html.mjs <page.html> <out.mp4> [seconds] [fps] [WxH]');
  process.exit(1);
}
const fps = Number(fpsArg);
const [width, height] = size.split('x').map(Number);
const frames = Math.round(Number(secs) * fps);

const browser = await launch();
const page = await browser.newPage({ viewport: { width, height } });
await page.goto(pathToFileURL(resolve(input)).href);
await page.waitForFunction(() => typeof window.seek === 'function');

const ffmpeg = spawn('ffmpeg', [
  '-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
  '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', output,
], { stdio: ['pipe', 'inherit', 'inherit'] });
const done = new Promise((res, rej) => ffmpeg.on('close', (c) => (c ? rej(new Error(`ffmpeg exit ${c}`)) : res())));

for (let i = 0; i < frames; i++) {
  await page.evaluate((t) => window.seek(t), i / fps);
  ffmpeg.stdin.write(await page.screenshot({ type: 'png' }));
}
ffmpeg.stdin.end();
await done;
await browser.close();
console.log(`wrote ${output} (${frames} frames @ ${fps}fps, ${width}x${height})`);
