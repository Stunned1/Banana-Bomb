'use client';

type GridMode = 'placement' | 'attack' | 'own';

interface BananaGridProps {
  mode: GridMode;
  title: string;
  onCellClick?: (index: number) => void;
  selectedCells?: readonly number[];
  /** Cells you have attacked (opponent grid) or revealed on own grid */
  revealed?: Record<number, 'safe' | 'bomb'>;
  /** Your bomb positions — only on own grid */
  myBombs?: readonly number[] | null;
  disabled?: boolean;
}

const cellClass =
  'flex aspect-square min-h-14 items-center justify-center rounded-xl border text-lg font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-50';

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
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-zinc-300">{title}</h3>
      <div className="grid max-w-sm grid-cols-3 gap-2">
        {Array.from({ length: 9 }, (_, i) => {
          const isRevealed = revealed[i] !== undefined;
          const result = revealed[i];
          const isBombMine = bombSet?.has(i) ?? false;
          const isSelected = selectedSet.has(i);

          let visual = '🍌';
          let bg = 'border-zinc-700 bg-zinc-900/80 hover:bg-zinc-800';

          if (mode === 'own') {
            if (isRevealed) {
              visual = result === 'bomb' ? '💥' : '✓';
              bg =
                result === 'bomb'
                  ? 'border-rose-500/60 bg-rose-950/50'
                  : 'border-emerald-500/50 bg-emerald-950/40';
            } else if (isBombMine) {
              visual = '🧨';
              bg = 'border-amber-600/50 bg-amber-950/30';
            }
          } else if (mode === 'placement') {
            visual = isSelected ? '🧨' : '🍌';
            bg = isSelected
              ? 'border-amber-500/70 bg-amber-950/40'
              : 'border-zinc-700 bg-zinc-900/80 hover:bg-zinc-800';
          } else {
            if (isRevealed) {
              visual = result === 'bomb' ? '💥' : '✓';
              bg =
                result === 'bomb'
                  ? 'border-rose-500/60 bg-rose-950/50'
                  : 'border-emerald-500/50 bg-emerald-950/40';
            }
          }

          const clickable =
            !disabled &&
            onCellClick &&
            (mode === 'placement' ||
              (mode === 'attack' && !isRevealed));

          return (
            <button
              key={i}
              type="button"
              disabled={disabled || !clickable}
              className={`${cellClass} ${bg}`}
              onClick={() => clickable && onCellClick?.(i)}
            >
              {visual}
            </button>
          );
        })}
      </div>
    </div>
  );
}
