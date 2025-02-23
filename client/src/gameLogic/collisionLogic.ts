import { PlayerInfo } from "../util/types";

export interface CollisionArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const checkCollision = (
  playerX: number,
  playerY: number,
  playerDX: number,
  playerDY: number,
  playerRadius: number,
  area: CollisionArea,
  bounceForce: number
): { bounceX: number; bounceY: number } => {

  let bounceX = 0;
  let bounceY = 0;

  if (playerX >= area.x - playerRadius && playerX <= area.x + area.width + playerRadius) {
    if (playerX <= area.x || playerX >= area.x + area.width) {
      bounceX = playerDX * bounceForce;
    }
  }

  if (playerY >= area.y - playerRadius && playerY <= area.y + area.height + playerRadius) {
    if (playerY <= area.y || playerY >= area.y + area.height) {
      bounceY = playerDY * bounceForce;
    }
  }

  return { bounceX, bounceY };
};

export const playerCollision = (
  player: PlayerInfo,
  opponent: PlayerInfo,
  playerRadius: number,

): { bounceX: number; bounceY: number } => {
  const dx = (player.x+player.dx) - (opponent.x+opponent.dx);
  const dy = (player.y+player.dy) - (opponent.y+opponent.dy);
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance <= playerRadius * 2) {

    const relativeVX = player.dx - opponent.dx;
    const relativeVY = player.dy - opponent.dy;

    const normalX = dx / distance;
    const normalY = dy / distance;

    const relativeVelocityNormal = relativeVX * normalX + relativeVY * normalY;

    if (relativeVelocityNormal < 0) {
      console.log("Reacted")
      const bounceX = -relativeVelocityNormal * normalX;
      const bounceY = -relativeVelocityNormal * normalY;
      return { bounceX, bounceY };
    }
  }

  return { bounceX: 0, bounceY: 0 };
}