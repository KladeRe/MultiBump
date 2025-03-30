import { useState, useEffect, useRef } from "react";
import { socketListen } from "../background/worker-wrapper";
import { Coordinates2D, PlayerInfo } from "../util/types";
import { Controls } from "../gameLogic/controls";
import { GameLoop } from "../gameLogic/GameLoop";
import { useNavigate } from "react-router-dom";
import Renderer from "../util/Renderer";
import Spinner from "../util/Spinner";
import {
  connectToWebSocket,
  waitForOpponent,
} from "../background/worker-wrapper";

const Game = () => {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const roomId = params.get("room") || "NTc2MA-Mjc4MA";
  const parts = roomId.split("-");
  const width = parseInt(window.atob(parts[0]), 10) / 4;
  const height = parseInt(window.atob(parts[1]), 10) / 4;
  const [playArea] = useState<Coordinates2D>({ x: width, y: height });
  const playerRadius = 25;

  const [playerPosition, setPlayerPosition] = useState<PlayerInfo>({
    x: playArea.x / 2,
    y: (playArea.y * 3) / 4,
    dx: 0,
    dy: 0,
  });

  const [opponentPosition, setOpponentPosition] = useState<PlayerInfo | null>(
    null
  );

  const [lineEnd, setLineEnd] = useState({
    x: playerPosition.x,
    y: playerPosition.y,
  });

  const initialMousePos = useRef<Coordinates2D>({ x: 0, y: 0 });
  const isDragging = useRef<boolean>(false);

  const [lastActive, setLastActive] = useState<Date>(new Date());

  const intervalCounter = useRef<number>(0);

  const worker = useRef<Worker | null>(null);

  const [gameStarted, setGameStarted] = useState<boolean>(false);

  const backToHome = () => {
    if (worker.current) {
      worker.current.postMessage({
        type: "close",
        payload: {},
      });
    }

    navigate("/login");
  };

  useEffect(() => {
    const redirectToFullRoom = () => {
      worker.current?.terminate();
      navigate(`/fullRoom`);
    };

    worker.current = new Worker(
      new URL("./../background/socket-worker.ts", import.meta.url)
    );

    connectToWebSocket(roomId, worker as React.MutableRefObject<Worker>);

    waitForOpponent(worker.current, setGameStarted, redirectToFullRoom);
  }, [worker, roomId, navigate]);

  useEffect(() => {
    if (!gameStarted || !worker.current) return; // Early return if not ready

    console.log("Opponent is there");
    const redirectToFullRoom = () => {
      navigate(`/fullRoom`);
    };

    const backToLogin = () => {
      if (worker.current) {
        worker.current.postMessage({
          type: "close",
          payload: {},
        });
      }

      navigate("/login");
    };

    // Start socket listening when game starts
    socketListen(
      setOpponentPosition,
      setLastActive,
      worker.current,
      redirectToFullRoom,
      backToLogin
    );

    return () => {
      worker.current?.postMessage({ type: "close" });
      worker.current?.terminate();
    };
  }, [gameStarted, navigate, roomId]);

  useEffect(() => {
    if (!gameStarted) return;
    const controls = new Controls(
      playerPosition,
      playerRadius,
      isDragging,
      setLineEnd,
      setPlayerPosition,
      initialMousePos
    );
    controls.addListeners();

    return () => {
      controls.removeListeners();
    };
  }, [gameStarted, playerPosition]);

  useEffect(() => {
    if (!gameStarted) return;
    const interval = GameLoop({
      playerRadius,
      playArea,
      intervalCounter,
      worker,
      playerPosition,
      opponentPosition,
      lastActive,
      setPlayerPosition,
      setOpponentPosition,
    });

    return () => {
      clearInterval(interval);
    };
  }, [
    lastActive,
    opponentPosition,
    playArea,
    playArea.x,
    playArea.y,
    playerPosition,
    playerPosition.dx,
    playerPosition.dy,
    playerPosition.x,
    playerPosition.y,
    gameStarted,
  ]);

  return (
    <>
      {!gameStarted ? (
        <div className="loader-container">
          <Spinner />
          <p>Waiting for other player</p>
          <br />
          <button onClick={backToHome} className="button-primary">
            Return to login
          </button>
        </div>
      ) : (
        <Renderer
          roomId={roomId}
          playArea={playArea}
          isDragging={isDragging}
          playerPosition={playerPosition}
          lineEnd={lineEnd}
          playerRadius={playerRadius}
          opponentPosition={opponentPosition}
          loginRedirect={backToHome}
        />
      )}
    </>
  );
};

export default Game;
