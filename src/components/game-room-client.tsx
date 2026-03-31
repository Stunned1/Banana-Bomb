'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { PublicState } from '@/types/game';
import { getGameServerWsUrl } from '@/utils/game-server-url';
import { logger } from '@/utils/logger';
import { NICKNAME_STORAGE_KEY } from '@/utils/nickname';

import { BananaGrid } from './banana-grid';

function readNickname(): string {
  if (typeof window === 'undefined') return 'Player';
  return window.sessionStorage.getItem(NICKNAME_STORAGE_KEY)?.trim() || 'Player';
}

interface GameRoomClientProps {
  initialJoinCode: string | null;
}

// ── SVGs ─────────────────────────────────────────────────────────────────────

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21C12 21 3 14 3 8a4.5 4.5 0 0 1 9-1 4.5 4.5 0 0 1 9 1c0 6-9 13-9 13z"/>
    </svg>
  );
}

function BombIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none">
      <circle cx="30" cy="36" r="20" fill="url(#bg2)"/>
      <path d="M38 18 Q44 10 50 8" stroke="#888" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="50" cy="7" r="3" fill="#f5c800"/>
      <circle cx="22" cy="28" r="4" fill="white" opacity="0.2"/>
      <defs>
        <radialGradient id="bg2" cx="35%" cy="30%">
          <stop offset="0%" stopColor="#555"/>
          <stop offset="100%" stopColor="#1a1a1a"/>
        </radialGradient>
      </defs>
    </svg>
  );
}

function MonkeyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="18" fill="#c8860a"/>
      <ellipse cx="10" cy="22" rx="5" ry="6" fill="#a06010"/>
      <ellipse cx="30" cy="22" rx="5" ry="6" fill="#a06010"/>
      <ellipse cx="20" cy="22" rx="11" ry="12" fill="#e8a830"/>
      <ellipse cx="20" cy="26" rx="7" ry="5" fill="#c8860a"/>
      <circle cx="15" cy="18" r="3" fill="white"/>
      <circle cx="25" cy="18" r="3" fill="white"/>
      <circle cx="15.5" cy="18.5" r="1.5" fill="#1a1a1a"/>
      <circle cx="25.5" cy="18.5" r="1.5" fill="#1a1a1a"/>
      <ellipse cx="20" cy="27" rx="4" ry="2.5" fill="#b07020"/>
    </svg>
  );
}

// ── Shared layout wrapper ─────────────────────────────────────────────────────

function RoomShell({ roomCode, children }: { roomCode?: string; children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh overflow-hidden pb-8" style={{ background: '#f5f0c8' }}>
      {/* Dotted bg */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, #d4c84a 1.5px, transparent 1.5px)',
          backgroundSize: '28px 28px',
          opacity: 0.45,
        }}
      />
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-5 pt-5 pb-2">
        <div>
          {roomCode && (
            <p className="text-xs font-extrabold uppercase tracking-widest" style={{ color: '#c8860a' }}>
              Room {roomCode}
            </p>
          )}
          <h1 className="text-xl font-black" style={{ color: '#c8860a' }}>Banana Bomb</h1>
        </div>
        <Link
          href="/"
          className="rounded-xl px-3 py-1.5 text-sm font-bold"
          style={{ background: '#e8e0a0', color: '#7a6a20' }}
        >
          Home
        </Link>
      </header>
      <div className="relative z-10 px-5 pt-3">{children}</div>
    </div>
  );
}

// ── Waiting lobby ─────────────────────────────────────────────────────────────

