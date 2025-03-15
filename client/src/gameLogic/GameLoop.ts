import { Coordinates2D, PlayerInfo } from "../util/types";
import { playerCollision } from "./collisionLogic";

export const GameLoop = ({
  playerRadius,
  playArea,
  intervalCounter,
  isConnected,
  worker,
  playerPosition,
  opponentPosition,
  lastActive,
  setPlayerPosition,
  setOpponentPosition,
}: {
  playerRadius: number;
  playArea: Coordinates2D;
  intervalCounter: React.MutableRefObject<number>;
  isConnected: boolean;
  worker: React.MutableRefObject<Worker | null>;
  playerPosition: PlayerInfo;
  opponentPosition: PlayerInfo | null;
  lastActive: Date;
  setPlayerPosition: React.Dispatch<React.SetStateAction<PlayerInfo>>;
  setOpponentPosition: React.Dispatch<React.SetStateAction<PlayerInfo | null>>;
}): NodeJS.Timeout => {
  const interval = setInterval(() => {
    setPlayerPosition((prev) => {
      let bounceX = 0;
      let bounceY = 0;
      if (opponentPosition) {
        const collisionResult = playerCollision(
          playerPosition,
          opponentPosition,
          playerRadius
        );

        bounceX = collisionResult.bounceX;
        bounceY = collisionResult.bounceY;
      }
      const nextX = prev.x + prev.dx;
      const nextY = prev.y + prev.dy;
      const nextDx =
        nextX <= playerRadius || nextX >= playArea.x - playerRadius
          ? prev.dx * -0.8
          : prev.dx + 2 * bounceX;
      const nextDy =
        nextY <= playerRadius || nextY >= playArea.y - playerRadius
          ? prev.dy * -0.8
          : prev.dy + 2 * bounceY;

      return {
        x: Math.min(Math.max(nextX, playerRadius), playArea.x - playerRadius),
        y: Math.min(Math.max(nextY, playerRadius), playArea.y - playerRadius),
        dx: nextDx * 0.95,
        dy: nextDy * 0.95,
      };
    });

    intervalCounter.current += 1;

    if (isConnected && worker.current) {
      worker.current.postMessage({
        type: "send",
        payload: {
          x: playArea.x - playerPosition.x,
          y: playArea.y - playerPosition.y,
          dx: -1 * playerPosition.dx,
          dy: -1 * playerPosition.dy,
        },
      });

      const now = new Date();
      if (now.getTime() - lastActive.getTime() > 3000) {
        setOpponentPosition(null);
      }
    }
  }, 8);

  return interval;
};

export const singlePlayerGameLoop = ({
  playerRadius,
  playArea,
  intervalCounter,
  setPlayerPosition,
}: {
  playerRadius: number;
  playArea: Coordinates2D;
  intervalCounter: React.MutableRefObject<number>;
  setPlayerPosition: React.Dispatch<React.SetStateAction<PlayerInfo>>;
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
        dx: nextDx * 0.95,
        dy: nextDy * 0.95,
      };
    });

    intervalCounter.current += 1;
  }, 8);

  return interval;
};
