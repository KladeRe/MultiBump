import { useState, useEffect, useRef } from "react";
import { connectToWebSocket, socketListen } from "./worker-wrapper";
import { Coordinates2D, PlayerInfo } from "./types";
import './App.css'
import Renderer from "./Renderer";

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
    worker.current = new Worker(new URL("./socket-worker.ts", import.meta.url));

    connectToWebSocket(roomId, setIsConnected, worker as React.MutableRefObject<Worker>);

    socketListen(setOpponentPosition, setLastActive, worker.current);

    return () => {
      worker.current?.postMessage({ type: "close" });
      worker.current?.terminate();
    };
  }, [roomId]);

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      const stageElement = event.currentTarget as HTMLElement;
      const boundingRect = stageElement.getBoundingClientRect();
      const mouseX = event.clientX - boundingRect.left;
      const mouseY = event.clientY - boundingRect.top;
      const dx = mouseX - playerPosition.x;
      const dy = mouseY - playerPosition.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < playerRadius) {
        isDragging.current = true;
        initialMousePos.current = { x: mouseX, y: mouseY };
      }

      setLineEnd({ x: playerPosition.x, y: playerPosition.y });
    };

    const handleMouseUp = (event: MouseEvent) => {
      if (isDragging.current) {
        const stageElement = document.querySelector("canvas");
        const boundingRect = stageElement?.getBoundingClientRect();
        const mouseX = event.clientX - (boundingRect?.left ?? 0);
        const mouseY = event.clientY - (boundingRect?.top ?? 0);

        const dx = mouseX - initialMousePos.current.x;
        const dy = mouseY - initialMousePos.current.y;

        setPlayerPosition((prev) => ({
          ...prev,
          dx: dx * -0.7,
          dy: dy * -0.7,
        }));
        isDragging.current = false;
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (isDragging.current) {
        const stageElement = document.querySelector("canvas");
        const boundingRect = stageElement?.getBoundingClientRect();
        const mouseX = event.clientX - (boundingRect?.left ?? 0);
        const mouseY = event.clientY - (boundingRect?.top ?? 0);
        setLineEnd({
          x: playerPosition.x + (playerPosition.x - mouseX),
          y: playerPosition.y + (playerPosition.y - mouseY),
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    const stageElement = document.querySelector("canvas");
    stageElement?.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      stageElement?.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [playerPosition]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlayerPosition((prev) => {
        const nextX = prev.x + prev.dx;
        const nextY = prev.y + prev.dy;
        const nextDx =
          nextX <= playerRadius || nextX >= playArea.x - playerRadius
            ? prev.dx * -0.8
            : prev.dx;
        const nextDy =
          nextY <= playerRadius || nextY >= playArea.y - playerRadius
            ? prev.dy * -0.8
            : prev.dy;

        return {
          x: Math.min(Math.max(nextX, playerRadius), playArea.x - playerRadius),
          y: Math.min(Math.max(nextY, playerRadius), playArea.y - playerRadius),
          dx: nextDx * 0.9,
          dy: nextDy * 0.9,
        };
      });

      intervalCounter.current += 1;

      if (
        isConnected &&
        worker.current &&
        (Math.abs(playerPosition.dx) >= 0.1 ||
          Math.abs(playerPosition.dy) >= 0.1 ||
          intervalCounter.current % 20 == 0)
      ) {
        worker.current.postMessage({
          type: "send",
          payload: {
            x: playArea.x - playerPosition.x,
            y: playArea.y - playerPosition.y,
          },
        });

        const now = new Date();
        if (now.getTime() - lastActive.getTime() > 3000) {
          setOpponentPosition(null);
        }
      }
    }, 16);

    return () => {
      clearInterval(interval);
    };
  }, [
    isConnected,
    lastActive,
    playArea.x,
    playArea.y,
    playerPosition.dx,
    playerPosition.dy,
    playerPosition.x,
    playerPosition.y,
  ]);

  return (
    <Renderer roomId={roomId} playArea={playArea} isDragging={isDragging} playerPosition={playerPosition} lineEnd={lineEnd} playerRadius={playerRadius} opponentPosition={opponentPosition}/>
  );
};

export default Game;
