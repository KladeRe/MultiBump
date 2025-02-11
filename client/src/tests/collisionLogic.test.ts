import { checkCollision, CollisionArea } from '../gameLogic/collisionLogic'

const testCollisionArea: CollisionArea = {
  x: 100,
  y: 100,
  width: 150,
  height: 250
};

const bounceForce = -0.5;

describe('checkCollision', () => {
  it('Should not react when not moving', () => {
    const bounce = checkCollision(110, 105, 0, 0, 20, testCollisionArea, bounceForce);

    expect(bounce.bounceX).toBe(0);
    expect(bounce.bounceY).toBe(0);
  });

  it('Should not react when player is far away #1', () => {
    const dx = -20;
    const dy = -15;

    const bounce = checkCollision(500, 600, dx, dy, 20, testCollisionArea, bounceForce);

    expect(bounce.bounceX).toBe(0);
    expect(bounce.bounceY).toBe(0);
  });

  it('Should not react when player is far away #2', () => {
    const dx = 20;
    const dy = -15;

    const bounce = checkCollision(10, 600, dx, dy, 20, testCollisionArea, bounceForce);

    expect(bounce.bounceX).toBe(0);
    expect(bounce.bounceY).toBe(0);
  });

  it('Should not react when player is far away #3', () => {
    const dx = 20;
    const dy = 15;

    const bounce = checkCollision(10, 60, dx, dy, 20, testCollisionArea, bounceForce);

    expect(bounce.bounceX).toBe(0);
    expect(bounce.bounceY).toBe(0);
  });

  it('Should not react when player is far away #4', () => {
    const dx = -20;
    const dy = 15;

    const bounce = checkCollision(500, 60, dx, dy, 20, testCollisionArea, bounceForce);

    expect(bounce.bounceX).toBe(0);
    expect(bounce.bounceY).toBe(0);
  });

  it('Should not react when player is far away inside the area', () => {
    const dx = -20;
    const dy = 15;

    const bounce = checkCollision(150, 200, dx, dy, 20, testCollisionArea, bounceForce);

    expect(bounce.bounceX).toBe(0);
    expect(bounce.bounceY).toBe(0);
  });

  it('Should react when player is close #1', () => {
    const dx = 20;
    const dy = 15;

    const bounce = checkCollision(80, 85, dx, dy, 20, testCollisionArea, bounceForce);

    expect(bounce.bounceX).toBe(dx*bounceForce);
    expect(bounce.bounceY).toBe(dy*bounceForce);
  });

  it('Should react when player is close #2', () => {
    const dx = 20;
    const dy = 15;

    const bounce = checkCollision(80, 40, dx, dy, 20, testCollisionArea, bounceForce);

    expect(bounce.bounceX).toBe(dx*bounceForce);
    expect(bounce.bounceY).toBe(0);
  });


})
