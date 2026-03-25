import { Suspense } from 'react';

import { RoomJoinLoader } from '@/components/room-join-loader';

export default function RoomPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-lg px-6 py-16 text-zinc-400">
          Loading…
        </div>
      }
    >
      <RoomJoinLoader />
    </Suspense>
  );
}
