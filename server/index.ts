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

      if (data.type === 'join') {
        const room = data.room;
        if (!rooms[room]) {
          rooms[room] = new Set();
        }
        rooms[room].add(ws);
        currentRoom = room;
      } else if (currentRoom) {
        const coordinates: Coordinates = JSON.parse(message);
        if (typeof coordinates.x === 'number' && typeof coordinates.y === 'number') {
          wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(coordinates));
            }
          });
        } else {
          ws.send(JSON.stringify({ type: 'error', message: 'Invalid input' }));
          }
      }
    } catch (e) {
      ws.send('Error parsing message');
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

