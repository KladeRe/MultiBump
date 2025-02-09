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

  const diffX1 = playerX - (area.x + area.width);
  const diffX2 = playerX - area.x;

  const diffY1 = playerY - (area.y + area.height);
  const diffY2 = playerX - area.y;

  const distanceX = Math.abs(diffX1) <= Math.abs(diffX2) ? diffX1 : diffX2;
  const distanceY = Math.abs(diffY1) <= Math.abs(diffY2) ? diffY1 : diffY2;

  let bounceX = playerDX;
  let bounceY = playerDY;

  if (Math.abs(distanceX) <= playerRadius) {
    bounceX = playerDX * bounceForce;
  }

  if (Math.abs(distanceY) <= playerRadius) {
    bounceY = playerDY * bounceForce;
  }


  return { bounceX, bounceY };
};