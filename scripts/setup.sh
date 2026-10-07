#!/usr/bin/env bash
# One-shot setup for a fresh clone (macOS or Debian/Ubuntu).
set -euo pipefail
cd "$(dirname "$0")/.."

need() { command -v "$1" >/dev/null 2>&1; }
if ! need ffmpeg || ! need node || ! need python3; then
  if need brew; then brew install node ffmpeg python
  elif need apt-get; then sudo apt-get update && sudo apt-get install -y nodejs npm ffmpeg python3 python3-pip
  else echo "Install node 22+, ffmpeg and python3 manually." >&2; exit 1; fi
fi

pip3 install -r requirements.txt
npm install
# Skip the browser download when a Chromium is already provided (cloud containers).
if [ -z "${PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD:-}" ]; then npx playwright install chromium; fi

npm run smoke
