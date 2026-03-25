'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { NICKNAME_STORAGE_KEY } from '@/utils/nickname';

export default function HomePage() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [joinCode, setJoinCode] = useState('');

  function persistNickname() {
    if (typeof window === 'undefined') {
      return;
    }
    window.sessionStorage.setItem(
      NICKNAME_STORAGE_KEY,
      nickname.trim() || 'Player',
    );
  }

  function handleCreate() {
    persistNickname();
    router.push('/room');
  }

  function handleJoin() {
    const code = joinCode.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!code) {
      return;
    }
    persistNickname();
    router.push(`/room?join=${encodeURIComponent(code)}`);
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center gap-10 px-6 py-16">
      <div>
        <h1 className="text-4xl font-semibold tracking-tight text-amber-400">
          Banana Bomb
        </h1>
        <p className="mt-3 text-lg text-zinc-400">
          1v1 on two 3×3 grids. Hide three bombs, then take turns guessing
          where theirs are. Hit a bomb and you lose a life — three lives each.
        </p>
      </div>

      <div className="space-y-3">
        <label className="block text-sm text-zinc-500" htmlFor="nick">
          Nickname
        </label>
        <input
          id="nick"
          type="text"
          maxLength={24}
          placeholder="Player"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900/60 px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30"
        />
      </div>

      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={handleCreate}
          className="rounded-xl bg-amber-500 px-5 py-4 text-center text-lg font-semibold text-zinc-950 hover:bg-amber-400"
        >
          Create lobby
        </button>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1 space-y-2">
            <label className="block text-sm text-zinc-500" htmlFor="code">
              Join code
            </label>
            <input
              id="code"
              type="text"
              maxLength={8}
              placeholder="e.g. ABC123"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900/60 px-4 py-3 font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30"
            />
          </div>
          <button
            type="button"
            onClick={handleJoin}
            className="rounded-xl border border-zinc-600 px-5 py-3 font-medium text-zinc-100 hover:bg-zinc-800 sm:shrink-0"
          >
            Join lobby
          </button>
        </div>
      </div>

      <p className="text-center text-sm text-zinc-600">
        Run <code className="text-zinc-500">npm run dev:all</code> so the game
        server is up.{' '}
        <Link href="/room" className="text-amber-500/80 underline">
          Room
        </Link>
      </p>
    </main>
  );
}
