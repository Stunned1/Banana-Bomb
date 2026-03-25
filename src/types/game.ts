export type Phase = 'waiting' | 'placement' | 'playing' | 'ended';

export interface PublicPlayerState {
  nickname: string;
  lives: number;
  placementReady: boolean;
  hasPlacedBombs: boolean;
}

export interface PublicState {
  phase: Phase;
  roomCode: string;
  players: [PublicPlayerState | null, PublicPlayerState | null];
  myIndex: 0 | 1;
  myAttacks: Record<number, 'safe' | 'bomb'>;
  attacksOnMe: Record<number, 'safe' | 'bomb'>;
  myBombCells: number[] | null;
  currentTurn: 0 | 1 | null;
  winnerIndex: 0 | 1 | null;
}

export type ServerPayload =
  | { type: 'state'; roomState: PublicState }
  | { type: 'room_created'; roomCode: string; roomState: PublicState }
  | { type: 'error'; message: string };
