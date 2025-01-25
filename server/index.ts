import WebSocket, { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 5228 });
interface Coordinates {
  x: number;
  y: number;
};

interface RoomParticipants {
  [key: string]: Set<WebSocket>;
};

const rooms: RoomParticipants = {}

wss.on('connection', (ws) => {
  let currentRoom: string | null = null;
  ws.on('message', (message: string) => {
    try {
      const data = JSON.parse(message);
      if (data.type == 'position') {
        const coordinates: Coordinates = data.payload;
        if (typeof coordinates.x === 'number' && typeof coordinates.y === 'number') {

          wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({ type: 'coordinates', payload: coordinates }));
            }
          });

        } else {
          ws.send('Invalid coordinates');
        }
      } else if (data.type == 'join') {
        const room = data.payload;
        if (!rooms[room]) {
          rooms[room] = new Set();
        }
        rooms[room].add(ws);
        currentRoom = room;
        ws.send(JSON.stringify({ type: 'joined', payload: room}));
      }

    } catch (e) {
      ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
    }
  });
  ws.on('close', () => {
    if (currentRoom && rooms[currentRoom]) {
      rooms[currentRoom].delete(ws);
      if (rooms[currentRoom].size === 0) {
        delete rooms[currentRoom];
      }
    }
  });
});

