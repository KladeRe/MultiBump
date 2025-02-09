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

  const diffX1 = Math.abs(playerX - (area.x + area.width));
  const diffX2 = Math.abs(playerX - area.x);
  const diffY1 = Math.abs(playerY - (area.y + area.height));
  const diffY2 = Math.abs(playerY - area.y);

  const distanceX = Math.min(diffX1, diffX2);
  const distanceY = Math.min(diffY1, diffY2);

  let bounceX = playerDX;
  let bounceY = playerDY;

  if (distanceX <= playerRadius) {
    bounceX = playerDX * bounceForce;
  }

  if (distanceY <= playerRadius) {
    bounceY = playerDY * bounceForce;
  }

  return { bounceX, bounceY };
};