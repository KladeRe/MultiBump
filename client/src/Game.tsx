import { useState, useEffect, useRef } from "react";
import { connectToWebSocket, socketListen } from "./background/worker-wrapper";
import { Coordinates2D, PlayerInfo } from "./util/types";
import { Controls } from "./gameLogic/controls";
import { GameLoop } from "./gameLogic/GameLoop";

import Renderer from "./Renderer";

import './App.css'

const Game = () => {
  const [playArea] = useState<Coordinates2D>({ x: 1000, y: 600 });
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
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const intervalCounter = useRef<number>(0);

  const worker = useRef<Worker | null>(null);

  const params = new URLSearchParams(window.location.search);
  const roomId = params.get("room") || "testing";

  useEffect(() => {
    worker.current = new Worker(new URL("./background/socket-worker.ts", import.meta.url));

    connectToWebSocket(roomId, setIsConnected, worker as React.MutableRefObject<Worker>);

    socketListen(setOpponentPosition, setLastActive, worker.current);

    return () => {
      worker.current?.postMessage({ type: "close" });
      worker.current?.terminate();
    };
  }, [roomId]);

  useEffect(() => {
    const controls = new Controls(playerPosition, playerRadius, isDragging, initialMousePos, setLineEnd, setPlayerPosition);
    controls.addListeners();

    return () => {
      controls.removeListeners();
    };
  }, [playerPosition]);

  useEffect(() => {
    const interval = GameLoop({playerRadius,
      playArea,
      intervalCounter,
      isConnected,
      worker,
      playerPosition,
      opponentPosition,
      lastActive,
      setPlayerPosition,
      setOpponentPosition})

    return () => {
      clearInterval(interval);
    };
  }, [isConnected, lastActive, opponentPosition, playArea, playArea.x, playArea.y, playerPosition, playerPosition.dx, playerPosition.dy, playerPosition.x, playerPosition.y]);

  return (
    <Renderer roomId={roomId} playArea={playArea} isDragging={isDragging} playerPosition={playerPosition} lineEnd={lineEnd} playerRadius={playerRadius} opponentPosition={opponentPosition}/>
  );
};

export default Game;
