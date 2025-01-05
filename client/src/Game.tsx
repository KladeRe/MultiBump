import { Stage } from '@pixi/react';
import { useState, useEffect, useRef } from 'react';
import { Graphics } from '@pixi/react';

const Game = () => {
  const [playerX, setplayerX] = useState(500);

  const [playerY, setplayerY] = useState(500);
  const [velocityX, setVelocityX] = useState(0);
  const [velocityY, setVelocityY] = useState(0);
  const initialMousePos = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);

  const screenWidth = 1000;
  const screenHeight = 800;
  const playerRadius = 25;

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      const stageElement = event.currentTarget as HTMLElement;
      const boundingRect = stageElement.getBoundingClientRect();
      const mouseX = event.clientX - boundingRect.left;
      const mouseY = event.clientY - boundingRect.top;
      const dx = mouseX - playerX;
      const dy = mouseY - playerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < playerRadius) {
        isDragging.current = true;
        initialMousePos.current = { x: mouseX, y: mouseY };
      }
    };

    const handleMouseUp = (event: MouseEvent) => {

      if (isDragging.current) {
        const stageElement = document.querySelector('canvas');
        const boundingRect = stageElement?.getBoundingClientRect();
        const mouseX = event.clientX - (boundingRect?.left ?? 0);
        const mouseY = event.clientY - (boundingRect?.top ?? 0);

        const dx = mouseX - initialMousePos.current.x;
        const dy = mouseY - initialMousePos.current.y;

        setVelocityX(dx * -0.7); // Adjust the multiplier to control the speed
        setVelocityY(dy * -0.7); // Adjust the multiplier to control the speed
        isDragging.current = false;
      }
    };

    const stageElement = document.querySelector('canvas');
    stageElement?.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);


    return () => {
      stageElement?.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [playerX, playerY]);

  useEffect(() => {
    const interval = setInterval(() => {
      setplayerX((prevX) => {
        const nextX = prevX + velocityX;
        if (nextX <= playerRadius || nextX >= screenWidth - playerRadius) {
          setVelocityX(velocityX * -0.8); // Bounce with 80% energy retention
        }
        return Math.min(Math.max(nextX, playerRadius), screenWidth - playerRadius);
      });
      setplayerY((prevY) => {
        const nextY = prevY + velocityY;
        if (nextY <= playerRadius || nextY >= screenHeight - playerRadius) {
          setVelocityY(velocityY * -0.8); // Bounce with 80% energy retention
        }
        return Math.min(Math.max(nextY, playerRadius), screenHeight - playerRadius);
      });
      setVelocityX((prevVx) => prevVx * 0.95); // Apply friction
      setVelocityY((prevVy) => prevVy * 0.95); // Apply friction

    }, 16);

    return () => clearInterval(interval);
  }, [velocityX, velocityY]);

  return (
    <Stage width={screenWidth} height={screenHeight} options={{ background: 0x1099bb }}>
      <Graphics
        draw={(g) => {
          g.clear();
          g.beginFill(0xff0000);
          g.drawCircle(playerX, playerY, playerRadius);
          g.endFill();
        }}
      />
    </Stage>
  );
};

export default Game;