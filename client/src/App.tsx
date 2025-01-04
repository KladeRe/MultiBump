import './App.css';
import { useEffect } from 'react';

import Game from './Game';
import useWebSocket from 'react-use-websocket';

const App = () => {
  const { lastMessage } = useWebSocket('ws://localhost:5228', {
    onOpen: () => console.log('Connected to WebSocket'),
    onClose: () => console.log('Disconnected from WebSocket'),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    shouldReconnect: (closeEvent) => true,
  });

  useEffect(() => {
    if (lastMessage) {
      const data = JSON.parse(lastMessage.data);
      console.log('Received:', data);
    }
  }, [lastMessage]);

  return(
    <Game />
  )
};

export default App;