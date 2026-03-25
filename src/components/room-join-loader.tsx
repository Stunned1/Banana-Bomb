'use client';

import { useSearchParams } from 'next/navigation';

import { GameRoomClient } from '@/components/game-room-client';

export function RoomJoinLoader() {
  const searchParams = useSearchParams();
  const join = searchParams.get('join');
  const initialJoinCode = join
    ? join.toUpperCase().replace(/[^A-Z0-9]/g, '') || null
    : null;

  return <GameRoomClient initialJoinCode={initialJoinCode} />;
}