function WaitingLobby({
  roomCode,
  myNickname,
  onCopy,
  copied,
}: {
  roomCode: string;
  myNickname: string;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div className="flex flex-col gap-5">
      {/* Room code card */}
      <div className="rounded-2xl p-5 text-center shadow-sm" style={{ background: '#fffde7', border: '2.5px solid #f5c800' }}>
        <p className="mb-1 text-xs font-extrabold uppercase tracking-widest" style={{ color: '#c8860a' }}>
          Room Code
        </p>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2 text-3xl font-black tracking-widest transition active:scale-95"
          style={{ background: '#f0eedc', color: '#2a2a2a' }}
        >
          {roomCode}
          {copied
            ? <CheckIcon className="h-6 w-6 text-green-600" />
            : <CopyIcon className="h-5 w-5 text-zinc-400" />}
        </button>
        <p className="mt-2 text-xs font-semibold text-zinc-500">Tap to copy</p>
      </div>

      {/* Player slots */}
      <div className="grid grid-cols-2 gap-3">
        {/* Me */}
        <div className="flex flex-col items-center gap-2 rounded-2xl p-4" style={{ background: '#fffde7', border: '2.5px solid #6abf4b' }}>
          <MonkeyIcon className="h-14 w-14" />
          <p className="text-center text-sm font-extrabold text-zinc-800 truncate w-full text-center">{myNickname}</p>
          <span className="rounded-full px-3 py-0.5 text-xs font-extrabold text-white" style={{ background: '#6abf4b' }}>
            You
          </span>
        </div>

        {/* Opponent — waiting */}
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl p-4" style={{ background: '#eef0e0', border: '2.5px dashed #ccc' }}>
          <div className="flex h-14 w-14 items-center justify-center rounded-full" style={{ background: '#e0dcc8' }}>
            <span className="text-2xl font-black text-zinc-400">?</span>
          </div>
          <p className="text-sm font-bold text-zinc-400">Waiting...</p>
          <WaitingDots />
        </div>
      </div>

      {/* Invite card */}
      <div className="rounded-2xl p-5" style={{ background: '#eef0e0' }}>
        <p className="mb-1 font-extrabold text-zinc-800">Share with a friend</p>
        <p className="mb-4 text-sm text-zinc-500">Send them the code or copy the invite link below.</p>
        <button
          type="button"
          onClick={onCopy}
          className="flex w-full items-center justify-center gap-2 rounded-2xl py-3 font-extrabold text-white shadow-md active:scale-95"
          style={{
            background: copied
              ? 'linear-gradient(180deg, #6abf4b 0%, #4a9a30 100%)'
              : 'linear-gradient(180deg, #f08060 0%, #d45a30 100%)',
            boxShadow: copied ? '0 4px 0 #3a7a20' : '0 4px 0 #a03820',
          }}
        >
          {copied ? <CheckIcon className="h-5 w-5" /> : <CopyIcon className="h-5 w-5" />}
          {copied ? 'Copied!' : 'Copy Invite Link'}
        </button>
      </div>
    </div>
  );
}

