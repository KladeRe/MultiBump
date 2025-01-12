interface Position {
  x: number,
  y: number
}

type WorkerMessage = {
  type: 'connect' | 'send' | 'close' | 'join';
  payload?: Position | string;
};

let websocket: WebSocket | null = null;

// Handle messages from the main thread
self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const { type, payload } = event.data;

  switch (type) {
    case 'connect':
      if (typeof payload !== 'string') {
        throw new Error('Invalid payload: Expected string type');
      }
      connect(payload);
      break;
    case 'send':
      if (typeof payload !== 'object' || !('x' in payload) || !('y' in payload)) {
        throw new Error('Invalid payload: Expected Position object');
      }
      console.log("Sending message")
      if (websocket && websocket.readyState === WebSocket.OPEN) {
        websocket.send(JSON.stringify({ type: 'position', payload: payload}));
      }
      break;
    case 'join':
      if (typeof payload !== 'string') {
        throw new Error('Invalid payload: Expected string type');
      }
      if (websocket && websocket.readyState === WebSocket.OPEN) {
        websocket.send(JSON.stringify({ type: 'join', payload: payload}));
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
    };

    websocket.onmessage = (event) => {
      const { type, payload } = JSON.parse(event.data);
      if (type === 'coordinates') {
        self.postMessage({ type: 'message', payload: payload });
      } else if (type === 'joined') {
        self.postMessage({ type: 'message', payload: 'Joined room' });
      } else if (type === 'error') {
        console.error('Error occurred');
      }

    };

    websocket.onerror = (error) => {
      self.postMessage({ type: 'error', payload: error });
    };

    websocket.onclose = () => {
      self.postMessage({ type: 'disconnected' });
      websocket = null;
    };
  } catch (error) {
    self.postMessage({ type: 'error', payload: error });
  }
}
