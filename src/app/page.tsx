'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { NICKNAME_STORAGE_KEY } from '@/utils/nickname';

// ── SVG icons ────────────────────────────────────────────────────────────────

function BananaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 52C18 36 30 18 52 12" stroke="#f5c800" strokeWidth="10" strokeLinecap="round"/>
      <path d="M12 52C18 36 30 18 52 12" stroke="#e6a800" strokeWidth="10" strokeLinecap="round" strokeDasharray="2 8" strokeDashoffset="4"/>
      <ellipse cx="52" cy="12" rx="5" ry="4" fill="#c8860a" transform="rotate(-30 52 12)"/>
      <ellipse cx="12" cy="52" rx="5" ry="4" fill="#c8860a" transform="rotate(-30 12 52)"/>
    </svg>
  );
}

function BombIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="36" r="20" fill="#2a2a2a"/>
      <circle cx="30" cy="36" r="20" fill="url(#bombGrad)"/>
      <path d="M38 18 Q44 10 50 8" stroke="#888" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="50" cy="7" r="3" fill="#f5c800"/>
      <circle cx="22" cy="28" r="4" fill="white" opacity="0.2"/>
      <defs>
        <radialGradient id="bombGrad" cx="35%" cy="30%">
          <stop offset="0%" stopColor="#555"/>
          <stop offset="100%" stopColor="#1a1a1a"/>
        </radialGradient>
      </defs>
    </svg>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#c0392b" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 21C12 21 3 14 3 8a4.5 4.5 0 0 1 9-1 4.5 4.5 0 0 1 9 1c0 6-9 13-9 13z"/>
    </svg>
  );
}

function GiftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="8" width="18" height="13" rx="2"/>
      <path d="M12 8v13M3 13h18"/>
      <path d="M8 8a2 2 0 0 1 0-4c2 0 4 4 4 4H8zM16 8a2 2 0 0 0 0-4c-2 0-4 4-4 4h4z"/>
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  );
}

function HelpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10"/>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
      <circle cx="12" cy="17" r="0.5" fill="currentColor"/>
    </svg>
  );
}

function SoloIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="7" r="4"/>
      <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  );
}

function VersusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="7" r="3.5"/>
      <path d="M1 20c0-3.3 3.1-6 7-6s7 2.7 7 6"/>
      <circle cx="17" cy="7" r="3.5"/>
      <path d="M14.5 20c.4-3.5 3.3-6 6.5-6"/>
    </svg>
  );
}

function LobbyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="3" width="9" height="9" rx="1.5"/>
      <rect x="13" y="3" width="9" height="9" rx="1.5"/>
      <rect x="2" y="14" width="9" height="7" rx="1.5"/>
      <rect x="13" y="14" width="9" height="7" rx="1.5"/>
    </svg>
  );
}

function LeaderboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="14" width="5" height="8" rx="1"/>
      <rect x="9.5" y="9" width="5" height="13" rx="1"/>
      <rect x="17" y="4" width="5" height="18" rx="1"/>
    </svg>
  );
}

function SkinsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}

function VolumeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
    </svg>
  );
}

function MuteIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <line x1="23" y1="9" x2="17" y2="15"/>
      <line x1="17" y1="9" x2="23" y2="15"/>
    </svg>
  );
}
// ── Player avatar SVGs for "Players Online" ──────────────────────────────────

