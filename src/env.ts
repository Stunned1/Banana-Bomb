import { z } from 'zod';

const envSchema = z.object({
  /** Public HTTP origin of the game server (Railway in prod). Used for REST + WebSocket URL. */
  NEXT_PUBLIC_GAME_SERVER_URL: z.string().url(),
});

const gameServerUrl =
  process.env.NEXT_PUBLIC_GAME_SERVER_URL?.trim() || 'http://localhost:4000';

export const env = envSchema.parse({
  NEXT_PUBLIC_GAME_SERVER_URL: gameServerUrl,
});
