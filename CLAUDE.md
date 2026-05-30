# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install        # install dependencies
npm run dev        # start Vite dev server on 127.0.0.1:5173
npm run build      # production build → dist/
npm run preview    # serve the production build locally
```

Docker:
```bash
docker build -t ai-pm-animation .
docker run -d -p 8080:80 ai-pm-animation
```

## Architecture

Single-page React app (Vite) that visualises "a day in the life of an AI Product Manager" as a real-time orbital animation.

**Rendering split:**
- `canvas` element — handles all visual effects (star field, dashed orbital rings, radial spoke lines, particle streams, center glow). Positions are computed every frame via `requestAnimationFrame`; DOM nodes are updated directly via `el.style.left/top` to avoid React re-renders.
- DOM overlay — node chip labels (positioned absolutely), center orb, event feed (`<aside>`), thought ticker. Only event/thought state goes through React (`useState`).

**Key files:**
- `src/App.jsx` — all logic: canvas loop, node position math, particle system, event stream timer, thought rotation
- `src/App.css` — all styles; node colours driven by `--c` / `--cg` CSS custom properties set per-node in JSX

**Animation data (all in `App.jsx`):**
- `NODES` — 8 nodes across 3 rings; each has `ring`, `a0` (start angle), `speed`, `color`
- `RING_FRACS` — ring radii as fractions of `min(W,H)/2` (responsive)
- `EVENTS` / `THOUGHTS` — content arrays for the live feed and ticker

**Deployment:** `render.yaml` configures a Render static site (`npm install && npm run build`, publish `./dist`). `Dockerfile` uses a two-stage build (node:20-alpine → nginx:alpine).
