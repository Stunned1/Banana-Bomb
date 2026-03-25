import { env } from '@/env';

/** Browser-visible HTTP origin (e.g. `https://your-app.up.railway.app`). */
export function getGameServerHttpOrigin(): string {
  return env.NEXT_PUBLIC_GAME_SERVER_URL.replace(/\/$/, '');
}

/** WebSocket URL derived from the game server origin. */
export function getGameServerWsUrl(): string {
  return getGameServerHttpOrigin().replace(/^http/, 'ws');
}
