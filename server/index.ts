import WebSocket, { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 5228 });
interface Coordinates {
  x: number;
  y: number;
}

wss.on('connection', (ws) => {
  ws.on('message', (message: string) => {
    try {
      console.log(message)
      const coordinates: Coordinates = JSON.parse(message);
      if (typeof coordinates.x === 'number' && typeof coordinates.y === 'number') {
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(coordinates));
          }
        });
      } else {
        ws.send('Invalid coordinates');
      }
    } catch (e) {
      ws.send('Error parsing message');
    }
  });
});

