import WebSocket, { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 5228 });

wss.on('connection', (ws) => {
  ws.send('Welcome to the game');

  ws.on('message', (message: string) => {
    console.log('Received message:', message);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});