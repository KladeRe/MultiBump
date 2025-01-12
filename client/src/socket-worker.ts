// Define message types for communication between worker and main thread
interface Position {
  x: number,
  y: number
}

type WorkerMessage = {
  type: 'connect' | 'join' | 'send' | 'close';
  payload?: Position | string;
};

let websocket: WebSocket | null = null;
let currentRoom: string | null = null;

// Handle messages from the main thread
self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const { type, payload } = event.data;

  switch (type) {
    case 'connect':
      if (typeof payload !== 'string') {
        throw new Error('Invalid payload: Expected string type')
      }
      connect(payload);
      break;
    case 'join':
      if (typeof payload !== 'string') {
        throw new Error('Invalid payload: Expected string type');
      }
      currentRoom = payload;
      if (websocket && websocket.readyState === WebSocket.OPEN) {
        websocket.send(JSON.stringify({ type: 'join', room: currentRoom }));
      }
      break;
    case 'send':
      if (typeof payload !== 'object' || !('x' in payload) || !('y' in payload)) {
        throw new Error('Invalid payload: expected Position object');
      }
      console.log("Sending message")
      if (websocket && websocket.readyState === WebSocket.OPEN) {
        websocket.send(JSON.stringify({ type: 'position', payload: payload }));
      }
      break;
    case 'close':
      if (websocket) {
        websocket.close();
      }
      break;
  }
};

// Connect to WebSocket server
const connect = (url: string) => {
  try {
    websocket = new WebSocket(url);

    websocket.onopen = () => {
      self.postMessage({ type: 'connected' });
      if (currentRoom) {
        websocket?.send(JSON.stringify({ type: 'join', room: currentRoom}));
      }
    };

    websocket.onmessage = (event) => {
      const { type, payload } = JSON.parse(event.data);
      if (type === 'joined') {
        console.log(`Joined room: ${payload.room}`);
      } else if (type === 'coordinates') {
        self.postMessage({ type: 'coordinates', payload });
      } else if (type === 'error') {
        console.error('WebSocket error:', payload.message);
      }
    };

    websocket.onerror = (error) => {
      self.postMessage({ type: 'error', payload: error });
    };

    websocket.onclose = () => {
      console.log('Websocket disconnected');
      websocket = null;
    };
  } catch (error) {
    self.postMessage({ type: 'error', payload: error });
  }
}
