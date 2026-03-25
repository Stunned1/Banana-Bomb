'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { PublicState } from '@/types/game';
import { getGameServerWsUrl } from '@/utils/game-server-url';
import { logger } from '@/utils/logger';
import { NICKNAME_STORAGE_KEY } from '@/utils/nickname';

import { BananaGrid } from './banana-grid';

function readNickname(): string {
  if (typeof window === 'undefined') {
    return 'Player';
  }
  return window.sessionStorage.getItem(NICKNAME_STORAGE_KEY)?.trim() || 'Player';
}

interface GameRoomClientProps {
  initialJoinCode: string | null;
}

export function GameRoomClient({ initialJoinCode }: GameRoomClientProps) {
  const [roomState, setRoomState] = useState<PublicState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [placementPick, setPlacementPick] = useState<number[]>([]);
  const [connection, setConnection] = useState<
    'connecting' | 'open' | 'closed'
  >('connecting');

  const wsRef = useRef<WebSocket | null>(null);
  const joinRef = useRef(initialJoinCode);

  const send = useCallback((payload: object) => {
    const ws = wsRef.current;
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(payload));
    }
  }, []);

  useEffect(() => {
    joinRef.current = initialJoinCode;
  }, [initialJoinCode]);

  useEffect(() => {
    setConnection('connecting');
    setError(null);

    let disposed = false;
    let didOpen = false;
    const url = getGameServerWsUrl();
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      if (disposed) {
        return;
      }
      didOpen = true;
      setConnection('open');
      setError(null);
      const nickname = readNickname();
      const join = joinRef.current;
      if (join) {
        ws.send(
          JSON.stringify({
            type: 'join_room',
            roomCode: join,
            nickname,
          }),
        );
      } else {
        ws.send(JSON.stringify({ type: 'create_room', nickname }));
      }
    };

    ws.onmessage = (ev) => {
      if (disposed) {
        return;
      }
      try {
        const data = JSON.parse(String(ev.data)) as {
          type: string;
          roomState?: PublicState;
          roomCode?: string;
          message?: string;
        };

        if (data.type === 'error' && data.message) {
          setError(data.message);
          return;
        }

        if (data.type === 'room_created' && data.roomState) {
          setRoomState(data.roomState);
          setPlacementPick([]);
          return;
        }

        if (data.type === 'state' && data.roomState) {
          const next = data.roomState;
          setRoomState(next);
          if (next.phase !== 'placement') {
            setPlacementPick([]);
          }
        }
      } catch (e) {
        logger.error('ws parse', { err: String(e) });
      }
    };

    ws.onerror = () => {
      if (disposed) {
        return;
      }
      setError(
        `Could not open WebSocket to ${url}. Is the game server running on port 4000?`,
      );
    };

    ws.onclose = () => {
      if (disposed) {
        return;
      }
      wsRef.current = null;
      if (!didOpen) {
        setError(
          `No game server at ${url}. From the repo root run npm run dev:all or npm run dev:server, then refresh.`,
        );
      }
      setConnection('closed');
    };

    return () => {
      disposed = true;
      ws.close();
      wsRef.current = null;
    };
  }, []);

  const togglePlacement = useCallback((i: number) => {
    setPlacementPick((prev) => {
      if (prev.includes(i)) {
        return prev.filter((x) => x !== i);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, i];
    });
  }, []);

  const handlePlaceBombs = useCallback(() => {
    if (placementPick.length !== 3) {
      return;
    }
    setError(null);
    send({ type: 'place_bombs', cells: [...placementPick].sort((a, b) => a - b) });
  }, [placementPick, send]);

  const handleReady = useCallback(() => {
    setError(null);
    send({ type: 'set_ready' });
  }, [send]);

  const handleAttack = useCallback(
    (cell: number) => {
      setError(null);
      send({ type: 'pick_cell', cell });
    },
    [send],
  );

  const copyInvite = useCallback(() => {
    if (!roomState?.roomCode || typeof window === 'undefined') {
      return;
    }
    const link = `${window.location.origin}/room?join=${roomState.roomCode}`;
    void navigator.clipboard.writeText(link);
  }, [roomState?.roomCode]);

  if (!roomState && connection === 'connecting') {
    return (
      <div className="mx-auto max-w-lg px-6 py-16 text-zinc-400">
        Connecting to game server…
      </div>
    );
  }

  if (!roomState && connection === 'closed') {
    return (
      <div className="mx-auto max-w-lg space-y-4 px-6 py-16">
        <p className="text-rose-400">Could not connect to the game server.</p>
        {error ? (
          <p className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 text-sm text-zinc-400">
            {error}
          </p>
        ) : null}
        <p className="text-sm text-zinc-500">
          Expected URL:{' '}
          <code className="text-zinc-300">{getGameServerWsUrl()}</code>
        </p>
        <Link href="/" className="text-amber-400 underline">
          Back home
        </Link>
      </div>
    );
  }

  if (!roomState) {
    return null;
  }

  const me = roomState.players[roomState.myIndex];
  const opp = roomState.players[roomState.myIndex === 0 ? 1 : 0];
  const myTurn =
    roomState.phase === 'playing' &&
    roomState.currentTurn === roomState.myIndex;
  const iWon =
    roomState.phase === 'ended' &&
    roomState.winnerIndex === roomState.myIndex;

  const placementDisplay =
    placementPick.length > 0
      ? placementPick
      : (roomState.myBombCells ?? []);

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-6 py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            Room {roomState.roomCode}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">Banana Bomb</h1>
        </div>
        <Link
          href="/"
          className="text-sm text-zinc-500 underline hover:text-zinc-300"
        >
          Home
        </Link>
      </header>

      {error ? (
        <p className="rounded-lg border border-rose-500/40 bg-rose-950/40 px-3 py-2 text-sm text-rose-200">
          {error}
        </p>
      ) : null}

      {roomState.phase === 'waiting' ? (
        <section className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
          <p className="text-zinc-300">
            Waiting for an opponent… share this link so they can join.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={copyInvite}
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-amber-400"
            >
              Copy invite link
            </button>
            <span className="self-center text-xs text-zinc-500">
              Code: <strong className="text-zinc-300">{roomState.roomCode}</strong>
            </span>
          </div>
        </section>
      ) : null}

      {roomState.phase === 'placement' || roomState.phase === 'playing' ? (
        <section className="flex flex-wrap gap-6 text-sm">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 px-4 py-3">
            <p className="text-zinc-500">You</p>
            <p className="font-medium text-zinc-100">{me?.nickname ?? '—'}</p>
            <p className="mt-1 text-amber-400">❤️ × {me?.lives ?? 0}</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 px-4 py-3">
            <p className="text-zinc-500">Opponent</p>
            <p className="font-medium text-zinc-100">{opp?.nickname ?? '—'}</p>
            <p className="mt-1 text-amber-400">❤️ × {opp?.lives ?? 0}</p>
          </div>
        </section>
      ) : null}

      {roomState.phase === 'placement' ? (
        <section className="space-y-6">
          <p className="text-zinc-400">
            Tap exactly <strong className="text-zinc-200">three</strong> bananas
            to hide your bombs, then save and ready up.
          </p>
          <BananaGrid
            mode="placement"
            title="Your grid — place 3 bombs"
            selectedCells={placementDisplay}
            onCellClick={togglePlacement}
            disabled={me?.placementReady === true}
          />
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={placementPick.length !== 3 || me?.placementReady === true}
              onClick={handlePlaceBombs}
              className="rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 disabled:opacity-40"
            >
              Save bombs
            </button>
            <button
              type="button"
              disabled={!me?.hasPlacedBombs || me?.placementReady === true}
              onClick={handleReady}
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-zinc-950 disabled:opacity-40"
            >
              Ready
            </button>
          </div>
          {me?.hasPlacedBombs && !me?.placementReady ? (
            <p className="text-sm text-emerald-400">Bombs saved — press Ready.</p>
          ) : null}
          {opp?.placementReady ? (
            <p className="text-sm text-zinc-500">Opponent is ready.</p>
          ) : (
            <p className="text-sm text-zinc-500">Waiting for opponent to ready…</p>
          )}
        </section>
      ) : null}

      {roomState.phase === 'playing' ? (
        <section className="space-y-8">
          <p className="text-zinc-400">
            {myTurn ? (
              <span className="text-amber-400">Your turn</span>
            ) : (
              <span>Opponent&apos;s turn…</span>
            )}
          </p>
          <BananaGrid
            mode="attack"
            title="Opponent grid — pick a banana"
            revealed={roomState.myAttacks}
            onCellClick={handleAttack}
            disabled={!myTurn}
          />
          <BananaGrid
            mode="own"
            title="Your grid — your bombs & their picks"
            revealed={roomState.attacksOnMe}
            myBombs={roomState.myBombCells}
            disabled
          />
        </section>
      ) : null}

      {roomState.phase === 'ended' ? (
        <section className="space-y-4 rounded-2xl border border-zinc-700 bg-zinc-900/50 p-8 text-center">
          <p className="text-xl font-semibold">
            {iWon ? 'You win!' : 'You lost'}
          </p>
          <p className="text-zinc-400">
            {iWon
              ? 'They stepped on all the wrong bananas.'
              : 'Watch your step next time.'}
          </p>
          <Link
            href="/"
            className="inline-block rounded-lg bg-amber-500 px-5 py-2 text-sm font-medium text-zinc-950"
          >
            Play again
          </Link>
        </section>
      ) : null}
    </div>
  );
}
