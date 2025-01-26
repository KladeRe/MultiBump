import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

const Login = () => {
  const [roomCode, setRoomCode] = useState('');
  const navigate = useNavigate();

  const handleJoin = () => {
    if (roomCode.trim().length > 0) {
      navigate(`/game?room=${roomCode}`);
    }
  };

  const handleRandomJoin = () => {
    const generateRandomString = (length: number) => {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    };

    const randomRoomCode = generateRandomString(25);
    navigate(`/game?room=${randomRoomCode}`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>Join a Room</h1>
      <input
        type="text"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
        placeholder="Enter room code"
        className={styles.input}
      />
      <button onClick={handleJoin} className={styles.button}>
        Join Room
      </button>
      <button onClick={handleRandomJoin} className={`${styles.button} ${styles.buttonSecondary}`}>
        Create Room
      </button>
    </div>
  );
};

export default Login;