function WaitingDots() {
  return (
    <div className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-2 w-2 rounded-full"
          style={{
            background: '#bbb',
            animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
      <style>{`@keyframes pulse { 0%,80%,100%{opacity:.3;transform:scale(.8)} 40%{opacity:1;transform:scale(1)} }`}</style>
    </div>
  );
}

// ── Player stat card ──────────────────────────────────────────────────────────

function PlayerCard({ label, nickname, lives, ready }: { label: string; nickname: string; lives: number; ready?: boolean }) {
  return (
    <div
      className="flex flex-col gap-2 rounded-2xl p-4"
      style={{ background: '#fffde7', border: `2.5px solid ${ready ? '#6abf4b' : '#f5c800'}` }}
    >
      <p className="text-xs font-extrabold uppercase tracking-widest" style={{ color: '#c8860a' }}>{label}</p>
      <div className="flex items-center gap-2">
        <MonkeyIcon className="h-9 w-9 shrink-0" />
        <p className="truncate font-extrabold text-zinc-800">{nickname}</p>
      </div>
      <div className="flex items-center gap-1">
        {Array.from({ length: 3 }, (_, i) => (
          <HeartIcon key={i} className={`h-4 w-4 ${i < lives ? 'text-red-500' : 'text-zinc-300'}`} />
        ))}
      </div>
      {ready !== undefined && (
        <span
          className="w-fit rounded-full px-2 py-0.5 text-xs font-extrabold text-white"
          style={{ background: ready ? '#6abf4b' : '#bbb' }}
        >
          {ready ? 'Ready' : 'Not ready'}
        </span>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function GameRoomClient({ initialJoinCode }: GameRoomClientProps) {
  const [roomState, setRoomState] = useState<PublicState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [placementPick, setPlacementPick] = useState<number[]>([]);
  const [connection, setConnection] = useState<'connecting' | 'open' | 'closed'>('connecting');
  const [copied, setCopied] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const joinRef = useRef(initialJoinCode);

  const send = useCallback((payload: object) => {
    const ws = wsRef.current;
    if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify(payload));
  }, []);

  useEffect(() => { joinRef.current = initialJoinCode; }, [initialJoinCode]);

  useEffect(() => {
    setConnection('connecting');
    setError(null);
    let disposed = false;
    let didOpen = false;
    const url = getGameServerWsUrl();
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      if (disposed) return;
      didOpen = true;
      setConnection('open');
      setError(null);
      const nickname = readNickname();
      const join = joinRef.current;
      if (join) {
        ws.send(JSON.stringify({ type: 'join_room', roomCode: join, nickname }));
      } else {
        ws.send(JSON.stringify({ type: 'create_room', nickname }));
      }
    };

    ws.onmessage = (ev) => {
      if (disposed) return;
      try {
        const data = JSON.parse(String(ev.data)) as {
          type: string;
          roomState?: PublicState;
          message?: string;
        };
        if (data.type === 'error' && data.message) { setError(data.message); return; }
        if ((data.type === 'room_created' || data.type === 'state') && data.roomState) {
          setRoomState(data.roomState);
          if (data.roomState.phase !== 'placement') setPlacementPick([]);
        }
      } catch (e) {
        logger.error('ws parse', { err: String(e) });
      }
    };

    ws.onerror = () => {
      if (disposed) return;
      setError(`Could not open WebSocket to ${url}. Is the game server running on port 4000?`);
    };

    ws.onclose = () => {
      if (disposed) return;
      wsRef.current = null;
      if (!didOpen) setError(`No game server at ${url}. From the repo root run npm run dev:all or npm run dev:server, then refresh.`);
      setConnection('closed');
    };

    return () => { disposed = true; ws.close(); wsRef.current = null; };
  }, []);

  const togglePlacement = useCallback((i: number) => {
    setPlacementPick((prev) => {
      if (prev.includes(i)) return prev.filter((x) => x !== i);
      if (prev.length >= 3) return prev;
      return [...prev, i];
    });
  }, []);

  const handlePlaceBombs = useCallback(() => {
    if (placementPick.length !== 3) return;
    setError(null);
    send({ type: 'place_bombs', cells: [...placementPick].sort((a, b) => a - b) });
  }, [placementPick, send]);

  const handleReady = useCallback(() => { setError(null); send({ type: 'set_ready' }); }, [send]);

  const handleAttack = useCallback((cell: number) => { setError(null); send({ type: 'pick_cell', cell }); }, [send]);

  const copyInvite = useCallback(() => {
    if (!roomState?.roomCode || typeof window === 'undefined') return;
    const link = `${window.location.origin}/room?join=${roomState.roomCode}`;
    void navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [roomState?.roomCode]);

  // ── Loading / error states ──────────────────────────────────────────────────

  if (!roomState && connection === 'connecting') {
    return (
      <RoomShell>
        <div className="flex flex-col items-center gap-4 pt-20 text-center">
          <WaitingDots />
          <p className="font-bold text-zinc-500">Connecting to game server…</p>
        </div>
      </RoomShell>
    );
  }

  if (!roomState && connection === 'closed') {
    return (
      <RoomShell>
        <div className="flex flex-col gap-4 rounded-2xl p-6" style={{ background: '#fffde7', border: '2.5px solid #f5c800' }}>
          <p className="font-extrabold text-red-600">Could not connect to the game server.</p>
          {error && (
            <p className="rounded-xl p-3 text-sm text-zinc-600" style={{ background: '#f0eedc' }}>{error}</p>
          )}
          <p className="text-sm text-zinc-500">
            Expected URL: <code className="font-bold text-zinc-700">{getGameServerWsUrl()}</code>
          </p>
          <Link
            href="/"
            className="w-fit rounded-xl px-4 py-2 font-extrabold text-white"
            style={{ background: 'linear-gradient(180deg, #f08060 0%, #d45a30 100%)' }}
          >
            Back home
          </Link>
        </div>
      </RoomShell>
    );
  }

  if (!roomState) return null;

  const me = roomState.players[roomState.myIndex];
  const opp = roomState.players[roomState.myIndex === 0 ? 1 : 0];
  const myTurn = roomState.phase === 'playing' && roomState.currentTurn === roomState.myIndex;
  const iWon = roomState.phase === 'ended' && roomState.winnerIndex === roomState.myIndex;
  const placementDisplay = placementPick.length > 0 ? placementPick : (roomState.myBombCells ?? []);

  return (
    <RoomShell roomCode={roomState.roomCode}>
      {/* Error banner */}
      {error && (
        <div className="mb-4 rounded-2xl px-4 py-3 text-sm font-bold text-red-700" style={{ background: '#ffe0e0' }}>
          {error}
        </div>
      )}

      {/* ── WAITING ── */}
      {roomState.phase === 'waiting' && (
        <WaitingLobby
          roomCode={roomState.roomCode}
          myNickname={me?.nickname ?? readNickname()}
          onCopy={copyInvite}
          copied={copied}
        />
      )}

      {/* ── PLACEMENT ── */}
      {roomState.phase === 'placement' && (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-3">
            <PlayerCard label="You" nickname={me?.nickname ?? '—'} lives={me?.lives ?? 0} ready={me?.placementReady} />
            <PlayerCard label="Opponent" nickname={opp?.nickname ?? '—'} lives={opp?.lives ?? 0} ready={opp?.placementReady} />
          </div>

          <div className="rounded-2xl p-5" style={{ background: '#fffde7', border: '2.5px solid #f5c800' }}>
            <p className="mb-4 font-bold text-zinc-700">
              Pick <span className="font-extrabold" style={{ color: '#c8860a' }}>3 cells</span> to hide your bombs, then save and ready up.
            </p>
            <BananaGrid
              mode="placement"
              title="Your grid"
              selectedCells={placementDisplay}
              onCellClick={togglePlacement}
              disabled={me?.placementReady === true}
            />
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                disabled={placementPick.length !== 3 || me?.placementReady === true}
                onClick={handlePlaceBombs}
                className="flex-1 rounded-2xl py-3 font-extrabold text-zinc-800 disabled:opacity-40"
                style={{ background: '#f5c800', boxShadow: '0 3px 0 #c8a000' }}
              >
                Save bombs
              </button>
              <button
                type="button"
                disabled={!me?.hasPlacedBombs || me?.placementReady === true}
                onClick={handleReady}
                className="flex-1 rounded-2xl py-3 font-extrabold text-white disabled:opacity-40"
                style={{ background: '#6abf4b', boxShadow: '0 3px 0 #4a9a30' }}
              >
                Ready!
              </button>
            </div>
            {me?.hasPlacedBombs && !me?.placementReady && (
              <p className="mt-3 text-sm font-bold text-green-600">Bombs saved — press Ready!</p>
            )}
          </div>

          <div className="rounded-2xl px-4 py-3 text-sm font-bold" style={{ background: '#eef0e0', color: '#888' }}>
            {opp?.placementReady ? '✓ Opponent is ready' : 'Waiting for opponent to ready…'}
          </div>
        </div>
      )}

      {/* ── PLAYING ── */}
      {roomState.phase === 'playing' && (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-3">
            <PlayerCard label="You" nickname={me?.nickname ?? '—'} lives={me?.lives ?? 0} />
            <PlayerCard label="Opponent" nickname={opp?.nickname ?? '—'} lives={opp?.lives ?? 0} />
          </div>

          <div
            className="rounded-2xl px-4 py-3 text-center font-extrabold"
            style={{
              background: myTurn ? '#fffde7' : '#eef0e0',
              border: `2.5px solid ${myTurn ? '#f5c800' : '#ccc'}`,
              color: myTurn ? '#c8860a' : '#888',
            }}
          >
            {myTurn ? '🎯 Your turn — pick a banana!' : "Opponent's turn…"}
          </div>

          <div className="rounded-2xl p-4" style={{ background: '#fffde7', border: '2.5px solid #f5c800' }}>
            <BananaGrid
              mode="attack"
              title="Opponent's grid — find their bombs"
              revealed={roomState.myAttacks}
              onCellClick={handleAttack}
              disabled={!myTurn}
            />
          </div>

          <div className="rounded-2xl p-4" style={{ background: '#eef0e0' }}>
            <BananaGrid
              mode="own"
              title="Your grid — your bombs & their guesses"
              revealed={roomState.attacksOnMe}
              myBombs={roomState.myBombCells}
              disabled
            />
          </div>
        </div>
      )}

      {/* ── ENDED ── */}
      {roomState.phase === 'ended' && (
        <div className="flex flex-col items-center gap-5 rounded-2xl p-8 text-center" style={{ background: '#fffde7', border: '2.5px solid #f5c800' }}>
          <BombIcon className="h-20 w-20" />
          <p
            className="text-4xl font-black"
            style={{
              color: iWon ? '#6abf4b' : '#d45a30',
              textShadow: `3px 4px 0 ${iWon ? '#3a7a20' : '#a03820'}`,
            }}
          >
            {iWon ? 'You Win!' : 'You Lost'}
          </p>
          <p className="font-semibold text-zinc-600">
            {iWon ? 'They stepped on all the wrong bananas.' : 'Watch your step next time.'}
          </p>
          <Link
            href="/"
            className="rounded-2xl px-8 py-3 font-extrabold text-white"
            style={{
              background: 'linear-gradient(180deg, #f08060 0%, #d45a30 100%)',
              boxShadow: '0 4px 0 #a03820',
            }}
          >
            Play Again
          </Link>
        </div>
      )}
    </RoomShell>
  );
}
