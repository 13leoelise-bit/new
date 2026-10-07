# motion-studio

Headless motion-graphics workspace for Claude Code: write animations as HTML
(or Remotion / HyperFrames), render them deterministically to MP4, and sync them
to music with audio analysis.

## Setup

```bash
./scripts/setup.sh        # node, ffmpeg, python deps, Playwright Chromium, smoke render
```

Skills and plugins are committed with the repo, so Claude Code picks them up on
open:

- `.agents/skills/` (symlinked from `.claude/skills/`): Remotion skills
  (`/remotion-create`, `/remotion-render`, ...) and HyperFrames skills
  (`/hyperframes` router, GSAP animation, audio, captions, ...). Pinned in
  `skills-lock.json`; refresh with `npx skills add remotion-dev/skills` and
  `npx skills add heygen-com/hyperframes`.
- `.claude/settings.json` enables the `claude-animation` plugin (hand-drawn
  rigs, pens, synthesized sound) from the `buildwithhanif/claude-animation-skill`
  marketplace. Claude Code prompts to install it the first time you trust the
  project.

Then start Claude Code on Opus 5.5:

```bash
claude --model claude-opus-5-5
> /model    # set effort: xhigh for one-shots, max for flagship pieces
```

## Tools

| Command | What it does |
| --- | --- |
| `npm run render -- page.html out.mp4 [secs] [fps] [WxH]` | Renders a page frame by frame to H.264. The page must define `window.seek(t)` that draws the frame at `t` seconds. |
| `npm run audio -- track.wav [beats.json]` | Prints duration, tempo, beat and onset times (librosa) for syncing cuts to music. |
| `npm run smoke` | Renders `examples/hello.html` to `out/hello.mp4`. |

`scripts/browser.mjs` launches Playwright's Chromium and falls back to
`$CHROMIUM_PATH` or `/opt/pw-browsers/chromium` when the bundled build is absent.
Renders go to `out/` (git-ignored).
