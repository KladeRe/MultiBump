import { useState, useRef, useEffect } from "react";
import { PlayerInfo, Coordinates2D } from "../util/types";
import { Controls } from "../gameLogic/controls";
import Renderer from "../util/Renderer";
import { singlePlayerGameLoop } from "../gameLogic/GameLoop";
import { useNavigate } from "react-router-dom";

const Simulation = () => {
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

  const opponentPosition = null;

  const [lineEnd, setLineEnd] = useState({
    x: playerPosition.x,
    y: playerPosition.y,
  });

  const initialMousePos = useRef<Coordinates2D>({ x: 0, y: 0 });
  const isDragging = useRef<boolean>(false);

  const intervalCounter = useRef<number>(0);

  const backToHome = () => {
    navigate("/login");
  };

  useEffect(() => {
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
  }, [playerPosition]);

  useEffect(() => {
    const interval = singlePlayerGameLoop({
      playerRadius,
      playArea,
      intervalCounter,
      setPlayerPosition,
    });

    return () => {
      clearInterval(interval);
    };
  }, [
    opponentPosition,
    playArea,
    playArea.x,
    playArea.y,
    playerPosition,
    playerPosition.dx,
    playerPosition.dy,
    playerPosition.x,
    playerPosition.y,
  ]);
  return (
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
  );
};

export default Simulation;
