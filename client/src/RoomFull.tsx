import { useNavigate } from 'react-router-dom';
import './App.css'

const RoomFull = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate(`/login`);
  }

  const handleCreateRedirect = () => {
    navigate(`/create`);
  };

  return (
    <div className="container">
      <h1>Room is already full, please join another room</h1>
      <button onClick={handleLoginRedirect } className="button-primary">
        Return to room login
      </button>
      <button onClick={handleCreateRedirect} className="button-secondary">
        Go to room creation
      </button>
    </div>
  )
}

export default RoomFull;