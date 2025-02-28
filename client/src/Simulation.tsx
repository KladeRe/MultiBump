import { useState, useRef, useEffect } from "react";
import { PlayerInfo, Coordinates2D } from "./util/types";
import { Controls } from "./gameLogic/controls";
import Renderer from "./Renderer";
const Simulation = () => {

  const params = new URLSearchParams(window.location.search);
  const roomId = params.get("room") || "1000-0600";
  const parts = roomId.split('-');
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

  useEffect(() => {
      const controls = new Controls(playerPosition, playerRadius, isDragging, setLineEnd, setPlayerPosition, initialMousePos);
      controls.addListeners();

      return () => {
        controls.removeListeners();
      };
  }, [playerPosition]);

  return (
    <Renderer roomId={roomId} playArea={playArea} isDragging={isDragging} playerPosition={playerPosition} lineEnd={lineEnd} playerRadius={playerRadius} opponentPosition={opponentPosition}/>
  )
};

export default Simulation;