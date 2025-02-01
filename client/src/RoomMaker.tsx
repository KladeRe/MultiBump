import { useNavigate } from 'react-router-dom';

const RoomMaker = () => {
  const navigate = useNavigate();

  const backToLogin = () => {
    navigate("/login");
  }
  return (
    <div>
      <h1>Room creator</h1>
      <p>Coming soon!</p>
      <button onClick={backToLogin}>
        Back to room login
      </button>
    </div>

  )
}

export default RoomMaker;