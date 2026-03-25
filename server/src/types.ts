import type { WebSocket } from 'ws';

export type Phase = 'waiting' | 'placement' | 'playing' | 'ended';

export type ClientMessage =
  | { type: 'create_room'; nickname: string }
  | { type: 'join_room'; roomCode: string; nickname: string }
  | { type: 'place_bombs'; cells: number[] }
  | { type: 'set_ready' }
  | { type: 'pick_cell'; cell: number };

export type ServerMessage =
  | { type: 'state'; roomState: PublicState }
  | { type: 'error'; message: string }
  | { type: 'room_created'; roomCode: string; roomState: PublicState };

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
  /** This player's picks on the opponent's grid */
  myAttacks: Record<number, 'safe' | 'bomb'>;
  /** Opponent's picks on this player's grid */
  attacksOnMe: Record<number, 'safe' | 'bomb'>;
  /** Your bomb cells — only sent to you, for rendering your own grid */
  myBombCells: number[] | null;
  currentTurn: 0 | 1 | null;
  winnerIndex: 0 | 1 | null;
}

export interface PlayerSlot {
  id: string;
  ws: WebSocket;
  nickname: string;
  bombs: Set<number> | null;
  ready: boolean;
  lives: number;
}

export interface GameRoom {
  code: string;
  players: [PlayerSlot | null, PlayerSlot | null];
  phase: Phase;
  currentTurn: 0 | 1 | null;
  winnerIndex: 0 | 1 | null;
  /** revealed[defenderIndex][cell] */
  revealed: [
    Record<number, 'safe' | 'bomb'>,
    Record<number, 'safe' | 'bomb'>,
  ];
}
