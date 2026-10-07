// Launch headless Chromium. Falls back to a pre-installed binary when the
// Playwright-bundled build is missing (e.g. cloud containers that ship their own).
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';

const FALLBACKS = [process.env.CHROMIUM_PATH, '/opt/pw-browsers/chromium'].filter(Boolean);

export async function launch(opts = {}) {
  try {
    return await chromium.launch(opts);
  } catch (err) {
    const executablePath = FALLBACKS.find((p) => existsSync(p));
    if (!executablePath) throw err;
    return chromium.launch({ ...opts, executablePath });
  }
}
