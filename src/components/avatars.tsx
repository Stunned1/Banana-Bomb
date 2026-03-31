// All avatars are 80x80 viewBox SVGs

export interface Avatar {
  id: string;
  label: string;
  component: (props: { className?: string }) => React.ReactElement;
}

// ── 1. Monkey ────────────────────────────────────────────────────────────────
function Monkey({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none">
      {/* ears */}
      <ellipse cx="14" cy="44" rx="9" ry="11" fill="#a06010"/>
      <ellipse cx="66" cy="44" rx="9" ry="11" fill="#a06010"/>
      <ellipse cx="14" cy="44" rx="5" ry="7" fill="#e8a830"/>
      <ellipse cx="66" cy="44" rx="5" ry="7" fill="#e8a830"/>
      {/* head */}
      <ellipse cx="40" cy="38" rx="26" ry="28" fill="#c8860a"/>
      {/* face patch */}
      <ellipse cx="40" cy="48" rx="17" ry="14" fill="#e8a830"/>
      {/* eyes */}
      <circle cx="31" cy="34" r="6" fill="white"/>
      <circle cx="49" cy="34" r="6" fill="white"/>
      <circle cx="32" cy="35" r="3.5" fill="#1a1a1a"/>
      <circle cx="50" cy="35" r="3.5" fill="#1a1a1a"/>
      <circle cx="33" cy="33.5" r="1.2" fill="white"/>
      <circle cx="51" cy="33.5" r="1.2" fill="white"/>
      {/* nose */}
      <ellipse cx="40" cy="43" rx="5" ry="3.5" fill="#b07020"/>
      <circle cx="38" cy="43" r="1.5" fill="#7a4a10"/>
      <circle cx="42" cy="43" r="1.5" fill="#7a4a10"/>
      {/* smile */}
      <path d="M33 51 Q40 57 47 51" stroke="#7a4a10" strokeWidth="2" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

// ── 2. Banana Head ───────────────────────────────────────────────────────────
function BananaHead({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none">
      {/* banana-shaped head */}
      <path d="M20 55 Q10 30 30 12 Q50 4 62 20 Q72 38 55 58 Q42 70 28 65 Z" fill="#f5c800"/>
      <path d="M20 55 Q10 30 30 12 Q50 4 62 20 Q72 38 55 58 Q42 70 28 65 Z" stroke="#c8860a" strokeWidth="2.5" fill="none"/>
      {/* eyes */}
      <circle cx="35" cy="32" r="5.5" fill="white"/>
      <circle cx="52" cy="28" r="5.5" fill="white"/>
      <circle cx="36" cy="33" r="3" fill="#1a1a1a"/>
      <circle cx="53" cy="29" r="3" fill="#1a1a1a"/>
      <circle cx="37" cy="31.5" r="1" fill="white"/>
      <circle cx="54" cy="27.5" r="1" fill="white"/>
      {/* mouth */}
      <path d="M34 46 Q42 53 50 46" stroke="#c8860a" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      {/* blush */}
      <ellipse cx="28" cy="42" rx="5" ry="3" fill="#f08060" opacity="0.5"/>
      <ellipse cx="56" cy="38" rx="5" ry="3" fill="#f08060" opacity="0.5"/>
    </svg>
  );
}

// ── 3. Explorer ──────────────────────────────────────────────────────────────
function Explorer({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none">
      {/* hat brim */}
      <ellipse cx="40" cy="22" rx="30" ry="6" fill="#c8860a"/>
      {/* hat top */}
      <rect x="22" y="6" width="36" height="18" rx="4" fill="#e8a830"/>
      {/* hat band */}
      <rect x="22" y="18" width="36" height="5" fill="#c8860a"/>
      {/* head */}
      <ellipse cx="40" cy="50" rx="22" ry="24" fill="#f5d5a0"/>
      {/* eyes */}
      <circle cx="32" cy="46" r="5" fill="white"/>
      <circle cx="48" cy="46" r="5" fill="white"/>
      <circle cx="33" cy="47" r="3" fill="#3a2a10"/>
      <circle cx="49" cy="47" r="3" fill="#3a2a10"/>
      <circle cx="34" cy="45.5" r="1" fill="white"/>
      <circle cx="50" cy="45.5" r="1" fill="white"/>
      {/* eyebrows */}
      <path d="M28 41 Q32 38 36 41" stroke="#8a5a20" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M44 41 Q48 38 52 41" stroke="#8a5a20" strokeWidth="2" strokeLinecap="round" fill="none"/>
      {/* nose */}
      <ellipse cx="40" cy="53" rx="3" ry="2" fill="#e0b080"/>
      {/* smile */}
      <path d="M33 60 Q40 66 47 60" stroke="#8a5a20" strokeWidth="2" strokeLinecap="round" fill="none"/>
      {/* teeth */}
      <path d="M36 60 Q40 64 44 60" fill="white"/>
    </svg>
  );
}

// ── 4. Ninja ─────────────────────────────────────────────────────────────────
function Ninja({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none">
      {/* head */}
      <ellipse cx="40" cy="42" rx="26" ry="28" fill="#2a2a2a"/>
      {/* mask wrap */}
      <rect x="14" y="46" width="52" height="18" rx="4" fill="#1a1a1a"/>
      {/* headband */}
      <rect x="14" y="24" width="52" height="10" rx="3" fill="#d45a30"/>
      {/* headband knot */}
      <ellipse cx="62" cy="29" rx="6" ry="4" fill="#f08060"/>
      {/* eyes */}
      <circle cx="31" cy="42" r="6" fill="white"/>
      <circle cx="49" cy="42" r="6" fill="white"/>
      <circle cx="32" cy="43" r="3.5" fill="#1a1a1a"/>
      <circle cx="50" cy="43" r="3.5" fill="#1a1a1a"/>
      <circle cx="33" cy="41" r="1.2" fill="white"/>
      <circle cx="51" cy="41" r="1.2" fill="white"/>
      {/* mask line */}
      <line x1="14" y1="46" x2="66" y2="46" stroke="#333" strokeWidth="1.5"/>
    </svg>
  );
}

// ── 5. Chef ──────────────────────────────────────────────────────────────────
function Chef({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none">
      {/* chef hat */}
      <ellipse cx="40" cy="20" rx="22" ry="8" fill="white"/>
      <rect x="24" y="8" width="32" height="16" rx="6" fill="white"/>
      <ellipse cx="40" cy="8" rx="14" ry="8" fill="white"/>
      {/* hat band */}
      <rect x="22" y="22" width="36" height="6" rx="2" fill="#e0d0b0"/>
      {/* head */}
      <ellipse cx="40" cy="52" rx="22" ry="22" fill="#f5d5a0"/>
      {/* eyes */}
      <circle cx="32" cy="48" r="5" fill="white"/>
      <circle cx="48" cy="48" r="5" fill="white"/>
      <circle cx="33" cy="49" r="3" fill="#3a2a10"/>
      <circle cx="49" cy="49" r="3" fill="#3a2a10"/>
      <circle cx="34" cy="47.5" r="1" fill="white"/>
      <circle cx="50" cy="47.5" r="1" fill="white"/>
      {/* rosy cheeks */}
      <ellipse cx="26" cy="55" rx="5" ry="3.5" fill="#f08060" opacity="0.5"/>
      <ellipse cx="54" cy="55" rx="5" ry="3.5" fill="#f08060" opacity="0.5"/>
      {/* smile */}
      <path d="M32 60 Q40 68 48 60" stroke="#8a5a20" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M35 60 Q40 65 45 60" fill="white"/>
      {/* mustache */}
      <path d="M30 56 Q35 53 40 56 Q45 53 50 56" stroke="#8a5a20" strokeWidth="2" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

// ── 6. Pirate ────────────────────────────────────────────────────────────────
function Pirate({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none">
      {/* hat */}
      <path d="M12 32 L40 8 L68 32 Z" fill="#1a1a1a"/>
      <rect x="10" y="30" width="60" height="8" rx="3" fill="#2a2a2a"/>
      {/* skull on hat */}
      <circle cx="40" cy="20" r="6" fill="white"/>
      <circle cx="37" cy="19" r="1.5" fill="#1a1a1a"/>
      <circle cx="43" cy="19" r="1.5" fill="#1a1a1a"/>
      <path d="M37 23 L38 25 L40 24 L42 25 L43 23" fill="#1a1a1a"/>
      {/* head */}
      <ellipse cx="40" cy="54" rx="22" ry="22" fill="#f5d5a0"/>
      {/* eye patch */}
      <circle cx="31" cy="50" r="8" fill="#1a1a1a"/>
      <line x1="23" y1="46" x2="14" y2="42" stroke="#1a1a1a" strokeWidth="2.5"/>
      <line x1="39" y1="46" x2="46" y2="42" stroke="#1a1a1a" strokeWidth="2.5"/>
      {/* good eye */}
      <circle cx="49" cy="50" r="5.5" fill="white"/>
      <circle cx="50" cy="51" r="3" fill="#3a2a10"/>
      <circle cx="51" cy="49.5" r="1" fill="white"/>
      {/* scar */}
      <path d="M34 58 L38 66" stroke="#c08060" strokeWidth="1.5" strokeLinecap="round"/>
      {/* smile */}
      <path d="M32 62 Q40 70 48 62" stroke="#8a5a20" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

export const AVATARS: Avatar[] = [
  { id: 'monkey',      label: 'Monkey',      component: Monkey },
  { id: 'banana-head', label: 'Banana Head', component: BananaHead },
  { id: 'explorer',   label: 'Explorer',    component: Explorer },
  { id: 'ninja',      label: 'Ninja',       component: Ninja },
  { id: 'chef',       label: 'Chef',        component: Chef },
  { id: 'pirate',     label: 'Pirate',      component: Pirate },
];

export function getAvatarById(id: string): Avatar {
  return AVATARS.find((a) => a.id === id) ?? AVATARS[0];
}
