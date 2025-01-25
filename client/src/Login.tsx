import { useState } from 'react';

const Login = () => {
  const [roomCode, setRoomCode] = useState('');

  const handleJoin = () => {
    if (roomCode.trim()) {
      console.log(roomCode);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h1>Join a Room</h1>
      <input
        type="text"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
        placeholder="Enter room code"
        style={{ padding: '10px', fontSize: '16px', marginBottom: '10px' }}
      />
      <button onClick={handleJoin} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Join Room
      </button>
    </div>
  );
};

export default Login;
