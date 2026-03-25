import { randomBytes, randomInt } from 'node:crypto';

import type { WebSocket } from 'ws';

import type {
  ClientMessage,
  GameRoom,
  PlayerSlot,
  PublicState,
  ServerMessage,
} from './types.js';

const ROOM_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generateRoomCode(): string {
  const buf = randomBytes(8);
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += ROOM_CHARS[buf[i]! % ROOM_CHARS.length]!;
  }
  return code;
}

function isValidBombSet(cells: number[]): boolean {
  if (cells.length !== 3) {
    return false;
  }
  const set = new Set(cells);
  if (set.size !== 3) {
    return false;
  }
  return cells.every((c) => Number.isInteger(c) && c >= 0 && c <= 8);
}

function send(ws: WebSocket, msg: ServerMessage) {
  if (ws.readyState === 1) {
    ws.send(JSON.stringify(msg));
  }
}

function buildPublicState(
  room: GameRoom,
  forPlayerIndex: 0 | 1,
): PublicState {
  const p0 = room.players[0];
  const p1 = room.players[1];

  const players: PublicState['players'] = [
    p0
      ? {
          nickname: p0.nickname,
          lives: p0.lives,
          placementReady: p0.ready,
          hasPlacedBombs: p0.bombs !== null && p0.bombs.size === 3,
        }
      : null,
    p1
      ? {
          nickname: p1.nickname,
          lives: p1.lives,
          placementReady: p1.ready,
          hasPlacedBombs: p1.bombs !== null && p1.bombs.size === 3,
        }
      : null,
  ];

  const myAttacks: Record<number, 'safe' | 'bomb'> = {};
  const attacksOnMe: Record<number, 'safe' | 'bomb'> = {};
  const defenderMe = forPlayerIndex;
  const defenderOpp = (1 - forPlayerIndex) as 0 | 1;

  for (const [cellStr, v] of Object.entries(room.revealed[defenderOpp])) {
    myAttacks[Number(cellStr)] = v;
  }
  for (const [cellStr, v] of Object.entries(room.revealed[defenderMe])) {
    attacksOnMe[Number(cellStr)] = v;
  }

  const me = room.players[forPlayerIndex];
  const myBombCells =
    me?.bombs && me.bombs.size === 3 ? [...me.bombs].sort((a, b) => a - b) : null;

  return {
    phase: room.phase,
    roomCode: room.code,
    players,
    myIndex: forPlayerIndex,
    myAttacks,
    attacksOnMe,
    myBombCells,
    currentTurn: room.currentTurn,
    winnerIndex: room.winnerIndex,
  };
}

export class RoomManager {
  private readonly rooms = new Map<string, GameRoom>();
  private readonly playerRoom = new Map<string, string>();

  private readonly sockets = new Map<string, WebSocket>();

  attachSocket(socketId: string, ws: WebSocket) {
    this.sockets.set(socketId, ws);
  }

  detachSocket(socketId: string) {
    this.sockets.delete(socketId);
    const roomCode = this.playerRoom.get(socketId);
    if (!roomCode) {
      return;
    }
    this.playerRoom.delete(socketId);
    const room = this.rooms.get(roomCode);
    if (!room) {
      return;
    }

    let slot: 0 | 1 | null = null;
    if (room.players[0]?.id === socketId) {
      slot = 0;
    } else if (room.players[1]?.id === socketId) {
      slot = 1;
    }
    if (slot === null) {
      return;
    }

    room.players[slot] = null;

    const other = room.players[1 - slot];
    if (other && room.phase !== 'ended') {
      room.phase = 'ended';
      room.winnerIndex = 1 - slot;
      room.currentTurn = null;
      send(other.ws, {
        type: 'state',
        roomState: buildPublicState(room, 1 - slot),
      });
    }

    if (!room.players[0] && !room.players[1]) {
      this.rooms.delete(roomCode);
    }
  }

  handleMessage(socketId: string, raw: string) {
    let msg: ClientMessage;
    try {
      msg = JSON.parse(raw) as ClientMessage;
    } catch {
      this.sendError(socketId, 'Invalid JSON');
      return;
    }

    let roomCode = this.playerRoom.get(socketId);

    try {
      if (msg.type === 'create_room') {
        const nick = String(msg.nickname ?? '').trim() || 'Player';
        this.createRoom(socketId, nick);
        return;
      }

      if (msg.type === 'join_room') {
        const code = String(msg.roomCode ?? '')
          .trim()
          .toUpperCase();
        const nick = String(msg.nickname ?? '').trim() || 'Player';
        this.joinRoom(socketId, code, nick);
        return;
      }

      if (!roomCode) {
        this.sendError(socketId, 'Join or create a room first');
        return;
      }

      const room = this.rooms.get(roomCode);
      if (!room) {
        this.sendError(socketId, 'Room not found');
        return;
      }

      const idx = this.getPlayerIndex(room, socketId);
      if (idx === null) {
        this.sendError(socketId, 'Not in this room');
        return;
      }

      if (msg.type === 'place_bombs') {
        this.placeBombs(room, idx, msg.cells);
        return;
      }
      if (msg.type === 'set_ready') {
        this.setReady(room, idx);
        return;
      }
      if (msg.type === 'pick_cell') {
        this.pickCell(room, idx, msg.cell);
        return;
      }

      this.sendError(socketId, 'Unknown message');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      this.sendError(socketId, message);
    }
  }

