# Sudhakar S — 3D Portfolio

Interactive 3D portfolio built with **React + Vite + Three.js + Framer Motion**.
The hero section turns your photo into a layered 3D scene (wall → "SK" letters → shadow → depth‑displaced cut‑out of you) that responds to pointer movement.

## Run locally

```bash
npm install
npm run dev       # http://localhost:5173
```

## Build

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build
```

## Deploy to GitHub Pages (already wired up)

This repo includes `.github/workflows/deploy.yml`, which builds and deploys automatically on every push to `main`.

1. Create a new GitHub repo and push this project (see commands below).
2. On GitHub: **Settings → Pages → Build and deployment → Source → GitHub Actions**.
3. Push to `main` — the Action builds the site and publishes it.
4. Your live URL: `https://<your-username>.github.io/<repo-name>/`

```bash
git init
git add -A
git commit -m "Initial commit: 3D portfolio"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

That's it — no build step to run yourself; GitHub Actions does it on every push.

### If you get a 404 on the live URL

- **Repo must be Public** (or you need GitHub Pro/Team) — Pages doesn't build on private repos on the free plan. Settings → General → Danger Zone → Change visibility.
- **Settings → Pages → Source must say "GitHub Actions"**, not "Deploy from a branch".
- Check the **Actions** tab — the "Deploy to GitHub Pages" run should be green. Click into any red ✕ to see the actual error.
- The workflow only triggers on pushes to **`main`** — if your default branch is `master`, run `git branch -M main && git push -u origin main`.

## Editing content

All text/data lives at the top of `src/App.jsx` (`SKILLS`, `PROJECTS`, `CREDS`, `CONTACTS` arrays) — edit those, no need to touch markup.

## Tech

- React 18 + Vite 5
- Three.js — the 3D hero scene (`src/components/Hero3D.jsx`)
- Framer Motion — scroll reveals, spotlight cards, marquee, counters (`src/components/ui.jsx`)
- Plain CSS, one shared `--max` container width so every section aligns
