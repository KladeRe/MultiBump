import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css'

const Login = () => {
  const [roomCode, setRoomCode] = useState('');
  const navigate = useNavigate();

  const handleJoin = () => {
    if (roomCode.trim().length > 0) {
      navigate(`/game?room=${roomCode}`);
    }
  };

  const handleRoomCreate = () => {
    navigate(`/create`);
  };

  return (
    <div className="container">
      <h1>Welcome to multiBump</h1>
      <input
        type="text"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
        placeholder="Enter room code"
      />
      <button onClick={handleJoin} className="button-primary">
        Join Room
      </button>
      <button onClick={handleRoomCreate} className="button-secondary">
        Create Room
      </button>
    </div>
  );
};

export default Login;