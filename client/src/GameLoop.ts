import { Coordinates2D, PlayerInfo } from "./types";

export const GameLoop = ({
  playerRadius,
  playArea,
  intervalCounter,
  isConnected,
  worker,
  playerPosition,
  lastActive,
  setPlayerPosition,
  setOpponentPosition
}: {
  playerRadius: number,
  playArea: Coordinates2D,
  intervalCounter: React.MutableRefObject<number>,
  isConnected: boolean,
  worker: React.MutableRefObject<Worker | null>,
  playerPosition: PlayerInfo,
  lastActive: Date,
  setPlayerPosition: React.Dispatch<React.SetStateAction<PlayerInfo>>,
  setOpponentPosition: React.Dispatch<React.SetStateAction<PlayerInfo | null>>
}): NodeJS.Timeout => {
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

  return interval;
}