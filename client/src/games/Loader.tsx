import Spinner from "../util/Spinner";
import { useNavigate } from "react-router-dom";

const Loader = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate("/login");
  };
  return (
    <div className="loader-container">
      <Spinner />
      <p>Waiting for other player</p>
      <br />
      <button onClick={handleLoginRedirect} className="button-primary">
        Return to login
      </button>
    </div>
  );
};

export default Loader;
