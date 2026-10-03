# Sudhakar Sk

React + Vite + Framer Motion portfolio with a layered-photo parallax hero.

## Run locally (correct way)

**Do NOT open `index.html` with VS Code's "Live Server" extension** — it only
serves static files and can't compile the JSX/React source, so you'll get a
blank white page. Use Vite's own dev server instead:

```bash
npm install
npm run dev
```

Open the URL it prints (usually `http://localhost:5173/`).

## Deploy to GitHub Pages

This repo deploys to a `gh-pages` branch automatically via GitHub Actions
every time you push to `main`. Setup is **one single step** on your end:

1. Push this project to a new GitHub repo (commands below).
2. Wait for the first push to finish — go to the **Actions** tab and confirm
   the "Deploy to GitHub Pages" run finishes green. This creates the
   `gh-pages` branch automatically; it won't exist before this first run.
3. **Only after that first green run:** go to **Settings → Pages**. Under
   "Build and deployment → Source", choose **"Deploy from a branch"**, then
   set **Branch: `gh-pages`**, folder **`/ (root)`**, and click **Save**.
4. Your live URL: `https://<your-username>.github.io/<repo-name>/`

```bash
git init
git add -A
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

Every future `git push` to `main` rebuilds and redeploys automatically —
you never touch Settings → Pages again after step 3.

### Still blank after following all of this?

Right-click the live URL → **View page source**. Look at the bottom for a
`<script type="module" src="...">` line:

- `src="./assets/index-XXXXXXXX.js"` → the built site is being served correctly.
  If it's still blank with this, the bug is a genuine JS error — open the
  browser's DevTools Console (F12) on the live site and send me the red
  error text.
- `src="/src/main.jsx"` → GitHub is serving raw, uncompiled source, not the
  build. This means Settings → Pages is pointed at the wrong branch/folder,
  or the Actions run failed before it could push to `gh-pages`. Check the
  Actions tab for a red ✕ and send me what the failed step says.

## Editing content

All text/data lives at the top of `src/App.jsx` (`SKILLS`, `PROJECTS`,
`CREDS`, `CONTACTS` arrays).

## Tech

- React 18 + Vite 5
- Framer Motion — parallax hero, scroll reveals, spotlight cards, marquee, counters
- Plain CSS, one shared `--max` container width so every section aligns
