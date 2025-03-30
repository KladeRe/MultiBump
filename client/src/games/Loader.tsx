import Spinner from "../util/Spinner";
import { useNavigate } from "react-router-dom";
import { useRef, useEffect } from "react";
import {
  connectToWebSocket,
  waitForOpponent,
} from "../background/worker-wrapper";
const Loader = () => {
  const navigate = useNavigate();

  const params = new URLSearchParams(window.location.search);
  const roomId = params.get("room") || "NTc2MA-Mjc4MA";

  const worker = useRef<Worker | null>(null);

  const handleLoginRedirect = () => {
    worker.current?.terminate();
    navigate("/login");
  };

  useEffect(() => {
    const redirectToFullRoom = () => {
      navigate(`/fullRoom`);
    };

    const redirectToGame = () => {
      navigate(`/game?room=${roomId}`);
    };
    worker.current = new Worker(
      new URL("./../background/socket-worker.ts", import.meta.url)
    );

    connectToWebSocket(roomId, worker as React.MutableRefObject<Worker>);

    waitForOpponent(worker.current, redirectToGame, redirectToFullRoom);
  }, [worker, roomId, navigate]);

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
