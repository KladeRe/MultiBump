// Define message types for communication between worker and main thread
interface Position {
  x: number,
  y: number
}

type WorkerMessage = {
  type: 'connect' | 'send' | 'close';
  payload?: Position | string;
};

let websocket: WebSocket | null = null;

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
    case 'send':
      if (typeof payload !== 'object' || !('x' in payload) || !('y' in payload)) {
        throw new Error('Invalid payload: expected Position object');
      }
      console.log("Sending message")
      sendMessage(payload);
      break;
    case 'close':
      closeConnection();
      break;
  }
};

// Connect to WebSocket server
function connect(url: string) {
  try {
    websocket = new WebSocket(url);

    websocket.onopen = () => {
      self.postMessage({ type: 'connected' });
    };

    websocket.onmessage = (event) => {
      self.postMessage({ type: 'message', payload: event.data });
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

// Send message to server
function sendMessage(data: Position) {
  if (websocket && websocket.readyState === WebSocket.OPEN) {
    websocket.send(JSON.stringify(data));
  }
}

// Close WebSocket connection
function closeConnection() {
  if (websocket) {
    websocket.close();
  }
}
