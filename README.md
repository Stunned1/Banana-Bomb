# Banana Bomb

A game made for my little sister’s birthday :)

## Stack

- **Next.js** (App Router) + **TypeScript** + **Tailwind CSS** — UI (e.g. Vercel)
- **Node** + **WebSocket** (`server/`) — lobbies / match sync (e.g. Railway)

## Local dev

1. Copy `.env.example` to `.env.local` (optional locally; defaults to `http://localhost:4000`).
2. From the repo root:

```bash
npm install
npm run setup
```

`setup` runs `npm install --prefix server` so the game server gets `tsx`, `ws`, and TypeScript. (A `postinstall` hook was removed: on Windows, nested `npm` calls from lifecycle scripts often run in a shell where `npm` is not on `PATH`, which breaks installs.)

You can use `npm install --prefix server` instead of `npm run setup` if you prefer. On Windows, if anything looks wrong, use `cd server` then `npm install` (same result, often fewer surprises).

3. Run **both** app and game server:

```bash
npm run dev:all
```

Or two terminals: `npm run dev` and `npm run dev:server`.

- Web: [http://localhost:3000](http://localhost:3000)
- Game server health: [http://localhost:4000/health](http://localhost:4000/health)

Use `getGameServerWsUrl()` from `src/utils/game-server-url.ts` when you open a WebSocket from the browser.

## Deploy

**Frontend (Vercel):** import the repo, set `NEXT_PUBLIC_GAME_SERVER_URL` to your Railway service URL (HTTPS, no trailing slash), e.g. `https://banana-bomb-production.up.railway.app`.

**Game server (Railway):**

1. New project → deploy from the same repo.
2. Set **Root Directory** to `server`.
3. **Build command:** `npm install && npm run build`
4. **Start command:** `npm start`
5. Railway sets `PORT`; the server reads it automatically.

After deploy, paste the public HTTPS URL into Vercel as `NEXT_PUBLIC_GAME_SERVER_URL`.

### Caveat

Managed hosts often **spin down** free/low-usage services after idle time (Supabase pauses projects; Railway’s free tier can sleep too). For a birthday demo that’s usually fine; for always-on, use a paid plan or a ping keep-alive (know the provider’s terms).

### Git on Windows

- **`node_modules` is not committed.** `.gitignore` uses `node_modules/` so both the root and `server/node_modules` stay out of Git. If you previously staged `server/node_modules`, run `git reset HEAD server/node_modules` (or `git rm -r --cached server/node_modules` if it was committed).
- If you see paths like `server/node_modules/banana-bomb/server/node_modules/...`, the install is corrupted. Delete the folder (`rd /s /q server\node_modules` in cmd, or delete `server\node_modules` in Explorer), then reinstall with `cd server` and `npm install`.
