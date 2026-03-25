import { randomUUID } from 'node:crypto';
import http from 'node:http';

import { WebSocketServer } from 'ws';

import { logger } from './logger.js';
import { RoomManager } from './room-manager.js';

const port = Number(process.env.PORT) || 4000;

const roomManager = new RoomManager();

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  res.writeHead(404);
  res.end();
});

const wss = new WebSocketServer({ server });

wss.on('connection', (socket) => {
  const socketId = randomUUID();
  roomManager.attachSocket(socketId, socket);

  socket.on('message', (data) => {
    try {
      const text = data.toString();
      roomManager.handleMessage(socketId, text);
    } catch (e) {
      logger.error('message handler', {
        err: e instanceof Error ? e.message : String(e),
      });
    }
  });

  socket.on('close', () => {
    roomManager.detachSocket(socketId);
  });
});

const host = process.env.HOST ?? '0.0.0.0';

server.listen(port, host, () => {
  logger.info(`listening`, { host, port });
});
