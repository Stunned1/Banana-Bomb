'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { AVATARS } from '@/components/avatars';
import { GameRoomClient } from '@/components/game-room-client';
import { AVATAR_STORAGE_KEY, NICKNAME_STORAGE_KEY } from '@/utils/nickname';


function BombIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none">
      <circle cx="30" cy="36" r="20" fill="url(#pjbg)"/>
      <path d="M38 18 Q44 10 50 8" stroke="#888" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="50" cy="7" r="3" fill="#f5c800"/>
      <circle cx="22" cy="28" r="4" fill="white" opacity="0.2"/>
      <defs>
        <radialGradient id="pjbg" cx="35%" cy="30%">
          <stop offset="0%" stopColor="#555"/>
          <stop offset="100%" stopColor="#1a1a1a"/>
        </radialGradient>
      </defs>
    </svg>
  );
}

interface PreJoinScreenProps {
  joinCode: string;
  onJoin: (nickname: string) => void;
}

function PreJoinScreen({ joinCode, onJoin }: PreJoinScreenProps) {
  const [nickname, setNickname] = useState('');
  const [avatarIndex, setAvatarIndex] = useState(0);

  function handleSubmit() {
    const name = nickname.trim() || 'Player';
    window.sessionStorage.setItem(NICKNAME_STORAGE_KEY, name);
    window.sessionStorage.setItem(AVATAR_STORAGE_KEY, AVATARS[avatarIndex].id);
    onJoin(name);
  }

  const AvatarComp = AVATARS[avatarIndex].component;

  return (
    <div className="relative min-h-dvh overflow-hidden" style={{ background: '#f5f0c8' }}>
      {/* Dotted bg */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, #d4c84a 1.5px, transparent 1.5px)',
          backgroundSize: '28px 28px',
          opacity: 0.45,
        }}
      />

      <div className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-5">
        <h1
          className="mb-2 text-5xl font-black leading-none tracking-tight"
          style={{
            color: '#f5c800',
            WebkitTextStroke: '2px #c8860a',
            textShadow: '3px 5px 0 #c8860a',
          }}
        >
          Banana Bomb
        </h1>
        <p className="mb-8 font-bold text-zinc-600">
          Joining room{' '}
          <span className="font-extrabold tracking-widest" style={{ color: '#c8860a' }}>
            {joinCode}
          </span>
        </p>

        <div className="w-full max-w-sm rounded-2xl p-6 shadow-sm" style={{ background: '#fffde7', border: '2.5px solid #f5c800' }}>
          {/* Character picker */}
          <div className="mb-4 flex items-center justify-between gap-2">
            <button
              type="button"
              aria-label="Previous character"
              onClick={() => setAvatarIndex((i) => (i - 1 + AVATARS.length) % AVATARS.length)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl font-black active:scale-90"
              style={{ background: '#f0eedc', color: '#c8860a' }}
            >
              ‹
            </button>

            <div className="flex flex-1 flex-col items-center gap-1">
              <AvatarComp className="h-24 w-24 drop-shadow-md" />
              <span className="text-xs font-extrabold uppercase tracking-widest" style={{ color: '#c8860a' }}>
                {AVATARS[avatarIndex].label}
              </span>
              <div className="flex gap-1 pt-0.5">
                {AVATARS.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Select ${AVATARS[i].label}`}
                    onClick={() => setAvatarIndex(i)}
                    className="h-1.5 rounded-full transition-all"
                    style={{
                      width: i === avatarIndex ? '16px' : '6px',
                      background: i === avatarIndex ? '#c8860a' : '#d4c870',
                    }}
                  />
                ))}
              </div>
            </div>

            <button
              type="button"
              aria-label="Next character"
              onClick={() => setAvatarIndex((i) => (i + 1) % AVATARS.length)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl font-black active:scale-90"
              style={{ background: '#f0eedc', color: '#c8860a' }}
            >
              ›
            </button>
          </div>

          <label className="mb-1 block text-xs font-extrabold uppercase tracking-widest" style={{ color: '#c8860a' }}>
            Your Nickname
          </label>
          <input
            type="text"
            maxLength={24}
            placeholder="Enter Your Name!"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="mb-4 w-full rounded-xl px-4 py-3 text-sm font-semibold text-zinc-700 placeholder:text-zinc-400 focus:outline-none"
            style={{ background: '#f0eedc' }}
            autoFocus
          />

          <button
            type="button"
            onClick={handleSubmit}
            className="flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-lg font-extrabold text-white shadow-md active:scale-95"
            style={{
              background: 'linear-gradient(180deg, #f08060 0%, #d45a30 100%)',
              boxShadow: '0 4px 0 #a03820',
            }}
          >
            Join Game
            <BombIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function RoomJoinLoader() {
  const searchParams = useSearchParams();
  const join = searchParams.get('join');
  const joinCode = join ? join.toUpperCase().replace(/[^A-Z0-9]/g, '') || null : null;

  // If joining via code, check if they already have a nickname set this session
  const hasNickname =
    typeof window !== 'undefined' &&
    !!window.sessionStorage.getItem(NICKNAME_STORAGE_KEY)?.trim();

  const [ready, setReady] = useState(!joinCode || hasNickname);

  if (!ready && joinCode) {
    return <PreJoinScreen joinCode={joinCode} onJoin={() => setReady(true)} />;
  }

  return <GameRoomClient initialJoinCode={joinCode} />;
}