  private sendError(socketId: string, message: string) {
    const ws = this.sockets.get(socketId);
    if (ws) {
      send(ws, { type: 'error', message });
    }
  }

  private sendState(room: GameRoom) {
    for (let i = 0; i < 2; i++) {
      const p = room.players[i];
      if (!p) {
        continue;
      }
      send(p.ws, {
        type: 'state',
        roomState: buildPublicState(room, i as 0 | 1),
      });
    }
  }

  private getPlayerIndex(room: GameRoom, socketId: string): 0 | 1 | null {
    if (room.players[0]?.id === socketId) {
      return 0;
    }
    if (room.players[1]?.id === socketId) {
      return 1;
    }
    return null;
  }

  private createRoom(socketId: string, nickname: string): string {
    if (this.playerRoom.has(socketId)) {
      throw new Error('Already in a room');
    }

    let code = generateRoomCode();
    while (this.rooms.has(code)) {
      code = generateRoomCode();
    }

    const ws = this.sockets.get(socketId);
    if (!ws) {
      throw new Error('No socket');
    }

    const player: PlayerSlot = {
      id: socketId,
      ws,
      nickname,
      bombs: null,
      ready: false,
      lives: 3,
    };

    const room: GameRoom = {
      code,
      players: [player, null],
      phase: 'waiting',
      currentTurn: null,
      winnerIndex: null,
      revealed: [{}, {}],
    };

    this.rooms.set(code, room);
    this.playerRoom.set(socketId, code);

    send(ws, {
      type: 'room_created',
      roomCode: code,
      roomState: buildPublicState(room, 0),
    });

    return code;
  }

  private joinRoom(socketId: string, code: string, nickname: string) {
    if (this.playerRoom.has(socketId)) {
      throw new Error('Already in a room');
    }

    const room = this.rooms.get(code);
    if (!room) {
      throw new Error('Room not found');
    }

    if (room.players[1]?.id) {
      throw new Error('Room is full');
    }

    if (room.players[0]?.id === socketId) {
      throw new Error('Already in this room');
    }

    const ws = this.sockets.get(socketId);
    if (!ws) {
      throw new Error('No socket');
    }

    const player: PlayerSlot = {
      id: socketId,
      ws,
      nickname,
      bombs: null,
      ready: false,
      lives: 3,
    };

    room.players[1] = player;
    room.phase = 'placement';

    this.playerRoom.set(socketId, code);

    send(ws, {
      type: 'state',
      roomState: buildPublicState(room, 1),
    });

    const host = room.players[0];
    if (host) {
      send(host.ws, {
        type: 'state',
        roomState: buildPublicState(room, 0),
      });
    }
  }

  private placeBombs(room: GameRoom, idx: 0 | 1, cells: number[]) {
    if (room.phase !== 'placement') {
      throw new Error('Not in placement phase');
    }

    const p = room.players[idx];
    if (!p) {
      throw new Error('No player');
    }

    if (!isValidBombSet(cells)) {
      throw new Error('Pick exactly 3 different cells (0–8)');
    }

    p.bombs = new Set(cells);
    p.ready = false;

    this.sendState(room);
  }

  private setReady(room: GameRoom, idx: 0 | 1) {
    if (room.phase !== 'placement') {
      throw new Error('Not in placement phase');
    }

    const p = room.players[idx];
    if (!p || !p.bombs || p.bombs.size !== 3) {
      throw new Error('Place 3 bombs first');
    }

    p.ready = true;

    const p0 = room.players[0];
    const p1 = room.players[1];

    if (
      p0?.ready &&
      p1?.ready &&
      p0.bombs &&
      p1.bombs &&
      p0.bombs.size === 3 &&
      p1.bombs.size === 3
    ) {
      room.phase = 'playing';
      room.currentTurn = randomInt(0, 2) as 0 | 1;
      room.winnerIndex = null;
    }

    this.sendState(room);
  }

  private pickCell(room: GameRoom, pickerIndex: 0 | 1, cell: number) {
    if (room.phase !== 'playing') {
      throw new Error('Game not in progress');
    }

    if (room.currentTurn !== pickerIndex) {
      throw new Error('Not your turn');
    }

    if (!Number.isInteger(cell) || cell < 0 || cell > 8) {
      throw new Error('Invalid cell');
    }

    const defenderIndex = (1 - pickerIndex) as 0 | 1;
    const defender = room.players[defenderIndex];
    const picker = room.players[pickerIndex];

    if (!defender?.bombs || !picker) {
      throw new Error('Invalid players');
    }

    if (room.revealed[defenderIndex][cell] !== undefined) {
      throw new Error('Cell already picked');
    }

    const isBomb = defender.bombs.has(cell);
    room.revealed[defenderIndex][cell] = isBomb ? 'bomb' : 'safe';

    if (isBomb) {
      picker.lives -= 1;
    }

    if (picker.lives <= 0) {
      room.phase = 'ended';
      room.winnerIndex = defenderIndex;
      room.currentTurn = null;
      this.sendState(room);
      return;
    }

    room.currentTurn = defenderIndex;

    this.sendState(room);
  }
}
