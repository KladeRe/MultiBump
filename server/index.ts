import WebSocket, { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 5228 });
interface Coordinates {
  x: number;
  y: number;
}

wss.on('connection', (ws) => {
  ws.on('message', (message: string) => {
    const data = JSON.parse(message);
    try {
      const coordinates: Coordinates = data.payload;
      if (data.type == 'position') {
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
        ws.send(JSON.stringify({ type: 'joined', payload: room}));
      }

    } catch (e) {
      ws.send('Error parsing message');
    }
  });
});