function AvatarMonkey({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
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

function AvatarBanana({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="18" fill="#f5e060"/>
      <path d="M12 30C15 20 22 12 30 10" stroke="#f5c800" strokeWidth="7" strokeLinecap="round"/>
      <ellipse cx="30" cy="10" rx="3.5" ry="3" fill="#c8860a" transform="rotate(-30 30 10)"/>
      <ellipse cx="12" cy="30" rx="3.5" ry="3" fill="#c8860a" transform="rotate(-30 12 30)"/>
    </svg>
  );
}

function AvatarPalm({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="18" fill="#a8d878"/>
      <rect x="18" y="16" width="4" height="16" rx="2" fill="#8b5e3c"/>
      <path d="M20 16 Q10 10 8 4" stroke="#4a9a30" strokeWidth="4" strokeLinecap="round"/>
      <path d="M20 16 Q30 10 32 4" stroke="#4a9a30" strokeWidth="4" strokeLinecap="round"/>
      <path d="M20 18 Q12 14 14 8" stroke="#5ab040" strokeWidth="3.5" strokeLinecap="round"/>
      <path d="M20 18 Q28 14 26 8" stroke="#5ab040" strokeWidth="3.5" strokeLinecap="round"/>
      <path d="M20 20 Q20 12 20 8" stroke="#4a9a30" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.25);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const audio = new Audio('/sounds/lobby_theme.mp3');
    audio.loop = true;
    audio.volume = 0.25;
    audioRef.current = audio;

    function startOnInteraction() {
      if (startedRef.current) return;
      startedRef.current = true;
      audio.play().catch(() => {});
      document.removeEventListener('click', startOnInteraction);
      document.removeEventListener('keydown', startOnInteraction);
    }

    document.addEventListener('click', startOnInteraction);
    document.addEventListener('keydown', startOnInteraction);

    return () => {
      document.removeEventListener('click', startOnInteraction);
      document.removeEventListener('keydown', startOnInteraction);
      audio.pause();
    };
  }, []);

  function toggleMute() {
    const audio = audioRef.current;
    if (!audio) return;
    const next = !muted;
    audio.muted = next;
    setMuted(next);
  }

  function handleVolumeChange(val: number) {
    setVolume(val);
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = val;
    if (val === 0) { audio.muted = true; setMuted(true); }
    else { audio.muted = false; setMuted(false); }
  }

  function persistNickname() {
    if (typeof window === 'undefined') return;
    window.sessionStorage.setItem(NICKNAME_STORAGE_KEY, nickname.trim() || 'Player');
  }

  function handleCreate() {
    persistNickname();
    router.push('/room');
  }

  function handleJoin() {
    const code = joinCode.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!code) return;
    persistNickname();
    router.push(`/room?join=${encodeURIComponent(code)}`);
  }

  return (
    <div
      className="relative min-h-dvh overflow-hidden pb-20"
      style={{ background: '#f5f0c8' }}
    >
      {/* Dotted background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, #d4c84a 1.5px, transparent 1.5px)',
          backgroundSize: '28px 28px',
          opacity: 0.45,
        }}
      />

      {/* Decorative tiles */}
      <BananaTile className="absolute -left-6 top-10 rotate-[-12deg] opacity-60" />
      <BananaTile className="absolute right-2 top-6 rotate-[10deg] opacity-50" />
      <BananaTile className="absolute -left-4 bottom-28 rotate-[8deg] opacity-40" />

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-5 pt-5">
        <span className="text-lg font-extrabold" style={{ color: '#c8860a' }}>
          Banana Bomb
        </span>
        <div className="flex gap-3">
          <IconBtn aria-label="Help">
            <HelpIcon className="h-5 w-5" />
          </IconBtn>
        </div>
      </header>

      {/* Hero title */}
      <div className="relative z-10 mt-4 px-5 text-center">
        <h1
          className="text-7xl font-black leading-none tracking-tight"
          style={{
            color: '#f5c800',
            WebkitTextStroke: '3px #c8860a',
            textShadow: '4px 6px 0 #c8860a',
          }}
        >
          Banana Bomb
        </h1>
      </div>

      {/* Tagline card */}
      <div className="relative z-10 mx-5 mt-5 rounded-2xl bg-white/80 px-6 py-4 text-center shadow-sm">
        <p className="text-base font-semibold text-zinc-800">
          Hide 3 bombs on your grid. Find theirs first to win!
        </p>
        <p className="mt-1 flex items-center justify-center gap-1.5 font-bold" style={{ color: '#b03a2e' }}>
          <HeartIcon className="h-4 w-4" />
          You have 3 lives.
        </p>
      </div>

      {/* Main cards column */}
      <div className="relative z-10 mt-5 flex flex-col gap-3 px-5">
        {/* Nickname + Play card */}
        <div
          className="flex flex-col gap-3 rounded-2xl p-4"
          style={{ background: '#fffde7', border: '2.5px solid #f5c800' }}
        >
          <label className="text-xs font-extrabold uppercase tracking-widest" style={{ color: '#c8860a' }}>
            Your Nickname
          </label>
          <input
            type="text"
            maxLength={24}
            placeholder="Enter Your Name!"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="rounded-xl px-4 py-3 text-sm font-semibold text-zinc-700 placeholder:text-zinc-400 focus:outline-none"
            style={{ background: '#f0eedc' }}
          />
          <button
            type="button"
            onClick={handleCreate}
            className="flex items-center justify-center gap-2 rounded-2xl py-3 text-lg font-extrabold text-white shadow-md active:scale-95"
            style={{
              background: 'linear-gradient(180deg, #f08060 0%, #d45a30 100%)',
              boxShadow: '0 4px 0 #a03820',
            }}
          >
            Play Now!
            <BombIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Join a Friend card */}
        <div
          className="flex flex-col gap-3 rounded-2xl p-4"
          style={{ background: '#eef0e0' }}
        >
          <p className="text-base font-extrabold text-zinc-800">Join a Friend</p>
          <div className="flex gap-2">
            <input
              type="text"
              maxLength={8}
              placeholder="CODE"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              className="min-w-0 flex-1 rounded-xl px-3 py-2 text-sm font-bold uppercase tracking-widest text-zinc-500 placeholder:text-zinc-400 focus:outline-none"
              style={{ background: '#fff' }}
            />
            <button
              type="button"
              onClick={handleJoin}
              className="rounded-xl px-3 py-2 font-extrabold text-white"
              style={{ background: '#2e7d32' }}
            >
              Go
            </button>
          </div>

          {/* Players online */}
          <div>
            <p className="mb-1 text-xs font-bold text-zinc-500">Players Online</p>
            <div className="flex items-center gap-1">
              <AvatarBanana className="h-8 w-8 rounded-full" />
              <AvatarMonkey className="h-8 w-8 rounded-full" />
              <AvatarPalm className="h-8 w-8 rounded-full" />
              <span
                className="ml-1 rounded-full px-2 py-0.5 text-xs font-extrabold text-white"
                style={{ background: '#888' }}
              >
                +42
              </span>
            </div>
          </div>
        </div>
      </div>





      {/* Settings sheet backdrop */}
      {settingsOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40"
          onClick={() => setSettingsOpen(false)}
        />
      )}

      {/* Settings sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 rounded-t-3xl px-6 pb-10 pt-5 shadow-2xl transition-transform duration-300"
        style={{
          background: '#fffde7',
          transform: settingsOpen ? 'translateY(0)' : 'translateY(100%)',
        }}
      >
        <div className="mb-5 flex items-center justify-between">
          <p className="text-lg font-extrabold text-zinc-800">Settings</p>
          <button
            type="button"
            onClick={() => setSettingsOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full font-bold text-zinc-500"
            style={{ background: '#e8e0a0' }}
          >
            ✕
          </button>
        </div>

        {/* Music on/off toggle */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {muted ? <MuteIcon className="h-5 w-5 text-zinc-400" /> : <VolumeIcon className="h-5 w-5 text-zinc-700" />}
            <span className="font-bold text-zinc-700">Music</span>
          </div>
          <button
            type="button"
            onClick={toggleMute}
            className="relative h-7 w-12 rounded-full transition-colors duration-200"
            style={{ background: muted ? '#ccc' : '#6abf4b' }}
            aria-label={muted ? 'Turn music on' : 'Turn music off'}
          >
            <span
              className="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform duration-200"
              style={{ transform: muted ? 'translateX(2px)' : 'translateX(22px)' }}
            />
          </button>
        </div>

        {/* Volume slider */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-zinc-700">Volume</span>
            <span className="text-sm font-extrabold" style={{ color: '#c8860a' }}>
              {Math.round(volume * 100)}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={muted ? 0 : volume}
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
            className="w-full accent-amber-500"
          />
        </div>
      </div>

      {/* Bottom nav */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-20 flex items-center justify-around border-t px-2 py-3"
        style={{ background: '#f5f0c8', borderColor: '#e0d870' }}
      >
        <NavItem icon={<LobbyIcon className="h-5 w-5" />} label="LOBBY" active />
        <NavItem icon={<LeaderboardIcon className="h-5 w-5" />} label="LEADERBOARD" />
        <NavItem icon={<SkinsIcon className="h-5 w-5" />} label="SKINS" />
        <NavItem icon={<SettingsIcon className="h-5 w-5" />} label="SETTINGS" onClick={() => setSettingsOpen(true)} />
      </nav>
    </div>
  );
}

function IconBtn({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className="flex h-9 w-9 items-center justify-center rounded-full"
      style={{ background: '#e8e0a0', color: '#7a6a20' }}
      {...props}
    >
      {children}
    </button>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex flex-col items-center gap-0.5">
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-full ${active ? 'text-white' : 'text-zinc-500'}`}
        style={active ? { background: '#6abf4b' } : {}}
      >
        {icon}
      </span>
      <span className={`text-[10px] font-extrabold tracking-wider ${active ? 'text-zinc-800' : 'text-zinc-400'}`}>
        {label}
      </span>
    </button>
  );
}

function BananaTile({ className }: { className?: string }) {
  return (
    <div
      className={`h-28 w-28 rounded-2xl ${className}`}
      style={{ background: '#e8e0a0' }}
      aria-hidden="true"
    >
      <div className="flex h-full w-full items-center justify-center opacity-50">
        <BananaIcon className="h-16 w-16" />
      </div>
    </div>
  );
}
