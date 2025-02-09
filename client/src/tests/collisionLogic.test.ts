import { checkCollision, CollisionArea } from '../collisionLogic'

describe('checkCollision', () => {
  it('Should not react when not moving', () => {
    const testCollisionArea: CollisionArea = {
      x: 100,
      y: 100,
      width: 150,
      height: 250
    };

    const bounce = checkCollision(110, 105, 0, 0, 20, testCollisionArea, -0.5);

    expect(bounce.bounceX).toBe(-0);
    expect(bounce.bounceY).toBe(-0);
  });

  it('Should not react when player is far away', () => {
    const testCollisionArea: CollisionArea = {
      x: 100,
      y: 100,
      width: 150,
      height: 250
    };

    const dx = -20;
    const dy = -15;

    const bounce = checkCollision(500, 600, dx, dy, 20, testCollisionArea, -0.5);

    expect(bounce.bounceX).toBe(dx);
    expect(bounce.bounceY).toBe(dy);
  });
})
