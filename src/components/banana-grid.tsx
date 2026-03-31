'use client';

type GridMode = 'placement' | 'attack' | 'own';

interface BananaGridProps {
  mode: GridMode;
  title: string;
  onCellClick?: (index: number) => void;
  selectedCells?: readonly number[];
  revealed?: Record<number, 'safe' | 'bomb'>;
  myBombs?: readonly number[] | null;
  disabled?: boolean;
}

function Bananasvg() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-7 w-7">
      <path d="M14 50C18 34 28 16 50 10" stroke="#f5c800" strokeWidth="10" strokeLinecap="round"/>
      <ellipse cx="50" cy="10" rx="4" ry="3.5" fill="#c8860a" transform="rotate(-30 50 10)"/>
      <ellipse cx="14" cy="50" rx="4" ry="3.5" fill="#c8860a" transform="rotate(-30 14 50)"/>
    </svg>
  );
}

function BombSvg() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-7 w-7">
      <circle cx="30" cy="36" r="18" fill="url(#bg3)"/>
      <path d="M36 20 Q42 12 48 10" stroke="#888" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="48" cy="9" r="3" fill="#f5c800"/>
      <circle cx="23" cy="29" r="3.5" fill="white" opacity="0.2"/>
      <defs>
        <radialGradient id="bg3" cx="35%" cy="30%">
          <stop offset="0%" stopColor="#555"/>
          <stop offset="100%" stopColor="#1a1a1a"/>
        </radialGradient>
      </defs>
    </svg>
  );
}

function ExplosionSvg() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-7 w-7">
      <circle cx="32" cy="32" r="16" fill="#f5c800" opacity="0.9"/>
      <circle cx="32" cy="32" r="10" fill="#f08060"/>
      <circle cx="32" cy="32" r="5" fill="#d45a30"/>
      {[0,45,90,135,180,225,270,315].map((deg, i) => (
        <line
          key={i}
          x1="32" y1="32"
          x2={32 + 22 * Math.cos((deg * Math.PI) / 180)}
          y2={32 + 22 * Math.sin((deg * Math.PI) / 180)}
          stroke="#f5c800" strokeWidth="3" strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

function SafeSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#6abf4b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

export function BananaGrid({
  mode,
  title,
  onCellClick,
  selectedCells = [],
  revealed = {},
  myBombs = null,
  disabled = false,
}: BananaGridProps) {
  const selectedSet = new Set(selectedCells);
  const bombSet = myBombs ? new Set(myBombs) : null;

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-extrabold uppercase tracking-widest" style={{ color: '#c8860a' }}>{title}</h3>
      <div className="grid max-w-xs grid-cols-3 gap-2">
        {Array.from({ length: 9 }, (_, i) => {
          const isRevealed = revealed[i] !== undefined;
          const result = revealed[i];
          const isBombMine = bombSet?.has(i) ?? false;
          const isSelected = selectedSet.has(i);

          let visual: React.ReactNode = <Bananasvg />;
          let bg = '#f0eedc';
          let border = '2px solid #e0d870';
          let hoverBg = '#e8e060';

          if (mode === 'own') {
            if (isRevealed) {
              visual = result === 'bomb' ? <ExplosionSvg /> : <SafeSvg />;
              bg = result === 'bomb' ? '#ffe0e0' : '#e0f5e0';
              border = result === 'bomb' ? '2px solid #f08060' : '2px solid #6abf4b';
            } else if (isBombMine) {
              visual = <BombSvg />;
              bg = '#fff8e0';
              border = '2px solid #f5c800';
            }
          } else if (mode === 'placement') {
            visual = isSelected ? <BombSvg /> : <Bananasvg />;
            bg = isSelected ? '#fff8e0' : '#f0eedc';
            border = isSelected ? '2px solid #f5c800' : '2px solid #e0d870';
          } else {
            // attack
            if (isRevealed) {
              visual = result === 'bomb' ? <ExplosionSvg /> : <SafeSvg />;
              bg = result === 'bomb' ? '#ffe0e0' : '#e0f5e0';
              border = result === 'bomb' ? '2px solid #f08060' : '2px solid #6abf4b';
            }
          }

          const clickable =
            !disabled &&
            onCellClick &&
            (mode === 'placement' || (mode === 'attack' && !isRevealed));

          return (
            <button
              key={i}
              type="button"
              disabled={disabled || !clickable}
              onClick={() => clickable && onCellClick?.(i)}
              className="flex aspect-square items-center justify-center rounded-2xl transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none"
              style={{
                background: bg,
                border,
                minHeight: '64px',
              }}
              onMouseEnter={(e) => { if (clickable) (e.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
              onMouseLeave={(e) => { if (clickable) (e.currentTarget as HTMLButtonElement).style.background = bg; }}
            >
              {visual}
            </button>
          );
        })}
      </div>
    </div>
  );
}
